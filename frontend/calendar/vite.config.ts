import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'MISSION_CONTROL',
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5182,
    proxy: {
      '/api': 'http://localhost:8340',
    },
  },
});
