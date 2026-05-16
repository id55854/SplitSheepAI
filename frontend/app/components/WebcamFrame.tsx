"use client";

import { useEffect, useState } from "react";

export function WebcamFrame({ url, label }: { url: string; label?: string | null }) {
  const [bust, setBust] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setBust(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative overflow-hidden rounded-lg border border-sea-700/60 bg-sea-900/40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${url}?t=${bust}`}
        alt={label ?? "Live beach webcam"}
        className="w-full h-40 object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {label && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sea-900/90 to-transparent text-xs px-2 py-1 text-sea-100">
          {label}
        </div>
      )}
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] uppercase tracking-wider text-sea-100 bg-sea-900/60 backdrop-blur px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        live
      </div>
    </div>
  );
}
