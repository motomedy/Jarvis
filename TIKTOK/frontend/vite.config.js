import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function loadPortsEnv() {
  const defaults = {
    TIKTOK_BACKEND_PORT: '5001',
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
      parsed[key] = value;
    }
  }

  return parsed;
}

const ports = loadPortsEnv();
const tiktokBackendPort = Number(process.env.TIKTOK_BACKEND_PORT ?? ports.TIKTOK_BACKEND_PORT);

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/status': `http://localhost:${tiktokBackendPort}`,
      '/api': `http://localhost:${tiktokBackendPort}`,
    },
  },
});
