"use client";

import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import { scoreTier } from "../lib/api";
import type { BeachSummary } from "../lib/types";

const TIER_COLORS: Record<ReturnType<typeof scoreTier>, string> = {
  great: "#22c55e",
  good: "#0ea5e9",
  ok: "#eab308",
  skip: "#ef4444",
};

function buildIcon(score: number) {
  const tier = scoreTier(score);
  const color = TIER_COLORS[tier];
  const html = `
    <div style="position:relative;width:38px;height:38px;">
      <div style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:0.35;animation:pulse-ring 2.4s ease-out infinite;"></div>
      <div style="position:absolute;inset:5px;border-radius:9999px;background:${color};display:flex;align-items:center;justify-content:center;color:#04293b;font-weight:700;font-size:13px;box-shadow:0 4px 10px rgba(0,0,0,0.3);border:2px solid #04293b;">${score}</div>
    </div>
  `;
  return L.divIcon({
    html,
    className: "beach-marker",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -16],
  });
}

function PanController({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 15, { duration: 0.8 });
  }, [target, map]);
  return null;
}

export default function BeachMap({
  beaches,
  selected,
  onSelect,
  focusOn,
}: {
  beaches: BeachSummary[];
  selected: string | null;
  onSelect: (slug: string) => void;
  focusOn: { lat: number; lng: number } | null;
}) {
  const center = useMemo<[number, number]>(() => [43.508, 16.45], []);
  const markersRef = useRef<Record<string, L.Marker | null>>({});

  useEffect(() => {
    if (selected && markersRef.current[selected]) {
      markersRef.current[selected]?.openPopup();
    }
  }, [selected]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      className="h-[420px] sm:h-[520px] w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <PanController target={focusOn} />
      {beaches.map((b) => (
        <Marker
          key={b.slug}
          position={[b.lat, b.lng]}
          icon={buildIcon(b.splash_score)}
          ref={(ref) => {
            markersRef.current[b.slug] = ref;
          }}
          eventHandlers={{
            click: () => onSelect(b.slug),
          }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-display text-base font-semibold">{b.name}</div>
              <div className="text-sea-100/90">{b.headline}</div>
              <div className="mt-1 text-xs text-sea-200/80">
                Splash {b.splash_score} · {b.water?.label ?? "—"} water · crowd {b.crowd.label}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
