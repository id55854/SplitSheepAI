"""Static registry of Split beaches, derived from the IZOR bathing-water portal
(16 official monitored sites) plus extra metadata (webcam URLs, vibe tags).

Refreshed against https://vrtlac.izor.hr/ords/kakvoca/kakvoce_sve_json on 2026-05-16."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class Beach:
    slug: str               # url-safe id
    name: str               # display name (native HR)
    izor_station: int       # lsta in IZOR JSON
    lat: float
    lng: float
    webcam_url: Optional[str] = None  # WhatsUpCams snapshot JPG, if available
    webcam_label: Optional[str] = None  # short note ("under renovation 2025-26")
    vibe: tuple[str, ...] = ()  # filter tags: family, quiet, party, shaded, snorkel, sandy, pebble


BEACHES: tuple[Beach, ...] = (
    Beach(
        slug="bacvice-ulaz",
        name="Bačvice (main)",
        izor_station=2050,
        lat=43.50224,
        lng=16.44769,
        webcam_url="https://cdn.whatsupcams.com/snapshot/hr_splitbacvice01.jpg",
        webcam_label="Bačvice main entrance",
        vibe=("sandy", "family", "party", "central"),
    ),
    Beach(
        slug="bacvice-zapad",
        name="Bačvice – west",
        izor_station=2049,
        lat=43.50060,
        lng=16.44607,
        vibe=("sandy", "family", "central"),
    ),
    Beach(
        slug="bacvice-istok",
        name="Bačvice – east",
        izor_station=2047,
        lat=43.50081,
        lng=16.44925,
        vibe=("sandy", "central"),
    ),
    Beach(
        slug="firule",
        name="Firule",
        izor_station=2046,
        lat=43.50029,
        lng=16.45353,
        vibe=("family", "quiet", "pebble"),
    ),
    Beach(
        slug="hotel-split",
        name="Hotel Split beach",
        izor_station=2045,
        lat=43.50150,
        lng=16.47063,
        vibe=("pebble", "quiet"),
    ),
    Beach(
        slug="znjan-zapad",
        name="Žnjan – west",
        izor_station=2044,
        lat=43.50143,
        lng=16.47602,
        webcam_url="https://cdn.whatsupcams.com/snapshot/hr_buildznjan01.jpg",
        webcam_label="Žnjan park renovation in progress 2025–26",
        vibe=("pebble", "renovation"),
    ),
    Beach(
        slug="znjan-istok",
        name="Žnjan – east",
        izor_station=2043,
        lat=43.50147,
        lng=16.48093,
        webcam_url="https://cdn.whatsupcams.com/snapshot/hr_buildznjan02.jpg",
        webcam_label="Žnjan east — view towards Hotel Lav",
        vibe=("pebble", "renovation"),
    ),
    Beach(
        slug="znjan-fanat",
        name="Žnjan (Hotel Fanat)",
        izor_station=2022,
        lat=43.50202,
        lng=16.47863,
        vibe=("pebble", "hotel"),
    ),
    Beach(
        slug="trstenik-radosevac",
        name="Trstenik–Radoševac",
        izor_station=2162,
        lat=43.50163,
        lng=16.46633,
        vibe=("pebble", "quiet"),
    ),
    Beach(
        slug="duilovo",
        name="Duilovo",
        izor_station=2161,
        lat=43.50140,
        lng=16.49399,
        vibe=("pebble", "quiet", "east"),
    ),
    Beach(
        slug="gusar",
        name="Gusar",
        izor_station=2056,
        lat=43.51646,
        lng=16.42533,
        vibe=("pebble", "rowing-club", "north"),
    ),
    Beach(
        slug="bene",
        name="Bene (Marjan)",
        izor_station=2054,
        lat=43.51438,
        lng=16.40127,
        vibe=("pebble", "shaded", "quiet", "marjan"),
    ),
    Beach(
        slug="kasjuni",
        name="Kašjuni",
        izor_station=2053,
        lat=43.50653,
        lng=16.40025,
        webcam_url="https://cdn.whatsupcams.com/snapshot/hr_split05.jpg",
        webcam_label="Marjan / Kašjuni",
        vibe=("pebble", "marjan", "sunset"),
    ),
    Beach(
        slug="uvala-kasjuni",
        name="Uvala Kašjuni",
        izor_station=2189,
        lat=43.50535,
        lng=16.40024,
        vibe=("pebble", "quiet", "marjan"),
    ),
    Beach(
        slug="jezinac",
        name="Ježinac",
        izor_station=2052,
        lat=43.50354,
        lng=16.41731,
        vibe=("pebble", "shaded", "quiet", "marjan"),
    ),
    Beach(
        slug="zvoncac",
        name="Zvončac",
        izor_station=2051,
        lat=43.50276,
        lng=16.42136,
        vibe=("pebble", "quiet"),
    ),
)


BY_SLUG: dict[str, Beach] = {b.slug: b for b in BEACHES}
BY_STATION: dict[int, Beach] = {b.izor_station: b for b in BEACHES}
