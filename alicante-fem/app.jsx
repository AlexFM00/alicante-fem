// app.jsx — navegación, ensamblaje, tweaks de estructura/flujo

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroLayout": "completo",
  "chatPlacement": "flotante",
  "primerBloque": "ciudad",
  "accent": "#E2674A",
  "density": "regular"
}/*EDITMODE-END*/;

const NAV = [
  { id: "ciudad", label: "La ciudad" },
  { id: "equipo", label: "Equipo" },
  { id: "liga", label: "Liga" },
  { id: "tienda", label: "Tienda" },
  { id: "newsletter", label: "Newsletter" },
];

function Nav({ onSettings }) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", f); f();
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <nav className={"af-nav" + (scrolled ? " af-nav-solid" : "")}>
      <div className="af-wrap af-nav-inner">
        <div className="af-brand">
          <img src="escudo.png" alt="Escudo Alicante Fem" className="af-brand-crest-img" />
          <a href="#inicio" className="af-brand-link" onClick={() => setOpen(false)}>
            <span className="af-brand-tx">Alicante<strong>Fem</strong></span>
          </a>
        </div>
        <div className={"af-nav-links" + (open ? " af-nav-links-open" : "")}>
          {NAV.map((n) => (
            <a key={n.id} href={"#" + n.id} onClick={() => setOpen(false)}>{n.label}</a>
          ))}
          <button className="af-icon-btn af-nav-gear" onClick={() => { onSettings(); setOpen(false); }} aria-label="Ajustes n8n" title="Conexión n8n">⚙</button>
        </div>
        <button className="af-nav-burger" onClick={() => setOpen((o) => !o)} aria-label="Menú">
          {open ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}

function Footer({ onSettings }) {
  return (
    <footer className="af-footer">
      <div className="af-wrap af-footer-inner">
        <div className="af-footer-brand">
          <span className="af-brand-tx af-brand-tx-lg">Alicante<strong>Fem</strong></span>
          <p>{CLUB.fullName}.<br/>Hecho en Alicante, junto al Mediterráneo. 💙</p>
        </div>
        <div className="af-footer-cols">
          <div>
            <h4>Club</h4>
            <a href="#equipo">Plantilla</a>
            <a href="#liga">Clasificación</a>
            <a href="#tienda">Tienda</a>
          </div>
          <div>
            <h4>Familias</h4>
            <a href="#newsletter">Newsletter</a>
            <a href="#tienda">Equipaciones</a>
            <button className="af-link-btn" onClick={onSettings}>Conexión n8n</button>
          </div>
          <div>
            <h4>Contacto</h4>
            <a href="mailto:info@alicantefem.es">info@alicantefem.es</a>
            <span>Ciudad Deportiva, Alicante</span>
          </div>
        </div>
      </div>
      <div className="af-footer-bottom af-wrap">
        <span>© {new Date().getFullYear()} {CLUB.name}</span>
        <span>Diseño original · escudo a aportar por el club</span>
      </div>
    </footer>
  );
}

function ContactChatSection() {
  return (
    <section className="af-section af-contact" id="contacto">
      <div className="af-wrap af-contact-inner">
        <div className="af-contact-text">
          <div className="af-eyebrow">Asistente del club</div>
          <h2 className="af-h2">¿Dudas? Pregúntanos</h2>
          <p className="af-section-sub">Horarios, partidos, asistencia, equipaciones, cuotas… el asistente del club te responde al instante. Las conversaciones llegan al club por n8n.</p>
          <ul className="af-contact-list">
            <li><span>💬</span> Respuestas inmediatas para madres y padres</li>
            <li><span>📋</span> Información de jugadoras y convocatorias</li>
            <li><span>🕘</span> Horarios y lugares de entrenamiento</li>
          </ul>
        </div>
        <div className="af-contact-chat">
          <ChatbotPanel inline={true} />
        </div>
      </div>
    </section>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.setAttribute("data-density", t.density);
    document.documentElement.setAttribute("data-hero", t.heroLayout);
  }, [t.accent, t.density, t.heroLayout]);

  const cityFirst = t.primerBloque === "ciudad";
  const City = <CitySection key="city" />;
  const Team = <TeamSection key="team" />;

  return (
    <div className="af-app">
      <Nav onSettings={() => setSettingsOpen(true)} />
      <Hero onChat={() => setChatOpen(true)} />

      {cityFirst ? [City, Team] : [Team, City]}
      <LeagueSection />
      <ShopSection />
      {t.chatPlacement === "seccion" && <ContactChatSection />}
      <Newsletter />
      <Footer onSettings={() => setSettingsOpen(true)} />

      {/* Chat flotante */}
      {t.chatPlacement === "flotante" && (
        <React.Fragment>
          <button
            className={"af-fab" + (chatOpen ? " af-fab-open" : "")}
            onClick={() => setChatOpen((o) => !o)}
            aria-label="Abrir asistente del club"
          >
            {chatOpen ? "✕" : "💬"}
          </button>
          <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />
        </React.Fragment>
      )}

      <WebhookSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <TweaksPanel>
        <TweakSection label="Estructura y flujo" />
        <TweakRadio label="Portada"
          value={t.heroLayout} options={["completo", "dividido"]}
          onChange={(v) => setTweak("heroLayout", v)} />
        <TweakRadio label="Chatbot"
          value={t.chatPlacement} options={["flotante", "seccion"]}
          onChange={(v) => setTweak("chatPlacement", v)} />
        <TweakRadio label="Primer bloque"
          value={t.primerBloque} options={["ciudad", "equipo"]}
          onChange={(v) => setTweak("primerBloque", v)} />
        <TweakSection label="Estilo" />
        <TweakRadio label="Densidad"
          value={t.density} options={["compacta", "regular"]}
          onChange={(v) => setTweak("density", v)} />
        <TweakColor label="Acento"
          value={t.accent}
          options={["#E2674A", "#2E9BD6", "#1763B6", "#E0A43B"]}
          onChange={(v) => setTweak("accent", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
