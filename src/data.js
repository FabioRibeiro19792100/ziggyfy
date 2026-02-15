const coverPalette = [
  ["#1f1c1a", "#7a6a4f"],
  ["#141312", "#3d3a36"],
  ["#221f1a", "#8f7a55"],
  ["#0f1011", "#4b4a46"],
  ["#1b1815", "#6a5b44"],
  ["#121415", "#5e5649"],
];

const makeCoverDataUrl = (artist, album, seed = 0) => {
  const [c1, c2] = coverPalette[seed % coverPalette.length];
  const svg =     `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="640">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c2}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
      <rect x="40" y="40" width="560" height="560" rx="14" ry="14" fill="none" stroke="#f1efea" stroke-opacity="0.2" stroke-width="2" />
      <text x="70" y="140" fill="#f1efea" font-family="Cormorant Garamond" font-size="40" font-weight="600">Ziggy Play</text>
      <text x="70" y="210" fill="#f1efea" font-family="Inter" font-size="20" font-weight="400">${artist}</text>
      <text x="70" y="250" fill="#f1efea" font-family="Inter" font-size="18" font-weight="300">${album}</text>
      <text x="70" y="530" fill="#f1efea" font-family="Inter" font-size="14" font-weight="300" opacity="0.7">Coleção privada</text>
      <text x="70" y="560" fill="#f1efea" font-family="Inter" font-size="14" font-weight="300" opacity="0.7">Pressagem selecionada</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
};

export const partners = [
  {
    id: "p1",
    name: "Casa Audionauta",
    url: "https://casaudionauta.com",
    description: "Curadoria focada em prensagens originais e edições audiophile.",
    address: "Rua das Agulhas, 82 · Pinheiros · São Paulo",
  },
  {
    id: "p2",
    name: "Rota do Vinil",
    url: "https://rotadovinil.com",
    description: "Acervo amplo com raridades brasileiras e importados clássicos.",
    address: "Av. Aurora, 155 · Centro · São Paulo",
  },
  {
    id: "p3",
    name: "Selo Sonoro",
    url: "https://selosonoro.com",
    description: "Seleção de dub, soul e new wave com foco em condição premium.",
    address: "Rua do Som, 41 · Santa Cecilia · São Paulo",
  },
];

export const vinyls = [
  {
    id: "v1",
    artist: "AC/DC",
    album: "Back in Black",
    year: 1980,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("AC/DC", "Back in Black", 0),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Atlantic Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v2",
    artist: "Bee Gees / Vários",
    album: "Saturday Night Fever (Soundtrack)",
    year: 1977,
    genre: "Soul / Pop",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Bee Gees / Vários", "Saturday Night Fever (Soundtrack)", 1),
    tags: [
      "Baladas de pista",
      "Groove classico"
    ],
    description: "Seleção de melodias fortes e grooves acessíveis, ideal para transitar entre escuta e pista.",
    tracklist: [],
    tech: {
      label: "RSO Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v3",
    artist: "Black Sabbath",
    album: "Sabotage",
    year: 1975,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Black Sabbath", "Sabotage", 2),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Warner Bros.",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v4",
    artist: "Black Sabbath",
    album: "Vol. 4",
    year: 1972,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Black Sabbath", "Vol. 4", 3),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Warner Bros.",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v5",
    artist: "Bob Dylan",
    album: "Highway 61 Revisited",
    year: 1965,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Bob Dylan", "Highway 61 Revisited", 4),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "Columbia Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v6",
    artist: "Bob Dylan",
    album: "The Essential Bob Dylan",
    year: 2000,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Bob Dylan", "The Essential Bob Dylan", 5),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "Columbia / Legacy",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v7",
    artist: "Caetano Veloso",
    album: "Trilhos Urbanos",
    year: 1982,
    genre: "MPB / BR Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Caetano Veloso", "Trilhos Urbanos", 6),
    tags: [
      "Brasilidade eletrica",
      "Cancao de varanda"
    ],
    description: "Canções brasileiras com recorte de época, arranjos marcantes e repertório para sessão coletiva.",
    tracklist: [],
    tech: {
      label: "Philips / PolyGram",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v8",
    artist: "Caetano Veloso & Chico Buarque",
    album: "Ao Vivo em Castro Alves",
    year: 1975,
    genre: "MPB / BR Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Caetano Veloso & Chico Buarque", "Ao Vivo em Castro Alves", 7),
    tags: [
      "Brasilidade eletrica",
      "Cancao de varanda"
    ],
    description: "Canções brasileiras com recorte de época, arranjos marcantes e repertório para sessão coletiva.",
    tracklist: [],
    tech: {
      label: "Philips",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v9",
    artist: "Cazuza",
    album: "O Tempo Não Para",
    year: 1989,
    genre: "MPB / BR Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Cazuza", "O Tempo Não Para", 8),
    tags: [
      "Brasilidade eletrica",
      "Cancao de varanda"
    ],
    description: "Canções brasileiras com recorte de época, arranjos marcantes e repertório para sessão coletiva.",
    tracklist: [],
    tech: {
      label: "Philips / PolyGram",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v10",
    artist: "Creedence Clearwater Revival",
    album: "Pendulum",
    year: 1970,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Creedence Clearwater Revival", "Pendulum", 9),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "Fantasy Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v11",
    artist: "David Bowie",
    album: "The Rise and Fall of Ziggy Stardust and the Spiders from Mars",
    year: 1972,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("David Bowie", "The Rise and Fall of Ziggy Stardust and the Spiders from Mars", 10),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "RCA Victor",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v12",
    artist: "David Bowie",
    album: "ChangesOneBowie",
    year: 1976,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("David Bowie", "ChangesOneBowie", 11),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "RCA Victor",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v13",
    artist: "David Bowie",
    album: "ChangesTwoBowie",
    year: 1981,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("David Bowie", "ChangesTwoBowie", 12),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "RCA Victor",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v14",
    artist: "David Bowie",
    album: "Let’s Dance",
    year: 1983,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("David Bowie", "Let’s Dance", 13),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "EMI America",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v15",
    artist: "David Bowie",
    album: "Ziggy Stardust: The Motion Picture",
    year: 1983,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("David Bowie", "Ziggy Stardust: The Motion Picture", 14),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "RCA Victor",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v16",
    artist: "Deep Purple",
    album: "Shades of Deep Purple",
    year: 1968,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Deep Purple", "Shades of Deep Purple", 15),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Tetragrammaton Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v17",
    artist: "Faith No More",
    album: "The Real Thing",
    year: 1989,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Faith No More", "The Real Thing", 16),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "Slash / Reprise",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v18",
    artist: "Fleetwood Mac",
    album: "Rumours",
    year: 1977,
    genre: "Soul / Pop",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Fleetwood Mac", "Rumours", 17),
    tags: [
      "Baladas de pista",
      "Groove classico"
    ],
    description: "Seleção de melodias fortes e grooves acessíveis, ideal para transitar entre escuta e pista.",
    tracklist: [],
    tech: {
      label: "Warner Bros.",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v19",
    artist: "Gilberto Gil",
    album: "A Gente Precisa Ver o Luar",
    year: 1981,
    genre: "MPB / BR Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Gilberto Gil", "A Gente Precisa Ver o Luar", 18),
    tags: [
      "Brasilidade eletrica",
      "Cancao de varanda"
    ],
    description: "Canções brasileiras com recorte de época, arranjos marcantes e repertório para sessão coletiva.",
    tracklist: [],
    tech: {
      label: "WEA",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v20",
    artist: "Guns N’ Roses",
    album: "Appetite for Destruction",
    year: 1987,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Guns N’ Roses", "Appetite for Destruction", 19),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Geffen Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v21",
    artist: "Guns N’ Roses",
    album: "G N’ R Lies",
    year: 1988,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Guns N’ Roses", "G N’ R Lies", 20),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Geffen Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v22",
    artist: "Guns N’ Roses",
    album: "Use Your Illusion I",
    year: 1991,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Guns N’ Roses", "Use Your Illusion I", 21),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Geffen Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v23",
    artist: "Guns N’ Roses",
    album: "Use Your Illusion II",
    year: 1991,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Guns N’ Roses", "Use Your Illusion II", 22),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Geffen Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v24",
    artist: "Iron Maiden",
    album: "Killers",
    year: 1981,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Iron Maiden", "Killers", 23),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "EMI",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v25",
    artist: "Iron Maiden",
    album: "Maiden Japan (EP)",
    year: 1981,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Iron Maiden", "Maiden Japan (EP)", 24),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "EMI",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v26",
    artist: "Iron Maiden",
    album: "The Number of the Beast",
    year: 1982,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Iron Maiden", "The Number of the Beast", 25),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "EMI",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v27",
    artist: "Iron Maiden",
    album: "Seventh Son of a Seventh Son",
    year: 1988,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Iron Maiden", "Seventh Son of a Seventh Son", 26),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "EMI",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v28",
    artist: "Joy Division",
    album: "Unknown Pleasures",
    year: 1979,
    genre: "Post-punk / New wave",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Joy Division", "Unknown Pleasures", 27),
    tags: [
      "Noite urbana",
      "Sintese fria"
    ],
    description: "Clima noturno e pulsação seca, com linhas de baixo e sintetizadores em primeiro plano.",
    tracklist: [],
    tech: {
      label: "Factory Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v29",
    artist: "Joy Division",
    album: "Closer",
    year: 1980,
    genre: "Post-punk / New wave",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Joy Division", "Closer", 28),
    tags: [
      "Noite urbana",
      "Sintese fria"
    ],
    description: "Clima noturno e pulsação seca, com linhas de baixo e sintetizadores em primeiro plano.",
    tracklist: [],
    tech: {
      label: "Factory Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v30",
    artist: "Kiss",
    album: "Creatures of the Night",
    year: 1982,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Kiss", "Creatures of the Night", 29),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Casablanca Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v31",
    artist: "Kraftwerk",
    album: "Die Mensch-Maschine",
    year: 1978,
    genre: "Post-punk / New wave",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Kraftwerk", "Die Mensch-Maschine", 30),
    tags: [
      "Noite urbana",
      "Sintese fria"
    ],
    description: "Clima noturno e pulsação seca, com linhas de baixo e sintetizadores em primeiro plano.",
    tracklist: [],
    tech: {
      label: "Kling Klang / EMI Electrola",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v32",
    artist: "Led Zeppelin",
    album: "Led Zeppelin",
    year: 1969,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Led Zeppelin", "Led Zeppelin", 31),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Atlantic Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v33",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    year: 1971,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Led Zeppelin", "Led Zeppelin IV", 32),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Atlantic Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v34",
    artist: "Legião Urbana",
    album: "As Quatro Estações",
    year: 1989,
    genre: "MPB / BR Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Legião Urbana", "As Quatro Estações", 33),
    tags: [
      "Brasilidade eletrica",
      "Cancao de varanda"
    ],
    description: "Canções brasileiras com recorte de época, arranjos marcantes e repertório para sessão coletiva.",
    tracklist: [],
    tech: {
      label: "EMI",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v35",
    artist: "Marvin Gaye",
    album: "What’s Going On",
    year: 1971,
    genre: "Soul / Pop",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Marvin Gaye", "What’s Going On", 34),
    tags: [
      "Baladas de pista",
      "Groove classico"
    ],
    description: "Seleção de melodias fortes e grooves acessíveis, ideal para transitar entre escuta e pista.",
    tracklist: [],
    tech: {
      label: "Tamla (Motown)",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v36",
    artist: "Megadeth",
    album: "Rust in Peace",
    year: 1990,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Megadeth", "Rust in Peace", 35),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Capitol Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v37",
    artist: "Metallica",
    album: "Metallica (Black Album)",
    year: 1991,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Metallica", "Metallica (Black Album)", 36),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Elektra / Vertigo",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v38",
    artist: "Metallica",
    album: "Master of Puppets",
    year: 1986,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Metallica", "Master of Puppets", 37),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Elektra Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v39",
    artist: "Miles Davis",
    album: "Kind of Blue",
    year: 1959,
    genre: "Jazz",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Miles Davis", "Kind of Blue", 38),
    tags: [
      "Sessao de escuta",
      "Noite instrumental"
    ],
    description: "Registro fundamental para audição dedicada, com dinâmica ampla e foco em timbre e espaço.",
    tracklist: [],
    tech: {
      label: "Columbia Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v40",
    artist: "Nirvana",
    album: "Nevermind",
    year: 1991,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Nirvana", "Nevermind", 39),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "DGC Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v41",
    artist: "Patti Smith",
    album: "Horses",
    year: 1975,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Patti Smith", "Horses", 40),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "Arista Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v42",
    artist: "Pink Floyd",
    album: "Delicate Sound of Thunder",
    year: 1988,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Pink Floyd", "Delicate Sound of Thunder", 41),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "EMI",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v43",
    artist: "Pink Floyd",
    album: "The Dark Side of the Moon",
    year: 1973,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Pink Floyd", "The Dark Side of the Moon", 42),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "Harvest / EMI",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v44",
    artist: "Queen",
    album: "Live in Tokyo 1985",
    year: 1985,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Queen", "Live in Tokyo 1985", 43),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "Bootleg (não oficial)",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v45",
    artist: "Radiohead",
    album: "OK Computer",
    year: 1997,
    genre: "Post-punk / New wave",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Radiohead", "OK Computer", 44),
    tags: [
      "Noite urbana",
      "Sintese fria"
    ],
    description: "Clima noturno e pulsação seca, com linhas de baixo e sintetizadores em primeiro plano.",
    tracklist: [],
    tech: {
      label: "Parlophone",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v46",
    artist: "Ramones",
    album: "Ramones",
    year: 1976,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Ramones", "Ramones", 45),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Sire Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v47",
    artist: "Raul Seixas",
    album: "O Segredo do Universo",
    year: 1988,
    genre: "MPB / BR Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Raul Seixas", "O Segredo do Universo", 46),
    tags: [
      "Brasilidade eletrica",
      "Cancao de varanda"
    ],
    description: "Canções brasileiras com recorte de época, arranjos marcantes e repertório para sessão coletiva.",
    tracklist: [],
    tech: {
      label: "Som Livre",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v48",
    artist: "Raul Seixas",
    album: "O Baú do Raul",
    year: 1992,
    genre: "MPB / BR Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Raul Seixas", "O Baú do Raul", 47),
    tags: [
      "Brasilidade eletrica",
      "Cancao de varanda"
    ],
    description: "Canções brasileiras com recorte de época, arranjos marcantes e repertório para sessão coletiva.",
    tracklist: [],
    tech: {
      label: "Som Livre",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v49",
    artist: "Sepultura",
    album: "Arise",
    year: 1991,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Sepultura", "Arise", 48),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Roadrunner Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v50",
    artist: "Skid Row",
    album: "Skid Row",
    year: 1989,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Skid Row", "Skid Row", 49),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Atlantic Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v51",
    artist: "Skid Row",
    album: "Slave to the Grind",
    year: 1991,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Skid Row", "Slave to the Grind", 50),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Atlantic Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v52",
    artist: "Soundgarden",
    album: "Badmotorfinger",
    year: 1991,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Soundgarden", "Badmotorfinger", 51),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "A&M Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v53",
    artist: "Supertramp",
    album: "Free as a Bird",
    year: 1987,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Supertramp", "Free as a Bird", 52),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "A&M Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v54",
    artist: "The Beatles",
    album: "Let It Be",
    year: 1970,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("The Beatles", "Let It Be", 53),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "Apple Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v55",
    artist: "The Cure",
    album: "Disintegration",
    year: 1989,
    genre: "Post-punk / New wave",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("The Cure", "Disintegration", 54),
    tags: [
      "Noite urbana",
      "Sintese fria"
    ],
    description: "Clima noturno e pulsação seca, com linhas de baixo e sintetizadores em primeiro plano.",
    tracklist: [],
    tech: {
      label: "Fiction Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v56",
    artist: "The Doors",
    album: "The Doors",
    year: 1967,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("The Doors", "The Doors", 55),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "Elektra Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v57",
    artist: "The Rolling Stones",
    album: "Exile on Main St.",
    year: 1972,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("The Rolling Stones", "Exile on Main St.", 56),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "Rolling Stones Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v58",
    artist: "The Smiths",
    album: "The World Won’t Listen",
    year: 1987,
    genre: "Post-punk / New wave",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("The Smiths", "The World Won’t Listen", 57),
    tags: [
      "Noite urbana",
      "Sintese fria"
    ],
    description: "Clima noturno e pulsação seca, com linhas de baixo e sintetizadores em primeiro plano.",
    tracklist: [],
    tech: {
      label: "Rough Trade",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v59",
    artist: "The Smiths",
    album: "Meat Is Murder",
    year: 1985,
    genre: "Post-punk / New wave",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("The Smiths", "Meat Is Murder", 58),
    tags: [
      "Noite urbana",
      "Sintese fria"
    ],
    description: "Clima noturno e pulsação seca, com linhas de baixo e sintetizadores em primeiro plano.",
    tracklist: [],
    tech: {
      label: "Rough Trade",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v60",
    artist: "The Stooges",
    album: "Raw Power",
    year: 1973,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("The Stooges", "Raw Power", 59),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Columbia Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v61",
    artist: "The Velvet Underground & Nico",
    album: "The Velvet Underground & Nico",
    year: 1967,
    genre: "Classic Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("The Velvet Underground & Nico", "The Velvet Underground & Nico", 60),
    tags: [
      "Classicos de acervo",
      "Sessao principal"
    ],
    description: "Título clássico de catálogo com repertório reconhecível e excelente resposta em escuta compartilhada.",
    tracklist: [],
    tech: {
      label: "Verve Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v62",
    artist: "Titãs",
    album: "Õ Blésq Blom",
    year: 1989,
    genre: "MPB / BR Rock",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Titãs", "Õ Blésq Blom", 61),
    tags: [
      "Brasilidade eletrica",
      "Cancao de varanda"
    ],
    description: "Canções brasileiras com recorte de época, arranjos marcantes e repertório para sessão coletiva.",
    tracklist: [],
    tech: {
      label: "WEA",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v63",
    artist: "U2",
    album: "Boy",
    year: 1980,
    genre: "Post-punk / New wave",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("U2", "Boy", 62),
    tags: [
      "Noite urbana",
      "Sintese fria"
    ],
    description: "Clima noturno e pulsação seca, com linhas de baixo e sintetizadores em primeiro plano.",
    tracklist: [],
    tech: {
      label: "Island Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v64",
    artist: "Van Halen",
    album: "Van Halen II",
    year: 1979,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Van Halen", "Van Halen II", 63),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Warner Bros.",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v65",
    artist: "Van Halen",
    album: "1984",
    year: 1984,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Van Halen", "1984", 64),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Warner Bros.",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v66",
    artist: "Vários",
    album: "Grease (Soundtrack)",
    year: 1978,
    genre: "Soul / Pop",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Vários", "Grease (Soundtrack)", 65),
    tags: [
      "Baladas de pista",
      "Groove classico"
    ],
    description: "Seleção de melodias fortes e grooves acessíveis, ideal para transitar entre escuta e pista.",
    tracklist: [],
    tech: {
      label: "RSO Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v67",
    artist: "Whitesnake",
    album: "Lovehunter",
    year: 1979,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Whitesnake", "Lovehunter", 66),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "United Artists / EMI",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v68",
    artist: "Whitesnake",
    album: "Whitesnake (1987)",
    year: 1987,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Whitesnake", "Whitesnake (1987)", 67),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "Geffen Records",
      producer: null,
      studio: null,
      country: null
    }
  },
  {
    id: "v69",
    artist: "Whitesnake",
    album: "Live… In the Heart of the City",
    year: 1980,
    genre: "Rock / Metal",
    format: "LP 12\"",
    cover_image_url: makeCoverDataUrl("Whitesnake", "Live… In the Heart of the City", 68),
    tags: [
      "Guitarras de garagem",
      "Peso analogico"
    ],
    description: "Disco de impacto com guitarras em destaque e energia de banda para sessões de alta voltagem.",
    tracklist: [],
    tech: {
      label: "United Artists / EMI",
      producer: null,
      studio: null,
      country: null
    }
  }
];

export const inventory = [
  {
    vinyl_id: "v1",
    partner_id: "p1",
    price_normal: 145,
    price_member: 123,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[0].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/ac-dc-back-in-black",
    notes: "Selo Atlantic Records"
  },
  {
    vinyl_id: "v2",
    partner_id: "p2",
    price_normal: 154,
    price_member: 131,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[1].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/bee-gees-varios-saturday-night-fever-soundtrack",
    notes: "Selo RSO Records"
  },
  {
    vinyl_id: "v3",
    partner_id: "p3",
    price_normal: 162,
    price_member: 138,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[2].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/black-sabbath-sabotage",
    notes: "Selo Warner Bros."
  },
  {
    vinyl_id: "v4",
    partner_id: "p1",
    price_normal: 171,
    price_member: 145,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[3].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/black-sabbath-vol-4",
    notes: "Selo Warner Bros."
  },
  {
    vinyl_id: "v5",
    partner_id: "p2",
    price_normal: 184,
    price_member: 156,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[4].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/bob-dylan-highway-61-revisited",
    notes: "Selo Columbia Records"
  },
  {
    vinyl_id: "v6",
    partner_id: "p3",
    price_normal: 170,
    price_member: 145,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[5].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/bob-dylan-the-essential-bob-dylan",
    notes: "Selo Columbia / Legacy"
  },
  {
    vinyl_id: "v7",
    partner_id: "p1",
    price_normal: 179,
    price_member: 152,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[6].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/caetano-veloso-trilhos-urbanos",
    notes: "Selo Philips / PolyGram"
  },
  {
    vinyl_id: "v8",
    partner_id: "p2",
    price_normal: 192,
    price_member: 163,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[7].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/caetano-veloso-chico-buarque-ao-vivo-em-castro-alves",
    notes: "Selo Philips"
  },
  {
    vinyl_id: "v9",
    partner_id: "p3",
    price_normal: 188,
    price_member: 160,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[8].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/cazuza-o-tempo-nao-para",
    notes: "Selo Philips / PolyGram"
  },
  {
    vinyl_id: "v10",
    partner_id: "p1",
    price_normal: 155,
    price_member: 132,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[9].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/creedence-clearwater-revival-pendulum",
    notes: "Selo Fantasy Records"
  },
  {
    vinyl_id: "v11",
    partner_id: "p2",
    price_normal: 159,
    price_member: 135,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[10].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/david-bowie-the-rise-and-fall-of-ziggy-stardust-and-the-spiders-from-mars",
    notes: "Selo RCA Victor"
  },
  {
    vinyl_id: "v12",
    partner_id: "p3",
    price_normal: 161,
    price_member: 137,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[11].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/david-bowie-changesonebowie",
    notes: "Selo RCA Victor"
  },
  {
    vinyl_id: "v13",
    partner_id: "p1",
    price_normal: 162,
    price_member: 138,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[12].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/david-bowie-changestwobowie",
    notes: "Selo RCA Victor"
  },
  {
    vinyl_id: "v14",
    partner_id: "p2",
    price_normal: 166,
    price_member: 141,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[13].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/david-bowie-let-s-dance",
    notes: "Selo EMI America"
  },
  {
    vinyl_id: "v15",
    partner_id: "p3",
    price_normal: 172,
    price_member: 146,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[14].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/david-bowie-ziggy-stardust-the-motion-picture",
    notes: "Selo RCA Victor"
  },
  {
    vinyl_id: "v16",
    partner_id: "p1",
    price_normal: 193,
    price_member: 164,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[15].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/deep-purple-shades-of-deep-purple",
    notes: "Selo Tetragrammaton Records"
  },
  {
    vinyl_id: "v17",
    partner_id: "p2",
    price_normal: 182,
    price_member: 155,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[16].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/faith-no-more-the-real-thing",
    notes: "Selo Slash / Reprise"
  },
  {
    vinyl_id: "v18",
    partner_id: "p3",
    price_normal: 196,
    price_member: 167,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[17].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/fleetwood-mac-rumours",
    notes: "Selo Warner Bros."
  },
  {
    vinyl_id: "v19",
    partner_id: "p1",
    price_normal: 144,
    price_member: 122,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[18].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/gilberto-gil-a-gente-precisa-ver-o-luar",
    notes: "Selo WEA"
  },
  {
    vinyl_id: "v20",
    partner_id: "p2",
    price_normal: 146,
    price_member: 124,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[19].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/guns-n-roses-appetite-for-destruction",
    notes: "Selo Geffen Records"
  },
  {
    vinyl_id: "v21",
    partner_id: "p3",
    price_normal: 152,
    price_member: 129,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[20].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/guns-n-roses-g-n-r-lies",
    notes: "Selo Geffen Records"
  },
  {
    vinyl_id: "v22",
    partner_id: "p1",
    price_normal: 158,
    price_member: 134,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[21].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/guns-n-roses-use-your-illusion-i",
    notes: "Selo Geffen Records"
  },
  {
    vinyl_id: "v23",
    partner_id: "p2",
    price_normal: 164,
    price_member: 139,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[22].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/guns-n-roses-use-your-illusion-ii",
    notes: "Selo Geffen Records"
  },
  {
    vinyl_id: "v24",
    partner_id: "p3",
    price_normal: 174,
    price_member: 148,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[23].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/iron-maiden-killers",
    notes: "Selo EMI"
  },
  {
    vinyl_id: "v25",
    partner_id: "p1",
    price_normal: 180,
    price_member: 153,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[24].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/iron-maiden-maiden-japan-ep",
    notes: "Selo EMI"
  },
  {
    vinyl_id: "v26",
    partner_id: "p2",
    price_normal: 185,
    price_member: 157,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[25].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/iron-maiden-the-number-of-the-beast",
    notes: "Selo EMI"
  },
  {
    vinyl_id: "v27",
    partner_id: "p3",
    price_normal: 188,
    price_member: 160,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[26].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/iron-maiden-seventh-son-of-a-seventh-son",
    notes: "Selo EMI"
  },
  {
    vinyl_id: "v28",
    partner_id: "p1",
    price_normal: 146,
    price_member: 124,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[27].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/joy-division-unknown-pleasures",
    notes: "Selo Factory Records"
  },
  {
    vinyl_id: "v29",
    partner_id: "p2",
    price_normal: 151,
    price_member: 128,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[28].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/joy-division-closer",
    notes: "Selo Factory Records"
  },
  {
    vinyl_id: "v30",
    partner_id: "p3",
    price_normal: 155,
    price_member: 132,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[29].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/kiss-creatures-of-the-night",
    notes: "Selo Casablanca Records"
  },
  {
    vinyl_id: "v31",
    partner_id: "p1",
    price_normal: 165,
    price_member: 140,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[30].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/kraftwerk-die-mensch-maschine",
    notes: "Selo Kling Klang / EMI Electrola"
  },
  {
    vinyl_id: "v32",
    partner_id: "p2",
    price_normal: 180,
    price_member: 153,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[31].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/led-zeppelin-led-zeppelin",
    notes: "Selo Atlantic Records"
  },
  {
    vinyl_id: "v33",
    partner_id: "p3",
    price_normal: 184,
    price_member: 156,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[32].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/led-zeppelin-led-zeppelin-iv",
    notes: "Selo Atlantic Records"
  },
  {
    vinyl_id: "v34",
    partner_id: "p1",
    price_normal: 176,
    price_member: 150,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[33].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/legiao-urbana-as-quatro-estacoes",
    notes: "Selo EMI"
  },
  {
    vinyl_id: "v35",
    partner_id: "p2",
    price_normal: 196,
    price_member: 167,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[34].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/marvin-gaye-what-s-going-on",
    notes: "Selo Tamla (Motown)"
  },
  {
    vinyl_id: "v36",
    partner_id: "p3",
    price_normal: 188,
    price_member: 160,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[35].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/megadeth-rust-in-peace",
    notes: "Selo Capitol Records"
  },
  {
    vinyl_id: "v37",
    partner_id: "p1",
    price_normal: 140,
    price_member: 119,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[36].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/metallica-metallica-black-album",
    notes: "Selo Elektra / Vertigo"
  },
  {
    vinyl_id: "v38",
    partner_id: "p2",
    price_normal: 146,
    price_member: 124,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[37].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/metallica-master-of-puppets",
    notes: "Selo Elektra Records"
  },
  {
    vinyl_id: "v39",
    partner_id: "p3",
    price_normal: 178,
    price_member: 151,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[38].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/miles-davis-kind-of-blue",
    notes: "Selo Columbia Records"
  },
  {
    vinyl_id: "v40",
    partner_id: "p1",
    price_normal: 158,
    price_member: 134,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[39].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/nirvana-nevermind",
    notes: "Selo DGC Records"
  },
  {
    vinyl_id: "v41",
    partner_id: "p2",
    price_normal: 174,
    price_member: 148,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[40].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/patti-smith-horses",
    notes: "Selo Arista Records"
  },
  {
    vinyl_id: "v42",
    partner_id: "p3",
    price_normal: 170,
    price_member: 145,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[41].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/pink-floyd-delicate-sound-of-thunder",
    notes: "Selo EMI"
  },
  {
    vinyl_id: "v43",
    partner_id: "p1",
    price_normal: 188,
    price_member: 160,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[42].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/pink-floyd-the-dark-side-of-the-moon",
    notes: "Selo Harvest / EMI"
  },
  {
    vinyl_id: "v44",
    partner_id: "p2",
    price_normal: 182,
    price_member: 155,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[43].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/queen-live-in-tokyo-1985",
    notes: "Selo Bootleg (não oficial)"
  },
  {
    vinyl_id: "v45",
    partner_id: "p3",
    price_normal: 188,
    price_member: 160,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[44].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/radiohead-ok-computer",
    notes: "Selo Parlophone"
  },
  {
    vinyl_id: "v46",
    partner_id: "p1",
    price_normal: 149,
    price_member: 127,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[45].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/ramones-ramones",
    notes: "Selo Sire Records"
  },
  {
    vinyl_id: "v47",
    partner_id: "p2",
    price_normal: 146,
    price_member: 124,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[46].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/raul-seixas-o-segredo-do-universo",
    notes: "Selo Som Livre"
  },
  {
    vinyl_id: "v48",
    partner_id: "p3",
    price_normal: 152,
    price_member: 129,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[47].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/raul-seixas-o-bau-do-raul",
    notes: "Selo Som Livre"
  },
  {
    vinyl_id: "v49",
    partner_id: "p1",
    price_normal: 158,
    price_member: 134,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[48].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/sepultura-arise",
    notes: "Selo Roadrunner Records"
  },
  {
    vinyl_id: "v50",
    partner_id: "p2",
    price_normal: 164,
    price_member: 139,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[49].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/skid-row-skid-row",
    notes: "Selo Atlantic Records"
  },
  {
    vinyl_id: "v51",
    partner_id: "p3",
    price_normal: 170,
    price_member: 145,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[50].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/skid-row-slave-to-the-grind",
    notes: "Selo Atlantic Records"
  },
  {
    vinyl_id: "v52",
    partner_id: "p1",
    price_normal: 176,
    price_member: 150,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[51].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/soundgarden-badmotorfinger",
    notes: "Selo A&M Records"
  },
  {
    vinyl_id: "v53",
    partner_id: "p2",
    price_normal: 182,
    price_member: 155,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[52].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/supertramp-free-as-a-bird",
    notes: "Selo A&M Records"
  },
  {
    vinyl_id: "v54",
    partner_id: "p3",
    price_normal: 203,
    price_member: 173,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[53].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/the-beatles-let-it-be",
    notes: "Selo Apple Records"
  },
  {
    vinyl_id: "v55",
    partner_id: "p1",
    price_normal: 140,
    price_member: 119,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[54].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/the-cure-disintegration",
    notes: "Selo Fiction Records"
  },
  {
    vinyl_id: "v56",
    partner_id: "p2",
    price_normal: 164,
    price_member: 139,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[55].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/the-doors-the-doors",
    notes: "Selo Elektra Records"
  },
  {
    vinyl_id: "v57",
    partner_id: "p3",
    price_normal: 165,
    price_member: 140,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[56].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/the-rolling-stones-exile-on-main-st",
    notes: "Selo Rolling Stones Records"
  },
  {
    vinyl_id: "v58",
    partner_id: "p1",
    price_normal: 158,
    price_member: 134,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[57].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/the-smiths-the-world-won-t-listen",
    notes: "Selo Rough Trade"
  },
  {
    vinyl_id: "v59",
    partner_id: "p2",
    price_normal: 164,
    price_member: 139,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[58].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/the-smiths-meat-is-murder",
    notes: "Selo Rough Trade"
  },
  {
    vinyl_id: "v60",
    partner_id: "p3",
    price_normal: 182,
    price_member: 155,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[59].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/the-stooges-raw-power",
    notes: "Selo Columbia Records"
  },
  {
    vinyl_id: "v61",
    partner_id: "p1",
    price_normal: 194,
    price_member: 165,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[60].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/the-velvet-underground-nico-the-velvet-underground-nico",
    notes: "Selo Verve Records"
  },
  {
    vinyl_id: "v62",
    partner_id: "p2",
    price_normal: 182,
    price_member: 155,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[61].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/titas-o-blesq-blom",
    notes: "Selo WEA"
  },
  {
    vinyl_id: "v63",
    partner_id: "p3",
    price_normal: 193,
    price_member: 164,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[62].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/u2-boy",
    notes: "Selo Island Records"
  },
  {
    vinyl_id: "v64",
    partner_id: "p1",
    price_normal: 146,
    price_member: 124,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[63].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/van-halen-van-halen-ii",
    notes: "Selo Warner Bros."
  },
  {
    vinyl_id: "v65",
    partner_id: "p2",
    price_normal: 147,
    price_member: 125,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[64].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/van-halen-1984",
    notes: "Selo Warner Bros."
  },
  {
    vinyl_id: "v66",
    partner_id: "p3",
    price_normal: 159,
    price_member: 135,
    condition_media: "VG+",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 1,
    cover_image_url: vinyls[65].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/varios-grease-soundtrack",
    notes: "Selo RSO Records"
  },
  {
    vinyl_id: "v67",
    partner_id: "p1",
    price_normal: 164,
    price_member: 139,
    condition_media: "VG+",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[66].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/whitesnake-lovehunter",
    notes: "Selo United Artists / EMI"
  },
  {
    vinyl_id: "v68",
    partner_id: "p2",
    price_normal: 164,
    price_member: 139,
    condition_media: "VG",
    condition_sleeve: "VG",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[67].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/whitesnake-whitesnake-1987",
    notes: "Selo Geffen Records"
  },
  {
    vinyl_id: "v69",
    partner_id: "p3",
    price_normal: 175,
    price_member: 149,
    condition_media: "NM",
    condition_sleeve: "VG+",
    availability_status: "Disponivel",
    quantity: 2,
    cover_image_url: vinyls[68].cover_image_url,
    product_url: "https://ziggyfy.com/catalogo/whitesnake-live-in-the-heart-of-the-city",
    notes: "Selo United Artists / EMI"
  }
];

export const sessions = [
  {
    id: "s1",
    date: "2026-02-16",
    theme: "Alta Voltagem",
    description: "Recorte de rock e metal com pressão, riffs clássicos e dinâmica de sala cheia.",
    movements: [
      "Guitarras de garagem",
      "Peso analogico",
      "Classicos de acervo"
    ]
  },
  {
    id: "s2",
    date: "2026-02-18",
    theme: "Noite Urbana",
    description: "Pulso pós-punk e new wave para uma sessão fria, repetitiva e hipnótica.",
    movements: [
      "Noite urbana",
      "Sintese fria",
      "Sessao principal"
    ]
  },
  {
    id: "s3",
    date: "2026-02-20",
    theme: "Brasil em Rotacao",
    description: "Canção brasileira em vinil, entre MPB e BR rock de catálogo.",
    movements: [
      "Brasilidade eletrica",
      "Cancao de varanda",
      "Classicos de acervo"
    ]
  },
  {
    id: "s4",
    date: "2026-02-22",
    theme: "Baladas e Groove",
    description: "Soul e pop com faixas de grande apelo melódico e groove contínuo.",
    movements: [
      "Baladas de pista",
      "Groove classico",
      "Sessao principal"
    ]
  },
  {
    id: "s5",
    date: "2026-02-24",
    theme: "Escuta de Referencia",
    description: "Noite dedicada à escuta de detalhes, timbre e espacialidade.",
    movements: [
      "Sessao de escuta",
      "Noite instrumental",
      "Classicos de acervo"
    ]
  },
  {
    id: "s6",
    date: "2026-02-26",
    theme: "Classicos da Casa",
    description: "Seleção transversal de clássicos para apresentar o acervo completo.",
    movements: [
      "Classicos de acervo",
      "Sessao principal",
      "Baladas de pista"
    ]
  },
  {
    id: "s7",
    date: "2026-02-28",
    theme: "Lado B Pesado",
    description: "Foco em cortes de impacto e discos de alta energia.",
    movements: [
      "Peso analogico",
      "Guitarras de garagem",
      "Noite urbana"
    ]
  },
  {
    id: "s8",
    date: "2026-03-02",
    theme: "Fechamento Ziggy",
    description: "Síntese do mês com repertório de diferentes frentes sonoras do catálogo.",
    movements: [
      "Sessao principal",
      "Classicos de acervo",
      "Brasilidade eletrica"
    ]
  }
];

export const sessionVinyl = [
  {
    session_id: "s1",
    vinyl_id: "v1",
    context_type: "tocado"
  },
  {
    session_id: "s1",
    vinyl_id: "v3",
    context_type: "tocado"
  },
  {
    session_id: "s1",
    vinyl_id: "v4",
    context_type: "tocado"
  },
  {
    session_id: "s1",
    vinyl_id: "v16",
    context_type: "tocado"
  },
  {
    session_id: "s1",
    vinyl_id: "v20",
    context_type: "relacionado"
  },
  {
    session_id: "s1",
    vinyl_id: "v21",
    context_type: "relacionado"
  },
  {
    session_id: "s2",
    vinyl_id: "v28",
    context_type: "tocado"
  },
  {
    session_id: "s2",
    vinyl_id: "v29",
    context_type: "tocado"
  },
  {
    session_id: "s2",
    vinyl_id: "v31",
    context_type: "tocado"
  },
  {
    session_id: "s2",
    vinyl_id: "v45",
    context_type: "tocado"
  },
  {
    session_id: "s2",
    vinyl_id: "v55",
    context_type: "relacionado"
  },
  {
    session_id: "s2",
    vinyl_id: "v58",
    context_type: "relacionado"
  },
  {
    session_id: "s3",
    vinyl_id: "v7",
    context_type: "tocado"
  },
  {
    session_id: "s3",
    vinyl_id: "v8",
    context_type: "tocado"
  },
  {
    session_id: "s3",
    vinyl_id: "v9",
    context_type: "tocado"
  },
  {
    session_id: "s3",
    vinyl_id: "v19",
    context_type: "tocado"
  },
  {
    session_id: "s3",
    vinyl_id: "v34",
    context_type: "relacionado"
  },
  {
    session_id: "s3",
    vinyl_id: "v47",
    context_type: "relacionado"
  },
  {
    session_id: "s4",
    vinyl_id: "v2",
    context_type: "tocado"
  },
  {
    session_id: "s4",
    vinyl_id: "v18",
    context_type: "tocado"
  },
  {
    session_id: "s4",
    vinyl_id: "v35",
    context_type: "tocado"
  },
  {
    session_id: "s4",
    vinyl_id: "v66",
    context_type: "tocado"
  },
  {
    session_id: "s4",
    vinyl_id: "v5",
    context_type: "relacionado"
  },
  {
    session_id: "s4",
    vinyl_id: "v6",
    context_type: "relacionado"
  },
  {
    session_id: "s5",
    vinyl_id: "v39",
    context_type: "tocado"
  },
  {
    session_id: "s5",
    vinyl_id: "v5",
    context_type: "tocado"
  },
  {
    session_id: "s5",
    vinyl_id: "v6",
    context_type: "tocado"
  },
  {
    session_id: "s5",
    vinyl_id: "v10",
    context_type: "tocado"
  },
  {
    session_id: "s5",
    vinyl_id: "v11",
    context_type: "relacionado"
  },
  {
    session_id: "s5",
    vinyl_id: "v12",
    context_type: "relacionado"
  },
  {
    session_id: "s6",
    vinyl_id: "v5",
    context_type: "tocado"
  },
  {
    session_id: "s6",
    vinyl_id: "v6",
    context_type: "tocado"
  },
  {
    session_id: "s6",
    vinyl_id: "v10",
    context_type: "tocado"
  },
  {
    session_id: "s6",
    vinyl_id: "v11",
    context_type: "tocado"
  },
  {
    session_id: "s6",
    vinyl_id: "v12",
    context_type: "relacionado"
  },
  {
    session_id: "s6",
    vinyl_id: "v13",
    context_type: "relacionado"
  },
  {
    session_id: "s7",
    vinyl_id: "v1",
    context_type: "tocado"
  },
  {
    session_id: "s7",
    vinyl_id: "v3",
    context_type: "tocado"
  },
  {
    session_id: "s7",
    vinyl_id: "v4",
    context_type: "tocado"
  },
  {
    session_id: "s7",
    vinyl_id: "v16",
    context_type: "tocado"
  },
  {
    session_id: "s7",
    vinyl_id: "v20",
    context_type: "relacionado"
  },
  {
    session_id: "s7",
    vinyl_id: "v21",
    context_type: "relacionado"
  },
  {
    session_id: "s8",
    vinyl_id: "v5",
    context_type: "tocado"
  },
  {
    session_id: "s8",
    vinyl_id: "v6",
    context_type: "tocado"
  },
  {
    session_id: "s8",
    vinyl_id: "v10",
    context_type: "tocado"
  },
  {
    session_id: "s8",
    vinyl_id: "v11",
    context_type: "tocado"
  },
  {
    session_id: "s8",
    vinyl_id: "v12",
    context_type: "relacionado"
  },
  {
    session_id: "s8",
    vinyl_id: "v13",
    context_type: "relacionado"
  }
];
