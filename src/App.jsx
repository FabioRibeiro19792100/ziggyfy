import { useEffect, useMemo, useState } from "react";
import { inventory, partners, sessions, sessionVinyl, vinyls } from "./data.js";

const formatDate = (iso) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

const formatPrice = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

const useMember = () => {
  const [member, setMember] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.localStorage.getItem("ziggy_member") === "1"
  );

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
      <div className="brand-mark">Ziggyfy</div>
      <div className="brand-sub">O Marketplace de vinis do Ziggy Play</div>
    </Link>
    <nav className="nav-links">
      <button
        type="button"
        className={`member-toggle ${member ? "is-active" : ""}`}
        onClick={() => setMember((prev) => !prev)}
      >
        {member ? "Membro ativo" : "Entrar como membro"}
      </button>
      <button type="button" className="cart-button" onClick={onToggleCart} aria-label="Carrinho">
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
        <span className="cart-label">Carrinho</span>
        {cartCount ? <span className="cart-count">{cartCount}</span> : null}
      </button>
    </nav>
  </header>
);

const SessionCard = ({ session, onReserve }) => {
  const covers = getSessionVinyls(session.id, "tocado").slice(0, 4);
  return (
    <div
      className="session-card"
      onClick={(event) => {
        if (event.target.closest(".session-actions")) return;
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div className="session-card-header">
        <div className="session-date">{formatDate(session.date)}</div>
        <div className="session-theme">{session.theme}</div>
      </div>
      <p className="session-desc">{session.description}</p>
      <div className="session-covers">
        {covers.map((vinyl) => (
          <div
            key={vinyl.id}
            className="session-cover"
            style={{ backgroundImage: `url(${vinyl.cover_image_url})` }}
          />
        ))}
      </div>
      <div className="session-actions">
        <button
          type="button"
          className="reserve-button"
          onClick={() => onReserve(session)}
        >
          Reservar lugar
        </button>
        <Link to={`/session/${session.id}`} className="session-buy-link">
          Saber mais
        </Link>
      </div>
    </div>
  );
};

const VinylCard = ({ vinyl, subtitle }) => (
  <Link to={`/vinyl/${vinyl.id}`} className="vinyl-card">
    <div className="vinyl-cover" style={{ backgroundImage: `url(${vinyl.cover_image_url})` }} />
    <div className="vinyl-info">
      <div className="vinyl-artist">{vinyl.artist}</div>
      <div className="vinyl-album">{vinyl.album}</div>
      {subtitle ? <div className="vinyl-subtitle">{subtitle}</div> : null}
    </div>
  </Link>
);

const Home = ({ member, onReserve }) => {
  const today = new Date();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("catalog")) {
      const section = document.getElementById("catalog");
      section?.scrollIntoView({ behavior: "smooth" });
    }
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

  const [query, setQuery] = useState("");
  const filtered = vinyls.filter((vinyl) => {
    const term = `${vinyl.artist} ${vinyl.album}`.toLowerCase();
    return term.includes(query.toLowerCase());
  });

  const pastSessions = sessions.filter(
    (session) => new Date(session.date) < new Date(today.toDateString())
  );

  return (
    <main className="page">
      <section className="section">
        <div className="section-header">
          <h2>Programacao do Ziggy Play</h2>
          <p>
            Cada sessão tem um tema. O que toca na sala guia o marketplace. Condição
            especial para membros.
          </p>
        </div>
        <div className="session-grid">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} onReserve={onReserve} />
          ))}
        </div>
        <Link to="/?catalog=1" className="section-link">
          <span className="section-arrow" aria-hidden="true" />
          Edicoes passadas
        </Link>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Pecas em Destaque</h2>
          <p>Discos que ja passaram pelo Ziggy Play em sessoes anteriores.</p>
        </div>
        <div className="vinyl-highlight">
          {highlightVinyls.map((vinyl) => (
            <div key={vinyl.id} className="highlight-item">
              <div
                className="highlight-cover"
                style={{ backgroundImage: `url(${vinyl.cover_image_url})` }}
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
        <Link to="/?catalog=1" className="section-link">
          <span className="section-arrow" aria-hidden="true" />
          Ver todos
        </Link>
      </section>

      <section className="section" id="catalog">
        <div className="section-header">
          <h2>Explorar Colecao</h2>
          <p>Busca simples por artista ou album.</p>
        </div>
        <div className="search-row">
          <input
            type="search"
            placeholder="Digite artista ou album"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span className="result-count">{filtered.length} itens</span>
        </div>
        <div className="vinyl-grid">
          {filtered.map((vinyl) => (
            <VinylCard key={vinyl.id} vinyl={vinyl} subtitle={`${vinyl.year} · ${vinyl.genre}`} />
          ))}
        </div>
      </section>
    </main>
  );
};

const SessionPage = ({ sessionId, member, onAddToCart }) => {
  const session = sessions.find((item) => item.id === sessionId);
  if (!session) {
    return (
      <main className="page">
        <div className="section-header">
          <h2>Sesao nao encontrada</h2>
          <Link to="/" className="primary-link">
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  const played = getSessionVinyls(session.id, "tocado");
  const related = getSessionVinyls(session.id, "relacionado");
  const movementTags = session?.movements || [];
  const movementGroups = movementTags.map((tag) => {
    const primary = vinyls.filter((vinyl) => vinyl.tags?.includes(tag));
    const nonPlayed = primary.filter((vinyl) => !played.some((item) => item.id === vinyl.id));
    const items = (nonPlayed.length ? nonPlayed : primary).slice(0, 4);
    return { tag, items };
  });

  return (
    <main className="page">
      <section className="section">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>→</span>
          <span>Sessao</span>
        </div>
        <div className="session-hero">
          <div>
            <div className="session-date">{formatDate(session.date)}</div>
            <h1>{session.theme}</h1>
            <p>{session.description}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Selecao principal da noite</h2>
        </div>
        <div className="played-grid">
          {played.map((vinyl) => {
            const best = getBestInventory(vinyl.id);
            const partner = best ? getPartnerById(best.partner_id) : null;
            return (
              <div key={vinyl.id} className="played-card">
                <div
                  className="played-cover"
                  style={{ backgroundImage: `url(${vinyl.cover_image_url})` }}
                />
                <div className="played-info">
                  <div className="vinyl-artist">{vinyl.artist}</div>
                  <div className="vinyl-album">{vinyl.album}</div>
                  <div className="vinyl-subtitle">
                    {vinyl.year} · {vinyl.genre}
                  </div>
                  {best && partner ? (
                    <div className="price-row">
                      <div className="price-main">
                        {member ? formatPrice(best.price_member) : formatPrice(best.price_normal)}
                      </div>
                      <div className="price-meta">
                        {member ? "Condicao exclusiva Ziggyfy" : "Preco normal"}
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
                    <div className="price-meta">Sem parceiro disponivel</div>
                  )}
                  <Link to={`/vinyl/${vinyl.id}`} className="primary-link">
                    Ver disco
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Explorar Alem da Sessao</h2>
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
                        style={{ backgroundImage: `url(${vinyl.cover_image_url})` }}
                        aria-label={`${vinyl.artist} ${vinyl.album}`}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Explorar Colecao Completa</h2>
          <p>Todo o acervo conectado aos parceiros.</p>
        </div>
        <Link to="/?catalog=1" className="primary-link">
          Ir para catalogo geral
        </Link>
      </section>
    </main>
  );
};

const VinylPage = ({ vinylId, member, onAddToCart }) => {
  const vinyl = getVinylById(vinylId);
  if (!vinyl) {
    return (
      <main className="page">
        <div className="section-header">
          <h2>Disco nao encontrado</h2>
          <Link to="/" className="primary-link">
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  const items = getInventoryForVinyl(vinyl.id);
  const related = vinyls
    .filter((item) => item.genre === vinyl.genre && item.id !== vinyl.id)
    .slice(0, 3);

  return (
    <main className="page">
      <section className="section">
        <div className="vinyl-hero">
          <div
            className="vinyl-hero-cover"
            style={{ backgroundImage: `url(${vinyl.cover_image_url})` }}
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
                  const price = member ? item.price_member : item.price_normal;
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
                          <div className="price-main">{formatPrice(price)}</div>
                          {member ? (
                            <div className="price-meta">Condicao exclusiva Ziggyfy</div>
                          ) : (
                            <div className="price-meta">Preco normal</div>
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
                  <img src={item.cover_image_url} alt={`${item.artist} ${item.album}`} />
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
            sessoes e os usuarios compram diretamente do parceiro.
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
              <div className="model-title">Conexao com sessoes</div>
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
              <div className="model-desc">Precos especiais para membros Ziggyfy.</div>
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

const PartnerPage = ({ partnerId, onAddToCart }) => {
  const partner = getPartnerById(partnerId);
  const partnerItems = inventory.filter((item) => item.partner_id === partnerId);
  const partnerVinyls = partnerItems.map((item) => ({
    ...getVinylById(item.vinyl_id),
    inventory: item,
  }));

  if (!partner) {
    return (
      <main className="page">
        <div className="section-header">
          <h2>Loja nao encontrada</h2>
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
            <div key={item.id} className="vinyl-card">
              <div className="vinyl-cover" style={{ backgroundImage: `url(${item.cover_image_url})` }} />
              <div className="vinyl-info">
                <div className="vinyl-artist">{item.artist}</div>
                <div className="vinyl-album">{item.album}</div>
                <div className="vinyl-subtitle">
                  {formatPrice(item.inventory.price_normal)} · {item.inventory.availability_status}
                </div>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Adicionar ao carrinho"
                  onClick={() =>
                    onAddToCart({
                      vinylId: item.id,
                      partnerId: item.inventory.partner_id,
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
          ))}
        </div>
      </section>
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
    if (cleanPath === "/") return { name: "home" };
    if (cleanPath.startsWith("/session/"))
      return { name: "session", id: cleanPath.replace("/session/", "") };
    if (cleanPath.startsWith("/vinyl/"))
      return { name: "vinyl", id: cleanPath.replace("/vinyl/", "") };
    if (cleanPath.startsWith("/partner/"))
      return { name: "partner", id: cleanPath.replace("/partner/", "") };
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
                  <input required type="email" name="email" placeholder="voce@email.com" />
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
                  Taxa de reserva R$ 20, recuperavel na consumacao.
                </div>
                <button type="submit" className="primary-button">
                  Pagar reserva R$ 20
                </button>
              </form>
            ) : (
              <div className="modal-body">
                <div className="modal-success">Reserva confirmada.</div>
                <div className="modal-note">
                  Voce recebera a confirmacao por email. A taxa sera abatida na consumacao.
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
                const price = member ? listing.price_member : listing.price_normal;
                return (
                  <div key={`${item.vinylId}-${item.partnerId}`} className="cart-item">
                    <div
                      className="cart-cover"
                      style={{ backgroundImage: `url(${vinyl.cover_image_url})` }}
                    />
                    <div className="cart-info">
                      <div className="vinyl-artist">{vinyl.artist}</div>
                      <div className="vinyl-album">{vinyl.album}</div>
                      <div className="cart-meta">{partner.name}</div>
                      <div className="price-main">{formatPrice(price)}</div>
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
      {route.name === "home" && (
        <Home
          member={member}
          onReserve={(session) => {
            setReserveSession(session);
            setReserveSuccess(false);
            setReserveOpen(true);
          }}
        />
      )}
      {route.name === "session" && (
        <SessionPage sessionId={route.id} member={member} onAddToCart={requestAddToCart} />
      )}
      {route.name === "vinyl" && (
        <VinylPage vinylId={route.id} member={member} onAddToCart={requestAddToCart} />
      )}
      {route.name === "partner" && (
        <PartnerPage partnerId={route.id} onAddToCart={requestAddToCart} />
      )}
      {route.name === "partners" && <PartnersPage />}
      {route.name === "notfound" && (
        <main className="page">
          <div className="section-header">
            <h2>Pagina nao encontrada</h2>
            <Link to="/" className="primary-link">
              Voltar
            </Link>
          </div>
        </main>
      )}
      <footer className="footer">
        <div>Marketplace contextual conectado a sala de escuta.</div>
        <div>Ziggyfy · Prototype 2026</div>
      </footer>
    </div>
  );
};

export default App;
