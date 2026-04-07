#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORTS_FILE="$ROOT_DIR/ports.env"

JARVIS_FRONTEND_PORT="5180"
CALENDAR_FRONTEND_PORT="5181"
TODO_DASHBOARD_BACKEND_PORT="8001"
TIKTOK_BACKEND_PORT="5001"

if [[ -f "$PORTS_FILE" ]]; then
	# shellcheck disable=SC1090
	source "$PORTS_FILE"
fi

echo "JARVIS backend and frontend are now managed by pm2. Use 'pm2 status' to check status."
# Start all major project servers and dashboards
echo "Starting JARVIS backend and frontend with pm2..."
pm2 start ecosystem.config.js
pm2 save

echo "Starting TikTok frontend (Vite)..."
cd "$(dirname "$0")/TIKTOK/frontend" && ./scripts/auto_port_and_watch.sh TIKTOK/frontend TIKTOK/frontend/vite.config.ts dev &
cd - > /dev/null

echo "TikTok backend is managed by pm2 (tiktok-backend)."

echo "To-Do Dashboard frontend: open todo_dashboard/frontend.html in your browser."

echo "STT and STT2: Please start manually if needed (no clear start command)."

echo "iOS App: Open IOS APP/JARVIS Assistant in Xcode and run on your device."

echo "All servers launched with standard ports from ports.env."
echo "Expected ports:"
echo "- JARVIS frontend: $JARVIS_FRONTEND_PORT"
echo "- Calendar frontend: $CALENDAR_FRONTEND_PORT"
echo "- To-Do backend: $TODO_DASHBOARD_BACKEND_PORT"
echo "- TikTok backend: $TIKTOK_BACKEND_PORT"
