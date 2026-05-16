"use client";

import type { BeachSummary, NowConditions } from "../lib/types";
import { SplashBadge } from "./SplashBadge";

export function HeroPanel({
  now,
  top,
  onJump,
}: {
  now: NowConditions;
  top: BeachSummary | null;
  onJump?: (slug: string) => void;
}) {
  const sea =
    now.sea_temp_c_dhmz != null
      ? `${now.sea_temp_c_dhmz.toFixed(1)}°C (DHMZ)`
      : now.sea_temp_c_model != null
      ? `${now.sea_temp_c_model.toFixed(1)}°C (model)`
      : "—";
  return (
    <section className="rounded-3xl bg-gradient-to-br from-sea-700/70 via-sea-800/70 to-sea-900/70 border border-sea-600/40 p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-sand-300">
            Split · right now
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-white font-semibold mt-1">
            {top ? `Go to ${top.name}` : "Pulling live conditions…"}
          </h1>
          {top && (
            <p className="text-sea-100/90 mt-2 max-w-xl">
              {top.headline}.{" "}
              <button
                onClick={() => top && onJump?.(top.slug)}
                className="underline decoration-sand-300 underline-offset-2 hover:text-white"
              >
                See on map →
              </button>
            </p>
          )}
        </div>
        {top && <SplashBadge score={top.splash_score} size="lg" />}
      </div>

      <dl className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
        <HeroStat
          label="Air"
          value={now.air_temp_c != null ? `${now.air_temp_c.toFixed(0)}°C` : "—"}
        />
        <HeroStat label="Sea" value={sea} />
        <HeroStat
          label="Wind"
          value={
            now.wind_speed_kmh != null
              ? `${now.wind_speed_kmh.toFixed(0)} km/h ${now.wind_name ?? ""}`
              : "—"
          }
        />
        <HeroStat
          label="Wave"
          value={now.wave_height_m != null ? `${now.wave_height_m.toFixed(2)} m` : "—"}
        />
        <HeroStat
          label="UV"
          value={now.uv_index != null ? `${now.uv_index.toFixed(1)}` : "—"}
        />
      </dl>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-sea-900/40 border border-sea-700/60 px-3 py-2">
      <dt className="text-[10px] uppercase tracking-wider text-sand-300">{label}</dt>
      <dd className="text-white font-medium mt-0.5">{value}</dd>
    </div>
  );
}
