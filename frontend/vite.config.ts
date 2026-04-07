import { defineConfig } from "vite";

const backendPort = Number(process.env.JARVIS_BACKEND_PORT ?? "8340");
const frontendPort = Number(process.env.JARVIS_FRONTEND_PORT ?? "5180");

export default defineConfig({
  server: {
    port: frontendPort,
    host: true, // Listen on all interfaces (0.0.0.0)
    proxy: {
      "/ws": {
        target: `https://localhost:${backendPort}`,
        ws: true,
        secure: false,
      },
      "/api": {
        target: `https://localhost:${backendPort}`,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
