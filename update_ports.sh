#!/bin/bash
# update_ports.sh - Auto-update PORTS.md with current project ports.

set -euo pipefail

PORTS_FILE="PORTS.md"
DATE=$(date +%Y-%m-%d)

extract_vite_port() {
  local file="$1"
  if [ -f "$file" ]; then
    grep -m1 'port:' "$file" | grep -Eo '[0-9]+' || echo "auto"
  else
    echo "auto"
  fi
}

extract_python_port() {
  local file="$1"
  if [ -f "$file" ]; then
    local port
    port=$(grep -Eo 'port[ =:]+[0-9]+' "$file" | grep -Eo '[0-9]+' | head -n1 || true)
    if [ -z "$port" ]; then
      port=$(grep -Eo -- '--port[ =]+[0-9]+' "$file" | grep -Eo '[0-9]+' | head -n1 || true)
    fi
    if [ -z "$port" ]; then
      port=$(grep -Eo 'default[ =]+[0-9]+' "$file" | grep -Eo '[0-9]+' | head -n1 || true)
    fi
    echo "${port:-auto}"
  else
    echo "auto"
  fi
}

JARVIS_FRONTEND_PORT=$(extract_vite_port frontend/vite.config.ts)
CALENDAR_FRONTEND_PORT=$(extract_vite_port frontend/calendar/vite.config.ts)
TIKTOK_FRONTEND_PORT=$(extract_vite_port TIKTOK/frontend/vite.config.ts)
CALENDAR_BACKEND_PORT=$(grep -Eo 'calendar_reports:app --reload --port [0-9]+' ecosystem.config.js | grep -Eo '[0-9]+' | head -n1 || echo "8000")
TODO_BACKEND_PORT=$(grep -Eo -- '--port [0-9]+' start-all.sh | grep -Eo '[0-9]+' | head -n1 || echo "8001")
JARVIS_BACKEND_PORT=$(extract_python_port server.py)
TIKTOK_BACKEND_PORT=$(extract_python_port TIKTOK/dashboard.py)

cat > "$PORTS_FILE" <<EOF
# Project Port Map (Auto-Updated Reference)

| Project                | Type      | Port  | Config/Source Location                      |
|------------------------|-----------|-------|---------------------------------------------|
| JARVIS Main Frontend   | Frontend  | ${JARVIS_FRONTEND_PORT}  | frontend/vite.config.ts                     |
| JARVIS Calendar Frontend| Frontend | ${CALENDAR_FRONTEND_PORT}* | frontend/calendar/vite.config.ts            |
| JARVIS Calendar Backend| Backend   | ${CALENDAR_BACKEND_PORT}  | Calendar/calendar_reports.py (uvicorn)      |
| To-Do Dashboard Backend| Backend   | ${TODO_BACKEND_PORT}  | todo_dashboard/app.py (uvicorn in start-all.sh) |
| JARVIS Backend         | Backend   | ${JARVIS_BACKEND_PORT}  | server.py                                   |
| TikTok Frontend        | Frontend  | ${TIKTOK_FRONTEND_PORT}  | TIKTOK/frontend/vite.config.ts              |
| TikTok Backend         | Backend   | ${TIKTOK_BACKEND_PORT}  | TIKTOK/dashboard.py                         |

*Calendar frontend may auto-increment if port is busy (e.g., 5182, 5183, ...)

**How to update:**
- If you change a port in a config or script, run this script again.
- For dynamic ports, check terminal output or launcher script logic.
- For new projects, add a row with project, type, port, and config location.

_Last updated: ${DATE}_
EOF

echo "PORTS.md updated from live config files."
