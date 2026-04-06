# JARVIS — Voice AI Assistant

## Overview
JARVIS (Just A Rather Very Intelligent System) is a voice-first AI assistant. It runs locally using Ollama for LLM inference, connecting to Apple Calendar, Mail, Notes, and can spawn Claude Code sessions for development tasks.

## Quick Start
Open this repo in a dev container — everything is automatic:
1. `setup.sh` runs once on first open: installs deps, Ollama, and pulls the LLM model
2. `start.sh` runs on every container start: launches Ollama, backend, and frontend
3. Port 5173 auto-forwards and opens in your browser
4. Speak to JARVIS

**Optional:** Edit `.env` to add a Fish Audio API key for voice TTS.

## Architecture
- **Backend**: FastAPI + Python (server.py)
- **Frontend**: Vite + TypeScript + Three.js (audio-reactive orb)
- **Communication**: WebSocket (JSON messages + binary audio)
- **AI**: Ollama (local LLM — default: qwen2:0.5b)
- **TTS**: Fish Audio with JARVIS voice model (optional)
- **System**: AppleScript for Calendar, Mail, Notes, Terminal integration

## Key Files
- `server.py` — Main server, WebSocket handler, LLM integration, action system
- `llm.py` — Ollama adapter (drop-in compatible interface)
- `setup.sh` — One-time container setup (deps, Ollama, model pull)
- `start.sh` — Service launcher (Ollama + backend + frontend)
- `frontend/src/orb.ts` — Three.js particle orb visualization
- `frontend/src/voice.ts` — Web Speech API + audio playback
- `frontend/src/main.ts` — Frontend state machine
- `memory.py` — SQLite memory system with FTS5 search
- `calendar_access.py` — Apple Calendar integration via AppleScript
- `mail_access.py` — Apple Mail integration (READ-ONLY)
- `notes_access.py` — Apple Notes integration
- `actions.py` — System actions (Terminal, Chrome, Claude Code)
- `browser.py` — Playwright web automation
- `work_mode.py` — Persistent Claude Code sessions

## Environment Variables
- `OLLAMA_MODEL` (optional) — Model to use, default: `qwen2:0.5b`
- `OLLAMA_HOST` (optional) — Ollama host, default: `http://localhost:11434`
- `FISH_API_KEY` (optional) — Fish Audio TTS key (get one at fish.audio)
- `FISH_VOICE_ID` (optional) — Voice model ID
- `USER_NAME` (optional) — Your name for JARVIS to use
- `CALENDAR_ACCOUNTS` (optional) — Comma-separated calendar emails

## Conventions
- JARVIS personality: British butler, dry wit, economy of language
- Max 1-2 sentences per voice response
- Action tags: [ACTION:BUILD], [ACTION:BROWSE], [ACTION:RESEARCH], etc.
- AppleScript for all macOS integrations (no OAuth needed)
- Read-only for Mail (safety by design)
- SQLite for all local data storage
