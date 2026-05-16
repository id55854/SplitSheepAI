"use client";

import { scoreTier } from "../lib/api";

export function SplashBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const tier = scoreTier(score);
  const dims =
    size === "lg" ? "w-20 h-20 text-3xl" : size === "sm" ? "w-12 h-12 text-base" : "w-16 h-16 text-2xl";
  return (
    <div
      data-tier={tier}
      className={`score-badge ${dims} rounded-full flex items-center justify-center font-display font-semibold text-white shadow-lg shadow-sea-900/40`}
      aria-label={`Splash score ${score}`}
    >
      {score}
    </div>
  );
}
