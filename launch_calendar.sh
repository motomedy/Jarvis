#!/bin/bash
# launch_calendar.sh
# This script launches the JARVIS backend and calendar frontend automatically.

# Exit on error
set -e

# Get the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Backend directory (assumed to be the parent of this script)
BACKEND_DIR="$SCRIPT_DIR"
FRONTEND_DIR="$SCRIPT_DIR/frontend/calendar"

# 1. Start backend
echo "Starting backend (FastAPI)..."
cd "$BACKEND_DIR"
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi
nohup python server.py > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID. Logs: $BACKEND_DIR/backend.log"

# 2. Start frontend (Vite + React)
echo "Starting frontend (Vite)..."
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID. Logs: $FRONTEND_DIR/frontend.log"

echo "\nJARVIS Calendar app is launching!"
echo "- Backend: https://localhost:8340 (API + WebSocket)"
echo "- Frontend: http://localhost:5181/ (calendar app, may auto-increment)"
echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
