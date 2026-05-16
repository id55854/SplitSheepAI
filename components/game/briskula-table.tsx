"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlayingCard } from "@/components/cards/card";
import { ChatPanel } from "@/components/tutor/chat-panel";
import type { MatchState } from "@/lib/briskula/state";
import type { Card } from "@/lib/briskula/deck";
import { SUIT_LABEL } from "@/lib/briskula/deck";

type Props = {
  matchId: string;
  initialState: MatchState;
};

export function BriskulaTable({ matchId, initialState }: Props) {
  const [state, setState] = useState<MatchState>(initialState);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function play(card: Card) {
    setError(null);
    const res = await fetch("/api/briskula/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, cardId: card.id }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "Greška.");
      return;
    }
    const j = await res.json();
    setState(j.state as MatchState);
  }

  async function newMatch() {
    const res = await fetch("/api/briskula/match", { method: "POST" });
    if (!res.ok) return;
    const j = await res.json();
    router.push(`/play/briskula/${j.id}`);
  }

  const myHand = state.hands[0];
  const botHand = state.hands[1];
  const playerLead = state.trick.find((t) => t.seat === 0)?.card;
  const botLead = state.trick.find((t) => t.seat === 1)?.card;

  const winnerLine = state.finished
    ? state.scores[0] > state.scores[1]
      ? "Ti dobi. Bravo, moj barba!"
      : state.scores[0] < state.scores[1]
      ? "Dida dobi ovaj put. Ajde, još jedan."
      : "Ravno. Reprize u Matejuški."
    : null;

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_320px]">
      <div className="card-surface p-5 md:p-6 relative">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="serif text-2xl text-adriaticDark">
              Briškula · ti vs Dida Frane
            </div>
            <div className="text-sm text-ink/60">
              Briscola: <b style={{ textTransform: "capitalize" }}>{SUIT_LABEL[state.briscolaSuit]}</b>
              {" · "}
              Štih {state.turnNumber} · Špil: {state.stock.length}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Score me={state.scores[0]} dida={state.scores[1]} />
            <button
              type="button"
              onClick={newMatch}
              className="btn-ghost text-sm"
              disabled={pending}
            >
              Nova partija
            </button>
          </div>
        </div>

        {/* Bot row */}
        <div className="mt-6">
          <div className="text-xs uppercase tracking-wider text-adriatic font-semibold">
            Dida Frane · {botHand.length} karte
          </div>
          <div className="mt-2 flex gap-2">
            {botHand.map((c, i) => (
              <PlayingCard key={i} card={c} faceDown size="md" />
            ))}
          </div>
        </div>

        {/* Trick area */}
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex justify-center min-h-[8rem] items-center">
            <div className="relative">
              {botLead ? (
                <PlayingCard card={botLead} size="lg" />
              ) : (
                <div className="w-24 h-36 grid place-items-center rounded-md border-2 border-dashed border-stone text-xs text-ink/50">
                  Dida čeka
                </div>
              )}
              <div className="text-center text-xs text-ink/60 mt-1">Dida</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-xs text-ink/60">špil</div>
            <div className="relative">
              {state.stock.length > 1 && (
                <PlayingCard card={null} faceDown size="md" />
              )}
              {state.stock.length > 0 && (
                <div
                  className="absolute -bottom-2 -right-2"
                  style={{ transform: "rotate(8deg)" }}
                >
                  <PlayingCard card={state.briscolaCard} size="md" />
                </div>
              )}
              {state.stock.length === 0 && (
                <div className="w-20 h-28 grid place-items-center rounded-md border-2 border-dashed border-stone text-xs text-ink/50">
                  prazno
                </div>
              )}
            </div>
            <div className="text-[10px] text-ink/50 text-center mt-1">
              briscola
            </div>
          </div>

          <div className="flex justify-center min-h-[8rem] items-center">
            <div>
              {playerLead ? (
                <PlayingCard card={playerLead} size="lg" />
              ) : (
                <div className="w-24 h-36 grid place-items-center rounded-md border-2 border-dashed border-stone text-xs text-ink/50">
                  tvoja karta
                </div>
              )}
              <div className="text-center text-xs text-ink/60 mt-1">Ti</div>
            </div>
          </div>
        </div>

        {/* Last trick result */}
        {state.lastTrick && (
          <div className="mt-3 text-center text-xs text-ink/60">
            Zadnji štih: {state.lastTrick.winner === 0 ? "tvoj" : "Didin"}
          </div>
        )}

        {/* My hand */}
        <div className="mt-8">
          <div className="text-xs uppercase tracking-wider text-terracotta font-semibold">
            Tvoja ruka {state.toAct === 0 && !state.finished && "· red ti je"}
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            {myHand.map((c) => (
              <PlayingCard
                key={c.id}
                card={c}
                size="lg"
                disabled={pending || state.toAct !== 0 || state.finished}
                onClick={() => startTransition(() => play(c))}
              />
            ))}
            {myHand.length === 0 && (
              <div className="text-sm text-ink/60">Nema više karata.</div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 text-sm text-terracotta">Greška: {error}</div>
        )}

        {winnerLine && (
          <div className="mt-6 rounded-lg bg-adriatic text-white p-4">
            <div className="serif text-xl">{winnerLine}</div>
            <div className="text-sm opacity-90 mt-1">
              Konačno: ti {state.scores[0]} · Dida {state.scores[1]}
            </div>
            <button onClick={newMatch} className="mt-3 btn-terra">
              Još jedna
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <ChatPanel
          gameId="briskula"
          context={{
            scoreSummary: `ti ${state.scores[0]}, Dida ${state.scores[1]}`,
            recentMoves: state.log.slice(-6),
          }}
        />
        <details className="card-surface p-4">
          <summary className="cursor-pointer text-sm font-medium">
            Štihovi (log)
          </summary>
          <ol className="mt-2 text-xs text-ink/70 space-y-1 list-decimal list-inside">
            {state.log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ol>
        </details>
      </div>
    </div>
  );
}

function Score({ me, dida }: { me: number; dida: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-md bg-terracotta/10 px-3 py-1 text-sm">
        <div className="text-[10px] uppercase tracking-wider text-terracotta">Ti</div>
        <div className="font-serif text-2xl text-terracotta leading-none">{me}</div>
      </div>
      <div className="rounded-md bg-adriatic/10 px-3 py-1 text-sm">
        <div className="text-[10px] uppercase tracking-wider text-adriatic">Dida</div>
        <div className="font-serif text-2xl text-adriatic leading-none">{dida}</div>
      </div>
    </div>
  );
}
