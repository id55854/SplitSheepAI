// In-memory data store. Persistent within a single function instance.
// Acceptable for the hackathon demo; Phase 1 swaps for Prisma + Neon.

import { seedEvents, seedScores, seedUsers, type SeedScore } from "@/lib/seed";

export type Kvart =
  | "Veli Varoš"
  | "Lučac"
  | "Manuš"
  | "Bačvice"
  | "Varoš"
  | "drugdi";

export type GameId =
  | "briskula"
  | "treseta"
  | "mora"
  | "pljockanje"
  | "balote"
  | "picigin"
  | "alka";

export type User = {
  id: string;
  displayName: string;
  kvart?: Kvart | null;
  isGuest: boolean;
  createdAt: string;
};

export type Event = {
  id: string;
  hostId: string;
  hostName: string;
  gameId: GameId;
  title: string;
  description: string;
  startsAt: string; // ISO
  lat: number;
  lng: number;
  locationName: string;
  capacity: number;
  language: "hr" | "en" | "ck";
  rsvps: string[]; // user ids
};

export type Score = {
  id: string;
  userId: string;
  userName: string;
  gameId: GameId;
  points: number;
  createdAt: string;
};

export type BriskulaMatch = {
  id: string;
  createdAt: string;
  playerId: string;
  // state is owned by lib/briskula/state — opaque blob here
  state: unknown;
};

type StoreShape = {
  users: Map<string, User>;
  events: Map<string, Event>;
  scores: Score[];
  matches: Map<string, BriskulaMatch>;
  seeded: boolean;
};

const g = globalThis as unknown as { __riva_store?: StoreShape };

if (!g.__riva_store) {
  g.__riva_store = {
    users: new Map(),
    events: new Map(),
    scores: [],
    matches: new Map(),
    seeded: false,
  };
}

const s = g.__riva_store;

function seed() {
  if (s.seeded) return;
  s.seeded = true;
  for (const u of seedUsers) s.users.set(u.id, u);
  for (const e of seedEvents) s.events.set(e.id, e);
  for (const sc of seedScores as SeedScore[])
    s.scores.push({ ...sc, id: cryptoId(), createdAt: sc.createdAt });
}

function cryptoId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const store = {
  ensureSeeded() {
    seed();
  },
  newId: cryptoId,

  // users
  createGuest(displayName: string, kvart?: Kvart | null): User {
    seed();
    const u: User = {
      id: cryptoId(),
      displayName,
      kvart: kvart ?? null,
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    s.users.set(u.id, u);
    return u;
  },
  getUser(id: string): User | undefined {
    seed();
    return s.users.get(id);
  },
  updateUser(id: string, patch: Partial<Pick<User, "displayName" | "kvart">>) {
    const u = s.users.get(id);
    if (!u) return null;
    if (patch.displayName) u.displayName = patch.displayName;
    if (patch.kvart !== undefined) u.kvart = patch.kvart;
    return u;
  },

  // events
  listEvents(): Event[] {
    seed();
    return [...s.events.values()].sort((a, b) =>
      a.startsAt.localeCompare(b.startsAt)
    );
  },
  getEvent(id: string): Event | undefined {
    seed();
    return s.events.get(id);
  },
  createEvent(input: Omit<Event, "id" | "rsvps">): Event {
    const e: Event = { ...input, id: cryptoId(), rsvps: [] };
    s.events.set(e.id, e);
    return e;
  },
  toggleRsvp(eventId: string, userId: string): Event | null {
    const e = s.events.get(eventId);
    if (!e) return null;
    const i = e.rsvps.indexOf(userId);
    if (i >= 0) e.rsvps.splice(i, 1);
    else e.rsvps.push(userId);
    return e;
  },

  // scores
  recordScore(input: Omit<Score, "id" | "createdAt">): Score {
    const sc: Score = {
      ...input,
      id: cryptoId(),
      createdAt: new Date().toISOString(),
    };
    s.scores.push(sc);
    return sc;
  },
  listScores(): Score[] {
    seed();
    return [...s.scores].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  // matches
  saveMatch(m: BriskulaMatch) {
    s.matches.set(m.id, m);
  },
  getMatch(id: string): BriskulaMatch | undefined {
    return s.matches.get(id);
  },
};
