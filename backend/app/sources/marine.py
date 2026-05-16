"""Open-Meteo Marine API — wave height/direction/period + sea-surface temperature."""

from __future__ import annotations

import httpx

from ..cache import cache

MARINE_URL = "https://marine-api.open-meteo.com/v1/marine"


async def fetch_split(lat: float = 43.50, lng: float = 16.42) -> dict:
    key = f"marine:{lat:.3f},{lng:.3f}"
    cached = cache.get(key)
    if cached is not None:
        return cached
    params = {
        "latitude": lat,
        "longitude": lng,
        "current": "sea_surface_temperature,wave_height,wave_period,wave_direction",
        "hourly": "wave_height,wave_direction,wave_period,sea_surface_temperature",
        "daily": "wave_height_max,wave_period_max",
        "forecast_days": 7,
        "timezone": "Europe/Zagreb",
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.get(MARINE_URL, params=params)
        r.raise_for_status()
        data = r.json()
    cur = data.get("current", {})
    out = {
        "sea_temp_c": cur.get("sea_surface_temperature"),
        "wave_height_m": cur.get("wave_height"),
        "wave_period_s": cur.get("wave_period"),
        "wave_direction_deg": cur.get("wave_direction"),
        "as_of": cur.get("time"),
        "hourly": data.get("hourly"),
        "daily": data.get("daily"),
    }
    cache.set(key, out, ttl=900)
    return out
