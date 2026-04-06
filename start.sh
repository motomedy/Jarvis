#!/bin/bash
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting JARVIS..."

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
