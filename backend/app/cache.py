"""Tiny in-process TTL cache. Avoids hammering upstream APIs.

Each entry: (value, expires_at). On miss / expiry, caller refetches and stores."""

from __future__ import annotations

import time
from threading import Lock
from typing import Any, Awaitable, Callable, Generic, TypeVar

T = TypeVar("T")


class TTLCache(Generic[T]):
    def __init__(self) -> None:
        self._store: dict[str, tuple[T, float]] = {}
        self._lock = Lock()

    def get(self, key: str) -> T | None:
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None
            value, expires = entry
            if expires < time.time():
                self._store.pop(key, None)
                return None
            return value

    def set(self, key: str, value: T, ttl: float) -> None:
        with self._lock:
            self._store[key] = (value, time.time() + ttl)

    async def get_or_fetch(
        self,
        key: str,
        ttl: float,
        fetch: Callable[[], Awaitable[T]],
    ) -> T:
        cached = self.get(key)
        if cached is not None:
            return cached
        value = await fetch()
        self.set(key, value, ttl)
        return value


cache: TTLCache[Any] = TTLCache()
