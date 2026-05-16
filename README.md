# Beach Worth Going · Split

Live conditions for the 16 monitored bathing beaches of Split, Croatia. Sea water
quality, sea temperature, wind, waves and live webcam crowd estimation, combined
into a single 0–100 **Splash Score** so you can pick the right beach right now.

Built for the SheepAI Summer 2026 challenge (T3 concept). See
`T3_BeachWorthGoing_Feasibility.md` for the data-source audit that this
implementation is based on.

## Stack
- **Backend:** FastAPI + httpx, async aggregator over five public data sources.
- **Vision:** ultralytics YOLOv8n (optional). Falls back to a time-of-day
  heuristic when the model isn't installed.
- **Frontend:** Next.js 15 (App Router) + Tailwind + react-leaflet.

## Data sources (all public, no auth)
| What | Where |
|------|-------|
| Bathing-water quality (per beach, current season) | IZOR / Ministry of Economy & Sustainable Development — `vrtlac.izor.hr/ords/kakvoca/kakvoce_sve_json` |
| Sea-surface temperature, live | DHMZ — `vrijeme.hr/more_n.xml` (Split station, 6 daily slots) |
| Sea-surface temperature, model | Open-Meteo Marine — `marine-api.open-meteo.com/v1/marine` |
| Wave height/direction/period, 7-day | Open-Meteo Marine |
| Air temp, wind, UV, 7-day | Open-Meteo Forecast — `api.open-meteo.com/v1/forecast` |
| Webcam JPGs | WhatsUpCams CDN — `cdn.whatsupcams.com/snapshot/hr_*.jpg` |

## Running locally

### 1. Backend (port 8000)

```powershell
cd backend
py -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe run.py
```

Endpoints:
- `GET /api/health`
- `GET /api/beaches` — current conditions + ranked list (Splash Score desc)
- `GET /api/beaches/{slug}` — single beach + 7-day forecast
- `POST /api/alerts` — `{ "email": "...", "criteria": { ... } }`, appended to `backend/data/alerts.jsonl`

### 2. Frontend (port 3000)

```powershell
cd frontend
npm install
npm run dev
```

Override the backend URL via `NEXT_PUBLIC_API_URL` if needed (defaults to
`http://127.0.0.1:8000`).

### Optional: enable real YOLOv8 crowd counting

```powershell
cd backend
.venv\Scripts\python.exe -m pip install ultralytics opencv-python-headless pillow numpy
```

The first request triggers a ~6 MB download of `yolov8n.pt`. Falls back to a
time-of-day heuristic if any vision dependency is missing — handy on Python
3.14 where some torch wheels lag.

## Splash Score (composite, 0–100)

| Weight | Component | Source |
|-------:|-----------|--------|
| 40% | Crowd (inverted — emptier wins) | Webcam YOLO headcount, normalized |
| 30% | Water quality | IZOR bathing assessment class |
| 15% | Temperature comfort | Sea (DHMZ if available, else Open-Meteo) + air |
| 15% | Wind & wave penalty | Open-Meteo (current wind + wave height) |

Closed beaches (Žnjan park is under renovation through 2026) are forced to score 0
and surfaced last with a "Closed for renovation" headline.

## Project layout

```
backend/
  app/
    main.py            FastAPI app (3 routes + health)
    beaches.py         16-entry static registry from IZOR probe (lat/lng, station ID, webcam URL, vibe tags)
    scoring.py         Splash Score composite + plain-English headline
    cache.py           Tiny in-process TTL cache
    alerts.py          JSONL append-only sink for the alert form
    sources/
      water_quality.py IZOR JSON
      sea_temp.py      DHMZ XML
      weather.py       Open-Meteo Forecast (named winds: Bura/Jugo/Maestral/Lebić)
      marine.py        Open-Meteo Marine
      webcams.py       JPG fetcher with 60s cache
    vision/
      crowd.py         YOLOv8n person counter; heuristic fallback
  run.py
  requirements.txt

frontend/
  app/
    page.tsx           Map + cards + hero + filter + alert form
    layout.tsx
    globals.css        Tailwind + Leaflet theme (dark coastal palette)
    lib/
      api.ts           Backend client + scoreTier()
      types.ts
    components/
      BeachMap.tsx     react-leaflet (CARTO dark tiles, custom pulsing markers)
      BeachCard.tsx    Per-beach card with live webcam thumb
      HeroPanel.tsx    "Right now in Split" panel
      FilterBar.tsx    Vibe filter chips (family / quiet / shaded / etc.)
      AlertForm.tsx
      SplashBadge.tsx
      WebcamFrame.tsx  60s auto-refresh JPG
```

## Demo arc (5 min)

1. **Problem (30s)** — 30 °C August, you want to swim with your kid. Google gets you nothing real-time. You drive to Bačvice. It's a wall of people. Parking is impossible. You can't tell if the water is clean.
2. **Map (60s)** — open the app. Splash-score badges over all 16 beaches. Top-ranked beach is highlighted. Show live webcam thumbs side-by-side for Bačvice vs Kašjuni.
3. **Recommend (60s)** — flip filter to "Family / quiet" — the recommendation rerouts to Bene or Ježinac. Bura today? The headline calls it out and ranks sheltered beaches higher.
4. **Why now (60s)** — Croatia has the cleanest sea in Europe (99% excellent). The Ministry already publishes this. No tourist or local knows where to look. We made it actionable.
5. **Path to v1 (60s)** — TZ Split partnership (overtourism is their stated KPI), B2B for beach clubs, premium alerts for residents.

## What's stubbed vs live

| Feature | Status |
|---------|--------|
| All five primary data sources | ✅ Live (probed and verified 2026-05-16) |
| YOLOv8 crowd vision | Falls back to heuristic if `ultralytics` not installed |
| Email alert form | ✅ Saves to `backend/data/alerts.jsonl`. Sending emails (Resend/Postmark) is out of scope for v0 |
| Parking / Google popular_times | ⏳ Deferred per feasibility doc — no public API for Split Parking, OSM Overpass + scraper is v1 work |

## Attribution

- Bathing-water data: Croatian Ministry of Economy and Sustainable Development (Hrvatske vode / IZOR).
- Sea temperature: Državni hidrometeorološki zavod (DHMZ — meteo.hr).
- Weather + wave forecast: Open-Meteo (CC BY 4.0).
- Webcam frames: WhatsUpCams.
- Base map tiles: OpenStreetMap contributors, rendered by CARTO.
