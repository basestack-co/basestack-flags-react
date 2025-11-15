import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/client.ts", "src/server.ts"],
  format: ["esm"],
  sourcemap: true,
  clean: true,
  platform: "neutral",
  target: "es2022",
  external: ["react", "react-dom", "@basestack/flags-js"],
});
