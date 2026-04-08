module.exports = {
  apps: [
    {
      name: 'jarvis-backend',
      script: '.venv/bin/python',
      args: 'server.py',
      cwd: './',
      interpreter: 'none',
      autorestart: true,
      watch: false
    },
    {
      name: 'jarvis-frontend',
      script: 'npm',
      args: 'run dev --prefix frontend',
      cwd: './',
      interpreter: 'none',
      autorestart: true,
      watch: false
    },
    {
      name: 'calendar-backend',
      script: './Calendar/.venv/bin/python',
      args: '-m uvicorn calendar_reports:app --reload --port 8000',
      cwd: './Calendar',
      interpreter: 'none',
      autorestart: true,
      watch: false
    },
    {
      name: 'calendar-frontend',
      script: 'npm',
      args: 'run dev --prefix frontend/calendar',
      cwd: './',
      interpreter: 'none',
      autorestart: true,
      watch: false
    }
  ]
};
