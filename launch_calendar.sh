#!/bin/bash
# launch_calendar.sh
# This script launches the JARVIS calendar backend and frontend automatically.

# Exit on error
set -e

# Get the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Backend directory (assumed to be the parent of this script)
BACKEND_DIR="$SCRIPT_DIR"
FRONTEND_DIR="$SCRIPT_DIR/frontend/calendar"

# 1. Start backend (FastAPI)
echo "Starting backend (FastAPI)..."
cd "$BACKEND_DIR"
if [ -d "Calendar/.venv" ]; then
    source Calendar/.venv/bin/activate
fi
nohup python -m uvicorn server:app --reload > backend.log 2>&1 &
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
echo "- Backend: http://127.0.0.1:8000/docs (API docs)"
echo "- Frontend: http://localhost:5173/ (web app)"
echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
