"""FastAPI entry. One main /api/beaches route + /api/beaches/{slug} detail + /api/alerts."""

from __future__ import annotations

import asyncio
import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from . import alerts
from .beaches import BEACHES, BY_SLUG, Beach
from .scoring import headline, splash_score
from .sources import marine, sea_temp, water_quality, weather, webcams
from .vision.crowd import CrowdEstimate, estimate_from_jpg

app = FastAPI(title="Beach Worth Going · Split", version="0.1.0")

_cors = os.getenv("CORS_ORIGINS", "*").strip()
_origins: list[str] = ["*"] if _cors == "*" else [o.strip() for o in _cors.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AlertIn(BaseModel):
    email: str
    criteria: dict[str, Any] = {}


async def _crowd_for(beach: Beach) -> CrowdEstimate:
    is_renovation = "renovation" in beach.vibe
    jpg: bytes | None = None
    if beach.webcam_url and not is_renovation:
        jpg = await webcams.fetch_snapshot(beach.webcam_url)
    elif beach.webcam_url and is_renovation:
        jpg = None  # don't bother fetching; we mark closed
    return estimate_from_jpg(
        jpg, is_renovation=is_renovation, popularity=beach.popularity
    )


async def _summary_for(
    beach: Beach,
    wx: dict,
    mar: dict,
    sea_split: dict | None,
) -> dict:
    water = await water_quality.for_station(beach.izor_station)
    crowd = await _crowd_for(beach)
    water_class = (water or {}).get("class", "unknown")

    # Prefer DHMZ Split temp (official, less smoothed); fall back to Open-Meteo marine.
    sea_temp_c = None
    sea_temp_source = None
    if sea_split and sea_split.get("latest_c") is not None:
        sea_temp_c = sea_split["latest_c"]
        sea_temp_source = f"DHMZ Split @ {sea_split.get('latest_hour'):02d}:00"
    elif mar.get("sea_temp_c") is not None:
        sea_temp_c = mar["sea_temp_c"]
        sea_temp_source = "Open-Meteo marine model"

    breakdown = splash_score(
        crowd_score_0_10=crowd.score,
        water_class=water_class,
        sea_temp_c=sea_temp_c,
        air_temp_c=wx.get("air_temp_c"),
        wind_kmh=wx.get("wind_speed_kmh"),
        wave_m=mar.get("wave_height_m"),
        wind_dir_deg=wx.get("wind_direction_deg"),
        exposure_deg=beach.exposure_deg,
    )

    is_closed = crowd.method == "renovation"
    splash = 0 if is_closed else breakdown.score
    if is_closed:
        line = "Closed for renovation — pick another beach"
    else:
        line = headline(
            splash=splash,
            wind_name=wx.get("wind_name", ""),
            water_class=water_class,
            crowd_label=crowd.label,
        )

    return {
        "slug": beach.slug,
        "name": beach.name,
        "lat": beach.lat,
        "lng": beach.lng,
        "vibe": list(beach.vibe),
        "webcam": (
            {"url": beach.webcam_url, "label": beach.webcam_label}
            if beach.webcam_url
            else None
        ),
        "splash_score": splash,
        "headline": line,
        "is_closed": is_closed,
        "crowd": {
            "score_0_10": round(crowd.score, 1),
            "label": crowd.label,
            "people_count": crowd.people_count,
            "method": crowd.method,
            "note": crowd.note,
        },
        "water": water,
        "sea_temp_c": sea_temp_c,
        "sea_temp_source": sea_temp_source,
        "wave_height_m": mar.get("wave_height_m"),
        "subscores": {
            "crowd": breakdown.crowd_sub,
            "water": breakdown.water_sub,
            "temp": breakdown.temp_sub,
            "wind_wave": breakdown.wind_wave_sub,
        },
    }


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok", "beaches": len(BEACHES)}


@app.get("/api/beaches")
async def list_beaches() -> dict:
    wx, mar, sea_all = await asyncio.gather(
        weather.fetch_split(),
        marine.fetch_split(),
        sea_temp.fetch_all(),
    )
    sea_split = sea_all.get("Split")
    summaries = await asyncio.gather(*[_summary_for(b, wx, mar, sea_split) for b in BEACHES])
    sorted_summaries = sorted(summaries, key=lambda s: s["splash_score"], reverse=True)
    return {
        "now": {
            "air_temp_c": wx.get("air_temp_c"),
            "wind_speed_kmh": wx.get("wind_speed_kmh"),
            "wind_direction_deg": wx.get("wind_direction_deg"),
            "wind_name": wx.get("wind_name"),
            "humidity_pct": wx.get("humidity_pct"),
            "uv_index": wx.get("uv_index"),
            "cloud_cover_pct": wx.get("cloud_cover_pct"),
            "sea_temp_c_dhmz": (sea_split or {}).get("latest_c"),
            "sea_temp_c_model": mar.get("sea_temp_c"),
            "wave_height_m": mar.get("wave_height_m"),
        },
        "beaches": sorted_summaries,
    }


@app.get("/api/beaches/{slug}")
async def beach_detail(slug: str) -> dict:
    beach = BY_SLUG.get(slug)
    if beach is None:
        raise HTTPException(status_code=404, detail=f"Unknown beach: {slug}")
    wx, mar, sea_all = await asyncio.gather(
        weather.fetch_split(),
        marine.fetch_split(),
        sea_temp.fetch_all(),
    )
    sea_split = sea_all.get("Split")
    summary = await _summary_for(beach, wx, mar, sea_split)
    return {
        **summary,
        "forecast": {
            "wind_hourly": (wx.get("hourly") or {}),
            "wave_hourly": (mar.get("hourly") or {}),
            "wind_daily_max": (wx.get("daily") or {}),
            "wave_daily_max": (mar.get("daily") or {}),
        },
    }


@app.post("/api/alerts")
async def create_alert(payload: AlertIn) -> dict:
    if not alerts.valid_email(payload.email):
        raise HTTPException(status_code=400, detail="Invalid email.")
    alerts.save(payload.email, payload.criteria)
    return {"ok": True, "total": alerts.count()}
