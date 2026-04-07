import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5180,
    host: true, // Listen on all interfaces (0.0.0.0)
    proxy: {
      "/ws": {
        target: "https://localhost:8340",
        ws: true,
        secure: false,
      },
      "/api": {
        target: "https://localhost:8340",
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
