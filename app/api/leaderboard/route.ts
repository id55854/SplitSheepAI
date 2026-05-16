import { NextRequest, NextResponse } from "next/server";
import { store, type GameId } from "@/lib/store";

export async function GET(req: NextRequest) {
  const win = req.nextUrl.searchParams.get("window") ?? "all";
  const gameId = req.nextUrl.searchParams.get("gameId") as GameId | null;
  const cutoff = (() => {
    const now = Date.now();
    if (win === "day") return new Date(now - 86400_000).toISOString();
    if (win === "week") return new Date(now - 7 * 86400_000).toISOString();
    if (win === "month") return new Date(now - 30 * 86400_000).toISOString();
    return "0";
  })();
  const scores = store.listScores().filter((s) => {
    if (gameId && s.gameId !== gameId) return false;
    return s.createdAt >= cutoff;
  });
  // Sum top scores per user
  const byUser = new Map<string, { userName: string; total: number; best: number; n: number }>();
  for (const s of scores) {
    const prev = byUser.get(s.userId) ?? {
      userName: s.userName,
      total: 0,
      best: 0,
      n: 0,
    };
    prev.total += s.points;
    prev.best = Math.max(prev.best, s.points);
    prev.n += 1;
    byUser.set(s.userId, prev);
  }
  const rows = [...byUser.entries()]
    .map(([userId, v]) => ({ userId, ...v }))
    .sort((a, b) => b.best - a.best);
  return NextResponse.json({ rows });
}
