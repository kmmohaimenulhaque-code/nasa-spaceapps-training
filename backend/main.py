"""
FastAPI entry point for the NASA NeoWs training dashboard.

Architecture reminder:
  Browser (React) -> this API (/api/neos) -> NASA NeoWs
"""

from __future__ import annotations

import os
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from nasa_client import MAX_RANGE_DAYS, default_date_range, fetch_neos

# Load .env from the project root (one level above /backend)
ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

# Prefer DEMO_KEY for local training. Replace via .env if rate-limited.
NASA_API_KEY = os.getenv("NASA_API_KEY", "DEMO_KEY")

app = FastAPI(
    title="NASA Space Apps Training API",
    description="Tiny proxy that fetches Near-Earth Object data from NASA NeoWs.",
    version="0.1.0",
)

# Allow the Vite dev server to call this API during local development.
# In production you would tighten this; for training, localhost is enough.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    """Simple check that the backend process is running."""
    return {"status": "ok"}


@app.get("/api/neos")
async def get_neos(
    start_date: str | None = Query(
        default=None,
        description="YYYY-MM-DD. Defaults to today.",
        examples=["2026-09-11"],
    ),
    end_date: str | None = Query(
        default=None,
        description=f"YYYY-MM-DD. Must be within {MAX_RANGE_DAYS} days of start_date.",
        examples=["2026-09-17"],
    ),
) -> dict:
    """
    Return flattened Near-Earth Object data for the dashboard.

    Example: GET /api/neos?start_date=2026-09-11&end_date=2026-09-17
    """
    if not start_date or not end_date:
        start_date, end_date = default_date_range()

    try:
        return await fetch_neos(
            api_key=NASA_API_KEY,
            start_date=start_date,
            end_date=end_date,
        )
    except httpx.HTTPStatusError as exc:
        # Surface NASA's status clearly (e.g. 403/429 when DEMO_KEY is limited)
        status = exc.response.status_code
        detail = (
            f"NASA API returned HTTP {status}. "
            "If this persists with DEMO_KEY, get a free key at https://api.nasa.gov/ "
            "and set NASA_API_KEY in a local .env file (never commit .env)."
        )
        raise HTTPException(status_code=502, detail=detail) from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Could not reach NASA API: {exc}",
        ) from exc
