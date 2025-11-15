import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(dirname, "../../dist");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@basestack/flags-react": path.join(distDir, "index.js"),
      "@basestack/flags-react/client": path.join(distDir, "client.js"),
      "@basestack/flags-react/server": path.join(distDir, "server.js"),
    },
  },
});
