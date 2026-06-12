// sections.jsx — secciones de la web

/* ---------- HERO ---------- */
function Hero({ onChat, onEnroll }) {
  return (
    <header className="af-hero" id="inicio">
      <image-slot id="hero-bg" class="af-hero-bg" placeholder="foto: panorámica de Alicante / equipo celebrando"></image-slot>
      <div className="af-hero-scrim"></div>
      <div className="af-hero-inner af-wrap">
        <div className="af-hero-badge">
          <span className="af-diamond"></span>
          Est. 2018 · Alicante
        </div>
        <h1 className="af-hero-title">
          <span>Alicante</span>
          <span className="af-hero-fem">Fem</span>
        </h1>
        <p className="af-hero-tag">{CLUB.tagline}. Cantera, ciudad y Mediterráneo en cada partido.</p>
        <div className="af-hero-cta">
          <button className="af-btn af-btn-primary" onClick={onEnroll}>Entrena con nosotras</button>
          <button className="af-btn af-btn-ghost" onClick={onChat}>Hablar con el club</button>
        </div>
      </div>
      <a href="#ciudad" className="af-hero-scroll" aria-label="Bajar">↓</a>
    </header>
  );
}

/* ---------- FORMULARIO INSCRIPCIÓN ---------- */
const CATEGORIAS = [
  { value: "Infantil", label: "Infantil (11-12 años)" },
  { value: "Cadete", label: "Cadete (13-14 años)" },
  { value: "Juvenil", label: "Juvenil (15-17 años)" },
  { value: "Senior", label: "Senior (18+ años)" },
];

function EnrollModal({ open, onClose }) {
  const EMPTY = { nombre: "", categoria: "", edad: "", email: "", telefono: "", experiencia: "", mensaje: "" };
  const [form, setForm] = React.useState(EMPTY);
  const [status, setStatus] = React.useState("idle"); // idle | sending | done | error
  const [demo, setDemo] = React.useState(false);

  React.useEffect(() => { if (open) { setForm(EMPTY); setStatus("idle"); setDemo(false); } }, [open]);

  if (!open) return null;

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const res = await sendToN8n("contacto", {
      tipo: "inscripcion",
      nombre_jugadora: form.nombre,
      categoria: form.categoria,
      edad: form.edad,
      email_contacto: form.email,
      telefono: form.telefono,
      experiencia_previa: form.experiencia,
      mensaje: form.mensaje,
    });
    setDemo(res.demo);
    setStatus(res.ok ? "done" : "error");
  };

  return (
    <div className="af-modal-overlay" onClick={onClose}>
      <div className="af-modal af-enroll-modal" onClick={(e) => e.stopPropagation()}>
        {status === "done" ? (
          <div className="af-enroll-ok">
            <div className="af-enroll-ok-icon">⚽</div>
            <h3>¡Solicitud enviada!</h3>
            <p>{demo ? "Modo demo — en producción el club recibirá tu solicitud y os contactaremos en 48h." : "Hemos recibido tu solicitud. Os contactaremos en menos de 48h. ¡Aupa Alicante Fem! 💙"}</p>
            <button className="af-btn af-btn-primary" onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <>
            <div className="af-modal-head">
              <div>
                <div className="af-eyebrow">Únete al club</div>
                <h3>Entrena con nosotras</h3>
              </div>
              <button className="af-icon-btn" onClick={onClose} aria-label="Cerrar">✕</button>
            </div>
            <p className="af-modal-sub">Rellena el formulario y el club se pondrá en contacto contigo en menos de 48 horas. Las pruebas son gratuitas y sin compromiso.</p>
            <form className="af-enroll-form" onSubmit={submit}>
              <label className="af-field">
                <span className="af-field-label">Nombre de la jugadora *</span>
                <input className="af-input" required placeholder="Nombre y apellidos" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
              </label>
              <div className="af-field-row">
                <label className="af-field">
                  <span className="af-field-label">Categoría *</span>
                  <select className="af-input" required value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
                    <option value="">Selecciona...</option>
                    {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </label>
                <label className="af-field">
                  <span className="af-field-label">Edad *</span>
                  <input className="af-input" required type="number" min="8" max="40" placeholder="Años" value={form.edad} onChange={(e) => set("edad", e.target.value)} />
                </label>
              </div>
              <div className="af-field-row">
                <label className="af-field">
                  <span className="af-field-label">Email de contacto *</span>
                  <input className="af-input" required type="email" placeholder="Email del padre/madre" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </label>
                <label className="af-field">
                  <span className="af-field-label">Teléfono</span>
                  <input className="af-input" type="tel" placeholder="6XX XXX XXX" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />
                </label>
              </div>
              <label className="af-field">
                <span className="af-field-label">Experiencia previa en fútbol</span>
                <select className="af-input" value={form.experiencia} onChange={(e) => set("experiencia", e.target.value)}>
                  <option value="">Sin experiencia / primera vez</option>
                  <option value="1-2 años">1-2 años en club o escuela</option>
                  <option value="3-5 años">3-5 años federada</option>
                  <option value="+5 años">Más de 5 años federada</option>
                </select>
              </label>
              <label className="af-field">
                <span className="af-field-label">¿Algo más que quieras contarnos?</span>
                <textarea className="af-input af-textarea" rows={3} placeholder="Horarios preferidos, dudas, situación especial..." value={form.mensaje} onChange={(e) => set("mensaje", e.target.value)} />
              </label>
              {status === "error" && <p className="af-enroll-error">Error al enviar. Inténtalo de nuevo o escríbenos a hola@alicantefem.com</p>}
              <div className="af-modal-foot">
                <button type="button" className="af-btn af-btn-ghost" onClick={onClose}>Cancelar</button>
                <button type="submit" className="af-btn af-btn-primary" disabled={status === "sending"}>
                  {status === "sending" ? "Enviando..." : "Enviar solicitud"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- CIUDAD ---------- */
function CitySection() {
  return (
    <section className="af-city af-section" id="ciudad">
      <div className="af-wrap">
        <div className="af-city-intro">
          <div>
            <div className="af-eyebrow af-eyebrow-light">{CITY.kicker}</div>
            <h2 className="af-serif af-city-title">{CITY.title}</h2>
          </div>
          <p className="af-city-lead af-serif">{CITY.lead}</p>
        </div>

        <div className="af-city-grid">
          {CITY.paragraphs.map((p) => (
            <article className="af-city-card" key={p.slot}>
              <image-slot id={p.slot} class="af-city-img" placeholder={p.label}></image-slot>
              <h3 className="af-serif">{p.h}</h3>
              <p>{p.t}</p>
            </article>
          ))}
        </div>

        <div className="af-stats">
          {CITY.stats.map((s) => (
            <div className="af-stat" key={s.l}>
              <div className="af-stat-n">{s.n}</div>
              <div className="af-stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- EQUIPO ---------- */
const POS_IMG = {
  "Portera":         "img/players/player-portera.svg",
  "Defensa":         "img/players/player-defensa.svg",
  "Centrocampista":  "img/players/player-centrocampista.svg",
  "Delantera":       "img/players/player-delantera.svg",
};

function TeamSection() {
  const [filter, setFilter] = React.useState("Todas");
  const positions = ["Todas", "Portera", "Defensa", "Centrocampista", "Delantera"];
  const shown = PLAYERS.filter((p) => filter === "Todas" || p.pos === filter);
  return (
    <section className="af-section af-team" id="equipo">
      <div className="af-wrap">
        <div className="af-section-head">
          <div>
            <div className="af-eyebrow">La plantilla</div>
            <h2 className="af-h2">Nuestras jugadoras</h2>
          </div>
          <div className="af-filters">
            {positions.map((p) => (
              <button
                key={p}
                className={"af-chip" + (filter === p ? " af-chip-on" : "")}
                onClick={() => setFilter(p)}
              >{p}</button>
            ))}
          </div>
        </div>

        <div className="af-players">
          {shown.map((p) => (
            <article className="af-player" key={p.num}>
              <div className="af-player-img-wrap">
                <image-slot id={p.slot} class="af-player-img" src={POS_IMG[p.pos] || ""} placeholder={"foto: " + p.name}></image-slot>
                <span className="af-player-num">{p.num}</span>
                {p.captain && <span className="af-player-cap">Capitana</span>}
              </div>
              <div className="af-player-info">
                <h3>{p.name}</h3>
                <span className="af-player-pos">{p.pos}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="af-staff">
          <h3 className="af-staff-title">Cuerpo técnico</h3>
          <div className="af-staff-grid">
            {STAFF.map((s) => (
              <div className="af-staff-card" key={s.name}>
                <image-slot id={s.slot} class="af-staff-img" shape="circle" placeholder="foto"></image-slot>
                <div>
                  <strong>{s.name}</strong>
                  <span>{s.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- LIGA ---------- */
function LeagueSection() {
  return (
    <section className="af-section af-league" id="liga">
      <div className="af-wrap af-league-wrap">
        <div className="af-league-table">
          <div className="af-section-head af-section-head-tight">
            <div>
              <div className="af-eyebrow af-eyebrow-light">Clasificación</div>
              <h2 className="af-h2 af-h2-light">La liga</h2>
            </div>
            <span className="af-league-upd">{LEAGUE.updated}</span>
          </div>
          <table>
            <thead>
              <tr><th>#</th><th>Equipo</th><th>PJ</th><th>Pts</th></tr>
            </thead>
            <tbody>
              {LEAGUE.rows.map((r) => (
                <tr key={r.team} className={r.us ? "af-row-us" : ""}>
                  <td>{r.pos}</td>
                  <td>{r.team}{r.us && <span className="af-tag-us">Nosotras</span>}</td>
                  <td>{r.pj}</td>
                  <td className="af-pts">{r.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="af-next">
          <div className="af-eyebrow af-eyebrow-light">Próximo partido</div>
          <div className="af-next-vs">
            <span>Alicante Fem</span>
            <span className="af-next-x">vs</span>
            <span>{LEAGUE.next.rival}</span>
          </div>
          <div className="af-next-meta">
            <div><span>🗓</span>{LEAGUE.next.when}</div>
            <div><span>📍</span>{LEAGUE.next.where}</div>
          </div>
          <p className="af-next-note">Se actualiza automáticamente con n8n tras cada jornada.</p>
        </aside>
      </div>
    </section>
  );
}

/* ---------- TIENDA ---------- */
function ProductRow({ p, open, onToggle, onAdd }) {
  const [size, setSize] = React.useState(p.sizes[0]);
  const [qty, setQty] = React.useState(1);
  return (
    <div className={"af-prod" + (open ? " af-prod-open" : "")}>
      <button className="af-prod-head" onClick={onToggle}>
        <image-slot id={p.slot} class="af-prod-img" placeholder="foto"></image-slot>
        <div className="af-prod-name">
          <strong>{p.name}</strong>
          {p.tag && <span className="af-prod-tag">{p.tag}</span>}
        </div>
        <span className="af-prod-price">{p.price}€</span>
        <span className="af-prod-caret">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="af-prod-body">
          <label className="af-mini-field">
            <span>Talla</span>
            <select className="af-input" value={size} onChange={(e) => setSize(e.target.value)}>
              {p.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="af-mini-field">
            <span>Cantidad</span>
            <div className="af-stepper">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))}>+</button>
            </div>
          </label>
          <button className="af-btn af-btn-primary af-prod-add" onClick={() => onAdd(p, size, qty)}>
            Añadir · {p.price * qty}€
          </button>
        </div>
      )}
    </div>
  );
}

function ShopSection() {
  const [openId, setOpenId] = React.useState(PRODUCTS[0].id);
  const [cart, setCart] = React.useState([]);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", player: "" });
  const [status, setStatus] = React.useState("idle"); // idle | sending | done | error
  const [demo, setDemo] = React.useState(false);

  const add = (p, size, qty) => {
    setStatus("idle");
    setCart((c) => {
      const idx = c.findIndex((i) => i.id === p.id && i.size === size);
      if (idx >= 0) { const n = [...c]; n[idx] = { ...n[idx], qty: n[idx].qty + qty }; return n; }
      return [...c, { id: p.id, name: p.name, price: p.price, size, qty }];
    });
  };
  const removeItem = (i) => setCart((c) => c.filter((_, idx) => idx !== i));
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!cart.length || status === "sending") return;
    setStatus("sending");
    const res = await window.sendToN8n("tienda", {
      items: cart,
      total,
      customer: form,
    });
    if (res.ok) { setDemo(!!res.demo); setStatus("done"); setCart([]); }
    else setStatus("error");
  };

  return (
    <section className="af-section af-shop" id="tienda">
      <div className="af-wrap">
        <div className="af-section-head">
          <div>
            <div className="af-eyebrow">Tienda del club</div>
            <h2 className="af-h2">Equipa a tu hija</h2>
            <p className="af-section-sub">Elige talla y cantidad. El pedido llega directo al club por n8n.</p>
          </div>
        </div>

        <div className="af-shop-grid">
          <div className="af-prod-list">
            {PRODUCTS.map((p) => (
              <ProductRow
                key={p.id}
                p={p}
                open={openId === p.id}
                onToggle={() => setOpenId((o) => (o === p.id ? null : p.id))}
                onAdd={add}
              />
            ))}
          </div>

          <aside className="af-cart">
            <h3>Tu pedido</h3>
            {cart.length === 0 && status !== "done" && (
              <p className="af-cart-empty">Aún no has añadido prendas. Despliega un producto y elige talla.</p>
            )}
            {status === "done" && (
              <div className="af-success">
                <div className="af-success-ic">✓</div>
                <strong>¡Pedido enviado!</strong>
                <p>{demo ? "Modo demo: configura el webhook de tienda en Ajustes para recibirlo en n8n." : "El club ha recibido tu pedido. Te contactarán para el pago y la entrega."}</p>
                <button className="af-btn af-btn-ghost-dark" onClick={() => setStatus("idle")}>Hacer otro pedido</button>
              </div>
            )}
            {cart.length > 0 && status !== "done" && (
              <React.Fragment>
                <ul className="af-cart-items">
                  {cart.map((i, idx) => (
                    <li key={idx}>
                      <span className="af-cart-q">{i.qty}×</span>
                      <span className="af-cart-nm">{i.name}<em>Talla {i.size}</em></span>
                      <span className="af-cart-pr">{i.price * i.qty}€</span>
                      <button className="af-cart-rm" onClick={() => removeItem(idx)} aria-label="Quitar">✕</button>
                    </li>
                  ))}
                </ul>
                <div className="af-cart-total"><span>Total</span><strong>{total}€</strong></div>
                <form className="af-cart-form" onSubmit={submit}>
                  <input className="af-input" required placeholder="Tu nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input className="af-input" required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <input className="af-input" placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <input className="af-input" placeholder="Nombre de la jugadora / equipo" value={form.player} onChange={(e) => setForm({ ...form, player: e.target.value })} />
                  <button className="af-btn af-btn-primary af-btn-block" disabled={status === "sending"}>
                    {status === "sending" ? "Enviando…" : "Enviar pedido"}
                  </button>
                  {status === "error" && <p className="af-err">No se pudo enviar. Revisa la URL del webhook en Ajustes.</p>}
                </form>
              </React.Fragment>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------- NEWSLETTER ---------- */
const NL_CATEGORIAS = ["Benjamín", "Alevín", "Infantil", "Cadete", "Juvenil", "Senior", "Solo me informo"];
const NL_ORIGEN = ["Web", "Instagram", "Boca a boca", "Evento del club", "Otro"];
const NL_INTERESES = [
  { key: "partidos", label: "Convocatorias y resultados" },
  { key: "eventos", label: "Eventos del club" },
  { key: "tienda", label: "Tienda y equipaciones" },
  { key: "pruebas", label: "Pruebas para jugadoras nuevas" },
];

function Newsletter() {
  const [form, setForm] = React.useState({
    nombre: "", email: "", telefono: "",
    jugadora_nombre: "", jugadora_edad: "",
    categoria_interes: "", origen: "",
    intereses: [],
    mensaje: "",
  });
  const [status, setStatus] = React.useState("idle");
  const [demo, setDemo] = React.useState(false);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const toggleInteres = (k) => set("intereses",
    form.intereses.includes(k) ? form.intereses.filter((x) => x !== k) : [...form.intereses, k]
  );

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const payload = {
      ...form,
      jugadora_edad: form.jugadora_edad ? Number(form.jugadora_edad) : null,
    };
    const res = await window.sendToN8n("newsletter", payload);
    if (res.ok) {
      setDemo(!!res.demo); setStatus("done");
      setForm({ nombre: "", email: "", telefono: "", jugadora_nombre: "", jugadora_edad: "", categoria_interes: "", origen: "", intereses: [], mensaje: "" });
    } else setStatus("error");
  };

  return (
    <section className="af-news af-section" id="newsletter">
      <div className="af-wrap af-news-inner">
        <div className="af-news-text">
          <div className="af-eyebrow af-eyebrow-light">Newsletter</div>
          <h2 className="af-h2 af-h2-light">No te pierdas nada del club</h2>
          <p>Convocatorias, resultados, eventos y novedades de la tienda. Una vez por semana, sin spam. Cuéntanos un poco sobre ti para personalizar lo que te llega.</p>
        </div>
        {status === "done" ? (
          <div className="af-news-done">
            <div className="af-success-ic">✓</div>
            <strong>¡Suscrita!</strong>
            <p>{demo ? "Modo demo: conecta el webhook de newsletter en Ajustes." : "Te has unido a la newsletter del Alicante Fem. Revisa tu email, te hemos mandado la bienvenida. 💙🤍"}</p>
          </div>
        ) : (
          <form className="af-news-form-full" onSubmit={submit}>
            <div className="af-nl-grid">
              <label className="af-nl-field">
                <span>Tu nombre <em>*</em></span>
                <input className="af-input" required type="text" placeholder="Ej. Patricia García" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
              </label>
              <label className="af-nl-field">
                <span>Email <em>*</em></span>
                <input className="af-input" required type="email" placeholder="tucorreo@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </label>
              <label className="af-nl-field">
                <span>Teléfono <em>opcional</em></span>
                <input className="af-input" type="tel" placeholder="600 000 000" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />
              </label>
              <label className="af-nl-field">
                <span>¿Cómo nos conociste?</span>
                <select className="af-input" required value={form.origen} onChange={(e) => set("origen", e.target.value)}>
                  <option value="">Elige una opción…</option>
                  {NL_ORIGEN.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="af-nl-field af-nl-field-wide">
                <span>Sobre tu hija <em>opcional · si vas a apuntarla</em></span>
                <div className="af-nl-row">
                  <input className="af-input" type="text" placeholder="Nombre de la jugadora" value={form.jugadora_nombre} onChange={(e) => set("jugadora_nombre", e.target.value)} />
                  <input className="af-input" type="number" min="6" max="40" placeholder="Edad" value={form.jugadora_edad} onChange={(e) => set("jugadora_edad", e.target.value)} style={{ maxWidth: 110 }} />
                  <select className="af-input" value={form.categoria_interes} onChange={(e) => set("categoria_interes", e.target.value)} style={{ maxWidth: 180 }}>
                    <option value="">Categoría de interés…</option>
                    {NL_CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </label>
              <div className="af-nl-field af-nl-field-wide">
                <span>¿Sobre qué quieres recibir info?</span>
                <div className="af-nl-checks">
                  {NL_INTERESES.map((i) => (
                    <label key={i.key} className={"af-nl-chk" + (form.intereses.includes(i.key) ? " af-nl-chk-on" : "")}>
                      <input type="checkbox" checked={form.intereses.includes(i.key)} onChange={() => toggleInteres(i.key)} />
                      <span>{i.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <label className="af-nl-field af-nl-field-wide">
                <span>Mensaje opcional</span>
                <textarea className="af-input" rows="3" placeholder="Algo que quieras contarnos…" value={form.mensaje} onChange={(e) => set("mensaje", e.target.value)} />
              </label>
            </div>
            <div className="af-nl-foot">
              <button type="submit" className="af-btn af-btn-primary" disabled={status === "sending"}>
                {status === "sending" ? "Enviando…" : "Quiero suscribirme 💙"}
              </button>
              {status === "error" && <p className="af-err af-err-light">No se pudo enviar. Revisa el webhook en Ajustes.</p>}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

Object.assign(window, { Hero, CitySection, TeamSection, LeagueSection, ShopSection, Newsletter });
