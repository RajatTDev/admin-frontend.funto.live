import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  optimizeDeps: {
    include: ["jquery", "moment"],
    entries: ["src/globals.js", "src/main.jsx"],
  },
});
