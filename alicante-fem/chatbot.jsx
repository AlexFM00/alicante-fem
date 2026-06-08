// chatbot.jsx — Asistente para padres
// En producción: cada mensaje se envía al webhook "chatbot" de n8n y se muestra
// la respuesta que devuelva (campo reply / message / output / text).
// En modo demo (sin webhook): responde con IA para que la experiencia sea real.

const SYSTEM_DEMO = `Eres el asistente virtual del club de fútbol femenino "Alicante Fem", de Alicante (España).
Ayudas a madres y padres con dudas sobre: horarios de entrenamiento, partidos, información de jugadoras,
asistencia, equipaciones, cuotas, transporte y normas del club. Responde SIEMPRE en español, con tono
cercano, breve y útil (2-4 frases). Si no sabes un dato concreto, dilo y sugiere contactar con el club.
Datos útiles inventados que puedes usar: los entrenamientos del primer equipo son martes y jueves de
18:00 a 19:30 en la Ciudad Deportiva; los partidos suelen ser los domingos por la mañana; la cuota mensual
es de 35€; la entrenadora es Cristina Bernabéu.`;

const SUGGESTIONS = [
  "¿Qué días entrenan?",
  "¿Cuánto cuesta la cuota?",
  "¿Dónde es el próximo partido?",
  "¿Cómo apunto a mi hija?",
];

function extractReply(data) {
  if (!data) return null;
  if (typeof data === "string") return data;
  return data.reply || data.message || data.output || data.text || data.answer || null;
}

function ChatbotPanel({ open, onClose, inline }) {
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "¡Hola! 👋 Soy el asistente de Alicante Fem. ¿En qué puedo ayudarte? Pregúntame por horarios, partidos, equipaciones o cualquier duda del club." },
  ]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef(null);
  const sessionId = React.useRef("s_" + Math.random().toString(36).slice(2, 10));

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy, open]);

  const send = async (text) => {
    const content = (text != null ? text : input).trim();
    if (!content || busy) return;
    setInput("");
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setBusy(true);

    const res = await window.sendToN8n("chatbot", {
      message: content,
      sessionId: sessionId.current,
      history: next.map((m) => ({ role: m.role, content: m.content })),
    });

    let reply = extractReply(res.data);
    if (res.demo || (!reply && res.ok)) {
      // Demo con IA
      try {
        reply = await window.claude.complete({
          messages: [
            { role: "user", content: SYSTEM_DEMO + "\n\nConversación hasta ahora:\n" +
              next.map((m) => (m.role === "user" ? "Padre/Madre: " : "Asistente: ") + m.content).join("\n") +
              "\n\nResponde como Asistente:" },
          ],
        });
      } catch (e) {
        reply = "Ahora mismo no puedo responder. Escríbenos a info@alicantefem.es y te ayudamos. 💙";
      }
    }
    if (!reply) reply = res.ok
      ? "Recibido ✓ Te responderemos en breve."
      : "No he podido conectar con el club. Inténtalo de nuevo en un momento.";

    setMessages((m) => [...m, { role: "assistant", content: reply }]);
    setBusy(false);
  };

  if (!open && !inline) return null;
  return (
    <div className={"af-chat" + (inline ? " af-chat--inline" : "")} role="dialog" aria-label="Asistente Alicante Fem">
      <div className="af-chat-head">
        <div className="af-chat-id">
          <span className="af-chat-dot" />
          <div>
            <strong>Asistente del club</strong>
            <em>Responde al instante</em>
          </div>
        </div>
        {!inline && <button className="af-icon-btn af-icon-btn-light" onClick={onClose} aria-label="Cerrar chat">✕</button>}
      </div>

      <div className="af-chat-body" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={"af-msg af-msg-" + m.role}>
            <div className="af-msg-bubble">{m.content}</div>
          </div>
        ))}
        {busy && (
          <div className="af-msg af-msg-assistant">
            <div className="af-msg-bubble af-typing"><span></span><span></span><span></span></div>
          </div>
        )}
        {messages.length <= 1 && !busy && (
          <div className="af-chat-suggs">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="af-sugg" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <form className="af-chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input
          className="af-input"
          placeholder="Escribe tu pregunta…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
        />
        <button type="submit" className="af-chat-send" disabled={busy || !input.trim()} aria-label="Enviar">
          ↑
        </button>
      </form>
    </div>
  );
}

Object.assign(window, { ChatbotPanel });
