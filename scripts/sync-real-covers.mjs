import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "src", "data.js");
const OUTPUT_FILE = path.join(ROOT, "src", "realCoverMap.json");

const normalizeCoverText = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const getPrimaryArtist = (artist = "") =>
  artist
    .split(/[\/,&]/)[0]
    .replace(/\bvarios\b/gi, "")
    .trim();

const normalizeAlbumForMatch = (value = "") =>
  normalizeCoverText(value)
    .replace(/\b(deluxe|edition|remaster|remastered|version|soundtrack|live)\b/g, "")
    .trim();

const rankItunesResult = (result, artist, album) => {
  const artistNorm = normalizeCoverText(getPrimaryArtist(artist));
  const albumNorm = normalizeAlbumForMatch(album);
  const resultArtist = normalizeCoverText(result?.artistName || "");
  const resultAlbum = normalizeAlbumForMatch(result?.collectionName || "");
  let score = 0;

  if (albumNorm && (resultAlbum.includes(albumNorm) || albumNorm.includes(resultAlbum))) score += 6;
  if (artistNorm && (resultArtist.includes(artistNorm) || artistNorm.includes(resultArtist))) score += 4;
  if (result?.collectionType === "Album") score += 1;
  return score;
};

const isTrustedItunesMatch = (result, artist, album) => {
  const artistNorm = normalizeCoverText(getPrimaryArtist(artist));
  const albumNorm = normalizeAlbumForMatch(album);
  const resultArtist = normalizeCoverText(result?.artistName || "");
  const resultAlbum = normalizeAlbumForMatch(result?.collectionName || "");
  const score = rankItunesResult(result, artist, album);

  const albumMatches =
    albumNorm && resultAlbum && (resultAlbum.includes(albumNorm) || albumNorm.includes(resultAlbum));
  const artistMatches =
    artistNorm && resultArtist && (resultArtist.includes(artistNorm) || artistNorm.includes(resultArtist));

  return score >= 8 && albumMatches && artistMatches;
};

const getArtworkFromItunesResult = (result) => {
  const raw = result?.artworkUrl100 || result?.artworkUrl60 || result?.artworkUrl30;
  if (!raw) return null;
  return raw.replace(/\/\d+x\d+bb\./, "/600x600bb.");
};

const parseVinylRows = (source) => {
  const sectionMatch = source.match(/export const vinyls = \[([\s\S]*?)\n\];/);
  if (!sectionMatch) return [];
  const section = sectionMatch[1];

  const rows = [];
  const pattern = /\{\s*id:\s*"([^"]+)"[\s\S]*?artist:\s*"([^"]+)"[\s\S]*?album:\s*"([^"]+)"[\s\S]*?\}/g;
  let match;
  while ((match = pattern.exec(section)) !== null) {
    const id = match[1]?.trim();
    if (!/^v\d+$/.test(id)) continue;
    rows.push({ id, artist: match[2]?.trim() || "", album: match[3]?.trim() || "" });
  }

  const deduped = new Map();
  for (const row of rows) {
    if (!deduped.has(row.id)) deduped.set(row.id, row);
  }
  return [...deduped.values()];
};

const searchItunes = async (artist, album) => {
  const term = `${getPrimaryArtist(artist)} ${album}`;
  const endpoint = new URL("https://itunes.apple.com/search");
  endpoint.searchParams.set("media", "music");
  endpoint.searchParams.set("entity", "album");
  endpoint.searchParams.set("limit", "8");
  endpoint.searchParams.set("term", term);

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ziggy-cover-sync/1.0",
      },
    });

    if (response.ok) {
      const payload = await response.json();
      return Array.isArray(payload?.results) ? payload.results : [];
    }

    if (response.status === 429 && attempt < 3) {
      await sleep(900 * attempt);
      continue;
    }

    throw new Error(`HTTP ${response.status}`);
  }

  return [];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readExistingMap = async () => {
  try {
    const content = await fs.readFile(OUTPUT_FILE, "utf8");
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const main = async () => {
  const source = await fs.readFile(DATA_FILE, "utf8");
  const vinyls = parseVinylRows(source);
  const existing = await readExistingMap();
  const nextMap = { ...existing };

  let found = 0;
  let missed = 0;

  console.log(`Sync de capas: ${vinyls.length} itens...`);

  for (const [index, vinyl] of vinyls.entries()) {
    const label = `${index + 1}/${vinyls.length} ${vinyl.id} - ${vinyl.artist} / ${vinyl.album}`;
    try {
      const results = await searchItunes(vinyl.artist, vinyl.album);
      if (!results.length) {
        missed += 1;
        console.log(`MISS  ${label}`);
        await sleep(260);
        continue;
      }

      const best = [...results].sort(
        (a, b) => rankItunesResult(b, vinyl.artist, vinyl.album) - rankItunesResult(a, vinyl.artist, vinyl.album)
      )[0];

      if (!best || !isTrustedItunesMatch(best, vinyl.artist, vinyl.album)) {
        missed += 1;
        console.log(`MISS  ${label}`);
        await sleep(260);
        continue;
      }

      const coverUrl = getArtworkFromItunesResult(best);
      if (!coverUrl) {
        missed += 1;
        console.log(`MISS  ${label}`);
        await sleep(260);
        continue;
      }

      nextMap[vinyl.id] = coverUrl;
      found += 1;
      console.log(`HIT   ${label}`);
    } catch (error) {
      missed += 1;
      console.log(`ERR   ${label} (${error.message})`);
    }

    await sleep(260);
  }

  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(nextMap, null, 2)}\n`, "utf8");
  console.log(`Concluido. Hits: ${found}, Misses: ${missed}. Arquivo: src/realCoverMap.json`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
