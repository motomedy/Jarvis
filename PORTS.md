# Project Port Map (Auto-Updated Reference)

Standard runtime source of truth: `ports.env`

| Project                | Type      | Port  | Config/Source Location                      |
|------------------------|-----------|-------|---------------------------------------------|
| JARVIS Main Frontend   | Frontend  | 5180  | frontend/vite.config.ts                     |
| JARVIS Calendar Frontend| Frontend | 5181  | frontend/calendar/vite.config.ts            |
| JARVIS Calendar Backend| Backend   | 8000  | Calendar/calendar_reports.py (uvicorn)      |
| To-Do Dashboard Backend| Backend   | 8001  | todo_dashboard/app.py (uvicorn in start-all.sh) |
| JARVIS Backend         | Backend   | 8340  | server.py                                   |
| TikTok Frontend        | Frontend  | auto  | TIKTOK/frontend/vite.config.ts              |
| TikTok Backend         | Backend   | 5001  | TIKTOK/dashboard.py                         |

**How to update:**
- If you change a port in a config or script, run this script again.
- For dynamic ports, check terminal output or launcher script logic.
- For new projects, add a row with project, type, port, and config location.

_Last updated: 2026-04-07_
