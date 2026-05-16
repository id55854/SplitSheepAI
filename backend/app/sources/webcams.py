"""Webcam snapshot fetcher (WhatsUpCams CDN JPG)."""

from __future__ import annotations

import httpx

from ..cache import cache


async def fetch_snapshot(url: str) -> bytes | None:
    cached = cache.get(f"cam:{url}")
    if cached is not None:
        return cached
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            r = await client.get(url)
            r.raise_for_status()
            data = r.content
    except (httpx.HTTPError, httpx.TimeoutException):
        return None
    cache.set(f"cam:{url}", data, ttl=60)
    return data
