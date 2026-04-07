#!/bin/bash
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTS_FILE="$REPO_DIR/ports.env"

JARVIS_BACKEND_PORT="8340"
JARVIS_FRONTEND_PORT="5180"

if [[ -f "$PORTS_FILE" ]]; then
    # shellcheck disable=SC1090
    source "$PORTS_FILE"
fi

echo "🚀 Starting JARVIS..."

# Ollama
if ! pgrep -x ollama > /dev/null; then
    nohup ollama serve > /tmp/ollama.log 2>&1 &
    echo "✅ Ollama started (PID $!)"
    sleep 2
else
    echo "✅ Ollama already running"
fi

# Backend
cd "$REPO_DIR"
source .venv/bin/activate
nohup python server.py --port "$JARVIS_BACKEND_PORT" > /tmp/jarvis-server.log 2>&1 &
echo "✅ Backend started (PID $!)"

# Frontend
cd "$REPO_DIR/frontend"
nohup npm run dev -- --host 0.0.0.0 --port "$JARVIS_FRONTEND_PORT" > /tmp/jarvis-frontend.log 2>&1 &
echo "✅ Frontend started (PID $!)"

echo "🎙️  JARVIS ready at http://localhost:$JARVIS_FRONTEND_PORT"
