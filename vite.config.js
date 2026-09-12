import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for the React dashboard.
// The proxy means the browser can call "/api/..." and Vite forwards
// those requests to FastAPI on port 8000 — no CORS headaches in dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
