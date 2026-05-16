# Implementation Plan — Split Heritage Games Platform

**Codename:** *Riva* (working title for the platform)

**Audience:** Claude Code (to execute), 5-person hackathon team (to coordinate), follow-up mayor pitch (to defend).

**Constraints honestly stated:** 5 people, 4 hours of hackathon time remaining, target Next.js + TypeScript + Postgres, AI scope includes full multimodal mora demo, production-grade aspirations for the City of Split pitch that will happen *after* the hackathon.

Companion files: `brief.md` (the concept + civic case), `game-catalog.md` (the heritage research).

---

## 1. The hard truth about 4 hours

5 people × 4 hours = ~20 person-hours minus 30% coordination tax = ~14 effective hours of build. That is enough to ship one impressive, end-to-end demo — *not* the full vision. So this plan splits cleanly into two horizons:

**Horizon A — Next 4 hours (the demo):** A single live-deployed MVP that demonstrates every pillar of the vision with the absolute minimum scope per pillar. One playable card game online (Briškula). One AI tutor persona (Dida Frane) speaking čakavski in text. A real Split map with seeded events and a working "create event" form. The multimodal mora demo as the hero feature. A leaderboard rendered with seed data. **No auth.** Guest play only — first-time visitors enter a display name, we mint an anonymous user row tied to a cookie. Saves ~3 person-hours and removes the entire email-delivery failure mode during the pitch. Auth is the first thing Phase 1 adds.

**Horizon B — Post-hackathon (the mayor pitch):** Everything else from `brief.md` — more games, multi-persona AI, TTS in čakavski, school mode, diaspora boards, konoba network, payments, accessibility, full GDPR. This plan specs each in enough detail that Claude Code can execute phase-by-phase between the hackathon and the city presentation.

If you remember nothing else from this section: **do not let any of the 5 people start anything outside Horizon A in the next 4 hours.** Discipline here is the difference between a working demo and a half-broken everything.

---

## 2. Architecture overview

### 2.1 Stack (locked)

- **Framework:** Next.js 15 (App Router) + TypeScript, single full-stack repo
- **UI:** Tailwind CSS + shadcn/ui + lucide-react icons
- **DB:** Postgres (Neon serverless for hackathon speed — zero config, free tier, branchable)
- **ORM:** Prisma
- **Auth (Horizon A):** NONE. Anonymous guest users — first visit prompts for `displayName` and optional `kvart`, server creates a `User` row, sets a signed cookie (`riva_uid`). All subsequent requests resolve user via the cookie. Phase 1 swaps this for Auth.js magic-link upgrade flow (the cookie ID can be merged into a real account).
- **Realtime:** Pusher Channels (managed, no server to run) — used for live game state and event RSVP updates. Fallback to polling if Pusher quota is an issue.
- **Maps:** MapLibre GL JS + free OSM/MapTiler tiles (no API key headache, Croatian-language labels available). If a paid Mapbox key is faster, swap in.
- **AI:** Claude API (Sonnet for tutors, Haiku for cheap classifications). `@anthropic-ai/sdk`.
- **Multimodal Mora:**
  - Camera: MediaPipe Hands (in-browser, runs in WASM, counts extended fingers reliably)
  - Microphone: Web Speech API for STT in Croatian (`hr-HR` locale) with Claude doing number-word parsing as fallback
  - TTS: ElevenLabs (Croatian voice) — fall back to Web Speech API synthesis if quota tight
- **Hosting:** Vercel (frontend + API routes) + Neon (DB) + Pusher (realtime). All three have free tiers.
- **State:** Zustand for client UI state, server actions + Prisma for persistence
- **Validation:** Zod everywhere on the boundary

### 2.2 Repo layout

```
riva/
├─ app/
│  ├─ (marketing)/page.tsx              # Landing + guest name prompt
│  ├─ play/
│  │  ├─ page.tsx                       # Game lobby
│  │  └─ briskula/[matchId]/page.tsx    # Live card game
│  ├─ mora/page.tsx                     # Multimodal mora hero demo
│  ├─ events/
│  │  ├─ page.tsx                       # Map of Split + event list
│  │  └─ [eventId]/page.tsx             # Single event + RSVP
│  ├─ leaderboard/page.tsx              # Daily/weekly/all-time
│  ├─ learn/
│  │  └─ [game]/page.tsx                # Tutor chat for one game
│  └─ api/
│     ├─ guest/route.ts                 # POST {displayName, kvart} → sets riva_uid cookie
│     ├─ briskula/                      # Game logic API
│     ├─ tutor/route.ts                 # Claude streaming
│     ├─ mora/route.ts                  # Mora round adjudication
│     └─ events/                        # CRUD
├─ components/
│  ├─ ui/                               # shadcn primitives
│  ├─ cards/                            # Triestine card SVGs + Card component
│  ├─ game/                             # Briskula table, hand, trick, score
│  ├─ map/                              # SplitMap, EventPin, EventForm
│  ├─ tutor/                            # ChatPanel, PersonaPicker
│  └─ mora/                             # CameraView, MicCapture, RoundUI
├─ lib/
│  ├─ briskula/                         # Pure game logic (deal, score, AI)
│  ├─ mora/                             # Finger counting, number parsing
│  ├─ claude.ts                         # SDK wrapper, persona prompts
│  ├─ pusher.ts                         # Client + server channels
│  └─ db.ts                             # Prisma client singleton
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts                           # Seed events + leaderboard data
├─ public/
│  └─ cards/                            # 40 Triestine card SVG assets
└─ .env.example                         # All required keys
```

### 2.3 Database schema (Prisma)

This is the *minimum* schema for the demo. Production additions noted inline as comments.

```prisma
// prisma/schema.prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

model User {
  id            String   @id @default(cuid())
  // Horizon A: no email, no password — anonymous guests resolved by signed cookie.
  // Phase 1 adds: email String? @unique, plus Auth.js Account/Session tables.
  email         String?  @unique
  displayName   String
  kvart         String?  // Split neighborhood: Veli Varoš, Lučac, Manuš, Bačvice, Varoš, other
  preferredLang String   @default("hr") // hr | en | ck (čakavski)
  isDiaspora    Boolean  @default(false)
  city          String?  // for diaspora users
  isGuest       Boolean  @default(true) // flipped to false when user upgrades to a real account in Phase 1
  createdAt     DateTime @default(now())

  matches       MatchPlayer[]
  scores        Score[]
  rsvps         EventRsvp[]
  hostedEvents  Event[] @relation("HostedEvents")
}

model Game {
  id          String   @id // "briskula", "treseta", "mora", "pljockanje", "balote", "picigin"
  name        String
  category    String   // "card" | "voice" | "outdoor" | "beach"
  online      Boolean  // is this playable online in our MVP
  heritage    String?  // "UNESCO" | "HR-national" | null
}

model Match {
  id          String   @id @default(cuid())
  gameId      String
  game        Game     @relation(fields: [gameId], references: [id])
  status      String   // "waiting" | "playing" | "finished"
  startedAt   DateTime @default(now())
  finishedAt  DateTime?
  state       Json     // game-specific state blob
  players     MatchPlayer[]
  scores      Score[]
}

model MatchPlayer {
  id        String  @id @default(cuid())
  matchId   String
  userId    String
  seat      Int     // 0..3
  match     Match   @relation(fields: [matchId], references: [id])
  user      User    @relation(fields: [userId], references: [id])
  @@unique([matchId, seat])
}

model Score {
  id        String   @id @default(cuid())
  userId    String
  gameId    String
  matchId   String?
  points    Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  match     Match?   @relation(fields: [matchId], references: [id])
  @@index([gameId, createdAt])
  @@index([userId, gameId])
}

model Event {
  id          String   @id @default(cuid())
  hostId      String
  host        User     @relation("HostedEvents", fields: [hostId], references: [id])
  gameId      String
  title       String
  description String
  startsAt    DateTime
  // PostGIS would be nicer in production; for MVP use plain floats
  lat         Float
  lng         Float
  locationName String  // "Konoba Matejuška", "Bačvice plaža", etc.
  capacity    Int      @default(8)
  language    String   @default("hr") // hr | en | ck
  createdAt   DateTime @default(now())
  rsvps       EventRsvp[]
  @@index([startsAt])
  @@index([gameId])
}

model EventRsvp {
  id       String @id @default(cuid())
  userId   String
  eventId  String
  user     User   @relation(fields: [userId], references: [id])
  event    Event  @relation(fields: [eventId], references: [id])
  @@unique([userId, eventId])
}

// PRODUCTION ADDITIONS (Horizon B, not for 4-hour build):
// - Konoba/Venue model (partner taverns)
// - School model + ClassMember (school mode)
// - TutorSession model (persisted Claude chats)
// - DialectCorpusEntry model (čakavski training data submissions)
// - Tournament model + TournamentRound (Igre kvarta championship)
```

### 2.4 Key API routes (server actions where possible)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/briskula/match` | Create or join a match (returns matchId + seat) |
| POST | `/api/briskula/play` | Submit a card play; server validates and updates Match.state |
| GET  | `/api/briskula/match/:id` | Poll match state (Pusher pushes the live updates) |
| POST | `/api/tutor` | Stream a tutor response; body `{persona, game, history, userMessage}` |
| POST | `/api/mora/round` | Submit `{fingersThrown, numberShouted}`; server picks AI move, returns `{aiFingers, aiCalled, winner}` |
| GET  | `/api/events` | List events (filter by gameId, dateRange, bbox for map) |
| POST | `/api/events` | Create event (auth required) |
| POST | `/api/events/:id/rsvp` | Toggle RSVP |
| GET  | `/api/leaderboard` | `{window: "day"|"week"|"month"|"year"|"all", gameId?: string}` |

### 2.5 Realtime channels (Pusher)

- `match-{matchId}` — `card-played`, `trick-won`, `match-finished`
- `event-{eventId}` — `rsvp-added`, `rsvp-removed`
- `leaderboard-global` — `score-updated` (rate-limited to once per 10s)

---

## 3. Horizon A — the 4-hour parallel plan

Five tracks, one per person. Each track ends in a *demoable* slice. There's a 30-minute integration window at the end where everyone stops building and assembles the demo flow.

### Track 1 — Platform Shell (Person A — call them the "infra lead")

**Why this track first:** Everyone else is blocked on the shell.

**Deliverables (hour 1):**
- `pnpm dlx create-next-app@latest riva --typescript --tailwind --eslint --app`
- Install: `prisma`, `@prisma/client`, `zod`, `zustand`, `@anthropic-ai/sdk`, `pusher`, `pusher-js`, `maplibre-gl`, `@mediapipe/tasks-vision`, `iron-session` (for signed guest cookies), shadcn-ui CLI bootstrap.
- Provision: Neon DB (free tier), Vercel project linked to GitHub, Pusher Channels app, Anthropic key. (No Resend, no ElevenLabs in Horizon A — both are Phase 1/3.)
- `prisma migrate dev --name init` against the schema above.
- Guest identity: `app/api/guest/route.ts` accepts `{displayName, kvart?}`, creates a `User` row with `isGuest=true`, sets a signed cookie `riva_uid`. All API routes read this cookie via a `getCurrentGuest()` helper in `lib/auth.ts`.
- Landing page asks for display name on first visit (modal); persists across the session.
- Top nav: Riva logo, Igraj (Play), Mora, Događaji (Events), Ljestvica (Leaderboard), display-name chip with "promijeni" action.
- Push to GitHub, Vercel auto-deploys. **Demo URL live by end of hour 1.**

**Deliverables (hours 2–4):** Switches to integration/polish support — landing page hero, theming (Adriatic blues, terracotta accents, klapa-style serif headings), responsive checks, helping any blocked track.

### Track 2 — Briškula Online (Person B — "game logic")

**Why this matters:** This is the proof that the platform can host real online play.

**Hour 1:** Pure logic in `lib/briskula/`. Implement:
- `createDeck()` returning the 40 Triestine cards: suits `["denari","spade","coppe","bastoni"]`, ranks `[1,2,3,4,5,6,7,11,12,13]` (Italian deck — no 8/9/10). Card values for scoring: A=11, 3=10, K=4, Q=3, J=2, rest=0.
- `deal(seed)` → 3 cards each, briscola card flipped, remaining stock.
- `legalPlays(hand, leadSuit, briscolaSuit)` → in briškula you can play anything; this is a no-op for ordinary rules but useful for the dupla variant later.
- `resolveTrick(plays, briscolaSuit)` → returns winner seat + captured cards.
- `scoreHand(captured)` → integer 0..120.
- `botMove(hand, state, level)` → a *deliberately weak* heuristic bot ("Dida Frane the friendly opponent") — plays lowest card unless it can capture a high-value trick. Good enough to demo and lose to the judge.

**Hour 2:** Server actions in `app/api/briskula/`. Match creation, join, play. Persist state to `Match.state` JSON. Emit Pusher events.

**Hour 3:** UI in `app/play/briskula/[matchId]/page.tsx`. Card table with seat layout, your hand fanned, briscola card pinned, trick area in the middle, score top-right. Drag-to-play or click-to-play. Use SVG cards from `public/cards/`.

**Hour 4:** Polish. Single-player vs bot path that requires zero matchmaking. "Play against Dida Frane" button on the lobby. Toast on trick win in čakavski ("Bravo, moj barba!").

**Cut ruthlessly:** 4-player teams, the dupla variant, animations. Ship 1v1-vs-bot first.

### Track 3 — AI Tutor: Dida Frane (Person C — "AI lead")

**Hour 1:** `lib/claude.ts` wrapper around the Anthropic SDK. Streaming responses. System prompt for Dida Frane:

> *You are Dida Frane, a 72-year-old grandfather from Veli Varoš in Split. You teach traditional Dalmatian card games — especially briškula and trešeta — to your grandchildren and to friendly tourists. You speak in splitska čakavština (Split čakavian dialect), warm and a little teasing. Key dialect markers: use "ča" for "what", "moj barba"/"moja sestrice" as affectionate address, "fala" for "thank you", "ajde" frequently, "lipo" for "lijepo". You ALWAYS answer in čakavski unless the user explicitly asks for English or standard Croatian, then you switch. Keep answers under 80 words. Never break character.*

**Hour 2:** `app/api/tutor/route.ts` — streaming endpoint that takes `{persona, gameId, recentMoves?, message}` and returns SSE.

**Hour 3:** `components/tutor/ChatPanel.tsx` — a slide-out panel from the right side of the briškula table. Sticky "Pitaj Didu" button. Renders streamed reply. Show persona avatar + name.

**Hour 4:** Two more *prompts* (not full personas — same UI, swap system prompt): Profesor Ćiro (formal standard Croatian) and Tony (Dalmatian-accented English). Persona picker dropdown.

**Cut ruthlessly:** TTS, voice input, dialect fine-tuning. Text chat is the demo.

**Pitfall to avoid:** Claude doesn't speak natively perfect čakavski. The prompt above keeps it within recognizable territory. Show the audience this is a *demo of the persona pattern*, and the *Marko Uvodić Splićanin* corpus is the production data path.

### Track 4 — Events & Split Map (Person D — "events lead")

**Hour 1:** Install MapLibre. `components/map/SplitMap.tsx` centered on Split (`43.5081, 16.4402`, zoom 13). Tiles from MapTiler free tier or OSM. Add custom markers per game category (card icon, ball icon, beach icon).

**Hour 2:** `app/events/page.tsx` — split layout: map on the left, scrollable event list on the right. Filter chips at the top: Sve, Briškula, Trešeta, Picigin, Balote, Pljočkanje. Click event → highlights pin and pans map.

**Hour 3:** Seed `prisma/seed.ts` with 15–20 realistic events across Split: briškula nights at Konoba Matejuška, Konoba Varoš, Konoba Bajamonti; picigin meetups at Bačvice and Žnjan; balote afternoons at Marjan and Trstenik; trešeta tournaments in Veli Varoš. Real coordinates (look them up). Spread over the next 14 days.

**Hour 4:** Event creation form: `app/events/[eventId]/page.tsx` for detail page and `components/map/EventForm.tsx` with click-on-map to set coordinates, Zod-validated form fields. RSVP button with optimistic update via Pusher. The judge should be able to create an event live during the demo.

**Cut ruthlessly:** Geocoding from text addresses (click on map only), recurring events, host verification, photo uploads.

### Track 5 — Multimodal Mora (Person E — "the hero demo")

**This is the committed hero feature.** Person E spends all 4 hours here. *But* — keep a graceful-degradation path always wired up so the demo can't break on stage. The pattern: every multimodal input also accepts a keyboard fallback that's permanently in the DOM and styled minimally. If the camera dies mid-demo, click-to-throw still works. Test the keyboard path explicitly in the integration window.

**Hour 1:** Sandbox a vanilla page at `app/mora/sandbox/page.tsx`. Install `@mediapipe/tasks-vision`. Get hand-landmark detection working from webcam → count extended fingers (0–5) in real time. Render finger count on screen. Wire keyboard fallback (0/1/2/3/4/5 keys) in parallel as a safety net.

**Hour 2:** Microphone input via Web Speech API in Croatian (`hr-HR`). Parse spoken numbers `dva..deset`. Fallback: a text input pre-filled with "dva" the user can click to submit.

**Hour 3:** Round logic in `lib/mora/`:
- User submits `{fingers: 0..5, called: 2..10}`
- Server picks AI fingers 0..5 with mild strategy (slightly bias toward 2–3), and AI called number close to plausible totals
- Round outcome: someone matches sum → wins point; otherwise tie
- First to 5 wins the set
- Server commentary in čakavski via Claude: "Uhvatija sam te, moj barba!"

**Hour 4:** Polish UI. Big camera tile on the left showing your hand outline. Big mic indicator on the right. AI persona on the right side throwing fingers with an emoji-hand animation. Sound effect on point. **This is the moment that wins the pitch — give it visual love.**

### Integration window — final 30 minutes

Everyone stops new work. Build the 5-minute demo:

1. **0:00–0:30** — landing page, the elevator pitch
2. **0:30–1:30** — open Events, show map, judge creates an event live
3. **1:30–3:00** — play briškula vs Dida Frane, open the chat panel mid-game, ask "kako da odigram?", Dida answers in čakavski
4. **3:00–4:30** — open Mora, run one round multimodally (the hero moment)
5. **4:30–5:00** — show leaderboard with seed data, close on the slide that says "Split. The platform for our games."

### Risk register (Horizon A only)

- **MediaPipe doesn't load on demo laptop browser.** Mitigation: pre-test on the actual demo machine before the integration window. Fall back to keyboard finger input.
- **Anthropic API rate limit during demo.** Mitigation: pre-cache 6–8 tutor responses for the canonical questions the demo will ask; serve from cache if API fails.
- **Pusher quota exceeded.** Mitigation: poll every 2 seconds as fallback. Single-player vs bot doesn't need Pusher anyway — keep that path on the demo critical path.
- **Vercel cold start ruins first impression.** Mitigation: hit the demo URL 30 seconds before presenting; keep a tab open through the pitch.
- **The guest cookie path silently fails.** Mitigation: render a "you are: {displayName}" chip in the nav so any cookie loss is visible instantly during testing. Seed three guest users (Frane, Ante, Marija) so the leaderboard isn't empty.

---

## 4. Horizon B — the production-grade roadmap (post-hackathon)

**Mayor pitch window: 4 weeks from hackathon end.** That makes Phases 1–3 below mandatory and Phases 4–6 stretch goals. Phases 7–8 are post-pitch. Each phase is a Claude Code-ready work package; ship sequentially.

### Phase 1 — Production hardening + real auth (1 week — MANDATORY)

1. **Auth & accounts (the deferred Horizon A piece).** Add Auth.js (NextAuth v5) magic-link via Resend, plus Google sign-in. Build the "upgrade guest to real account" flow: existing guest cookie `riva_uid` is merged into the new authenticated user, preserving match history and event RSVPs. GDPR consent banner. Account deletion flow. Profile edit (display name, kvart, diaspora city, preferred language). Persisted preferred language drives all tutor and UI defaults.
2. **Database.** Move from in-memory match state to durable Match.state with optimistic concurrency. Add migrations for production. Use Neon branching for preview environments.
3. **Observability.** Sentry for errors, Axiom for logs, simple uptime ping on the demo URL. Anthropic + Pusher + ElevenLabs usage dashboards.
4. **Accessibility.** Keyboard navigation across the briškula table, screen-reader labels on cards (`Coppe Asso, 11 punata`), focus rings, color-contrast pass. This is non-negotiable for a civic pitch.
5. **i18n.** `next-intl`. Three locales: `hr` (default), `en`, `ck` (čakavski). Translation files for UI shell; tutor stays Claude-driven.

### Phase 2 — Game catalog expansion (2 weeks — MANDATORY)

Implement in this order — easiest first, each one builds on the briškula engine:

1. **Trešeta** — same Triestine deck, point-counting differs (cards 1=1, 2=1/3, 3=1/3, K=1/3, Q=1/3, J=1/3, accusi for runs). Render the *tučem* and *strišo* heritage signals as named gesture buttons next to the play action — judges will remember the detail. Game played to 41 points.
2. **Bela** — 32-card deck, different art, partnership trick-taking. Major UX is the bidding phase.
3. **Karambol (card variant)** — verify rules with a Splićanin first; if the disc-board variant is more recognizable, switch.
4. **Pljočkanje** — physics-based casual game with three.js or matter.js. Throw a flat stone, scoring by proximity to lek. Mobile-friendly tilt-throw.

For each: pure logic in `lib/{game}/`, server endpoints under `app/api/{game}/`, table UI under `app/play/{game}/`, Dida Frane tutor prompts customized per game.

**Mora** is already in MVP — extend it: multi-round sets, online play between two humans (camera+mic feeds across Pusher), record rounds for highlights reel.

### Phase 3 — Voice & dialect (1 week within the 4-week budget — MANDATORY, scope-cut)

In the 4-week window you can't fully commission a real Splićanin voice clone for Dida Frane. Compromise:

1. **TTS for tutors (Ćiro and Tony only).** ElevenLabs voices for standard Croatian (Profesor Ćiro) and English (Tony). Skip Dida Frane's voice for the pitch — keep him text-only and explain to the mayor's office that a real Splićanin voice clone is the *exact ask* of the proposed partnership with the Marko Uvodić Splićanin Association. This is a stronger pitch than a fake čakavski TTS.
2. **Voice input on tutors.** "Press to speak" button in the chat panel, Web Speech API STT in Croatian.
3. **Dialect corpus skeleton.** A simple form: "Submit a čakavski word or phrase with its meaning, recorded audio optional." Even with 50 seed entries from public čakavski sources, it tells the story.

### Phase 4 — Event organizing depth (1 week — STRETCH within 4-week window)

1. **Konoba / Venue model.** Verified partner taverns with photos, opening hours, contact, "this place hosts briškula on Tuesdays" recurring events.
2. **"Looking for a fourth" quick-match.** A user post: "Want trešeta tonight, 19:00, near Riva, 4 players, čakavski preferred." Auto-match into a meet-up at a nearby partner konoba.
3. **Recurring events** + iCal export.
4. **Tourist exchange marketplace.** Splićani list paid micro-experiences ("Balote afternoon with locals, €20, 2h"). Stripe Connect payments split — 90% to host, 10% platform. GDPR + Croatian invoicing compliance.

### Phase 5 — Leaderboards as civic infrastructure (1 week — STRETCH or post-pitch)

1. **Per-kvart rivalries.** Veli Varoš vs Lučac vs Manuš vs Bačvice vs Varoš boards.
2. **Konoba boards.** "Best briškula at Konoba Matejuška." Konoba opt-in.
3. **Diaspora boards.** Split, Toronto, Buenos Aires, Pittsburgh, Sydney, Melbourne. Diaspora users set their city in profile.
4. **Hajduk seasonal skins.** Requires permission; sketch the partnership pitch first.

### Phase 6 — Heritage events integration (2 weeks — POST-PITCH, but mention in pitch deck)

1. **Sinjska Alka companion.** Live ring-strike tracker for the first Sunday of August. Coordinate with the Viteško alkarsko društvo. Multi-language ritual explainer.
2. **Picigin World Championship hub.** Annual Bačvice event registration, bracket, livestream embed. Coordinate with the existing organizers.
3. **Povratak igri integration.** Pull the Split-Dalmatia County Tourist Board + Kinesiology Faculty calendar; users sign up through the platform; offer the digital layer the program currently lacks.

### Phase 7 — School mode (2 weeks — POST-PITCH)

1. **Teacher/class accounts.** A teacher creates a class, generates student join codes (no student emails required; minor-safe).
2. **Curriculum pack.** Briškula + trešeta lessons aligned with primary school cultural curriculum, all in čakavski.
3. **Class vs class tournaments.** Teacher dashboard.
4. **Pilot:** one Split primary school. The Čakavski Sabor will introduce.

### Phase 8 — Polish and pitch-readiness (1 week — INSERT BEFORE PITCH, week 4)

1. **Klapa audio identity.** Sourced from a real Split klapa. Victory jingles, login chime, ambient menu loop.
2. **Local-artist Triestine deck.** Commission one signature deck; sell on the platform.
3. **AR overlay at Bačvice.** WebXR proof-of-concept showing famous picigin moves on real beach scene.
4. **Press kit.** One-pager for the mayor's office, demo video, sponsor deck, financial model.

---

## 5. Locked decisions and remaining questions

### Locked (you already answered)

- **Domain:** `*.vercel.app` for the hackathon. Purchase a real domain only before the mayor pitch (recommend `igreriva.hr` if `riva.hr` is taken — check Saturday morning of week 4).
- **Mora demo:** committed as hero. All 4 hours of Person E. Keyboard fallback wired in parallel as safety net, not as plan B.
- **Auth in MVP:** none. Guest cookie pattern. Real auth lands in Phase 1.
- **Mayor pitch timeline:** 4 weeks. Phases 1–3 mandatory, 4–5 stretch, 6–8 post-pitch.

### Still open — answer before Claude Code handoff

1. **Branding palette.** Default proposal: Adriatic blue (`#1e6091`) + terracotta (`#c1502e`) + warm sand (`#f4ead5`) + Cormorant Garamond serif headings + system sans body. Veto if different.
2. **Card art.** Use a public-domain Triestine deck (Wikimedia Commons has SVGs) for the demo. Commission a Split-artist deck in Phase 8. Confirm public-domain deck OK for Track 2.
3. **Seed users for the leaderboard.** Recommend 8 — Frane, Ante, Šime, Jure, Mate, Marija, Ana, Iva — split across Split kvarts. Approve or adjust.
4. **Are the 5 of you sticking with this past the hackathon?** Critical. If yes, Phase 1 starts Monday. If no, the mayor pitch needs a different team or a handoff partner identified before week 1.
5. **Whose voice would be Dida Frane in production?** Even though Phase 3 leaves him text-only, you'll want to *name* a real Splićanin voice donor candidate in the mayor pitch (Marko Uvodić Splićanin Association is the natural intro). Decide who you'll ask before week 3.
6. **Hajduk partnership ask.** Anyone on the team know someone at the club? Even an aspirational mention in the pitch deck is fine, but a name is stronger.
7. **Data minimization commitments.** Lock now what you will NOT collect: no voice recordings stored without consent, no minor data without school authorization, no diaspora user data sold. Write this into the privacy policy in Phase 1.
8. **Pusher quota.** Free tier is 200k messages/day, 100 concurrent. Enough for the demo and pilot, not enough for a Split-wide launch. Budget includes a $49/mo Pusher tier from week 5.

---

## 6. Handoff checklist for Claude Code

When you hand this off, give Claude Code:

- This file (`implementation-plan.md`)
- The concept brief (`brief.md`)
- The game catalog (`game-catalog.md`)
- Your answers to the 8 remaining open questions above
- The minimum `.env` values for Horizon A: `DATABASE_URL` (Neon), `ANTHROPIC_API_KEY`, `PUSHER_APP_ID`/`KEY`/`SECRET`/`CLUSTER`, `SESSION_SECRET` (any 32-byte random string for iron-session). Resend and ElevenLabs keys are Phase 1 / Phase 3 — don't provision them yet.
- Explicit instruction: "Build Horizon A only. Stop at the integration window. Do not start Phase 1 until I say so. Do NOT add auth, do NOT add TTS, do NOT add more games."

Tell Claude Code to scaffold Track 1 first and not parallelize until the platform shell builds and deploys to Vercel. The other four tracks can then go truly in parallel.

Good luck. Sritno.
