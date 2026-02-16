import { useEffect, useMemo, useState } from "react";
import { inventory, partners, sessions, sessionVinyl, vinyls } from "./data.js";
import imagemCardapio2 from "../Cardapio2.jpg";
import capaHero from "../capahero.webp";
import capaHero4 from "../capa4.webp";

const MONTHS_PT = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const formatDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS_PT[date.getMonth()] || "";
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatPrice = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
const splitTextBySentence = (value = "") => {
  const normalized = String(value).replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  const parts = normalized.match(/[^.!?]+[.!?]?/g);
  return (parts || [normalized]).map((item) => item.trim()).filter(Boolean);
};
const getInitials = (value = "") =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const discountedPrice = (normalPrice) => Math.round(normalPrice * 0.85);
const COVER_CACHE_KEY = "ziggy_real_cover_cache_v2";

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
  normalizeCoverText(value).replace(
    /\b(deluxe|edition|remaster|remastered|version|soundtrack|live)\b/g,
    ""
  ).trim();

const getArtworkFromItunesResult = (result) => {
  const raw = result?.artworkUrl100 || result?.artworkUrl60 || result?.artworkUrl30;
  if (!raw) return null;
  return raw.replace(/\/\d+x\d+bb\./, "/600x600bb.");
};

const isGeneratedCover = (url = "") => url.startsWith("data:image/svg+xml");
const hasRealCoverUrl = (url = "") => Boolean(url) && !isGeneratedCover(url);

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

const useRealCoverResolver = () => {
  const [coverMap, setCoverMap] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(COVER_CACHE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(COVER_CACHE_KEY, JSON.stringify(coverMap));
  }, [coverMap]);

  useEffect(() => {
    let cancelled = false;
    const missing = vinyls.filter((vinyl) => coverMap[vinyl.id] === undefined);
    if (!missing.length) return () => {};

    const fetchCovers = async () => {
      for (const vinyl of missing) {
        if (cancelled) break;
        try {
          const term = encodeURIComponent(`${getPrimaryArtist(vinyl.artist)} ${vinyl.album}`);
          const response = await fetch(
            `https://itunes.apple.com/search?media=music&entity=album&limit=8&term=${term}`
          );
          if (!response.ok) {
            setCoverMap((prev) => ({ ...prev, [vinyl.id]: null }));
            continue;
          }
          const payload = await response.json();
          const results = Array.isArray(payload?.results) ? payload.results : [];
          if (!results.length) {
            setCoverMap((prev) => ({ ...prev, [vinyl.id]: null }));
            continue;
          }

          const best = [...results].sort(
            (a, b) => rankItunesResult(b, vinyl.artist, vinyl.album) - rankItunesResult(a, vinyl.artist, vinyl.album)
          )[0];
          if (!best || !isTrustedItunesMatch(best, vinyl.artist, vinyl.album)) {
            setCoverMap((prev) => ({ ...prev, [vinyl.id]: null }));
            continue;
          }
          const coverUrl = getArtworkFromItunesResult(best);
          if (!coverUrl || cancelled) {
            setCoverMap((prev) => ({ ...prev, [vinyl.id]: null }));
            continue;
          }

          setCoverMap((prev) => {
            if (prev[vinyl.id] === coverUrl) return prev;
            return { ...prev, [vinyl.id]: coverUrl };
          });
        } catch {
          setCoverMap((prev) => ({ ...prev, [vinyl.id]: null }));
        }
      }
    };

    fetchCovers();

    return () => {
      cancelled = true;
    };
  }, [coverMap]);

  return (vinyl) => {
    const cached = coverMap[vinyl.id];
    if (cached) return cached;
    if (cached === null) return "";
    if (vinyl.cover_image_url && !isGeneratedCover(vinyl.cover_image_url)) return vinyl.cover_image_url;
    return "";
  };
};

const PricePrivacyEye = ({ onActivate }) => (
  <span
    className="price-eye-button"
    role="button"
    tabIndex={0}
    aria-label="Ativar modo membro premium"
    title="Ativar modo membro premium"
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onActivate?.();
    }}
    onMouseDown={(event) => {
      event.preventDefault();
      event.stopPropagation();
    }}
    onTouchStart={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onActivate?.();
    }}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        onActivate?.();
      }
    }}
  >
    <span className="price-eye" aria-hidden="true">
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
      <path
        d="M2.8 12c1.9-3.2 5.1-5 9.2-5s7.3 1.8 9.2 5c-1.9 3.2-5.1 5-9.2 5s-7.3-1.8-9.2-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 20 20 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    </span>
  </span>
);

const NonMemberPrice = ({ value, onActivate }) => (
  <div
    className="price-main with-eye"
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onActivate?.();
    }}
    onTouchStart={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onActivate?.();
    }}
  >
    <span>{value}</span>
    <PricePrivacyEye onActivate={onActivate} />
  </div>
);

const useMember = () => {
  const [member, setMember] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("ziggy_member", member ? "1" : "0");
  }, [member]);

  return [member, setMember];
};

const useCart = () => {
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem("ziggy_cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("ziggy_cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (item) => {
    setCart((prev) => {
      if (prev.some((entry) => entry.vinylId === item.vinylId && entry.partnerId === item.partnerId)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeItem = (item) => {
    setCart((prev) =>
      prev.filter((entry) => !(entry.vinylId === item.vinylId && entry.partnerId === item.partnerId))
    );
  };

  const clear = () => setCart([]);

  return { cart, addItem, removeItem, clear };
};

const usePath = () => {
  const [path, setPath] = useState(() => window.location.pathname + window.location.search);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname + window.location.search);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  return { path };
};

const Link = ({ to, children, className }) => (
  <a
    href={to}
    className={className}
    onClick={(event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      window.history.pushState({}, "", to);
      window.dispatchEvent(new PopStateEvent("popstate"));
      const hash = to.includes("#") ? to.split("#")[1] : "";
      if (hash) {
        const scrollToHash = (attempt = 0) => {
          const target = document.getElementById(hash);
          if (target) {
            const nav = document.querySelector(".top-nav");
            const navHeight = nav ? nav.getBoundingClientRect().height : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top, behavior: "smooth" });
            return;
          }
          if (attempt < 30) {
            requestAnimationFrame(() => scrollToHash(attempt + 1));
            return;
          }
          window.scrollTo(0, 0);
        };
        requestAnimationFrame(() => scrollToHash(0));
      } else {
        window.scrollTo(0, 0);
      }
    }}
  >
    {children}
  </a>
);

const getVinylById = (id) => vinyls.find((vinyl) => vinyl.id === id);
const getPartnerById = (id) => partners.find((partner) => partner.id === id);
const partnerCatalogLink = (partnerId) => `/partner/${partnerId}`;

const getInventoryForVinyl = (vinylId) =>
  inventory.filter((item) => item.vinyl_id === vinylId);

const getBestInventory = (vinylId) => {
  const items = getInventoryForVinyl(vinylId);
  if (!items.length) return null;
  return [...items].sort((a, b) => a.price_normal - b.price_normal)[0];
};

const getSessionVinyls = (sessionId, type) =>
  sessionVinyl
    .filter((item) => item.session_id === sessionId && item.context_type === type)
    .map((item) => getVinylById(item.vinyl_id))
    .filter(Boolean);

const isVinylInSession = (sessionId, vinylId) =>
  sessionVinyl.some(
    (item) => item.session_id === sessionId && item.vinyl_id === vinylId
  );

const TopNav = ({ member, setMember, cartCount, onToggleCart }) => (
  <header className="top-nav">
    <Link to="/" className="brand">
      <div className="brand-mark">Ziggy Play</div>
      <div className="brand-sub">Um lugar que toca música</div>
    </Link>
    <div className="top-nav-actions">
      <button
        type="button"
        className={`member-toggle member-toggle-icon ${member ? "is-active" : ""}`}
        onClick={() => setMember((prev) => !prev)}
        aria-label={member ? "Membro ativo" : "Entrar como membro"}
        title={member ? "Membro ativo" : "Entrar como membro"}
      >
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path
            d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-6 1.6-6 3.6V20h12v-1.9c0-2-2.7-3.6-6-3.6Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
    <nav className="nav-links">
      <Link to="/" className="nav-link">
        A sala
      </Link>
      <Link to="/clube" className="nav-link">
        O clube
      </Link>
      <Link to="/menu" className="nav-link">
        O balcão
      </Link>
      <Link to="/market?catalog=1" className="nav-link">
        A loja
      </Link>
    </nav>
  </header>
);

const SessionCard = ({ session, onReserve, resolveCoverUrl }) => {
  const covers = getSessionVinyls(session.id, "tocado")
    .filter((vinyl) => hasRealCoverUrl(resolveCoverUrl(vinyl)))
    .slice(0, 4);
  const isSpecial = Boolean(session.is_special && session.guest_name);
  return (
    <div
      className={`session-card ${isSpecial ? "is-special" : ""}`}
      onClick={(event) => {
        if (event.target.closest(".session-actions")) return;
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div className="session-card-header">
        <div className="session-card-topline">
          <div className="session-date">{formatDate(session.date)}</div>
          {isSpecial ? (
            <div className="session-special-pill session-special-pill-compact">Sessão especial</div>
          ) : null}
        </div>
        <div className="session-theme">{session.theme}</div>
        <div className="session-card-guest-slot">
          {isSpecial ? (
            <div className="session-guest-line">
              <span>
                {(session.guest_role || "Convidado da noite")
                  .replace(" da noite", "")
                  .replace(" da Noite", "")}
              </span>
              <span className="session-guest-separator" aria-hidden="true" />
              <span>{session.guest_name}</span>
            </div>
          ) : (
            <span aria-hidden="true">placeholder</span>
          )}
        </div>
      </div>
      <p className="session-desc">{session.description}</p>
      {covers.length ? (
        <div className="session-covers">
          {covers.map((vinyl) => (
            <div
              key={vinyl.id}
              className="session-cover"
              style={{ backgroundImage: `url(${resolveCoverUrl(vinyl)})` }}
            />
          ))}
        </div>
      ) : null}
      <div className="session-actions">
        <button
          type="button"
          className="reserve-button"
          onClick={() => onReserve(session)}
        >
          Reservar
        </button>
        <Link to={`/session/${session.id}`} className="session-buy-link">
          Saber mais
        </Link>
      </div>
    </div>
  );
};


const SalaPage = ({ onReserve, resolveCoverUrl }) => {
  const today = new Date();
  const upcoming = [...sessions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter((session) => new Date(session.date) >= new Date(today.toDateString()));
  const nextSession = upcoming[0] || sessions[0];

  return (
    <main className="page">
      <section className="section sala-hero">
        <div
          className="sala-hero-image"
          aria-label="Sala de audição"
          style={{ backgroundImage: `url(${capaHero4}?v=2)` }}
        />
        <a
          className="sala-hero-address sala-hero-address-top"
          href="https://www.google.com/maps/search/?api=1&query=Rua%20da%20Consola%C3%A7%C3%A3o%2C%20222%2C%20conjunto%2018%2C%20S%C3%A3o%20Paulo"
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir no mapa"
          aria-label="Abrir no mapa: Rua da Consolação, 222, conjunto 18"
        >
          <span className="sala-hero-address-text">
            <span className="sala-hero-address-line">Rua da Consolação, 222</span>
            <span className="sala-hero-address-line">Conjunto 18</span>
            <span className="sala-hero-address-line">Centro-SP</span>
          </span>
          <span className="sala-hero-address-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path
                d="M8 16 16 8M10 8h6v6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
        <div className="sala-hero-copy">
          <div className="menu-hero-kicker sala-hero-kicker">A SALA</div>
          <p className="sala-hero-title">
            <span className="sala-hero-title-line">Um lugar</span>{" "}
            <span className="sala-hero-title-line">onde a música</span>{" "}
            <span className="sala-hero-title-line">é redonda e plana</span>
          </p>
          <p className="sala-hero-description">
            Audições programadas de vinil, <span className="sala-hero-description-break">todos os dias</span>
          </p>
        </div>
      </section>

      <section className="section" id="programacao-semana">
        <div className="section-header">
          <h2>Programação da semana</h2>
        </div>
        <div className="session-grid">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} onReserve={onReserve} resolveCoverUrl={resolveCoverUrl} />
          ))}
        </div>
      </section>

      <section className="section" id="clube">
        <div className="section-header">
          <h2>Clube de membros</h2>
          <p>Participação contínua com plano Free e Premium.</p>
        </div>
        <Link to="/clube" className="primary-link">Ver níveis do clube</Link>
      </section>

    </main>
  );
};

const VinylCard = ({ vinyl, subtitle, member, onAddToCart, inventoryItem, onActivateMember, resolveCoverUrl }) => {
  const best = inventoryItem || getBestInventory(vinyl.id);
  const partner = best ? getPartnerById(best.partner_id) : null;
  const normalPrice = best ? best.price_normal : null;
  const price = normalPrice !== null ? (member ? discountedPrice(normalPrice) : normalPrice) : null;

  return (
    <Link to={`/vinyl/${vinyl.id}`} className="vinyl-card">
      <div className="vinyl-cover" style={{ backgroundImage: `url(${resolveCoverUrl(vinyl)})` }} />
      <div className="vinyl-info">
        <div className="vinyl-artist">{vinyl.artist}</div>
        <div className="vinyl-album">{vinyl.album}</div>
        {subtitle ? <div className="vinyl-subtitle">{subtitle}</div> : null}
        {best && partner && price ? (
          <div className="price-row">
            {member ? (
              <div className="price-main price-compare">
                <span className="price-old">{formatPrice(normalPrice)}</span>
                <span className="price-new">{formatPrice(price)}</span>
              </div>
            ) : (
              <NonMemberPrice value={formatPrice(price)} onActivate={onActivateMember} />
            )}
            <div className="price-meta">
              {member ? "15% OFF Membro Premium" : "Preço normal"}
            </div>
            <div className="price-partner-row">
              <button
                type="button"
                className="price-partner-link as-button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const to = partnerCatalogLink(partner.id);
                  window.history.pushState({}, "", to);
                  window.dispatchEvent(new PopStateEvent("popstate"));
                  window.scrollTo(0, 0);
                }}
              >
                {partner.name}
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label="Adicionar ao carrinho"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onAddToCart?.({
                    vinylId: vinyl.id,
                    partnerId: best.partner_id,
                  });
                }}
              >
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path
                    d="M6 6h14l-1.6 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5.5 4H3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="20" r="1.3" fill="currentColor" />
                  <circle cx="17" cy="20" r="1.3" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="vinyl-subtitle">Sem parceiro disponível</div>
        )}
      </div>
    </Link>
  );
};

const MarketplacePage = ({ member, onReserve, onAddToCart, onAddPackToCart, onActivateMember, resolveCoverUrl }) => {
  const today = new Date();
  const movementParam = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("movement") || "";
  }, []);
  const movementLabel = movementParam.trim();
  const movementDescriptions = {
    "Soul de quarto escuro":
      "Texturas densas, vozes próximas e camadas que pedem escuta focada em volume controlado.",
    "Baladas com arranjo orquestral":
      "Faixas de pulso lento com harmonias amplas e clima cinematografico para audição prolongada.",
    "Groove lento e urbano":
      "Baixos marcados, batida redonda e repeticao hipnotica para construcoes de atmosfera.",
  };
  const catalogOnly = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("catalog") === "1";
  }, []);
  const upcomingSessions = [...sessions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter((session) => new Date(session.date) >= new Date(today.toDateString()));

  const highlightVinyls = useMemo(() => {
    const ids = new Set();
    const picks = [];
    upcomingSessions.forEach((session) => {
      getSessionVinyls(session.id, "tocado").forEach((vinyl) => {
        if (!ids.has(vinyl.id) && picks.length < 4) {
          ids.add(vinyl.id);
          picks.push(vinyl);
        }
      });
    });
    return picks.length ? picks : vinyls.slice(0, 4);
  }, [upcomingSessions]);
  const highlightDisplay = useMemo(
    () => highlightVinyls.filter((vinyl) => hasRealCoverUrl(resolveCoverUrl(vinyl))),
    [highlightVinyls, resolveCoverUrl]
  );

  const [query, setQuery] = useState(movementParam);
  const [catalogFilter, setCatalogFilter] = useState("all");
  const discountVinylIds = useMemo(
    () =>
      new Set(
        inventory
          .filter((item) => item.price_member < item.price_normal)
          .map((item) => item.vinyl_id)
      ),
    []
  );
  const rarityVinylIds = useMemo(
    () => new Set(inventory.filter((item) => item.quantity <= 1).map((item) => item.vinyl_id)),
    []
  );
  const filtered = vinyls.filter((vinyl) => {
    const term = `${vinyl.artist} ${vinyl.album} ${vinyl.genre} ${(vinyl.tags || []).join(" ")}`.toLowerCase();
    const matchQuery = term.includes(query.toLowerCase());
    if (!matchQuery) return false;
    const best = getBestInventory(vinyl.id);
    const activePrice = best
      ? member
        ? discountedPrice(best.price_normal)
        : best.price_normal
      : null;
    if (catalogFilter === "all") return true;
    if (catalogFilter === "discount") return discountVinylIds.has(vinyl.id);
    if (catalogFilter === "rarity") return rarityVinylIds.has(vinyl.id);
    if (catalogFilter === "up100") return activePrice !== null && activePrice <= 100;
    if (catalogFilter === "up200") return activePrice !== null && activePrice <= 200;
    if (catalogFilter === "70s") return vinyl.year >= 1970 && vinyl.year < 1980;
    if (catalogFilter === "80s") return vinyl.year >= 1980 && vinyl.year < 1990;
    if (catalogFilter === "90s") return vinyl.year >= 1990 && vinyl.year < 2000;
    return true;
  });
  const filteredDisplay = useMemo(
    () => filtered.filter((vinyl) => hasRealCoverUrl(resolveCoverUrl(vinyl))),
    [filtered, resolveCoverUrl]
  );
  const movementBase = useMemo(() => {
    if (!movementLabel) return [];
    const term = movementLabel.toLowerCase();
    return vinyls.filter((vinyl) =>
      `${vinyl.artist} ${vinyl.album} ${vinyl.genre} ${(vinyl.tags || []).join(" ")}`
        .toLowerCase()
        .includes(term)
    );
  }, [movementLabel]);
  const movementDisplay = useMemo(() => {
    if (!movementLabel) return [];
    const exact = vinyls.filter((vinyl) => vinyl.tags?.includes(movementLabel));
    if (exact.length) return exact.slice(0, 4);
    return movementBase.slice(0, 4);
  }, [movementLabel, movementBase]);
  const movementDisplayWithCover = useMemo(
    () => movementDisplay.filter((vinyl) => hasRealCoverUrl(resolveCoverUrl(vinyl))),
    [movementDisplay, resolveCoverUrl]
  );
  const movementPackage = useMemo(() => {
    if (!movementDisplayWithCover.length) return null;
    const picks = movementDisplayWithCover
      .map((vinyl) => {
        const best = getBestInventory(vinyl.id);
        if (!best) return null;
        const basePrice = member ? discountedPrice(best.price_normal) : best.price_normal;
        return { vinyl, basePrice, partnerId: best.partner_id };
      })
      .filter(Boolean)
      .slice(0, 4);
    if (picks.length < 2) return null;
    const totalBase = picks.reduce((sum, item) => sum + item.basePrice, 0);
    const totalPack = Math.round(totalBase * 0.85);
    return { picks, totalBase, totalPack };
  }, [movementDisplayWithCover, member]);

  const pastSessions = sessions.filter(
    (session) => new Date(session.date) < new Date(today.toDateString())
  );

  return (
    <main className="page">
      {!catalogOnly ? (
        <section className="section">
          <div className="section-header">
            <h2>Programação do Ziggy Play</h2>
            <p>
              Cada sessão tem um tema. O que toca na sala guia o marketplace. Condição
              especial para membros.
            </p>
          </div>
          <div className="session-grid">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} onReserve={onReserve} resolveCoverUrl={resolveCoverUrl} />
            ))}
          </div>
          <Link to="/market?catalog=1" className="section-link">
            <span className="section-arrow" aria-hidden="true" />
            Edicoes passadas
          </Link>
        </section>
      ) : null}

      {!catalogOnly ? (
        <section className="section">
          <div className="section-header">
            <h2>Pecas em Destaque</h2>
            <p>Discos que ja passaram pelo Ziggy Play em sessões anteriores.</p>
          </div>
          <div className="vinyl-highlight">
            {highlightDisplay.map((vinyl) => (
              <div key={vinyl.id} className="highlight-item">
                <div
                  className="highlight-cover"
                  style={{ backgroundImage: `url(${resolveCoverUrl(vinyl)})` }}
                />
                <div className="highlight-info">
                  <div className="vinyl-artist">{vinyl.artist}</div>
                  <div className="vinyl-album">{vinyl.album}</div>
                  <Link to={`/vinyl/${vinyl.id}`} className="primary-link">
                    Ver disco
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Link to="/market?catalog=1" className="section-link">
            <span className="section-arrow" aria-hidden="true" />
            Ver todos
          </Link>
        </section>
      ) : null}

      <section className="section" id="catalog">
        {!movementLabel ? (
          <div className="section-header">
            <h2>{catalogOnly ? "Catálogo Geral" : "Explorar Coleção"}</h2>
            <p>Busca simples por artista ou album.</p>
          </div>
        ) : null}
        {movementLabel ? (
          <div className="catalog-context">
            <div className="catalog-context-title">Movimento selecionado</div>
            <div className="catalog-context-movement">{movementLabel}</div>
            <p>
              {movementDescriptions[movementLabel] ||
                "Seleção contextual vinculada ao movimento da sessão, com critério de afinidade sonora."}
            </p>
            {movementPackage ? (
              <div className="catalog-pack">
                <div className="catalog-pack-title">Pacote do movimento</div>
                <div className="catalog-pack-meta">
                  {movementPackage.picks.map((item) => item.vinyl.album).join(" + ")}
                </div>
                <div className="catalog-pack-row">
                  <div className="catalog-pack-price">
                    <span className="old">{formatPrice(movementPackage.totalBase)}</span>
                    <span className="new">{formatPrice(movementPackage.totalPack)}</span>
                    <span className="off">15% OFF no pacote</span>
                  </div>
                  <button
                    type="button"
                    className="pack-cart-button"
                    aria-label="Adicionar pacote ao carrinho"
                    onClick={() => onAddPackToCart?.(movementPackage.picks)}
                  >
                    <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                      <path
                        d="M6 6h14l-1.6 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5.5 4H3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="9" cy="20" r="1.3" fill="currentColor" />
                      <circle cx="17" cy="20" r="1.3" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {!movementLabel ? (
          <div className="catalog-filters">
            <button
              type="button"
              className={`filter-chip ${catalogFilter === "all" ? "is-active" : ""}`}
              onClick={() => setCatalogFilter("all")}
            >
              Todos
            </button>
            <button
              type="button"
              className={`filter-chip ${catalogFilter === "discount" ? "is-active" : ""}`}
              onClick={() => setCatalogFilter("discount")}
            >
              Com desconto
            </button>
            <button
              type="button"
              className={`filter-chip ${catalogFilter === "rarity" ? "is-active" : ""}`}
              onClick={() => setCatalogFilter("rarity")}
            >
              Raridades
            </button>
            <button
              type="button"
              className={`filter-chip ${catalogFilter === "up100" ? "is-active" : ""}`}
              onClick={() => setCatalogFilter("up100")}
            >
              Ate R$ 100
            </button>
            <button
              type="button"
              className={`filter-chip ${catalogFilter === "up200" ? "is-active" : ""}`}
              onClick={() => setCatalogFilter("up200")}
            >
              Ate R$ 200
            </button>
            <button
              type="button"
              className={`filter-chip ${catalogFilter === "70s" ? "is-active" : ""}`}
              onClick={() => setCatalogFilter("70s")}
            >
              Anos 70
            </button>
            <button
              type="button"
              className={`filter-chip ${catalogFilter === "80s" ? "is-active" : ""}`}
              onClick={() => setCatalogFilter("80s")}
            >
              Anos 80
            </button>
            <button
              type="button"
              className={`filter-chip ${catalogFilter === "90s" ? "is-active" : ""}`}
              onClick={() => setCatalogFilter("90s")}
            >
              Anos 90
            </button>
          </div>
        ) : null}
        {!movementLabel ? (
          <div className="search-row">
            <input
              type="search"
              placeholder="Digite artista ou album"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <span className="result-count">{filteredDisplay.length} itens</span>
          </div>
        ) : null}
        <div className="vinyl-grid">
          {(movementLabel ? movementDisplayWithCover : filteredDisplay).map((vinyl) => (
            <VinylCard
              key={vinyl.id}
              vinyl={vinyl}
              subtitle={`${vinyl.year} · ${vinyl.genre}`}
              member={member}
              onAddToCart={onAddToCart}
              onActivateMember={onActivateMember}
              resolveCoverUrl={resolveCoverUrl}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

const SessionPage = ({
  sessionId,
  member,
  onAddToCart,
  onActivateMember,
  resolveCoverUrl,
  onReserve,
}) => {
  const session = sessions.find((item) => item.id === sessionId);
  if (!session) {
    return (
      <main className="page">
        <div className="section-header">
          <h2>Sesao não encontrada</h2>
          <Link to="/" className="primary-link">
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  const played = getSessionVinyls(session.id, "tocado");
  const playedDisplay = played.filter((vinyl) => hasRealCoverUrl(resolveCoverUrl(vinyl)));
  const related = getSessionVinyls(session.id, "relacionado");
  const relatedDisplay = (() => {
    const ids = new Set();
    const list = [];

    related.forEach((vinyl) => {
      if (!ids.has(vinyl.id)) {
        ids.add(vinyl.id);
        list.push(vinyl);
      }
    });

    if (list.length < 4) {
      vinyls.forEach((vinyl) => {
        if (ids.has(vinyl.id)) return;
        if (played.some((item) => item.id === vinyl.id)) return;
        ids.add(vinyl.id);
        list.push(vinyl);
      });
    }

    return list
      .filter((vinyl) => hasRealCoverUrl(resolveCoverUrl(vinyl)))
      .slice(0, 4);
  })();
  const movementTags = session?.movements || [];
  const isSpecial = Boolean(session?.is_special && session?.guest_name);
  const guestPhotoUrl = session?.guest_photo_url || "";
  const guestInitials = getInitials(session?.guest_name || "Convidado");
  const guestBio = session?.guest_bio || "";
  const sessionLongDescription = session?.detail_description || session?.description || "";
  const sessionActionCard = (
    <aside className="session-quick-card" aria-label="Ações da sessão">
      <div className="meta-label">Acesso rápido</div>
      <div className="session-quick-links">
        <button type="button" className="session-cta-link" onClick={() => onReserve(session)}>
          Reservar
        </button>
        <Link to="/clube" className="session-cta-link">
          Tornar-se membro
        </Link>
        <Link to="/menu" className="session-cta-link">
          Ver cardápio
        </Link>
      </div>
    </aside>
  );
  const vinylsWithRealCover = useMemo(
    () => vinyls.filter((vinyl) => hasRealCoverUrl(resolveCoverUrl(vinyl))),
    [resolveCoverUrl]
  );
  const movementGroups = movementTags.map((tag) => {
    const primary = vinylsWithRealCover.filter((vinyl) => vinyl.tags?.includes(tag));
    const nonPlayed = primary.filter((vinyl) => !played.some((item) => item.id === vinyl.id));
    const items = [];
    const picked = new Set();
    const pushItem = (vinyl) => {
      if (!vinyl || picked.has(vinyl.id) || items.length >= 4) return;
      picked.add(vinyl.id);
      items.push(vinyl);
    };

    (nonPlayed.length ? nonPlayed : primary).forEach(pushItem);

    if (items.length < 4) {
      vinylsWithRealCover.forEach((vinyl) => {
        if (played.some((item) => item.id === vinyl.id)) return;
        pushItem(vinyl);
      });
    }

    if (items.length < 4) {
      vinylsWithRealCover.forEach(pushItem);
    }

    return { tag, items };
  }).filter((group) => group.items.length === 4);

  return (
    <main className="page">
      <section className="section">
        {isSpecial ? (
          <div className="session-hero session-hero--special">
            <div className="session-night-feature">
              <div className="session-date">{formatDate(session.date)}</div>
              <h1>{session.theme}</h1>
              <div className="session-hero-copy-row">
                {sessionLongDescription ? (
                  <div className="session-description-block session-body-copy-group">
                    {splitTextBySentence(sessionLongDescription).map((line, index) => (
                      <p key={`${line}-${index}`} className="session-long-description session-body-copy">
                        {line}
                      </p>
                    ))}
                  </div>
                ) : null}
                {sessionActionCard}
              </div>
            </div>
            <div className="session-guest-photo">
              {guestPhotoUrl ? (
                <img src={guestPhotoUrl} alt={session.guest_name} />
              ) : (
                <div className="session-guest-feature-fallback" aria-hidden="true">
                  {guestInitials}
                </div>
              )}
            </div>
            <aside className="session-guest-bio-card">
              <div className="meta-label">Convidado Especial</div>
              <div className="session-guest-name">{session.guest_name}</div>
              <div className="session-guest-role">{session.guest_role || "Convidado da noite"}</div>
              {guestBio ? (
                <div className="session-body-copy-group">
                  {splitTextBySentence(guestBio).map((line, index) => (
                    <p key={`${line}-${index}`} className="session-guest-bio session-body-copy">
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
            </aside>
          </div>
        ) : (
          <div className="session-hero">
            <div className="session-hero-main">
              <div className="session-date">{formatDate(session.date)}</div>
              <h1>{session.theme}</h1>
              <div className="session-hero-copy-row">
                {sessionLongDescription ? (
                  <div className="session-description-block session-body-copy-group">
                    {splitTextBySentence(sessionLongDescription).map((line, index) => (
                      <p key={`${line}-${index}`} className="session-long-description session-body-copy">
                        {line}
                      </p>
                    ))}
                  </div>
                ) : null}
                {sessionActionCard}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Seleção principal da noite</h2>
          <div className="session-time-pill">Primeiro álbum às 20:30</div>
        </div>
        <div className="played-grid">
          {playedDisplay.map((vinyl) => {
            const best = getBestInventory(vinyl.id);
            const partner = best ? getPartnerById(best.partner_id) : null;
            return (
              <div key={vinyl.id} className="played-card">
                <Link to={`/vinyl/${vinyl.id}`}>
                  <div
                    className="played-cover"
                    style={{ backgroundImage: `url(${resolveCoverUrl(vinyl)})` }}
                  />
                </Link>
                <div className="played-info">
                  <div className="vinyl-artist">{vinyl.artist}</div>
                  <div className="vinyl-album">{vinyl.album}</div>
                  <div className="vinyl-subtitle">
                    {vinyl.year} · {vinyl.genre}
                  </div>
                  {best && partner ? (
                    <div className="price-row">
                      {member ? (
                        <div className="price-main price-compare">
                          <span className="price-old">{formatPrice(best.price_normal)}</span>
                          <span className="price-new">{formatPrice(discountedPrice(best.price_normal))}</span>
                        </div>
                      ) : (
                        <NonMemberPrice
                          value={formatPrice(best.price_normal)}
                          onActivate={onActivateMember}
                        />
                      )}
                      <div className="price-meta">
                        {member ? "15% OFF Membro Premium" : "Preço normal"}
                      </div>
                      <div className="price-partner-row">
                        <Link
                          to={partnerCatalogLink(partner.id)}
                          className="price-partner-link"
                        >
                          {partner.name}
                        </Link>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label="Adicionar ao carrinho"
                          onClick={() =>
                            onAddToCart({
                              vinylId: vinyl.id,
                              partnerId: best.partner_id,
                            })
                          }
                        >
                          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                            <path
                              d="M6 6h14l-1.6 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5.5 4H3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle cx="9" cy="20" r="1.3" fill="currentColor" />
                            <circle cx="17" cy="20" r="1.3" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="price-meta">Sem parceiro disponível</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Conhecer outros artistas</h2>
          <p>Seleção relacionada ao tema da sessão.</p>
        </div>
        <div className="vinyl-grid">
          {relatedDisplay.map((vinyl) => (
            <VinylCard
              key={vinyl.id}
              vinyl={vinyl}
              subtitle={`${vinyl.year} · ${vinyl.genre}`}
              member={member}
              onAddToCart={onAddToCart}
              onActivateMember={onActivateMember}
              resolveCoverUrl={resolveCoverUrl}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Explorar Além da Sessão</h2>
          <p>Conexoes de movimento e afinidade para expandir a noite.</p>
        </div>
        <div className="context-block">
          <div className="context-title">Movimentos da noite</div>
          <div className="movement-grid">
            {movementGroups.map((group) => (
              <div key={group.tag} className="movement-card">
                <div className="movement-title">{group.tag}</div>
                <div className="movement-covers">
                  {group.items.map((vinyl) => (
                    <Link key={vinyl.id} to={`/vinyl/${vinyl.id}`} className="movement-cover">
                      <div
                        className="movement-cover-image"
                        style={{ backgroundImage: `url(${resolveCoverUrl(vinyl)})` }}
                        aria-label={`${vinyl.artist} ${vinyl.album}`}
                      />
                    </Link>
                  ))}
                  <Link
                    to={`/market?catalog=1&movement=${encodeURIComponent(group.tag)}`}
                    className="movement-overlay"
                  >
                    +
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Explorar Coleção Completa</h2>
          <p>Todo o acervo conectado aos parceiros.</p>
        </div>
        <Link to="/market?catalog=1" className="primary-link">
          Ir para catálogo geral
        </Link>
      </section>
    </main>
  );
};

const VinylPage = ({ vinylId, member, onAddToCart, onActivateMember, resolveCoverUrl }) => {
  const vinyl = getVinylById(vinylId);
  if (!vinyl) {
    return (
      <main className="page">
        <div className="section-header">
          <h2>Disco não encontrado</h2>
          <Link to="/" className="primary-link">
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  const items = getInventoryForVinyl(vinyl.id);
  const vinylCoverUrl = resolveCoverUrl(vinyl);
  if (!hasRealCoverUrl(vinylCoverUrl)) {
    return (
      <main className="page">
        <div className="section-header">
          <h2>Disco sem capa real no acervo visual</h2>
          <p>Este item foi ocultado por não ter capa oficial disponível.</p>
          <Link to="/market?catalog=1" className="primary-link">
            Voltar ao catálogo
          </Link>
        </div>
      </main>
    );
  }
  const related = vinyls
    .filter((item) => item.genre === vinyl.genre && item.id !== vinyl.id)
    .filter((item) => hasRealCoverUrl(resolveCoverUrl(item)))
    .slice(0, 3);

  return (
    <main className="page">
      <section className="section">
        <div className="vinyl-hero">
          <div
            className="vinyl-hero-cover"
            style={{ backgroundImage: `url(${vinylCoverUrl})` }}
          />
          <div className="vinyl-hero-info">
            <div className="vinyl-artist">{vinyl.artist}</div>
            <h1>{vinyl.album}</h1>
            <div className="vinyl-subtitle">
              {vinyl.year} · {vinyl.genre} · {vinyl.format}
            </div>
            {vinyl.description ? <div className="vinyl-description">{vinyl.description}</div> : null}
            <div className="vinyl-buy">
              <div className="vinyl-buy-title">Vendido por</div>
              <div className="partner-list compact">
                {items.map((item) => {
                  const partner = getPartnerById(item.partner_id);
                  const price = member ? discountedPrice(item.price_normal) : item.price_normal;
                  return (
                    <div key={`${item.partner_id}-${item.vinyl_id}`} className="partner-card compact">
                      <div>
                        <Link
                          to={partnerCatalogLink(item.partner_id)}
                          className="partner-name-link"
                        >
                          {partner?.name}
                        </Link>
                        <div className="partner-meta">
                          Midia {item.condition_media} · Capa {item.condition_sleeve}
                        </div>
                        <div className="partner-meta">
                          {item.availability_status} · {item.quantity} un.
                        </div>
                      </div>
                      <div className="partner-price">
                        <div className="partner-price-main">
                          {member ? (
                            <div className="price-main price-compare">
                              <span className="price-old">{formatPrice(item.price_normal)}</span>
                              <span className="price-new">{formatPrice(price)}</span>
                            </div>
                          ) : (
                            <NonMemberPrice value={formatPrice(price)} onActivate={onActivateMember} />
                          )}
                          {member ? (
                            <div className="price-meta">15% OFF Membro Premium</div>
                          ) : (
                        <div className="price-meta">Preço normal</div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label="Adicionar ao carrinho"
                          onClick={() =>
                            onAddToCart?.({
                              vinylId: vinyl.id,
                              partnerId: item.partner_id,
                            })
                          }
                        >
                          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                            <path
                              d="M6 6h14l-1.6 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5.5 4H3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle cx="9" cy="20" r="1.3" fill="currentColor" />
                            <circle cx="17" cy="20" r="1.3" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Faixas e ficha tecnica</h2>
          <p>Resumo do album e informacoes essenciais.</p>
        </div>
        <div className="vinyl-details">
          <div className="tracklist">
            <div className="context-title">Tracklist</div>
            <ol>
              {vinyl.tracklist?.map((track) => (
                <li key={track}>{track}</li>
              ))}
            </ol>
          </div>
          <div className="tech-card">
            <div className="context-title">Ficha tecnica</div>
            <div className="tech-grid">
              {vinyl.tech?.label ? (
                <div className="tech-row">
                  <div className="tech-label">Selo</div>
                  <div className="tech-value">{vinyl.tech.label}</div>
                </div>
              ) : null}
              {vinyl.tech?.producer ? (
                <div className="tech-row">
                  <div className="tech-label">Producao</div>
                  <div className="tech-value">{vinyl.tech.producer}</div>
                </div>
              ) : null}
              {vinyl.tech?.studio ? (
                <div className="tech-row">
                  <div className="tech-label">Estudio</div>
                  <div className="tech-value">{vinyl.tech.studio}</div>
                </div>
              ) : null}
              {vinyl.tech?.country ? (
                <div className="tech-row">
                  <div className="tech-label">Pais</div>
                  <div className="tech-value">{vinyl.tech.country}</div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="related-card">
            <div className="context-title">Vinis relacionados</div>
            <div className="related-list">
              {related.map((item) => (
                <Link key={item.id} to={`/vinyl/${item.id}`} className="related-item">
                  <img src={resolveCoverUrl(item)} alt={`${item.artist} ${item.album}`} />
                  <div>
                    <div className="vinyl-artist">{item.artist}</div>
                    <div className="vinyl-album">{item.album}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

const PartnersPage = () => {
  const csvHeaders = [
    "partner_name",
    "artist",
    "album",
    "year",
    "genre",
    "format",
    "condition_media",
    "condition_sleeve",
    "price_brl",
    "availability_status",
    "quantity",
    "cover_image_url",
    "product_url",
    "notes",
  ];

  const csvContent = `${csvHeaders.join(",")}\n`;
  const downloadUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;

  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <h2>Parceiros Ziggyfy</h2>
          <p>
            Lojistas enviam o acervo via template, a Ziggyfy conecta os discos as
            sessões e os usuarios compram diretamente do parceiro.
          </p>
        </div>
        <div className="partner-model">
          <div className="model-step">
            <div className="model-label">1</div>
            <div>
              <div className="model-title">Envio de acervo</div>
              <div className="model-desc">Template CSV simples com dados do disco.</div>
            </div>
          </div>
          <div className="model-step">
            <div className="model-label">2</div>
            <div>
              <div className="model-title">Conexao com sessões</div>
              <div className="model-desc">Discos vinculados ao contexto da sala.</div>
            </div>
          </div>
          <div className="model-step">
            <div className="model-label">3</div>
            <div>
              <div className="model-title">Venda direta</div>
              <div className="model-desc">Compra finalizada no site do lojista.</div>
            </div>
          </div>
          <div className="model-step">
            <div className="model-label">4</div>
            <div>
              <div className="model-title">Beneficios contextuais</div>
              <div className="model-desc">Preços especiais para membros Ziggyfy.</div>
            </div>
          </div>
        </div>
        <a href={downloadUrl} download="ziggy-play-template.csv" className="primary-link">
          Baixar template de acervo
        </a>
      </section>
    </main>
  );
};

const PartnerPage = ({ partnerId, onAddToCart, member, onActivateMember, resolveCoverUrl }) => {
  const partner = getPartnerById(partnerId);
  const partnerItems = inventory.filter((item) => item.partner_id === partnerId);
  const partnerVinyls = partnerItems
    .map((item) => {
      const vinyl = getVinylById(item.vinyl_id);
      if (!vinyl) return null;
      return { vinyl, inventory: item };
    })
    .filter(Boolean);

  if (!partner) {
    return (
      <main className="page">
        <div className="section-header">
          <h2>Loja não encontrada</h2>
          <Link to="/" className="primary-link">
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <h2>{partner.name}</h2>
          <p>{partner.description}</p>
        </div>
        <div className="partner-address">{partner.address}</div>
        <div className="vinyl-grid">
          {partnerVinyls.map((item) => (
            <VinylCard
              key={item.vinyl.id}
              vinyl={item.vinyl}
              subtitle={`${item.vinyl.year} · ${item.vinyl.genre}`}
              member={member}
              onAddToCart={onAddToCart}
              inventoryItem={item.inventory}
              onActivateMember={onActivateMember}
              resolveCoverUrl={resolveCoverUrl}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

const MenuPage = () => (
  <main className="page menu-page">
    <section className="section club-hero menu-hero">
      <div className="club-hero-layout">
        <div
          className="club-hero-image menu-hero-image"
          aria-label="Ambiente Ziggy Play"
        >
          <img src={imagemCardapio2} alt="" loading="eager" decoding="async" />
        </div>
        <div className="club-hero-copy">
          <div className="menu-hero-kicker">O BALCÃO</div>
          <h1>
            We can be foodies <span className="club-title-line">just for one day</span>
          </h1>
          <p>
            No bar, trabalhamos exclusivamente com produtores brasileiros: whisky Lamas do Rio
            Grande do Sul, gin Amazzoni, vermute e bitter Enraizes, vinhos naturais do Sul e de
            São Paulo, conservas Tours, cervejas artesanais. A carta e inteira nacional, dos
            destilados aos queijos.
          </p>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-header">
        <h2>Bebidas (Cult Brasileiro)</h2>
      </div>
      <div className="menu-section">
        <div className="menu-section-title">Whiskey</div>
        <div className="menu-table">
          <div className="menu-row">
            <div className="menu-col-title">Blackstar</div>
            <div className="menu-col-subtitle">Lamas Single Malt (RS)</div>
            <div className="menu-col-desc">
              Whisky artesanal brasileiro, maturado em barris de carvalho. Notas de baunilha, leve
              defumado e final macio. Dose de 50ml. Servido puro ou com gelo grande.
            </div>
            <div className="menu-col-price">R$ 58 · dose</div>
          </div>
          <div className="menu-row">
            <div className="menu-col-title">Golden Years</div>
            <div className="menu-col-subtitle">Lamas Bourbon Style / Blend Especial</div>
            <div className="menu-col-desc">
              Perfil quente e envolvente, com notas de caramelo e especiarias suaves. Dose de 50ml.
              Servido puro ou com gelo.
            </div>
            <div className="menu-col-price">R$ 54 · dose</div>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <div className="menu-section-title">Drinks</div>
        <div className="menu-table">
          <div className="menu-row">
            <div className="menu-col-title">Starman</div>
            <div className="menu-col-subtitle">Old Fashioned Brasil</div>
            <div className="menu-col-desc">
              Whisky Lamas, bitter artesanal Enraizes, acucar e casca de laranja. Denso, elegante e
              levemente especiado.
            </div>
            <div className="menu-col-price">R$ 46 · coquetel</div>
          </div>
          <div className="menu-row">
            <div className="menu-col-title">Let's Dance</div>
            <div className="menu-col-subtitle">Negroni Brasileiro</div>
            <div className="menu-col-desc">
              Gin Amazzoni, Vermute Rosso Enraizes, Bitter artesanal brasileiro. Intenso, herbal,
              equilibrado.
            </div>
            <div className="menu-col-price">R$ 44 · coquetel</div>
          </div>
          <div className="menu-row">
            <div className="menu-col-title">Modern Love</div>
            <div className="menu-col-subtitle">Gin & Tônica Botanica</div>
            <div className="menu-col-desc">
              Gin Amazzoni ou Yvy Mar, tonica brasileira premium, toque citrico. Fresco, aromatico,
              vibrante.
            </div>
            <div className="menu-col-price">R$ 38 · coquetel</div>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <div className="menu-section-title">Vinhos</div>
        <div className="menu-table">
          <div className="menu-row">
            <div className="menu-col-title">Sound & Vision</div>
            <div className="menu-col-subtitle">Vivente Branco Natural (RS)</div>
            <div className="menu-col-desc">
              Mineral, acido na medida certa, extremamente gastronomico. Taca 150ml.
            </div>
            <div className="menu-col-price">R$ 36 · taça</div>
          </div>
          <div className="menu-row">
            <div className="menu-col-title">Life on Mars?</div>
            <div className="menu-col-subtitle">Casa Viccas Rose Natural (SP)</div>
            <div className="menu-col-desc">Leve, fresco, textura delicada. Taca 150ml.</div>
            <div className="menu-col-price">R$ 34 · taça</div>
          </div>
          <div className="menu-row">
            <div className="menu-col-title">Heroes</div>
            <div className="menu-col-subtitle">Dominio Vicari Tinto Natural (RS)</div>
            <div className="menu-col-desc">Leve, frutado, fácil de beber. Taça 150ml.</div>
            <div className="menu-col-price">R$ 38 · taça</div>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <div className="menu-section-title">Cervejas artesanais</div>
        <div className="menu-table">
          <div className="menu-row">
            <div className="menu-col-title">Rebel Rebel</div>
            <div className="menu-col-subtitle">Dadiva Pilsen</div>
            <div className="menu-col-desc">Classica, limpa, refrescante.</div>
            <div className="menu-col-price">R$ 24 · lata</div>
          </div>
          <div className="menu-row">
            <div className="menu-col-title">Changes</div>
            <div className="menu-col-subtitle">Tarantino Session IPA ou Sour Leve</div>
            <div className="menu-col-desc">Aromatica, leve, com personalidade.</div>
            <div className="menu-col-price">R$ 28 · lata</div>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <div className="menu-section-title">Não alcoólicos</div>
        <div className="menu-table">
          <div className="menu-row">
            <div className="menu-col-title">Ashes to Ashes</div>
            <div className="menu-col-subtitle">Kombucha artesanal brasileira</div>
            <div className="menu-col-desc">(Hibisco ou gengibre) leve, fermentada, refrescante.</div>
            <div className="menu-col-price">R$ 18 · garrafa</div>
          </div>
          <div className="menu-row">
            <div className="menu-col-title">Space Oddity</div>
            <div className="menu-col-subtitle">Água com gas + limão siciliano</div>
            <div className="menu-col-desc">Simples, elegante, essencial.</div>
            <div className="menu-col-price">R$ 12 · copo</div>
          </div>
          <div className="menu-row">
            <div className="menu-col-title">Refris e agua normal</div>
            <div className="menu-col-subtitle">&nbsp;</div>
            <div className="menu-col-desc">Selecionados da casa.</div>
            <div className="menu-col-price">R$ 10 · un.</div>
          </div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-header">
        <h2>Comidinhas (Spiders from Kitchen)</h2>
      </div>
      <div className="menu-section-title">Petiscos</div>
      <div className="menu-table">
        <div className="menu-row">
          <div className="menu-col-title">Station to Station</div>
          <div className="menu-col-subtitle">Tábua brasileira</div>
          <div className="menu-col-desc">
            Queijos artesanais nacionais (cabra, mofo branco ou canastra), nozes e mel.
          </div>
          <div className="menu-col-price">R$ 54 · porcao</div>
        </div>
        <div className="menu-row">
          <div className="menu-col-title">Diamond Dogs</div>
          <div className="menu-col-subtitle">Atum em azeite - Tours Conservas</div>
          <div className="menu-col-desc">
            Atum solido brasileiro servido com pao rustico e manteiga artesanal.
          </div>
          <div className="menu-col-price">R$ 48 · porcao</div>
        </div>
        <div className="menu-row">
          <div className="menu-col-title">Young Americans</div>
          <div className="menu-col-subtitle">Snacks selecionados</div>
          <div className="menu-col-desc">
            Amendoas defumadas, azeitonas marinadas e chips artesanais.
          </div>
          <div className="menu-col-price">R$ 36 · porcao</div>
        </div>
      </div>
    </section>
  </main>
);

const ClubePage = () => (
  <main className="page clube-page">
    <section className="section club-hero">
      <div className="club-hero-layout">
        <div
          className="club-hero-image"
          aria-label="Clube Ziggy Play"
        >
          <img src={capaHero} alt="" loading="eager" decoding="async" />
        </div>
        <div className="club-hero-copy">
          <div className="menu-hero-kicker">O CLUBE</div>
          <h1>Ground Control to Member Tom</h1>
          <p>
            O Clube Ziggy Play é a camada de participação contínua do espaço. Ele conecta a programação
            da sala ao marketplace contextual e cria vantagens reais para quem quer participar
            ativamente da circulação de acervos.
          </p>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-header">
        <h2>Comparar planos</h2>
        <p>Quer destravar o ecossistema do Ziggy? Escolha um plano abaixo.</p>
      </div>
      <div className="club-plan-grid">
        <article className="club-plan-card">
          <div className="club-tier">Ziggy Free</div>
          <ul className="club-plan-points">
            <li>Acesso ao marketplace de vinis.</li>
            <li>Programação da sala com antecedência.</li>
            <li>Entrada na comunidade Ziggy.</li>
          </ul>
          <div className="club-actions">
            <Link className="primary-button" to="/clube/adesao/free">
              Entrar no Ziggy Free
            </Link>
          </div>
        </article>
        <article className="club-plan-card premium">
          <div className="club-tier">Ziggy Stardust</div>
          <ul className="club-plan-points">
            <li>Tudo do Ziggy Free.</li>
            <li>Condição especial na compra de discos da programação.</li>
            <li>Acesso prioritário a sessões especiais com convidados.</li>
            <li>Participação no Clube de Troca de Vinis.</li>
          </ul>
          <div className="club-actions">
            <Link to="/clube/adesao/stardust" className="primary-button">
              Assinar Ziggy Stardust
              <span className="club-price-in-cta"> - R$ 49 / mes</span>
            </Link>
            <div className="club-price-inline">R$ 49 / mes</div>
          </div>
        </article>
      </div>
    </section>
  </main>
);

const ClubePlanResultPage = ({ plan, onActivateMember }) => {
  const isPremium = plan === "stardust";
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [freeSubmitted, setFreeSubmitted] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupCpf, setSignupCpf] = useState("");

  const whatsappEntryUrl = `https://wa.me/5500000000000?text=${encodeURIComponent(
    `Oi! Quero entrar no grupo do Ziggy Free.\n\nNome: ${signupName}\nEmail: ${signupEmail}\nTelefone: ${signupPhone}${signupCpf ? `\nCPF: ${signupCpf}` : ""}`
  )}`;

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    if (isPremium) {
      setPaymentOpen(true);
      return;
    }
    window.open(whatsappEntryUrl, "_blank", "noopener,noreferrer");
    setFreeSubmitted(true);
  };

  return (
    <main className="page clube-page">
      <section className="section">
        <div className="section-header">
          <p className="club-signup-intro">
            {isPremium
              ? "Complete seu cadastro básico para abrir a janela de pagamento."
              : "Complete seu cadastro básico para entrar no grupo de WhatsApp do Ziggy Free."}
          </p>
        </div>

        <article className={`club-card club-signup-card ${isPremium ? "premium" : ""}`}>
          <div className="club-signup-summary">
            <div className="club-tier">{isPremium ? "Ziggy Stardust" : "Ziggy Free"}</div>
            <div className="club-price">{isPremium ? "R$ 49 / mes" : "Sem mensalidade"}</div>
            <ul className="club-list">
              <li>Acesso ao marketplace contextual de vinis.</li>
              {isPremium ? (
                <li>Desconto de membro na vitrine conectada às sessões.</li>
              ) : (
                <li>Programação da sala com antecedência e reservas.</li>
              )}
              {isPremium ? (
                <li>Prioridade em sessões especiais e clube de troca.</li>
              ) : (
                <li>Upgrade para o premium a qualquer momento.</li>
              )}
            </ul>
          </div>

          <div className="club-signup-main">
            <div className="club-signup-divider">Seus dados</div>
            <form className="club-signup-form" onSubmit={handleSignupSubmit}>
              <label>
                Nome completo
                <input
                  required
                  type="text"
                  name="name"
                  value={signupName}
                  onChange={(event) => setSignupName(event.target.value)}
                  placeholder="Seu nome"
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  name="email"
                  value={signupEmail}
                  onChange={(event) => setSignupEmail(event.target.value)}
                  placeholder="voce@email.com"
                />
              </label>
              <label>
                Telefone
                <input
                  required
                  type="tel"
                  name="phone"
                  value={signupPhone}
                  onChange={(event) => setSignupPhone(event.target.value)}
                  placeholder="(11) 99999-0000"
                />
              </label>
              <label>
                CPF (opcional)
                <input
                  type="text"
                  name="cpf"
                  value={signupCpf}
                  onChange={(event) => setSignupCpf(event.target.value)}
                  placeholder="000.000.000-00"
                />
              </label>

              <div className="club-signup-cta-row">
                <button type="submit" className="primary-button">
                  {isPremium ? "Continuar para pagamento" : "Entrar no grupo do WhatsApp"}
                </button>
                <Link to="/clube" className="club-back-link">
                  Ou voltar para planos
                </Link>
              </div>
            </form>

            {freeSubmitted && !isPremium ? (
              <div className="club-signup-note">
                Cadastro enviado. O grupo de WhatsApp foi aberto em uma nova aba.
              </div>
            ) : null}
          </div>
        </article>
      </section>

      {paymentOpen ? (
        <div className="modal-overlay" onClick={() => setPaymentOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Pagamento Ziggy Stardust</div>
                <div className="modal-subtitle">R$ 49 / mes · {signupName || "Assinante"}</div>
              </div>
              <button type="button" className="modal-close" onClick={() => setPaymentOpen(false)}>
                Fechar
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-note">Janela de pagamento simulada para assinatura mensal.</div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    onActivateMember?.();
                    setPaymentOpen(false);
                    window.history.pushState({}, "", "/market?catalog=1");
                    window.dispatchEvent(new PopStateEvent("popstate"));
                    window.scrollTo(0, 0);
                  }}
                >
                  Pagar R$ 49 e ativar assinatura
                </button>
                <button type="button" className="ghost-button" onClick={() => setPaymentOpen(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

const App = () => {
  const [member, setMember] = useMember();
  const { cart, addItem, removeItem, clear } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reserveSession, setReserveSession] = useState(null);
  const [reserveSuccess, setReserveSuccess] = useState(false);
  const [confirmItem, setConfirmItem] = useState(null);
  const { path } = usePath();
  const resolveCoverUrl = useRealCoverResolver();
  const requestAddToCart = (input) => {
    if (!input) return;
    if (input.vinylId && input.partnerId) {
      setConfirmItem({ vinylId: input.vinylId, partnerId: input.partnerId });
      return;
    }
    if (input.id) {
      const best = getBestInventory(input.id);
      if (!best) return;
      setConfirmItem({ vinylId: input.id, partnerId: best.partner_id });
    }
  };

  const route = useMemo(() => {
    const cleanPath = path.split("?")[0];
    if (cleanPath === "/") return { name: "sala" };
    if (cleanPath.startsWith("/session/"))
      return { name: "session", id: cleanPath.replace("/session/", "") };
    if (cleanPath.startsWith("/vinyl/"))
      return { name: "vinyl", id: cleanPath.replace("/vinyl/", "") };
    if (cleanPath.startsWith("/partner/"))
      return { name: "partner", id: cleanPath.replace("/partner/", "") };
    if (cleanPath === "/clube") return { name: "clube" };
    if (cleanPath === "/clube/adesao/free") return { name: "clube-result", plan: "free" };
    if (cleanPath === "/clube/adesao/stardust") return { name: "clube-result", plan: "stardust" };
    if (cleanPath === "/market") return { name: "market" };
    if (cleanPath === "/menu") return { name: "menu" };
    if (cleanPath === "/partners") return { name: "partners" };
    return { name: "notfound" };
  }, [path]);

  return (
    <div className="app">
      {confirmItem ? (
        <div className="modal-overlay" onClick={() => setConfirmItem(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Adicionar ao carrinho?</div>
                <div className="modal-subtitle">
                  {getVinylById(confirmItem.vinylId)?.artist} —{" "}
                  {getVinylById(confirmItem.vinylId)?.album}
                </div>
              </div>
              <button type="button" className="modal-close" onClick={() => setConfirmItem(null)}>
                Fechar
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-note">
                Vendido por{" "}
                {getPartnerById(confirmItem.partnerId)?.name}
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    addItem({
                      vinylId: confirmItem.vinylId,
                      partnerId: confirmItem.partnerId,
                    });
                    setConfirmItem(null);
                  }}
                >
                  Confirmar
                </button>
                <button type="button" className="ghost-button" onClick={() => setConfirmItem(null)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <TopNav
        member={member}
        setMember={setMember}
        cartCount={cart.length}
        onToggleCart={() => setCartOpen((prev) => !prev)}
      />
      {reserveOpen ? (
        <div className="modal-overlay" onClick={() => setReserveOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Reservar lugar</div>
                {reserveSession ? (
                  <div className="modal-subtitle">
                    {reserveSession.theme} · {formatDate(reserveSession.date)}
                  </div>
                ) : null}
              </div>
              <button type="button" className="modal-close" onClick={() => setReserveOpen(false)}>
                Fechar
              </button>
            </div>
            {!reserveSuccess ? (
              <form
                className="modal-body"
                onSubmit={(event) => {
                  event.preventDefault();
                  setReserveSuccess(true);
                }}
              >
                <label>
                  Nome completo
                  <input required type="text" name="name" placeholder="Seu nome" />
                </label>
                <label>
                  Email
                  <input required type="email" name="email" placeholder="você@email.com" />
                </label>
                <label>
                  Telefone
                  <input required type="tel" name="phone" placeholder="(11) 99999-0000" />
                </label>
                <label>
                  CPF (opcional)
                  <input type="text" name="cpf" placeholder="000.000.000-00" />
                </label>
                <div className="modal-note">
                  Taxa de reserva R$ 20, recuperável na consumação.
                </div>
                <button type="submit" className="primary-button">
                  Pagar reserva R$ 20
                </button>
              </form>
            ) : (
              <div className="modal-body">
                <div className="modal-success">Reserva confirmada.</div>
                <div className="modal-note">
                  Você receberá a confirmação por email. A taxa será abatida na consumação.
                </div>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    setReserveOpen(false);
                    setReserveSuccess(false);
                  }}
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
      {cartOpen ? (
        <div className="cart-panel">
          <div className="cart-header">
            <div>
              <div className="cart-title">Carrinho simulado</div>
              <div className="cart-subtitle">Checkout no Ziggyfy.</div>
            </div>
            <button type="button" className="cart-close" onClick={() => setCartOpen(false)}>
              Fechar
            </button>
          </div>
          <div className="cart-body">
            {cart.length ? (
              cart.map((item) => {
                const vinyl = getVinylById(item.vinylId);
                const partner = getPartnerById(item.partnerId);
                const listing = inventory.find(
                  (entry) => entry.vinyl_id === item.vinylId && entry.partner_id === item.partnerId
                );
                if (!vinyl || !partner || !listing) return null;
                const price = member ? discountedPrice(listing.price_normal) : listing.price_normal;
                return (
                  <div key={`${item.vinylId}-${item.partnerId}`} className="cart-item">
                    <div
                      className="cart-cover"
                      style={{ backgroundImage: `url(${resolveCoverUrl(vinyl)})` }}
                    />
                    <div className="cart-info">
                      <div className="vinyl-artist">{vinyl.artist}</div>
                      <div className="vinyl-album">{vinyl.album}</div>
                      <div className="cart-meta">{partner.name}</div>
                      {member ? (
                        <div className="price-main price-compare">
                          <span className="price-old">{formatPrice(listing.price_normal)}</span>
                          <span className="price-new">{formatPrice(price)}</span>
                        </div>
                      ) : (
                        <NonMemberPrice value={formatPrice(price)} onActivate={() => setMember(true)} />
                      )}
                      <div className="cart-actions">
                        <button type="button" className="primary-button">
                          Finalizar compra
                        </button>
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() => removeItem(item)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-note">Carrinho vazio.</div>
            )}
          </div>
          {cart.length ? (
            <div className="cart-footer">
              <button type="button" className="ghost-button" onClick={clear}>
                Limpar carrinho
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      {cart.length ? (
        <button
          type="button"
          className="floating-cart-button"
          onClick={() => setCartOpen(true)}
          aria-label="Abrir carrinho"
          title="Carrinho"
        >
          <span className="cart-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path
                d="M6 6h14l-1.6 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L5.5 4H3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="20" r="1.3" fill="currentColor" />
              <circle cx="17" cy="20" r="1.3" fill="currentColor" />
            </svg>
          </span>
          <span className="floating-cart-count">{cart.length}</span>
        </button>
      ) : null}
      {route.name === "sala" && (
        <SalaPage
          resolveCoverUrl={resolveCoverUrl}
          onReserve={(session) => {
            setReserveSession(session);
            setReserveSuccess(false);
            setReserveOpen(true);
          }}
        />
      )}
      {route.name === "market" && (
        <MarketplacePage
          member={member}
          onActivateMember={() => setMember(true)}
          resolveCoverUrl={resolveCoverUrl}
          onAddToCart={requestAddToCart}
          onAddPackToCart={(packItems) => {
            if (!packItems?.length) return;
            packItems.forEach((item) => {
              addItem({
                vinylId: item.vinyl.id,
                partnerId: item.partnerId,
              });
            });
          }}
          onReserve={(session) => {
            setReserveSession(session);
            setReserveSuccess(false);
            setReserveOpen(true);
          }}
        />
      )}
      {route.name === "session" && (
        <SessionPage
          sessionId={route.id}
          member={member}
          onAddToCart={requestAddToCart}
          onActivateMember={() => setMember(true)}
          resolveCoverUrl={resolveCoverUrl}
          onReserve={(session) => {
            setReserveSession(session);
            setReserveSuccess(false);
            setReserveOpen(true);
          }}
        />
      )}
      {route.name === "vinyl" && (
        <VinylPage
          vinylId={route.id}
          member={member}
          onAddToCart={requestAddToCart}
          onActivateMember={() => setMember(true)}
          resolveCoverUrl={resolveCoverUrl}
        />
      )}
      {route.name === "partner" && (
        <PartnerPage
          partnerId={route.id}
          onAddToCart={requestAddToCart}
          member={member}
          onActivateMember={() => setMember(true)}
          resolveCoverUrl={resolveCoverUrl}
        />
      )}
      {route.name === "clube" && <ClubePage />}
      {route.name === "clube-result" && (
        <ClubePlanResultPage
          plan={route.plan}
          onActivateMember={() => setMember(true)}
        />
      )}
      {route.name === "menu" && <MenuPage />}
      {route.name === "partners" && <PartnersPage />}
      {route.name === "notfound" && (
        <main className="page">
          <div className="section-header">
            <h2>Pagina não encontrada</h2>
            <Link to="/" className="primary-link">
              Voltar
            </Link>
          </div>
        </main>
      )}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">Ziggy Play</div>
          <div className="footer-address">Rua da Consolação, 222, conjunto 18, Centro, São Paulo/SP</div>
        </div>
        <div className="footer-quote">we are absolute beginners</div>
      </footer>
    </div>
  );
};

export default App;
