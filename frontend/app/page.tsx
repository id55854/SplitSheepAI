"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { AlertForm } from "./components/AlertForm";
import { BeachCard } from "./components/BeachCard";
import { FilterBar } from "./components/FilterBar";
import { HeroPanel } from "./components/HeroPanel";
import { fetchBeaches } from "./lib/api";
import type { BeachesResponse } from "./lib/types";

const BeachMap = dynamic(() => import("./components/BeachMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] sm:h-[520px] w-full rounded-2xl bg-sea-800/50 border border-sea-700/60 flex items-center justify-center text-sea-200">
      Loading map…
    </div>
  ),
});

export default function HomePage() {
  const [data, setData] = useState<BeachesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [focusOn, setFocusOn] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const d = await fetchBeaches();
        if (!cancelled) {
          setData(d);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.beaches;
    return data.beaches.filter((b) => b.vibe.includes(filter));
  }, [data, filter]);

  const onJumpTo = (slug: string) => {
    const b = data?.beaches.find((x) => x.slug === slug);
    if (b) {
      setSelected(slug);
      setFocusOn({ lat: b.lat, lng: b.lng });
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-sand-300">
            Beach Worth Going
          </p>
          <p className="text-sea-200/80 text-sm">
            Live conditions across all 16 monitored Split beaches.
          </p>
        </div>
        <div className="text-xs text-sea-200/70 hidden sm:block">
          {data ? `${data.beaches.length} beaches · updated every 60s` : "—"}
        </div>
      </header>

      <HeroPanel
        now={
          data?.now ?? {
            air_temp_c: null,
            wind_speed_kmh: null,
            wind_direction_deg: null,
            wind_name: null,
            humidity_pct: null,
            uv_index: null,
            cloud_cover_pct: null,
            sea_temp_c_dhmz: null,
            sea_temp_c_model: null,
            wave_height_m: null,
          }
        }
        top={data?.beaches[0] ?? null}
        onJump={onJumpTo}
      />

      <FilterBar active={filter} onChange={setFilter} />

      <div className="grid lg:grid-cols-[1fr_24rem] gap-6">
        <BeachMap
          beaches={filtered}
          selected={selected}
          onSelect={(slug) => {
            setSelected(slug);
            const b = data?.beaches.find((x) => x.slug === slug);
            if (b) setFocusOn({ lat: b.lat, lng: b.lng });
          }}
          focusOn={focusOn}
        />

        <div className="space-y-3 max-h-[520px] lg:overflow-y-auto pr-1">
          {error && (
            <div className="rounded-xl bg-red-900/40 border border-red-700/60 p-3 text-sm text-red-200">
              {error} — is the backend running on http://127.0.0.1:8000?
            </div>
          )}
          {!error && filtered.length === 0 && data && (
            <div className="rounded-xl bg-sea-800/40 border border-sea-700/60 p-4 text-sm text-sea-200">
              No beaches match this filter — try “All beaches”.
            </div>
          )}
          {filtered.map((b) => (
            <BeachCard
              key={b.slug}
              beach={b}
              active={selected === b.slug}
              onSelect={() => onJumpTo(b.slug)}
            />
          ))}
        </div>
      </div>

      <AlertForm />

      <footer className="text-xs text-sea-200/60 pt-2 pb-6">
        Data: IZOR / Ministry of Economy and Sustainable Development (bathing
        quality) · DHMZ (sea temperature) · Open-Meteo (weather, waves) ·
        WhatsUpCams (webcams). Built for the SheepAI Summer 2026 challenge.
      </footer>
    </main>
  );
}
