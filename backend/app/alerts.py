"""Email-collection sink for the 'Alert me when ___' form.

v0: append-only JSON Lines file. Replace with Resend/Postmark integration later."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)
ALERTS_FILE = DATA_DIR / "alerts.jsonl"

_lock = Lock()
_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def valid_email(email: str) -> bool:
    return bool(_EMAIL_RE.match(email or ""))


def save(email: str, criteria: dict) -> None:
    record = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "email": email.strip(),
        "criteria": criteria,
    }
    line = json.dumps(record, ensure_ascii=False)
    with _lock:
        with ALERTS_FILE.open("a", encoding="utf-8") as f:
            f.write(line + "\n")


def count() -> int:
    if not ALERTS_FILE.exists():
        return 0
    with ALERTS_FILE.open("r", encoding="utf-8") as f:
        return sum(1 for _ in f)
