"""IZOR bathing-water quality JSON.

Endpoint returns all ~1144 Croatian monitored sites; we filter for Split.
Quality code `lbri`: 40=EXCELLENT, 30=GOOD, 20=SUFFICIENT, 10=POOR.
Sub-codes (28, 32, etc.) are mid-cycle assessments — bucket by tens digit."""

from __future__ import annotations

import httpx

from ..cache import cache

IZOR_URL = (
    "https://vrtlac.izor.hr/ords/kakvoca/kakvoce_sve_json"
    "?p_jezik=en&p_god=&p_ciklus="
)

QUALITY_LABELS = {
    "excellent": ("Excellent", "#0ea5e9"),
    "good": ("Good", "#22c55e"),
    "sufficient": ("Sufficient", "#eab308"),
    "poor": ("Poor", "#ef4444"),
    "unknown": ("Unknown", "#94a3b8"),
}


def classify(lbri: int | None) -> str:
    if lbri is None:
        return "unknown"
    bucket = (lbri // 10) * 10
    return {
        40: "excellent",
        30: "good",
        20: "sufficient",
        10: "poor",
    }.get(bucket, "unknown")


async def fetch_all() -> dict[int, dict]:
    """Returns {station_id -> {lbri, lkad, lpla, lat, lng}} for Split sites."""
    cached = cache.get("izor:split")
    if cached is not None:
        return cached
    async with httpx.AsyncClient(timeout=20.0) as client:
        r = await client.get(IZOR_URL)
        r.raise_for_status()
        data = r.json()
    by_station: dict[int, dict] = {}
    for m in data.get("markers", []):
        if m.get("lgrad") != "Split":
            continue
        lsta = m.get("lsta")
        if not isinstance(lsta, int):
            continue
        by_station[lsta] = {
            "lbri": m.get("lbri"),
            "lkad": m.get("lkad"),
            "lpla": m.get("lpla"),
            "lat": m.get("lat"),
            "lng": m.get("lng"),
        }
    cache.set("izor:split", by_station, ttl=3600)  # bathing data refreshes every 2 weeks
    return by_station


async def for_station(station_id: int) -> dict | None:
    all_data = await fetch_all()
    raw = all_data.get(station_id)
    if raw is None:
        return None
    cls = classify(raw.get("lbri"))
    label, color = QUALITY_LABELS[cls]
    return {
        "class": cls,
        "label": label,
        "color": color,
        "raw_code": raw.get("lbri"),
        "season": raw.get("lkad"),
    }
