"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map as MLMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Event as RivaEvent, GameId } from "@/lib/store";

const SPLIT_CENTER: [number, number] = [16.4402, 43.5081];

const GAME_COLOR: Record<GameId, string> = {
  briskula: "#1e6091",
  treseta: "#3a6c8c",
  mora: "#c1502e",
  balote: "#2d6a3a",
  picigin: "#0e8db5",
  pljockanje: "#6b4d2a",
};

const GAME_EMOJI: Record<GameId, string> = {
  briskula: "🂡",
  treseta: "🂢",
  mora: "✋",
  balote: "●",
  picigin: "◎",
  pljockanje: "▲",
};

type Props = {
  events: RivaEvent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  pickMode?: boolean;
  pickedCoord?: { lat: number; lng: number } | null;
  onPick?: (lat: number, lng: number) => void;
};

export function SplitMap({
  events,
  selectedId,
  onSelect,
  pickMode,
  pickedCoord,
  onPick,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const pickMarkerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (!wrap.current || mapRef.current) return;
    const m = new maplibregl.Map({
      container: wrap.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: SPLIT_CENTER,
      zoom: 13,
      attributionControl: { compact: true },
    });
    m.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = m;
    return () => {
      m.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when events change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Remove markers not in new set
    for (const [id, mk] of markersRef.current) {
      if (!events.find((e) => e.id === id)) {
        mk.remove();
        markersRef.current.delete(id);
      }
    }
    for (const e of events) {
      let mk = markersRef.current.get(e.id);
      if (!mk) {
        const el = document.createElement("button");
        el.className = "riva-pin";
        el.style.cssText = `
          display:grid; place-items:center; width:30px; height:30px;
          border-radius:9999px; border:2px solid white;
          background:${GAME_COLOR[e.gameId]}; color:white; font-size:14px;
          box-shadow:0 4px 10px rgba(0,0,0,.2); cursor:pointer;
        `;
        el.innerHTML = GAME_EMOJI[e.gameId];
        el.addEventListener("click", (ev) => {
          ev.stopPropagation();
          onSelect(e.id);
        });
        mk = new maplibregl.Marker({ element: el })
          .setLngLat([e.lng, e.lat])
          .addTo(map);
        markersRef.current.set(e.id, mk);
      }
      const el = mk.getElement();
      el.style.outline =
        e.id === selectedId ? "3px solid #c1502e" : "none";
      el.style.transform = e.id === selectedId ? "scale(1.15)" : "scale(1)";
    }
  }, [events, selectedId, onSelect]);

  // Pan when selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const ev = events.find((e) => e.id === selectedId);
    if (!ev) return;
    map.easeTo({ center: [ev.lng, ev.lat], zoom: 14.5, duration: 600 });
  }, [selectedId, events]);

  // Pick mode click handler
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    function handle(e: maplibregl.MapMouseEvent) {
      if (!pickMode || !onPick) return;
      onPick(e.lngLat.lat, e.lngLat.lng);
    }
    map.on("click", handle);
    return () => {
      map.off("click", handle);
    };
  }, [pickMode, onPick]);

  // Render the "picked" marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (pickMarkerRef.current) pickMarkerRef.current.remove();
    pickMarkerRef.current = null;
    if (pickedCoord) {
      const el = document.createElement("div");
      el.style.cssText =
        "width:18px;height:18px;border-radius:50%;background:#c1502e;border:3px solid white;box-shadow:0 0 0 4px rgba(193,80,46,.3)";
      pickMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([pickedCoord.lng, pickedCoord.lat])
        .addTo(map);
    }
  }, [pickedCoord]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={wrap}
        className="w-full h-full rounded-lg overflow-hidden border border-stone"
        style={{ minHeight: 420 }}
      />
      {pickMode && (
        <div className="absolute top-3 left-3 pill bg-terracotta text-white border-transparent">
          Klikni na kartu da odrediš lokaciju
        </div>
      )}
    </div>
  );
}
