import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentGuest } from "@/lib/guest";
import { store } from "@/lib/store";

const Body = z.object({ points: z.number().int().min(0).max(12) });

export async function POST(req: NextRequest) {
  const user = await getCurrentGuest();
  if (!user) return NextResponse.json({ error: "no_guest" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "bad_input" }, { status: 400 });
  store.recordScore({
    userId: user.id,
    userName: user.displayName,
    gameId: "alka",
    points: parsed.data.points,
  });
  return NextResponse.json({ ok: true });
}
