import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const tiktokBackendPort = Number(process.env.TIKTOK_BACKEND_PORT ?? '5001');

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/status': `http://localhost:${tiktokBackendPort}`,
      '/api': `http://localhost:${tiktokBackendPort}`,
    },
  },
});
