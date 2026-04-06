#!/bin/bash
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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
nohup python server.py > /tmp/jarvis-server.log 2>&1 &
echo "✅ Backend started (PID $!)"

# Frontend
cd "$REPO_DIR/frontend"
nohup npm run dev > /tmp/jarvis-frontend.log 2>&1 &
echo "✅ Frontend started (PID $!)"

echo "🎙️  JARVIS ready at http://localhost:5173"
