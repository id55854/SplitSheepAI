import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireGuest } from "@/lib/guest";
import { store } from "@/lib/store";
import { applyPlay, cardById, type MatchState } from "@/lib/treseta/state";
import { pickMove } from "@/lib/treseta/bot";

const Body = z.object({
  matchId: z.string(),
  cardId: z.string(),
  signal: z.enum(["tučem", "strišo"]).nullable().optional(),
});

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireGuest();
  } catch {
    return NextResponse.json({ error: "no_guest" }, { status: 401 });
  }
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_input" }, { status: 400 });
  }
  const { matchId, cardId, signal } = parsed.data;
  const m = store.getMatch(matchId);
  if (!m) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (m.playerId !== user.id)
    return NextResponse.json({ error: "not_yours" }, { status: 403 });

  const state = m.state as MatchState;
  if (state.finished) return NextResponse.json({ error: "finished", state });
  if (state.toAct !== 0)
    return NextResponse.json({ error: "not_your_turn", state }, { status: 409 });

  const card = cardById(state, 0, cardId);
  if (!card) return NextResponse.json({ error: "not_in_hand", state }, { status: 400 });

  applyPlay(state, 0, card, signal ?? null);

  const mut = state as MatchState;
  if (!mut.finished && mut.toAct === 1) {
    const botCard = pickMove(mut, 1);
    applyPlay(mut, 1, botCard);
  }

  store.saveMatch({ ...m, state });

  if (state.finished) {
    // Round to whole points for the leaderboard
    const pts = Math.round(state.scoreThirds[0] / 3);
    store.recordScore({
      userId: user.id,
      userName: user.displayName,
      gameId: "treseta",
      points: pts,
    });
  }
  return NextResponse.json({ id: matchId, state });
}
