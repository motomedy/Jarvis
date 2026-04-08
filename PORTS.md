# Project Port Map (Auto-Updated Reference)

| Project                | Type      | Port  | Config/Source Location                      |
|------------------------|-----------|-------|---------------------------------------------|
| JARVIS Main Frontend   | Frontend  | 5180  | frontend/vite.config.ts                     |
| JARVIS Calendar Frontend| Frontend | 5181* | frontend/calendar/vite.config.ts            |
| JARVIS Calendar Backend| Backend   | 8000  | Calendar/calendar_reports.py (uvicorn)      |
| To-Do Dashboard Backend| Backend   | 8001  | todo_dashboard/app.py (uvicorn in start-all.sh) |
| JARVIS Backend         | Backend   | 8340? | server.py (check for FastAPI/uvicorn config) |
| TikTok Frontend        | Frontend  | auto  | TIKTOK/frontend/scripts/auto_port_and_watch.sh |
| TikTok Backend         | Backend   | auto  | TIKTOK/main.py                              |

*Calendar frontend may auto-increment if port is busy (e.g., 5182, 5183, ...)

**How to update:**
- If you change a port in a config or script, update this file.
- For dynamic ports, check the terminal output or script logic.
- For new projects, add a row with project, type, port, and config location.

_Last updated: 2026-04-07_
