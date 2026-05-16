"use client";

import type { BeachSummary } from "../lib/types";
import { SplashBadge } from "./SplashBadge";
import { WebcamFrame } from "./WebcamFrame";

export function BeachCard({
  beach,
  onSelect,
  active,
}: {
  beach: BeachSummary;
  onSelect?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left w-full rounded-2xl bg-sea-800/60 border ${
        active ? "border-sea-300 ring-2 ring-sea-300/40" : "border-sea-700/60"
      } p-4 hover:border-sea-400 transition-colors`}
    >
      <div className="flex items-start gap-4">
        <SplashBadge score={beach.splash_score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-white truncate">
              {beach.name}
            </h3>
            <span className="text-[11px] uppercase tracking-wider text-sea-200/80 whitespace-nowrap">
              {beach.water?.label ?? "—"}
            </span>
          </div>
          <p className="text-sm text-sea-100/90 mt-0.5">{beach.headline}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {beach.vibe.slice(0, 4).map((v) => (
              <span
                key={v}
                className="text-[10px] uppercase tracking-wider bg-sea-700/60 text-sea-100 px-2 py-0.5 rounded-full"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      {beach.webcam && (
        <div className="mt-3">
          <WebcamFrame url={beach.webcam.url} label={beach.webcam.label} />
        </div>
      )}

      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Stat label="Crowd" value={`${beach.crowd.label}`} />
        <Stat label="Sea" value={beach.sea_temp_c != null ? `${beach.sea_temp_c.toFixed(1)}°C` : "—"} />
        <Stat label="Wave" value={beach.wave_height_m != null ? `${beach.wave_height_m.toFixed(2)} m` : "—"} />
      </dl>

      {beach.crowd.note && (
        <p className="mt-2 text-[11px] text-sea-200/70 italic">{beach.crowd.note}</p>
      )}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-sea-900/50 rounded-md px-2 py-1.5">
      <dt className="text-[9px] uppercase tracking-wider text-sea-300">{label}</dt>
      <dd className="text-sm font-medium text-white">{value}</dd>
    </div>
  );
}
