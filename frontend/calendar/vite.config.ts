import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const calendarBackendPort = Number(process.env.CALENDAR_BACKEND_PORT ?? '8000');
const calendarFrontendPort = Number(process.env.CALENDAR_FRONTEND_PORT ?? '5181');

export default defineConfig({
  plugins: [react()],
  server: {
    port: calendarFrontendPort,
    host: true,
    proxy: {
      '/api': `http://localhost:${calendarBackendPort}`,
    },
  },
});
