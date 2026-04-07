#!/bin/bash
# update_ports.sh — Auto-update PORTS.md with current project ports
# Run this script after adding a new project or changing a port.

PORTS_FILE="PORTS.md"
DATE=$(date +%Y-%m-%d)

cat > "$PORTS_FILE" <<EOF
# Project Port Map (Auto-Updated Reference)

| Project                | Type      | Port  | Config/Source Location                      |
|------------------------|-----------|-------|---------------------------------------------|
| JARVIS Main Frontend   | Frontend  | $(extract_vite_port frontend/vite.config.ts)  | frontend/vite.config.ts                     |
| JARVIS Calendar Frontend| Frontend | $(extract_vite_port frontend/calendar/vite.config.ts)* | frontend/calendar/vite.config.ts            |
| TikTok Frontend        | Frontend  | $(extract_vite_port TIKTOK/frontend/vite.config.js) | TIKTOK/frontend/vite.config.js              |
| JARVIS Calendar Backend| Backend   | $(extract_python_port Calendar/calendar_reports.py)  | Calendar/calendar_reports.py (uvicorn)      |
| To-Do Dashboard Backend| Backend   | $(extract_python_port todo_dashboard/app.py)  | todo_dashboard/app.py (uvicorn in start-all.sh) |
| JARVIS Backend         | Backend   | $(extract_python_port server.py) | server.py (check for FastAPI/uvicorn config) |
| TikTok Backend         | Backend   | $(extract_python_port TIKTOK/dashboard.py) | TIKTOK/dashboard.py (Flask)                  |

*Calendar frontend may auto-increment if port is busy (e.g., 5182, 5183, ...)

**How to update:**
- If you change a port in a config or script, run this script again.
- For dynamic ports, check the terminal output or script logic.
- For new projects, add a row with project, type, port, and config location.

_Last updated: $DATE_
EOF

#!/bin/bash
# update_ports.sh — Auto-update PORTS.md with current project ports
# Run this script after adding a new project or changing a port.

PORTS_FILE="PORTS.md"
DATE=$(date +%Y-%m-%d)

# Helper to extract port from vite config (ts or js)
extract_vite_port() {
	local file="$1"
	if [ -f "$file" ]; then
		grep -m1 'port:' "$file" | grep -o '[0-9]\+' || echo "auto"
	else
		echo "auto"
	fi
}

# Helper to extract port from Python FastAPI/Flask/uvicorn scripts
extract_python_port() {
	local file="$1"
	if [ -f "$file" ]; then
		grep -Eo 'port[ =:]+[0-9]+' "$file" | grep -Eo '[0-9]+' | head -n1 || echo "auto"
	else
		echo "auto"
	fi
}

cat > "$PORTS_FILE" <<EOF
# Project Port Map (Auto-Updated Reference)

| Project                | Type      | Port  | Config/Source Location                      |
|------------------------|-----------|-------|---------------------------------------------|
| JARVIS Main Frontend   | Frontend  | \$(extract_vite_port frontend/vite.config.ts)  | frontend/vite.config.ts                     |
| JARVIS Calendar Frontend| Frontend | \$(extract_vite_port frontend/calendar/vite.config.ts)* | frontend/calendar/vite.config.ts            |
| TikTok Frontend        | Frontend  | \$(extract_vite_port TIKTOK/frontend/vite.config.js) | TIKTOK/frontend/vite.config.js              |
| JARVIS Calendar Backend| Backend   | \$(extract_python_port Calendar/calendar_reports.py)  | Calendar/calendar_reports.py (uvicorn)      |
| To-Do Dashboard Backend| Backend   | \$(extract_python_port todo_dashboard/app.py)  | todo_dashboard/app.py (uvicorn in start-all.sh) |
| JARVIS Backend         | Backend   | \$(extract_python_port server.py) | server.py (check for FastAPI/uvicorn config) |
| TikTok Backend         | Backend   | \$(extract_python_port TIKTOK/dashboard.py) | TIKTOK/dashboard.py (Flask)                  |

*Calendar frontend may auto-increment if port is busy (e.g., 5182, 5183, ...)

**How to update:**
- If you change a port in a config or script, run this script again.
- For dynamic ports, check the terminal output or script logic.
- For new projects, add a row with project, type, port, and config location.

_Last updated: $DATE_
EOF

echo "PORTS.md updated. Review for accuracy if you add new projects or custom ports."
