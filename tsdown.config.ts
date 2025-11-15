import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/client.ts", "src/server.ts"],
  format: ["esm"],
  minify: true,
  sourcemap: false,
  clean: true,
  platform: "neutral",
  target: "es2022",
  external: ["react", "react-dom", "@basestack/flags-js"],
});
