import fs from "node:fs";
import path from "node:path";

import { defineConfig } from "vite";

function loadPortsEnv() {
  const defaults = {
    JARVIS_BACKEND_PORT: "8340",
    JARVIS_FRONTEND_PORT: "5180",
  };

  const envPath = path.resolve(__dirname, "../ports.env");
  if (!fs.existsSync(envPath)) {
    return defaults;
  }

  const parsed = { ...defaults };
  for (const rawLine of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");
    if (key in parsed && value) {
      parsed[key as keyof typeof parsed] = value;
    }
  }

  return parsed;
}

const ports = loadPortsEnv();
const backendPort = Number(process.env.JARVIS_BACKEND_PORT ?? ports.JARVIS_BACKEND_PORT);
const frontendPort = Number(process.env.JARVIS_FRONTEND_PORT ?? ports.JARVIS_FRONTEND_PORT);

export default defineConfig({
  server: {
    port: frontendPort,
    strictPort: true,
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
