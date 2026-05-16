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
    # exposure_deg = compass bearing the beach OPENS TO (away from land, into the sea).
    # Used to compute wind shelter: onshore wind from the same bearing is worst,
    # offshore wind from the opposite bearing is best.
    exposure_deg: int = 180
    # popularity: 1 (always empty) ... 5 (always packed). Modulates the time-of-day
    # crowd heuristic when a live YOLO headcount isn't available.
    popularity: int = 3


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
        exposure_deg=180, popularity=5,
    ),
    Beach(
        slug="bacvice-zapad",
        name="Bačvice – west",
        izor_station=2049,
        lat=43.50060,
        lng=16.44607,
        vibe=("sandy", "family", "central"),
        exposure_deg=180, popularity=4,
    ),
    Beach(
        slug="bacvice-istok",
        name="Bačvice – east",
        izor_station=2047,
        lat=43.50081,
        lng=16.44925,
        vibe=("sandy", "central"),
        exposure_deg=180, popularity=4,
    ),
    Beach(
        slug="firule",
        name="Firule",
        izor_station=2046,
        lat=43.50029,
        lng=16.45353,
        vibe=("family", "quiet", "pebble"),
        exposure_deg=170, popularity=3,
    ),
    Beach(
        slug="hotel-split",
        name="Hotel Split beach",
        izor_station=2045,
        lat=43.50150,
        lng=16.47063,
        vibe=("pebble", "quiet"),
        exposure_deg=180, popularity=3,
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
        exposure_deg=170, popularity=1,
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
        exposure_deg=170, popularity=1,
    ),
    Beach(
        slug="znjan-fanat",
        name="Žnjan (Hotel Fanat)",
        izor_station=2022,
        lat=43.50202,
        lng=16.47863,
        vibe=("pebble", "hotel"),
        exposure_deg=170, popularity=3,
    ),
    Beach(
        slug="trstenik-radosevac",
        name="Trstenik–Radoševac",
        izor_station=2162,
        lat=43.50163,
        lng=16.46633,
        vibe=("pebble", "quiet"),
        exposure_deg=150, popularity=3,
    ),
    Beach(
        slug="duilovo",
        name="Duilovo",
        izor_station=2161,
        lat=43.50140,
        lng=16.49399,
        vibe=("pebble", "quiet", "east"),
        exposure_deg=180, popularity=2,
    ),
    Beach(
        slug="gusar",
        name="Gusar",
        izor_station=2056,
        lat=43.51646,
        lng=16.42533,
        vibe=("pebble", "rowing-club", "north"),
        # Tucked into the Kaštela Bay shore — Marjan north flank, faces NW into the bay
        exposure_deg=315, popularity=2,
    ),
    Beach(
        slug="bene",
        name="Bene (Marjan)",
        izor_station=2054,
        lat=43.51438,
        lng=16.40127,
        vibe=("pebble", "shaded", "quiet", "marjan"),
        # North side of Marjan, faces the Kaštela channel
        exposure_deg=30, popularity=3,
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
        # South-west tip of Marjan, faces SSW toward Čiovo
        exposure_deg=210, popularity=4,
    ),
    Beach(
        slug="uvala-kasjuni",
        name="Uvala Kašjuni",
        izor_station=2189,
        lat=43.50535,
        lng=16.40024,
        vibe=("pebble", "quiet", "marjan"),
        exposure_deg=210, popularity=2,
    ),
    Beach(
        slug="jezinac",
        name="Ježinac",
        izor_station=2052,
        lat=43.50354,
        lng=16.41731,
        vibe=("pebble", "shaded", "quiet", "marjan"),
        exposure_deg=190, popularity=2,
    ),
    Beach(
        slug="zvoncac",
        name="Zvončac",
        izor_station=2051,
        lat=43.50276,
        lng=16.42136,
        vibe=("pebble", "quiet"),
        exposure_deg=190, popularity=3,
    ),
)


BY_SLUG: dict[str, Beach] = {b.slug: b for b in BEACHES}
BY_STATION: dict[int, Beach] = {b.izor_station: b for b in BEACHES}
