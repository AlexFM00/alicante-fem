// webhook.jsx — integración con n8n
// Las URLs fijas están hardcodeadas (WH_FIXED). Las configurables desde el
// panel de Ajustes (icono ⚙) se guardan en localStorage.

// URLs fijas — no editables desde el panel público
const WH_FIXED = {
  newsletter: "https://afinestratm.app.n8n.cloud/webhook/alicantefem-newsletter-signup",
  tienda: "https://afinestratm.app.n8n.cloud/webhook/alicantefem-entrega-ropa",
  chatbot: "https://afinestratm.app.n8n.cloud/webhook/alicantefem-web-chatbot",
  contacto: "https://afinestratm.app.n8n.cloud/webhook/alicantefem-web-contacto",
};

// URLs configurables desde el panel ⚙
const WH_KEYS = [];

const WH_STORE = "alicantefem_webhooks_v1";

function loadWebhooks() {
  try {
    return JSON.parse(localStorage.getItem(WH_STORE)) || {};
  } catch (e) {
    return {};
  }
}
function saveWebhooks(obj) {
  localStorage.setItem(WH_STORE, JSON.stringify(obj));
}

// Envía un payload JSON al webhook de n8n indicado.
// Devuelve { ok, demo, data, error }.
async function sendToN8n(which, payload) {
  const hooks = loadWebhooks();
  // Las URLs fijas tienen prioridad sobre las de localStorage
  const url = (WH_FIXED[which] || hooks[which] || "").trim();
  const body = {
    source: "alicante-fem-web",
    type: which,
    timestamp: new Date().toISOString(),
    ...payload,
  };
  // Sin URL configurada -> modo demo (no rompe la experiencia).
  if (!url) {
    await new Promise((r) => setTimeout(r, 650));
    return { ok: true, demo: true, data: null };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let data = null;
    const txt = await res.text();
    try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
    return { ok: res.ok, demo: false, data, status: res.status };
  } catch (err) {
    return { ok: false, demo: false, error: String(err) };
  }
}

// Panel de ajustes de webhooks
function WebhookSettings({ open, onClose }) {
  const [vals, setVals] = React.useState(loadWebhooks());
  const [saved, setSaved] = React.useState(false);
  React.useEffect(() => { if (open) { setVals(loadWebhooks()); setSaved(false); } }, [open]);
  if (!open) return null;

  const update = (k, v) => { setVals((s) => ({ ...s, [k]: v })); setSaved(false); };
  const save = () => { saveWebhooks(vals); setSaved(true); setTimeout(() => setSaved(false), 1800); };

  return (
    <div className="af-modal-overlay" onClick={onClose}>
      <div className="af-modal" onClick={(e) => e.stopPropagation()}>
        <div className="af-modal-head">
          <div>
            <div className="af-eyebrow">Conexión n8n</div>
            <h3>Webhooks de automatización</h3>
          </div>
          <button className="af-icon-btn" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <p className="af-modal-sub">
          Pega aquí la URL de cada webhook de n8n. Mientras estén vacías, la web funciona
          en <strong>modo demo</strong> (se ve todo, pero no envía a ningún sitio).
        </p>
        <div className="af-wh-list">
          {WH_KEYS.map((w) => (
            <label className="af-field" key={w.key}>
              <span className="af-field-label">
                {w.label}
                <em>{w.help}</em>
              </span>
              <input
                type="url"
                className="af-input"
                placeholder="https://tu-n8n.app/webhook/..."
                value={vals[w.key] || ""}
                onChange={(e) => update(w.key, e.target.value)}
                spellCheck={false}
              />
            </label>
          ))}
        </div>
        <div className="af-modal-foot">
          <span className="af-saved" style={{ opacity: saved ? 1 : 0 }}>✓ Guardado</span>
          <button className="af-btn af-btn-primary" onClick={save}>Guardar conexiones</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WH_KEYS, loadWebhooks, saveWebhooks, sendToN8n, WebhookSettings });
