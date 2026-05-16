import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentGuest } from "@/lib/guest";
import { adjudicate } from "@/lib/mora/logic";
import { shortMessage } from "@/lib/claude";
import { store } from "@/lib/store";

const Body = z.object({
  fingers: z.number().int().min(0).max(5),
  called: z.number().int().min(2).max(10),
  scorePlayer: z.number().int().min(0).max(50).optional(),
  scoreAi: z.number().int().min(0).max(50).optional(),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentGuest();
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_input" }, { status: 400 });
  }
  const { fingers, called, scorePlayer = 0, scoreAi = 0 } = parsed.data;
  const round = adjudicate(fingers, called);

  // Commentary in čakavski (Dida persona, very short)
  const ask =
    round.outcome === "player"
      ? `User threw ${fingers}, shouted ${called}. You (the AI) threw ${round.aiFingers}, shouted ${round.aiCalled}. Total ${round.total}. User WON the point. Score: user ${scorePlayer + 1}, you ${scoreAi}. Trash-talk yourself in one sentence (under 12 words), čakavski.`
      : round.outcome === "ai"
      ? `User threw ${fingers}, shouted ${called}. You (the AI) threw ${round.aiFingers}, shouted ${round.aiCalled}. Total ${round.total}. YOU won the point. Score: user ${scorePlayer}, you ${scoreAi + 1}. Brag in one short sentence (under 12 words), čakavski.`
      : `User threw ${fingers}, shouted ${called}. You threw ${round.aiFingers}, shouted ${round.aiCalled}. Total ${round.total}. Tie, no point. Say one line, čakavski, under 12 words.`;

  // Best-effort commentary; never block the round on Claude.
  let commentary = "";
  try {
    commentary = await Promise.race([
      shortMessage("dida", ask),
      new Promise<string>((_, rej) => setTimeout(() => rej(new Error("t")), 2500)),
    ]);
  } catch {
    commentary =
      round.outcome === "player"
        ? "Uhvatija si me, moj barba."
        : round.outcome === "ai"
        ? "Uhvatija san te, moj barba!"
        : "Ravno. Još jedna runda.";
  }

  // If the player reached 5 with this round, record their final score.
  const newPlayerScore = scorePlayer + (round.outcome === "player" ? 1 : 0);
  const setFinished = newPlayerScore >= 5 || scoreAi + (round.outcome === "ai" ? 1 : 0) >= 5;
  if (setFinished && user && newPlayerScore >= 5) {
    store.recordScore({
      userId: user.id,
      userName: user.displayName,
      gameId: "mora",
      points: newPlayerScore,
    });
  }

  return NextResponse.json({ round, commentary });
}
