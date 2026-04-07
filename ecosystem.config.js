const fs = require('fs');
const path = require('path');

function loadPortsEnv() {
  const defaults = {
    JARVIS_BACKEND_PORT: '8340',
    JARVIS_FRONTEND_PORT: '5180',
    CALENDAR_BACKEND_PORT: '8000',
    CALENDAR_FRONTEND_PORT: '5181',
    TODO_DASHBOARD_BACKEND_PORT: '8001',
    TIKTOK_BACKEND_PORT: '5001',
  };

  const envPath = path.join(__dirname, 'ports.env');
  if (!fs.existsSync(envPath)) {
    return defaults;
  }

  const parsed = { ...defaults };
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) {
      continue;
    }
    const idx = line.indexOf('=');
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    if (key) {
      parsed[key] = value;
    }
  }
  return parsed;
}

const ports = loadPortsEnv();

module.exports = {
  apps: [
    {
      name: 'jarvis-backend',
      script: '.venv/bin/python',
      args: `server.py --host 0.0.0.0 --port ${ports.JARVIS_BACKEND_PORT}`,
      cwd: './',
      interpreter: 'none',
      env: {
        JARVIS_BACKEND_PORT: ports.JARVIS_BACKEND_PORT,
      },
      autorestart: true,
      watch: false
    },
    {
      name: 'jarvis-frontend',
      script: 'npm',
      args: `run dev --prefix frontend -- --host 0.0.0.0 --port ${ports.JARVIS_FRONTEND_PORT}`,
      cwd: './',
      interpreter: 'none',
      env: {
        JARVIS_BACKEND_PORT: ports.JARVIS_BACKEND_PORT,
        JARVIS_FRONTEND_PORT: ports.JARVIS_FRONTEND_PORT,
      },
      autorestart: true,
      watch: false
    },
    {
      name: 'calendar-backend',
      script: './.venv/bin/python',
      args: `-m uvicorn calendar_reports:app --app-dir Calendar --host 0.0.0.0 --port ${ports.CALENDAR_BACKEND_PORT}`,
      cwd: './',
      interpreter: 'none',
      env: {
        CALENDAR_BACKEND_PORT: ports.CALENDAR_BACKEND_PORT,
      },
      autorestart: true,
      watch: false
    },
    {
      name: 'calendar-frontend',
      script: 'npm',
      args: `run dev -- --host 0.0.0.0 --port ${ports.CALENDAR_FRONTEND_PORT}`,
      cwd: './frontend/calendar',
      interpreter: 'none',
      env: {
        CALENDAR_BACKEND_PORT: ports.CALENDAR_BACKEND_PORT,
        CALENDAR_FRONTEND_PORT: ports.CALENDAR_FRONTEND_PORT,
      },
      autorestart: true,
      watch: false
    },
    {
      name: 'todo-backend',
      script: './.venv/bin/python',
      args: `-m uvicorn app:app --app-dir todo_dashboard --host 0.0.0.0 --port ${ports.TODO_DASHBOARD_BACKEND_PORT}`,
      cwd: './',
      interpreter: 'none',
      env: {
        TODO_DASHBOARD_BACKEND_PORT: ports.TODO_DASHBOARD_BACKEND_PORT,
      },
      autorestart: true,
      watch: false
    },
    {
      name: 'tiktok-backend',
      script: './TIKTOK/venv/bin/python',
      args: 'dashboard.py',
      cwd: './TIKTOK',
      interpreter: 'none',
      env: {
        TIKTOK_BACKEND_PORT: ports.TIKTOK_BACKEND_PORT,
      },
      autorestart: true,
      watch: false
    }
  ]
};
