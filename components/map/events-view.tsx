"use client";

import { useMemo, useState } from "react";
import { SplitMap } from "@/components/map/split-map";
import { EventForm } from "@/components/map/event-form";
import type { Event as RivaEvent, GameId } from "@/lib/store";
import clsx from "clsx";

const GAMES: { id: "all" | GameId; label: string }[] = [
  { id: "all", label: "Sve" },
  { id: "briskula", label: "Briškula" },
  { id: "treseta", label: "Trešeta" },
  { id: "picigin", label: "Picigin" },
  { id: "balote", label: "Balote" },
  { id: "pljockanje", label: "Pljočkanje" },
  { id: "mora", label: "Mora" },
];

export function EventsView({
  initialEvents,
  userId,
}: {
  initialEvents: RivaEvent[];
  userId: string | null;
}) {
  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState<"all" | GameId>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialEvents[0]?.id ?? null
  );
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.gameId === filter)),
    [events, filter]
  );

  const selected = events.find((e) => e.id === selectedId) ?? null;

  async function toggleRsvp(id: string) {
    if (!userId) return;
    const res = await fetch(`/api/events/${id}/rsvp`, { method: "POST" });
    if (!res.ok) return;
    const j = await res.json();
    setEvents((prev) => prev.map((e) => (e.id === id ? j.event : e)));
  }

  function onCreated(ev: RivaEvent) {
    setEvents((p) => [ev, ...p]);
    setSelectedId(ev.id);
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="serif text-4xl text-adriaticDark">Događaji u Splitu</h1>
        <button
          className="btn-terra text-sm"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Zatvori formu" : "Stvori događaj"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setFilter(g.id)}
            className={clsx(
              "rounded-full border px-3 py-1 text-sm transition",
              filter === g.id
                ? "border-adriatic bg-adriatic text-white"
                : "border-stone bg-white/70 hover:bg-white"
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      {showForm && (
        <EventForm onCreated={onCreated} onCancel={() => setShowForm(false)} />
      )}

      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="h-[520px]">
          <SplitMap
            events={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className="card-surface p-2 max-h-[520px] overflow-y-auto">
          <ol className="divide-y divide-stone/70">
            {filtered.map((e) => (
              <li
                key={e.id}
                onClick={() => setSelectedId(e.id)}
                className={clsx(
                  "p-3 cursor-pointer transition",
                  selectedId === e.id ? "bg-adriatic/10" : "hover:bg-white/70"
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-medium">{e.title}</div>
                  <div className="text-[11px] text-ink/60">
                    {formatDate(e.startsAt)}
                  </div>
                </div>
                <div className="text-xs text-ink/70 mt-0.5">
                  {e.locationName} · {gameLabel(e.gameId)} ·{" "}
                  <span className="uppercase">{e.language}</span>
                </div>
                <div className="text-xs text-ink/60 mt-1">
                  {e.rsvps.length}/{e.capacity} prijavljenih · host {e.hostName}
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="p-4 text-sm text-ink/60">
                Nema događaja za ovaj filter.
              </li>
            )}
          </ol>
        </div>
      </div>

      {selected && (
        <div className="card-surface p-5">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <div>
              <div className="serif text-2xl text-adriaticDark">
                {selected.title}
              </div>
              <div className="text-sm text-ink/70">
                {selected.locationName} · {formatDate(selected.startsAt)} ·{" "}
                {gameLabel(selected.gameId)} · {selected.language.toUpperCase()}
              </div>
            </div>
            <button
              className={clsx(
                "btn-primary text-sm",
                userId && selected.rsvps.includes(userId) && "!bg-terracotta hover:!bg-terracotta/90"
              )}
              onClick={() => toggleRsvp(selected.id)}
              disabled={!userId}
            >
              {userId && selected.rsvps.includes(userId)
                ? "Odjavi se"
                : "Prijavi se"}
            </button>
          </div>
          <p className="mt-3 text-sm text-ink/80">{selected.description}</p>
          <div className="mt-3 text-xs text-ink/60">
            Host: <b>{selected.hostName}</b> · Kapacitet {selected.capacity} ·{" "}
            {selected.rsvps.length} prijavljenih
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("hr-HR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function gameLabel(g: GameId): string {
  switch (g) {
    case "briskula":
      return "Briškula";
    case "treseta":
      return "Trešeta";
    case "mora":
      return "Mora";
    case "balote":
      return "Balote";
    case "picigin":
      return "Picigin";
    case "pljockanje":
      return "Pljočkanje";
  }
}
