"""Splash Score: 0-100, higher = better beach right now.

Weights (per feasibility doc §8):
  crowd        40% — inverted: emptier = better
  water        30% — IZOR quality class
  temp_delta   15% — comfort window around 24°C sea / 24-30°C air
  wind/wave    15% — penalty for high wind or waves, modulated by beach exposure

All sub-scores are 0-1 before weighting."""

from __future__ import annotations

import math
from dataclasses import dataclass


WATER_CLASS_SCORE = {
    "excellent": 1.0,
    "good": 0.75,
    "sufficient": 0.45,
    "poor": 0.1,
    "unknown": 0.55,
}


def _crowd_subscore(crowd_score_0_10: float) -> float:
    """Lower crowd = higher subscore. Linear inversion with mild non-linearity for empty beaches."""
    inv = 1.0 - (crowd_score_0_10 / 10.0)
    return max(0.0, min(1.0, inv))


def _temp_subscore(sea_temp_c: float | None, air_temp_c: float | None) -> float:
    """Best at sea≈23-27°C, air≈24-30°C; degrades linearly outside."""
    parts: list[float] = []
    if sea_temp_c is not None:
        if 23 <= sea_temp_c <= 27:
            parts.append(1.0)
        elif sea_temp_c < 23:
            parts.append(max(0.0, 1.0 - (23 - sea_temp_c) / 12.0))  # 11°C => 0
        else:
            parts.append(max(0.0, 1.0 - (sea_temp_c - 27) / 8.0))   # 35°C => 0
    if air_temp_c is not None:
        if 24 <= air_temp_c <= 30:
            parts.append(1.0)
        elif air_temp_c < 24:
            parts.append(max(0.0, 1.0 - (24 - air_temp_c) / 14.0))
        else:
            parts.append(max(0.0, 1.0 - (air_temp_c - 30) / 10.0))
    if not parts:
        return 0.5
    return sum(parts) / len(parts)


def shelter_factor(wind_dir_deg: float | None, exposure_deg: float | None) -> float:
    """Returns a multiplier in [0.5, 1.5] applied to wind speed:
      offshore wind (blowing from land out to sea past the beach) ⇒ 0.5
      onshore wind  (blowing from sea straight into the beach)    ⇒ 1.5
      cross-shore                                                  ⇒ ~1.0

    Conventions: wind_dir = direction wind is coming FROM (meteorological).
                 exposure_deg = compass bearing the beach OPENS TO."""
    if wind_dir_deg is None or exposure_deg is None:
        return 1.0
    # When wind comes from the exposure direction (sea side), it blows onshore.
    delta = math.radians(wind_dir_deg - exposure_deg)
    # cos(delta) = +1 when wind from exposure (onshore, worst), -1 when offshore (best)
    return 1.0 + 0.5 * math.cos(delta)


def _wind_wave_subscore(
    wind_kmh: float | None,
    wave_m: float | None,
    *,
    wind_dir_deg: float | None = None,
    exposure_deg: float | None = None,
) -> float:
    """Penalty for choppy/windy conditions, modulated by how exposed the beach is."""
    parts: list[float] = []
    if wind_kmh is not None:
        eff_wind = wind_kmh * shelter_factor(wind_dir_deg, exposure_deg)
        # 0 km/h -> 1.0, 15 km/h -> 1.0, 30 -> 0.5, >=50 -> 0
        if eff_wind <= 15:
            parts.append(1.0)
        elif eff_wind >= 50:
            parts.append(0.0)
        else:
            parts.append(max(0.0, 1.0 - (eff_wind - 15) / 35.0))
    if wave_m is not None:
        # <=0.3m -> 1.0, 1.5m -> 0, anywhere in between linear
        if wave_m <= 0.3:
            parts.append(1.0)
        elif wave_m >= 1.5:
            parts.append(0.0)
        else:
            parts.append(max(0.0, 1.0 - (wave_m - 0.3) / 1.2))
    if not parts:
        return 0.7
    return sum(parts) / len(parts)


@dataclass
class SplashBreakdown:
    score: int
    crowd_sub: float
    water_sub: float
    temp_sub: float
    wind_wave_sub: float


def splash_score(
    *,
    crowd_score_0_10: float,
    water_class: str,
    sea_temp_c: float | None,
    air_temp_c: float | None,
    wind_kmh: float | None,
    wave_m: float | None,
    wind_dir_deg: float | None = None,
    exposure_deg: float | None = None,
) -> SplashBreakdown:
    c = _crowd_subscore(crowd_score_0_10)
    w = WATER_CLASS_SCORE.get(water_class, 0.55)
    t = _temp_subscore(sea_temp_c, air_temp_c)
    ww = _wind_wave_subscore(
        wind_kmh, wave_m, wind_dir_deg=wind_dir_deg, exposure_deg=exposure_deg
    )
    weighted = 0.40 * c + 0.30 * w + 0.15 * t + 0.15 * ww
    return SplashBreakdown(
        score=round(weighted * 100),
        crowd_sub=round(c, 3),
        water_sub=round(w, 3),
        temp_sub=round(t, 3),
        wind_wave_sub=round(ww, 3),
    )


def headline(
    *,
    splash: int,
    wind_name: str,
    water_class: str,
    crowd_label: str,
) -> str:
    """One-line, plain-English summary suitable for a card header."""
    quality = water_class if water_class in ("excellent", "good") else f"{water_class} water"
    bits = [f"{crowd_label.lower()}", f"{quality} water"]
    if wind_name and wind_name != "Calm":
        bits.append(f"{wind_name.lower()} blowing")
    return " · ".join(bits).capitalize()
