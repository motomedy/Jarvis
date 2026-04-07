"""Simple local storage for TikTok dashboard ideas."""

from __future__ import annotations

import json
from pathlib import Path

_STORAGE_FILE = Path(__file__).with_name("video_ideas.json")


def load_ideas() -> list[str]:
    if not _STORAGE_FILE.exists():
        return []

    try:
        data = json.loads(_STORAGE_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []

    if isinstance(data, list):
        return [str(item) for item in data]
    return []


def save_ideas(ideas: list[str]) -> None:
    sanitized = [str(item) for item in ideas]
    _STORAGE_FILE.write_text(json.dumps(sanitized, indent=2), encoding="utf-8")
