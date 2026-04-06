"""
Ollama LLM adapter for JARVIS.

Provides a drop-in compatible interface matching the Anthropic client usage:
    response = await client.messages.create(model=..., max_tokens=..., system=..., messages=[...])
    response.content[0].text

Uses Ollama's OpenAI-compatible endpoint — no API key required.
"""

import logging
import httpx

log = logging.getLogger("jarvis.llm")

DEFAULT_HOST  = "http://localhost:11434"
DEFAULT_MODEL = "qwen2.5"


def _build_messages(system: str | None, messages: list[dict]) -> list[dict]:
    """Convert to OpenAI-style messages, flattening multimodal blocks to text."""
    result = []
    if system:
        result.append({"role": "system", "content": system})
    for msg in messages:
        content = msg["content"]
        if isinstance(content, list):
            # Flatten multimodal blocks — extract text only (vision not supported by qwen2.5)
            text_parts = [b["text"] for b in content if b.get("type") == "text"]
            content = " ".join(text_parts)
        result.append({"role": msg["role"], "content": content})
    return result


class _Response:
    """Mimics anthropic.types.Message so callers can use response.content[0].text."""
    def __init__(self, text: str):
        self.content = [type("Block", (), {"text": text})()]


class _MessagesAPI:
    def __init__(self, host: str, model: str):
        self._host  = host
        self._model = model

    async def create(
        self,
        model: str,
        max_tokens: int,
        messages: list[dict],
        system: str | None = None,
        **_kwargs,
    ) -> _Response:
        payload = {
            "model":      self._model,
            "messages":   _build_messages(system, messages),
            "stream":     False,
            "options":    {"num_predict": max_tokens},
        }
        async with httpx.AsyncClient(timeout=60.0) as http:
            resp = await http.post(
                f"{self._host}/v1/chat/completions",
                json=payload,
                headers={"Authorization": "Bearer ollama"},
            )
            resp.raise_for_status()
            text = resp.json()["choices"][0]["message"]["content"]
        return _Response(text)


class OllamaClient:
    """Async Ollama client with Anthropic-compatible messages.create() interface."""

    def __init__(self, host: str = DEFAULT_HOST, model: str = DEFAULT_MODEL):
        self.host  = host
        self.model = model
        self.messages = _MessagesAPI(host, model)
