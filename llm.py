"""
Gemini LLM adapter for JARVIS.

Provides a drop-in compatible interface matching the Anthropic client usage:
    response = await client.messages.create(model=..., max_tokens=..., system=..., messages=[...])
    response.content[0].text
"""

import base64
import logging

log = logging.getLogger("jarvis.llm")

# Model mapping: Anthropic names → Gemini equivalents
_MODEL_MAP = {
    "claude-haiku-4-5-20251001": "gemini-2.5-flash-preview-04-17",
    "claude-opus-4-6":           "gemini-2.5-pro-preview-03-25",
}

FAST_MODEL  = "gemini-2.5-flash-preview-04-17"
SMART_MODEL = "gemini-2.5-pro-preview-03-25"


def _map_model(model: str) -> str:
    return _MODEL_MAP.get(model, FAST_MODEL)


def _convert_messages(messages: list[dict]) -> list[dict]:
    """Convert Anthropic-style messages to Gemini contents format."""
    result = []
    for msg in messages:
        role = "model" if msg["role"] == "assistant" else "user"
        content = msg["content"]

        if isinstance(content, str):
            result.append({"role": role, "parts": [{"text": content}]})
        elif isinstance(content, list):
            # Multimodal — Anthropic image blocks
            parts = []
            for block in content:
                if block.get("type") == "text":
                    parts.append({"text": block["text"]})
                elif block.get("type") == "image":
                    src = block.get("source", {})
                    if src.get("type") == "base64":
                        raw = base64.b64decode(src["data"])
                        mime = src.get("media_type", "image/png")
                        parts.append({"inline_data": {"mime_type": mime, "data": base64.b64encode(raw).decode()}})
            result.append({"role": role, "parts": parts})
    return result


class _Response:
    """Mimics anthropic.types.Message so callers can use response.content[0].text."""
    def __init__(self, text: str):
        self.content = [type("Block", (), {"text": text})()]


class _MessagesAPI:
    def __init__(self, genai_client):
        self._client = genai_client

    async def create(
        self,
        model: str,
        max_tokens: int,
        messages: list[dict],
        system: str | None = None,
        **_kwargs,
    ) -> _Response:
        from google.genai import types

        gemini_model = _map_model(model)
        contents = _convert_messages(messages)

        config_kwargs: dict = {"max_output_tokens": max_tokens}
        if system:
            config_kwargs["system_instruction"] = system

        config = types.GenerateContentConfig(**config_kwargs)

        response = await self._client.aio.models.generate_content(
            model=gemini_model,
            contents=contents,
            config=config,
        )
        text = response.text or ""
        return _Response(text)


class GeminiClient:
    """Async Gemini client with Anthropic-compatible messages.create() interface."""

    def __init__(self, api_key: str):
        from google import genai
        self._raw = genai.Client(api_key=api_key)
        self.messages = _MessagesAPI(self._raw)
