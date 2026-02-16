import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Listen on all IPv4 interfaces so both localhost and 127.0.0.1 work reliably.
    host: "0.0.0.0",
    port: 5176,
    // Keep a fixed port so localhost URL does not jump between restarts.
    strictPort: true,
  },
});
