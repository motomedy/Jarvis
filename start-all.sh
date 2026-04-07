#!/bin/bash
echo "JARVIS backend and frontend are now managed by pm2. Use 'pm2 status' to check status."
# Start all major project servers and dashboards
echo "Starting JARVIS backend and frontend with pm2..."
pm2 start ecosystem.config.js
pm2 save

echo "Starting TikTok frontend (Vite)..."
cd "$(dirname "$0")/TIKTOK/frontend" && ./scripts/auto_port_and_watch.sh TIKTOK/frontend TIKTOK/frontend/vite.config.ts dev &
cd - > /dev/null

echo "Starting TikTok backend (main.py)..."
cd "$(dirname "$0")/TIKTOK" && nohup python3 main.py > tiktok_backend.log 2>&1 &
cd - > /dev/null

echo "Starting To-Do Dashboard backend (FastAPI)..."
cd "$(dirname "$0")/todo_dashboard" && nohup uvicorn app:app --host 0.0.0.0 --port 8001 > dashboard_backend.log 2>&1 &
cd - > /dev/null

echo "To-Do Dashboard frontend: open todo_dashboard/frontend.html in your browser."

echo "STT and STT2: Please start manually if needed (no clear start command)."

echo "iOS App: Open IOS APP/JARVIS Assistant in Xcode and run on your device."

echo "All servers launched. Use 'pm2 status' to check JARVIS, and check logs for others."
echo "Starting JARVIS main frontend (auto port)..."
./scripts/auto_port_and_watch.sh frontend frontend/vite.config.ts dev &

echo "Starting JARVIS calendar frontend (auto port)..."
./scripts/auto_port_and_watch.sh frontend/calendar frontend/calendar/vite.config.ts dev &

echo "Starting TikTok frontend (auto port)..."
./scripts/auto_port_and_watch.sh TIKTOK/frontend TIKTOK/frontend/vite.config.ts dev &
