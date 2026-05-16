"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type PlayerRow = {
  userId: string;
  userName: string;
  kvart: string | null;
  total: number;
  best: number;
  n: number;
};

type KvartRow = {
  kvart: string;
  total: number;
  best: number;
  n: number;
  players: number;
  top: { name: string; points: number } | null;
};

type Win = "day" | "week" | "month" | "all";
type GameFilter = "all" | "briskula" | "treseta" | "mora" | "pljockanje" | "alka";
type Mode = "players" | "kvarts";

const WINS: { id: Win; label: string }[] = [
  { id: "day", label: "Danas" },
  { id: "week", label: "Tjedan" },
  { id: "month", label: "Mjesec" },
  { id: "all", label: "Sve" },
];

const GAMES: { id: GameFilter; label: string }[] = [
  { id: "all", label: "Sve igre" },
  { id: "briskula", label: "Briškula" },
  { id: "treseta", label: "Trešeta" },
  { id: "mora", label: "Mora" },
  { id: "pljockanje", label: "Pljočkanje" },
  { id: "alka", label: "Alka" },
];

const KVART_COLOR: Record<string, string> = {
  "Veli Varoš": "#1e6091",
  "Lučac": "#c1502e",
  "Manuš": "#2d6a3a",
  "Bačvice": "#0e8db5",
  "Varoš": "#8b1f1f",
  "drugdi": "#6b4d2a",
};

export function LeaderboardView() {
  const [win, setWin] = useState<Win>("all");
  const [game, setGame] = useState<GameFilter>("all");
  const [mode, setMode] = useState<Mode>("players");
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [kvarts, setKvarts] = useState<KvartRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ window: win, mode });
    if (game !== "all") params.set("gameId", game);
    fetch(`/api/leaderboard?${params.toString()}`)
      .then((r) => r.json())
      .then((j) => {
        if (mode === "players") setPlayers(j.rows ?? []);
        else setKvarts(j.rows ?? []);
      })
      .finally(() => setLoading(false));
  }, [win, game, mode]);

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h1 className="serif text-4xl text-adriaticDark">Ljestvica</h1>
        <div className="flex gap-1 rounded-full border border-stone bg-white/70 p-1 text-sm">
          <button
            onClick={() => setMode("players")}
            className={clsx(
              "rounded-full px-3 py-1 transition",
              mode === "players"
                ? "bg-adriatic text-white"
                : "text-ink hover:bg-white"
            )}
          >
            Igrači
          </button>
          <button
            onClick={() => setMode("kvarts")}
            className={clsx(
              "rounded-full px-3 py-1 transition",
              mode === "kvarts"
                ? "bg-adriatic text-white"
                : "text-ink hover:bg-white"
            )}
          >
            Kvarti
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {WINS.map((w) => (
          <button
            key={w.id}
            onClick={() => setWin(w.id)}
            className={clsx(
              "rounded-full border px-3 py-1 text-sm",
              win === w.id
                ? "border-adriatic bg-adriatic text-white"
                : "border-stone bg-white/70 hover:bg-white"
            )}
          >
            {w.label}
          </button>
        ))}
        <span className="text-ink/40 mx-1">·</span>
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setGame(g.id)}
            className={clsx(
              "rounded-full border px-3 py-1 text-sm",
              game === g.id
                ? "border-terracotta bg-terracotta text-white"
                : "border-stone bg-white/70 hover:bg-white"
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      {mode === "players" ? (
        <PlayersTable rows={players} loading={loading} />
      ) : (
        <KvartsBoard rows={kvarts} loading={loading} />
      )}

      <div className="text-xs text-ink/60">
        Phase 1 dodaje ljestvicu po konobi (Matejuška vs Bajamonti) i po
        diaspori (Split · Toronto · Sydney · Buenos Aires · Pittsburgh ·
        Melbourne).
      </div>
    </div>
  );
}

function PlayersTable({
  rows,
  loading,
}: {
  rows: PlayerRow[];
  loading: boolean;
}) {
  return (
    <div className="card-surface overflow-hidden">
      <table className="w-full text-sm">
        <thead className="text-left text-ink/60">
          <tr className="border-b border-stone/70">
            <th className="px-4 py-2 w-12">#</th>
            <th className="px-4 py-2">Igrač</th>
            <th className="px-4 py-2">Kvart</th>
            <th className="px-4 py-2 text-right">Najbolje</th>
            <th className="px-4 py-2 text-right">Ukupno</th>
            <th className="px-4 py-2 text-right">Partije</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={6} className="p-6 text-center text-ink/60">
                Učitavam…
              </td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={6} className="p-6 text-center text-ink/60">
                Nema rezultata u ovom prozoru.
              </td>
            </tr>
          )}
          {!loading &&
            rows.map((r, i) => (
              <tr
                key={r.userId}
                className={clsx(
                  "border-b border-stone/40",
                  i === 0 && "bg-terracotta/10"
                )}
              >
                <td className="px-4 py-2 font-serif text-lg">{i + 1}</td>
                <td className="px-4 py-2 font-medium">{r.userName}</td>
                <td className="px-4 py-2">
                  {r.kvart ? (
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-xs text-white"
                      style={{
                        background: KVART_COLOR[r.kvart] ?? "#6b4d2a",
                      }}
                    >
                      {r.kvart}
                    </span>
                  ) : (
                    <span className="text-ink/40 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right font-serif text-lg text-adriatic">
                  {r.best}
                </td>
                <td className="px-4 py-2 text-right">{r.total}</td>
                <td className="px-4 py-2 text-right text-ink/60">{r.n}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function KvartsBoard({ rows, loading }: { rows: KvartRow[]; loading: boolean }) {
  const maxTotal = Math.max(1, ...rows.map((r) => r.total));
  if (loading) {
    return (
      <div className="card-surface p-6 text-center text-ink/60">Učitavam…</div>
    );
  }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {rows.map((r, i) => {
        const pct = (r.total / maxTotal) * 100;
        const color = KVART_COLOR[r.kvart] ?? "#6b4d2a";
        return (
          <div
            key={r.kvart}
            className={clsx(
              "card-surface p-4 relative overflow-hidden",
              i === 0 && r.total > 0 && "ring-2 ring-terracotta/40"
            )}
          >
            <div
              aria-hidden
              className="absolute inset-y-0 left-0"
              style={{
                width: `${pct}%`,
                background: color,
                opacity: 0.08,
              }}
            />
            <div className="relative">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl text-ink/40">
                    {i + 1}
                  </span>
                  <span
                    className="font-serif text-2xl"
                    style={{ color }}
                  >
                    {r.kvart}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-ink/50">
                    Ukupno
                  </div>
                  <div
                    className="font-serif text-3xl leading-none"
                    style={{ color }}
                  >
                    {r.total}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-ink/70 flex items-center gap-3">
                <span>{r.players} igrača</span>
                <span>·</span>
                <span>{r.n} partija</span>
                <span>·</span>
                <span>najbolje {r.best}</span>
              </div>
              {r.top && (
                <div className="mt-2 text-xs text-ink/70">
                  Najbolji:{" "}
                  <b className="text-ink">{r.top.name}</b>
                  {" "}({r.top.points} pt)
                </div>
              )}
              {r.total === 0 && (
                <div className="mt-2 text-xs text-ink/50">
                  Još nema rezultata. Tvoj kvart te čeka.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
