import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireGuest } from "@/lib/guest";
import { store } from "@/lib/store";
import { applyPlay, cardById, type MatchState } from "@/lib/briskula/state";
import { pickMove } from "@/lib/briskula/bot";

const Body = z.object({
  matchId: z.string(),
  cardId: z.string(),
});

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireGuest();
  } catch {
    return NextResponse.json({ error: "no_guest" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_input" }, { status: 400 });
  }
  const { matchId, cardId } = parsed.data;
  const m = store.getMatch(matchId);
  if (!m) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (m.playerId !== user.id)
    return NextResponse.json({ error: "not_yours" }, { status: 403 });

  const state = m.state as MatchState;
  if (state.finished)
    return NextResponse.json({ error: "finished", state });

  if (state.toAct !== 0)
    return NextResponse.json({ error: "not_your_turn", state }, { status: 409 });

  const card = cardById(state, 0, cardId);
  if (!card) return NextResponse.json({ error: "not_in_hand", state }, { status: 400 });

  applyPlay(state, 0, card);

  // applyPlay mutates state. TypeScript can't see that; re-read fields via any-cast.
  const mut = state as MatchState;

  // If bot is now to act and game not finished, let bot play (possibly multiple
  // times if it leads + we want player to see one tick — but standard turn: bot
  // plays once, then either responds-into-resolve or leads-and-waits).
  if (!mut.finished && mut.toAct === 1) {
    const botCard = pickMove(mut, 1);
    applyPlay(mut, 1, botCard);

    // If trick resolved and bot now leads, play another bot move so player only
    // sees the lead + their own response phase. Otherwise leave bot's lead on the
    // table waiting for player.
    // (No additional play — leaving bot's lead on the table is the desired UX.)
  }

  store.saveMatch({ ...m, state });

  // Record final score on finish
  if (state.finished) {
    const points = state.scores[0];
    store.recordScore({
      userId: user.id,
      userName: user.displayName,
      gameId: "briskula",
      points,
    });
  }

  return NextResponse.json({ id: matchId, state });
}
