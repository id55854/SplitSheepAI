"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlayingCard } from "@/components/cards/card";
import { ChatPanel } from "@/components/tutor/chat-panel";
import { canDeclareTučem, type MatchState } from "@/lib/treseta/state";
import type { Card } from "@/lib/briskula/deck";

export function TresetaTable({
  matchId,
  initialState,
}: {
  matchId: string;
  initialState: MatchState;
}) {
  const [state, setState] = useState<MatchState>(initialState);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [armSignal, setArmSignal] = useState<"tučem" | "strišo" | null>(null);
  const router = useRouter();

  async function play(card: Card) {
    setError(null);
    const res = await fetch("/api/treseta/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, cardId: card.id, signal: armSignal }),
    });
    setArmSignal(null);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "Greška.");
      return;
    }
    const j = await res.json();
    setState(j.state as MatchState);
  }

  async function newMatch() {
    const res = await fetch("/api/treseta/match", { method: "POST" });
    if (!res.ok) return;
    const j = await res.json();
    router.push(`/play/treseta/${j.id}`);
  }

  const myHand = state.hands[0];
  const botHand = state.hands[1];
  const playerLead = state.trick.find((t) => t.seat === 0)?.card;
  const botLead = state.trick.find((t) => t.seat === 1)?.card;
  const playerScore = (state.scoreThirds[0] / 3).toFixed(2).replace(/\.?0+$/, "");
  const botScore = (state.scoreThirds[1] / 3).toFixed(2).replace(/\.?0+$/, "");

  const winnerLine = state.finished
    ? state.scoreThirds[0] > state.scoreThirds[1]
      ? "Tvoja partija. Bravo, lipo si!"
      : state.scoreThirds[0] < state.scoreThirds[1]
      ? "Šjora Mare dobi ovaj put."
      : "Ravno. Reprize."
    : null;

  // We expose strišo/tučem to the user when meaningful.
  const isLeader = state.trick.length === 0;
  const couldStrišo =
    state.toAct === 0 &&
    state.leadSuit !== null &&
    !myHand.some((c) => c.suit === state.leadSuit); // about to discard

  const couldTučem = (card: Card) =>
    state.toAct === 0 && canDeclareTučem(state, 0, card);

  const anyCouldTučem = myHand.some(couldTučem);

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_320px]">
      <div className="card-surface p-5 md:p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="serif text-2xl text-adriaticDark">
              Trešeta · ti vs Šjora Mare
            </div>
            <div className="text-sm text-ink/60">
              Štih {state.turnNumber} ·{" "}
              {state.leadSuit ? `Lead: ${state.leadSuit}` : "ti vodiš"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Score me={playerScore} them={botScore} />
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
            Šjora Mare · {botHand.length} karat
          </div>
          <div className="mt-2 flex gap-1 flex-wrap">
            {botHand.map((_, i) => (
              <PlayingCard key={i} card={null} faceDown size="sm" />
            ))}
          </div>
        </div>

        {/* Trick area */}
        <div className="mt-6 grid grid-cols-2 gap-4 items-center">
          <div className="flex justify-center min-h-[8rem] items-center">
            <div>
              {botLead ? (
                <PlayingCard card={botLead} size="lg" />
              ) : (
                <div className="w-24 h-36 grid place-items-center rounded-md border-2 border-dashed border-stone text-xs text-ink/50">
                  Šjora
                </div>
              )}
              <div className="text-center text-xs text-ink/60 mt-1">
                Šjora
                {state.lastTrick?.plays.find((p) => p.seat === 1)?.signal &&
                  " · " +
                    state.lastTrick.plays.find((p) => p.seat === 1)!.signal}
              </div>
            </div>
          </div>
          <div className="flex justify-center min-h-[8rem] items-center">
            <div>
              {playerLead ? (
                <PlayingCard card={playerLead} size="lg" />
              ) : (
                <div className="w-24 h-36 grid place-items-center rounded-md border-2 border-dashed border-stone text-xs text-ink/50">
                  Ti
                </div>
              )}
              <div className="text-center text-xs text-ink/60 mt-1">
                Ti
                {state.lastTrick?.plays.find((p) => p.seat === 0)?.signal &&
                  " · " +
                    state.lastTrick.plays.find((p) => p.seat === 0)!.signal}
              </div>
            </div>
          </div>
        </div>

        {/* Signal buttons (heritage UX) */}
        {state.toAct === 0 && !state.finished && (
          <div className="mt-5 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-ink/60 mr-1">Signali (komunikacija dozvoljena samo s ovim):</span>
            <button
              type="button"
              disabled={!anyCouldTučem}
              onClick={() =>
                setArmSignal((s) => (s === "tučem" ? null : "tučem"))
              }
              className={
                "rounded-full border px-3 py-1 text-sm transition " +
                (armSignal === "tučem"
                  ? "border-terracotta bg-terracotta text-white"
                  : "border-stone bg-white/70 hover:bg-white") +
                (!anyCouldTučem ? " opacity-40 cursor-not-allowed" : "")
              }
              title="Najavi da uzimaš ovaj štih s većom kartom u boji."
            >
              tučem
            </button>
            <button
              type="button"
              disabled={!couldStrišo}
              onClick={() =>
                setArmSignal((s) => (s === "strišo" ? null : "strišo"))
              }
              className={
                "rounded-full border px-3 py-1 text-sm transition " +
                (armSignal === "strišo"
                  ? "border-adriatic bg-adriatic text-white"
                  : "border-stone bg-white/70 hover:bg-white") +
                (!couldStrišo ? " opacity-40 cursor-not-allowed" : "")
              }
              title="Govoriš partneru: nemam više ove boje (prilikom otpadanja)."
            >
              strišo
            </button>
            {armSignal && (
              <span className="text-xs text-ink/70">
                — sljedeća karta bit će objavljena s "{armSignal}".
              </span>
            )}
          </div>
        )}

        {/* My hand */}
        <div className="mt-6">
          <div className="text-xs uppercase tracking-wider text-terracotta font-semibold">
            Tvoja ruka {state.toAct === 0 && !state.finished && "· red ti je"}
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            {myHand.map((c) => {
              const mustFollow =
                state.leadSuit && myHand.some((x) => x.suit === state.leadSuit);
              const playable = mustFollow ? c.suit === state.leadSuit : true;
              return (
                <PlayingCard
                  key={c.id}
                  card={c}
                  size="lg"
                  disabled={
                    pending || state.toAct !== 0 || state.finished || !playable
                  }
                  onClick={() => startTransition(() => play(c))}
                />
              );
            })}
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
              Konačno: ti {playerScore} · Šjora {botScore}
            </div>
            <button onClick={newMatch} className="mt-3 btn-terra">
              Još jedna
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <ChatPanel
          gameId="treseta"
          context={{
            scoreSummary: `ti ${playerScore}, Šjora ${botScore}`,
            recentMoves: state.log.slice(-6),
          }}
        />
        <details className="card-surface p-4">
          <summary className="cursor-pointer text-sm font-medium">Štihovi</summary>
          <ol className="mt-2 text-xs text-ink/70 space-y-1 list-decimal list-inside">
            {state.log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ol>
        </details>
        <div className="card-surface p-4 text-xs text-ink/70 space-y-1">
          <div className="font-medium text-ink">Bodovanje (Dalmatinska)</div>
          <div>As (1) = 1 pt · 2, 3, J, Q, K = 1/3 pt · ultima = 1 pt</div>
          <div className="text-ink/60">Igra se do 31 punat — MVP: jedan dijel.</div>
        </div>
      </div>
    </div>
  );
}

function Score({ me, them }: { me: string; them: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-md bg-terracotta/10 px-3 py-1 text-sm">
        <div className="text-[10px] uppercase tracking-wider text-terracotta">Ti</div>
        <div className="font-serif text-2xl text-terracotta leading-none">{me}</div>
      </div>
      <div className="rounded-md bg-adriatic/10 px-3 py-1 text-sm">
        <div className="text-[10px] uppercase tracking-wider text-adriatic">Šjora</div>
        <div className="font-serif text-2xl text-adriatic leading-none">{them}</div>
      </div>
    </div>
  );
}
