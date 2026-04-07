"""Minimal TikTok API helper stubs for local dashboard use."""

from __future__ import annotations

from urllib.parse import urlencode


def get_auth_url(redirect_uri: str, state: str) -> str:
    params = urlencode({
        "redirect_uri": redirect_uri,
        "state": state,
    })
    return f"https://www.tiktok.com/v2/auth/authorize/?{params}"


def exchange_code_for_token(code: str, redirect_uri: str) -> dict:
    # Local fallback for offline/dev use.
    return {
        "access_token": "dev-token",
        "token_type": "bearer",
        "code": code,
        "redirect_uri": redirect_uri,
    }
