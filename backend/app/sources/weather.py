"""Open-Meteo Forecast API — air temp, wind speed/direction, humidity, 7-day hourly."""

from __future__ import annotations

import httpx

from ..cache import cache

FORECAST_URL = "https://api.open-meteo.com/v1/forecast"


# direction in degrees -> Adriatic wind name
def name_wind(deg: float, speed_kmh: float) -> str:
    if speed_kmh < 5:
        return "Calm"
    # primary Adriatic winds (clockwise from north)
    if 315 <= deg or deg < 45:
        return "Bura" if speed_kmh > 25 else "NE breeze"  # actually N/NE
    if 45 <= deg < 90:
        return "Levant"
    if 90 <= deg < 180:
        return "Jugo" if speed_kmh > 20 else "SE breeze"
    if 180 <= deg < 270:
        return "Lebić" if speed_kmh > 25 else "S/SW breeze"
    return "Maestral" if 12 <= speed_kmh <= 28 else "NW breeze"


async def fetch_split(lat: float = 43.5081, lng: float = 16.4402) -> dict:
    key = f"forecast:{lat:.3f},{lng:.3f}"
    cached = cache.get(key)
    if cached is not None:
        return cached
    params = {
        "latitude": lat,
        "longitude": lng,
        "current": "temperature_2m,wind_speed_10m,wind_direction_10m,relative_humidity_2m,uv_index,cloud_cover,precipitation",
        "hourly": "temperature_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,uv_index",
        "daily": "temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum,uv_index_max",
        "forecast_days": 7,
        "timezone": "Europe/Zagreb",
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.get(FORECAST_URL, params=params)
        r.raise_for_status()
        data = r.json()
    cur = data.get("current", {})
    wind_speed = cur.get("wind_speed_10m") or 0.0
    wind_dir = cur.get("wind_direction_10m") or 0.0
    out = {
        "air_temp_c": cur.get("temperature_2m"),
        "wind_speed_kmh": wind_speed,
        "wind_direction_deg": wind_dir,
        "wind_name": name_wind(wind_dir, wind_speed),
        "humidity_pct": cur.get("relative_humidity_2m"),
        "uv_index": cur.get("uv_index"),
        "cloud_cover_pct": cur.get("cloud_cover"),
        "precipitation_mm": cur.get("precipitation"),
        "as_of": cur.get("time"),
        "hourly": data.get("hourly"),
        "daily": data.get("daily"),
    }
    cache.set(key, out, ttl=600)
    return out
