import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'vite';

function loadPortsEnv() {
  const defaults = {
    CALENDAR_BACKEND_PORT: '8000',
    CALENDAR_FRONTEND_PORT: '5181',
  };

  const envPath = path.resolve(__dirname, '../../ports.env');
  if (!fs.existsSync(envPath)) {
    return defaults;
  }

  const parsed = { ...defaults };
  for (const rawLine of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) {
      continue;
    }
    const index = line.indexOf('=');
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    if (key in parsed && value) {
      parsed[key as keyof typeof parsed] = value;
    }
  }

  return parsed;
}

const ports = loadPortsEnv();
const calendarBackendPort = Number(process.env.CALENDAR_BACKEND_PORT ?? ports.CALENDAR_BACKEND_PORT);
const calendarFrontendPort = Number(process.env.CALENDAR_FRONTEND_PORT ?? ports.CALENDAR_FRONTEND_PORT);

export default defineConfig({
  server: {
    port: calendarFrontendPort,
    strictPort: true,
    host: true,
    proxy: {
      '/api': `http://localhost:${calendarBackendPort}`,
    },
  },
});
