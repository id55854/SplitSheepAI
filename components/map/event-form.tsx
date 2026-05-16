"use client";

import { useState } from "react";
import { SplitMap } from "@/components/map/split-map";
import type { Event as RivaEvent, GameId } from "@/lib/store";

const GAMES: { id: GameId; label: string }[] = [
  { id: "briskula", label: "Briškula" },
  { id: "treseta", label: "Trešeta" },
  { id: "picigin", label: "Picigin" },
  { id: "balote", label: "Balote" },
  { id: "pljockanje", label: "Pljočkanje" },
  { id: "mora", label: "Mora" },
];

const isoFor = (offsetH = 24) =>
  new Date(Date.now() + offsetH * 3600_000).toISOString().slice(0, 16);

export function EventForm({
  onCreated,
  onCancel,
}: {
  onCreated: (e: RivaEvent) => void;
  onCancel: () => void;
}) {
  const [gameId, setGameId] = useState<GameId>("briskula");
  const [title, setTitle] = useState("Briškula večer u kvartu");
  const [description, setDescription] = useState(
    "Sjednemo, igramo, jedna runda traje koliko traje."
  );
  const [startsAt, setStartsAt] = useState(isoFor(24));
  const [locationName, setLocationName] = useState("Konoba Matejuška");
  const [capacity, setCapacity] = useState(12);
  const [language, setLanguage] = useState<"hr" | "en" | "ck">("hr");
  const [coord, setCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!coord) {
      setErr("Klikni na kartu da odrediš lokaciju.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          title: title.trim(),
          description: description.trim(),
          startsAt: new Date(startsAt).toISOString(),
          lat: coord.lat,
          lng: coord.lng,
          locationName: locationName.trim(),
          capacity: Number(capacity),
          language,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? "Greška");
      }
      const j = await res.json();
      onCreated(j.event as RivaEvent);
    } catch (e: any) {
      setErr(e?.message ?? "Greška.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card-surface p-5 space-y-4">
      <div className="serif text-2xl text-adriaticDark">Novi događaj</div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-sm">
          Igra
          <select
            value={gameId}
            onChange={(e) => setGameId(e.target.value as GameId)}
            className="mt-1 w-full rounded-md border border-stone bg-white/80 px-2 py-1.5"
          >
            {GAMES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Kada
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone bg-white/80 px-2 py-1.5"
          />
        </label>
        <label className="text-sm">
          Jezik
          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value as "hr" | "en" | "ck")
            }
            className="mt-1 w-full rounded-md border border-stone bg-white/80 px-2 py-1.5"
          >
            <option value="hr">Hrvatski</option>
            <option value="ck">Čakavski</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="text-sm md:col-span-2">
          Naslov
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone bg-white/80 px-2 py-1.5"
            maxLength={80}
          />
        </label>
        <label className="text-sm">
          Kapacitet
          <input
            type="number"
            min={2}
            max={64}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-stone bg-white/80 px-2 py-1.5"
          />
        </label>
        <label className="text-sm md:col-span-2">
          Lokacija (naziv)
          <input
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone bg-white/80 px-2 py-1.5"
            maxLength={80}
          />
        </label>
        <label className="text-sm md:col-span-3">
          Opis
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-stone bg-white/80 px-2 py-1.5"
            maxLength={400}
          />
        </label>
      </div>

      <div>
        <div className="text-sm font-medium mb-1">
          Klikni na karti gde će se igrat
        </div>
        <div className="h-[320px]">
          <SplitMap
            events={[]}
            selectedId={null}
            onSelect={() => {}}
            pickMode
            pickedCoord={coord}
            onPick={(lat, lng) => setCoord({ lat, lng })}
          />
        </div>
        {coord && (
          <div className="text-xs text-ink/60 mt-1">
            {coord.lat.toFixed(5)}, {coord.lng.toFixed(5)}
          </div>
        )}
      </div>

      {err && <div className="text-sm text-terracotta">{err}</div>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost text-sm"
          disabled={busy}
        >
          Odustani
        </button>
        <button type="submit" className="btn-primary text-sm" disabled={busy}>
          {busy ? "Šaljem…" : "Objavi"}
        </button>
      </div>
    </form>
  );
}
