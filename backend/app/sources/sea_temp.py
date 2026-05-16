"""DHMZ sea-temperature XML (https://vrijeme.hr/more_n.xml).

XML structure: <Temperature_mora><Podatci><Postaja>Split</Postaja>
                <Termin>17.0</Termin> ... six time slots: 07,08,11,14,15,17.
Empty <Termin/> means no reading at that slot; '-' means station offline."""

from __future__ import annotations

import xml.etree.ElementTree as ET

import httpx

from ..cache import cache

DHMZ_URL = "https://vrijeme.hr/more_n.xml"
SLOT_HOURS = [7, 8, 11, 14, 15, 17]


def _parse_value(text: str | None) -> float | None:
    if text is None:
        return None
    text = text.strip()
    if not text or text == "-":
        return None
    try:
        return float(text)
    except ValueError:
        return None


async def fetch_all() -> dict[str, dict]:
    """Returns {station_name -> {latest, latest_hour, all_slots}}."""
    cached = cache.get("dhmz:stations")
    if cached is not None:
        return cached
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.get(DHMZ_URL)
        r.raise_for_status()
        xml_text = r.text
    root = ET.fromstring(xml_text)
    out: dict[str, dict] = {}
    for podatci in root.findall("Podatci"):
        postaja = podatci.find("Postaja")
        if postaja is None or postaja.text is None:
            continue
        name = postaja.text.strip()
        if name.startswith("Postaja"):  # header row
            continue
        termini = podatci.findall("Termin")
        readings: list[tuple[int, float]] = []
        for i, t in enumerate(termini):
            v = _parse_value(t.text)
            if v is not None and i < len(SLOT_HOURS):
                readings.append((SLOT_HOURS[i], v))
        latest = readings[-1] if readings else None
        out[name] = {
            "latest_c": latest[1] if latest else None,
            "latest_hour": latest[0] if latest else None,
            "slots": readings,
        }
    cache.set("dhmz:stations", out, ttl=600)
    return out


async def split_temperature() -> dict | None:
    stations = await fetch_all()
    return stations.get("Split")
