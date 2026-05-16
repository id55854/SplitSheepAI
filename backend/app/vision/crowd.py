"""Crowd estimation from a webcam JPG.

Real path: ultralytics YOLOv8n -> count person-class boxes -> normalize.
Fallback path: deterministic time-of-day heuristic so the demo still runs
if torch / ultralytics isn't installed (e.g. on Python 3.14 where wheels lag)."""

from __future__ import annotations

import io
from dataclasses import dataclass
from datetime import datetime, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

try:
    _TZ = ZoneInfo("Europe/Zagreb")
except ZoneInfoNotFoundError:
    _TZ = timezone.utc  # tzdata not installed; UTC is close enough for the heuristic

_yolo_model = None
_yolo_available: bool | None = None


@dataclass
class CrowdEstimate:
    score: float            # 0-10, higher = more crowded
    label: str              # "Empty", "Quiet", "Busy", "Packed"
    people_count: int | None  # raw detection count, or None when stubbed
    method: str             # "yolo" | "heuristic" | "renovation"
    note: str | None = None


def _label_for(score: float) -> str:
    if score < 2.0:
        return "Empty"
    if score < 4.5:
        return "Quiet"
    if score < 7.0:
        return "Busy"
    return "Packed"


def _try_load_yolo():
    """Lazy-load YOLO. Sets _yolo_available to True/False on first call."""
    global _yolo_model, _yolo_available
    if _yolo_available is not None:
        return _yolo_model
    try:
        from ultralytics import YOLO  # type: ignore

        _yolo_model = YOLO("yolov8n.pt")
        _yolo_available = True
    except Exception:
        _yolo_model = None
        _yolo_available = False
    return _yolo_model


def _heuristic_score(now: datetime | None = None, popularity: int = 3) -> float:
    """Time-of-day proxy for crowd, scaled by each beach's popularity (1-5).
    Returned score is on a 0-10 scale where 10 = packed."""
    if now is None:
        now = datetime.now(_TZ)
    h = now.hour + now.minute / 60.0
    if h < 7:
        base = 0.5
    elif h < 10:
        base = 2.5
    elif h < 12:
        base = 5.0
    elif h < 17:
        base = 8.0  # peak
    elif h < 20:
        base = 5.5
    else:
        base = 1.5
    # popularity ∈ [1, 5] scales base by 0.4 to 1.4 — quiet beaches stay quieter even at peak.
    pop_factor = 0.4 + 0.25 * (max(1, min(5, popularity)) - 1)
    return min(10.0, base * pop_factor)


def estimate_from_jpg(
    jpg_bytes: bytes | None,
    *,
    is_renovation: bool = False,
    capacity_hint: int = 80,
    popularity: int = 3,
) -> CrowdEstimate:
    """Single entry point. `capacity_hint` = headcount that should map to score 10."""
    if is_renovation:
        return CrowdEstimate(
            score=0.0,
            label="Closed",
            people_count=0,
            method="renovation",
            note="Beach under renovation; live cam shows construction work.",
        )
    if jpg_bytes is None:
        score = _heuristic_score(popularity=popularity)
        return CrowdEstimate(
            score=score,
            label=_label_for(score),
            people_count=None,
            method="heuristic",
            note="No webcam snapshot available — using time-of-day + popularity proxy.",
        )
    model = _try_load_yolo()
    if model is None:
        score = _heuristic_score(popularity=popularity)
        return CrowdEstimate(
            score=score,
            label=_label_for(score),
            people_count=None,
            method="heuristic",
            note="Vision model unavailable on this host — using time-of-day + popularity proxy.",
        )
    try:
        import numpy as np  # type: ignore
        from PIL import Image  # type: ignore

        img = Image.open(io.BytesIO(jpg_bytes)).convert("RGB")
        arr = np.array(img)
        results = model.predict(arr, classes=[0], verbose=False, conf=0.25)
        boxes = results[0].boxes
        count = int(len(boxes)) if boxes is not None else 0
        score = max(0.0, min(10.0, (count / capacity_hint) * 10.0))
        return CrowdEstimate(
            score=score,
            label=_label_for(score),
            people_count=count,
            method="yolo",
        )
    except Exception as exc:
        score = _heuristic_score(popularity=popularity)
        return CrowdEstimate(
            score=score,
            label=_label_for(score),
            people_count=None,
            method="heuristic",
            note=f"Vision inference failed ({type(exc).__name__}); falling back.",
        )
