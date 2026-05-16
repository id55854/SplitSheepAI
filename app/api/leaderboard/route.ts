import { NextRequest, NextResponse } from "next/server";
import { store, type GameId, type Kvart } from "@/lib/store";

const KVARTS: Kvart[] = [
  "Veli Varoš",
  "Lučac",
  "Manuš",
  "Bačvice",
  "Varoš",
  "drugdi",
];

export async function GET(req: NextRequest) {
  const win = req.nextUrl.searchParams.get("window") ?? "all";
  const mode = (req.nextUrl.searchParams.get("mode") ?? "players") as
    | "players"
    | "kvarts";
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

  if (mode === "players") {
    const byUser = new Map<
      string,
      { userName: string; kvart: string | null; total: number; best: number; n: number }
    >();
    for (const s of scores) {
      const user = store.getUser(s.userId);
      const prev = byUser.get(s.userId) ?? {
        userName: s.userName,
        kvart: user?.kvart ?? null,
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

  // mode === "kvarts" — aggregate by kvart
  type KRow = {
    kvart: string;
    total: number;
    best: number;
    n: number;
    players: number;
    top: { name: string; points: number } | null;
  };
  const byKvart = new Map<string, KRow>();
  const seenPlayers = new Map<string, Set<string>>();
  for (const s of scores) {
    const u = store.getUser(s.userId);
    const k = (u?.kvart as string | null) ?? "drugdi";
    const row =
      byKvart.get(k) ?? {
        kvart: k,
        total: 0,
        best: 0,
        n: 0,
        players: 0,
        top: null,
      };
    row.total += s.points;
    if (s.points > row.best) {
      row.best = s.points;
      row.top = { name: s.userName, points: s.points };
    }
    row.n += 1;
    byKvart.set(k, row);
    const set = seenPlayers.get(k) ?? new Set<string>();
    set.add(s.userId);
    seenPlayers.set(k, set);
  }
  for (const [k, set] of seenPlayers) {
    const row = byKvart.get(k);
    if (row) row.players = set.size;
  }
  // Ensure all canonical kvarts appear, even with 0 scores
  for (const k of KVARTS) {
    if (!byKvart.has(k)) {
      byKvart.set(k, {
        kvart: k,
        total: 0,
        best: 0,
        n: 0,
        players: 0,
        top: null,
      });
    }
  }
  const rows = [...byKvart.values()].sort((a, b) => b.total - a.total);
  return NextResponse.json({ rows });
}
