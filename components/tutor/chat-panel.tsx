"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type Msg = { role: "user" | "assistant"; content: string };

type PersonaKey = "dida" | "ciro" | "tony";

const PERSONAS: Record<PersonaKey, { name: string; tag: string; greet: string }> = {
  dida: {
    name: "Dida Frane",
    tag: "Čakavski · Veli Varoš",
    greet:
      "Sidi, moj barba. Ako oćeš da te naučin briškulu, pitaj me ča oćeš. Ako oćeš da ti šutin, igraj kartu.",
  },
  ciro: {
    name: "Profesor Ćiro",
    tag: "Standardni hrvatski",
    greet:
      "Dobar dan. Pitajte slobodno o pravilima ili strategiji — odgovaram kratko i jasno.",
  },
  tony: {
    name: "Tony from the Riva",
    tag: "English · Dalmatian",
    greet:
      "Hey my friend, Tony here. You play briškula? Ask me anything — is simple, really.",
  },
};

type Ctx = {
  scoreSummary?: string;
  recentMoves?: string[];
};

export function ChatPanel({ gameId, context }: { gameId: string; context?: Ctx }) {
  const [persona, setPersona] = useState<PersonaKey>("dida");
  const [open, setOpen] = useState(true);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [msgs, streaming]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || streaming) return;
    const next = [...msgs, { role: "user" as const, content: t }];
    setMsgs(next);
    setInput("");
    setStreaming(true);
    let acc = "";
    setMsgs([...next, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona,
          gameId,
          message: t,
          history: next.slice(0, -1),
          scoreSummary: context?.scoreSummary,
          recentMoves: context?.recentMoves,
        }),
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        // SSE frames separated by \n\n
        let idx;
        while ((idx = buf.indexOf("\n\n")) !== -1) {
          const frame = buf.slice(0, idx).trim();
          buf = buf.slice(idx + 2);
          if (!frame.startsWith("data:")) continue;
          const payload = frame.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const j = JSON.parse(payload);
            if (j.d) {
              acc += j.d;
              setMsgs((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "Ajde, izgubili smo vezu. Pitaj me ponovno za koju sekundu.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  const p = PERSONAS[persona];

  return (
    <div className="card-surface flex flex-col" style={{ minHeight: 320 }}>
      <div className="flex items-center justify-between gap-2 p-3 border-b border-stone/70">
        <div>
          <div className="serif text-lg text-adriaticDark">Pitaj {p.name}</div>
          <div className="text-[11px] text-ink/60">{p.tag}</div>
        </div>
        <select
          value={persona}
          onChange={(e) => setPersona(e.target.value as PersonaKey)}
          className="rounded-md border border-stone bg-white/80 px-2 py-1 text-xs"
        >
          <option value="dida">Dida Frane (čakavski)</option>
          <option value="ciro">Profesor Ćiro (hrvatski)</option>
          <option value="tony">Tony (English)</option>
        </select>
      </div>

      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm"
        style={{ maxHeight: 360 }}
      >
        <Bubble role="assistant" text={p.greet} />
        {msgs.map((m, i) => (
          <Bubble key={i} role={m.role} text={m.content} />
        ))}
        {streaming && msgs[msgs.length - 1]?.content === "" && (
          <Bubble role="assistant" text="…" />
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 p-3 border-t border-stone/70"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            persona === "tony"
              ? "Ask about the rules…"
              : persona === "ciro"
              ? "Pitajte o pravilima…"
              : "Pitaj me ča te muči…"
          }
          className="flex-1 rounded-md border border-stone bg-white/80 px-3 py-2 text-sm outline-none focus:border-adriatic"
          disabled={streaming}
        />
        <button className="btn-primary text-sm" disabled={streaming || !input.trim()}>
          Pitaj
        </button>
      </form>
      <div className="flex flex-wrap gap-1 px-3 pb-3">
        {QUICKS[persona].map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => send(q)}
            disabled={streaming}
            className="rounded-full border border-stone bg-white/70 px-2 py-1 text-[11px] hover:bg-white"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ role, text }: { role: "user" | "assistant"; text: string }) {
  return (
    <div
      className={clsx(
        "max-w-[85%] rounded-lg px-3 py-2",
        role === "user"
          ? "ml-auto bg-adriatic text-white"
          : "bg-stone/60 text-ink"
      )}
    >
      {text || " "}
    </div>
  );
}

const QUICKS: Record<PersonaKey, string[]> = {
  dida: [
    "Ča ti vridi as?",
    "Kako da ne izgubin tricu?",
    "Kad da bacin briskolu?",
  ],
  ciro: [
    "Koja je vrijednost karata?",
    "Kada smijem otvoriti briskolu?",
    "Koliko bodova za pobjedu?",
  ],
  tony: [
    "What's a briscola?",
    "How do I win a trick?",
    "What's a good first card to play?",
  ],
};
