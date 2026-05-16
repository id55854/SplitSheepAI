"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type Row = {
  userId: string;
  userName: string;
  total: number;
  best: number;
  n: number;
};

type Win = "day" | "week" | "month" | "all";
type GameFilter = "all" | "briskula" | "mora";

const WINS: { id: Win; label: string }[] = [
  { id: "day", label: "Danas" },
  { id: "week", label: "Tjedan" },
  { id: "month", label: "Mjesec" },
  { id: "all", label: "Sve" },
];

const GAMES: { id: GameFilter; label: string }[] = [
  { id: "all", label: "Sve igre" },
  { id: "briskula", label: "Briškula" },
  { id: "mora", label: "Mora" },
];

export function LeaderboardView() {
  const [win, setWin] = useState<Win>("all");
  const [game, setGame] = useState<GameFilter>("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ window: win });
    if (game !== "all") params.set("gameId", game);
    fetch(`/api/leaderboard?${params.toString()}`)
      .then((r) => r.json())
      .then((j) => setRows(j.rows ?? []))
      .finally(() => setLoading(false));
  }, [win, game]);

  return (
    <div className="space-y-5">
      <h1 className="serif text-4xl text-adriaticDark">Ljestvica</h1>

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

      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-ink/60">
            <tr className="border-b border-stone/70">
              <th className="px-4 py-2 w-12">#</th>
              <th className="px-4 py-2">Igrač</th>
              <th className="px-4 py-2 text-right">Najbolje</th>
              <th className="px-4 py-2 text-right">Ukupno</th>
              <th className="px-4 py-2 text-right">Partije</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink/60">
                  Učitavam…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink/60">
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
      <div className="text-xs text-ink/60">
        Phase 1 dodaje ljestvice po kvartu (Veli Varoš · Lučac · Manuš ·
        Bačvice · Varoš) i po konobi.
      </div>
    </div>
  );
}
