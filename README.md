# Riva — igre Splita (hackathon prototype)

Platform for Split's traditional games: briškula, trešeta, mora, picigin, balote, pljočkanje. AI tutors that speak čakavski/Croatian/English, a Split map of in-person events, and a city leaderboard.

This branch implements the **Horizon A** scope from `implementation-plan.md` — a single live demo of every pillar with the minimum scope per pillar. No auth, no TTS, no extra games.

## What's wired up

- **Landing** — concept, three CTAs.
- **Briškula vs Dida Frane** — `/play/briskula`. Full Triestine deck, real rules, deliberately friendly bot.
- **Tutor chat** — Dida Frane (čakavski), Profesor Ćiro (hrvatski), Tony (English), streaming via Anthropic Sonnet 4.6.
- **Mora · multimodal** — `/mora`. Keyboard 0–5 + 2–10 always available; optional webcam tile and Web Speech API (hr-HR). Server adjudicates, Dida Frane comments in čakavski.
- **Events map** — `/events`. MapLibre + OSM tiles, seeded events across Split's kvarts, filter chips, click-on-map "Create event" form.
- **Leaderboard** — `/leaderboard`. Day/week/month/all-time, per-game, seeded with 8 Splićani.
- **Guest identity** — first-visit modal asks for display name + kvart, signs an iron-session cookie.

## Local dev

```
cp .env.example .env.local
# fill in ANTHROPIC_API_KEY and any 32+ char SESSION_SECRET
npm install
npm run dev
```

## Deploy

Auto-deploys on Vercel for any push to this branch when the project is linked to Next.js. Required env vars on Vercel:

- `ANTHROPIC_API_KEY` — for the tutor + mora commentary
- `SESSION_SECRET` — 32+ random bytes

The app uses an in-memory store (`lib/store.ts`) keyed on `globalThis`. State survives within a single function instance — fine for the demo, replaced by Prisma+Neon in Phase 1.

## What's *not* here

Per Horizon A scope, on purpose:

- No auth (guest cookies only)
- No TTS (text chat only)
- No additional games (trešeta, bela, etc. — Phase 2)
- No persistent DB (in-memory store + seed)
- No Pusher / realtime (single-player vs bot path doesn't need it)

See `implementation-plan.md` for the full Horizon B roadmap.
