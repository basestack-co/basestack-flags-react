import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  sourcemap: true,
  clean: true,
  splitting: false,
  platform: "neutral",
  target: "es2022",
  external: ["react", "react-dom", "@basestack/flags-js"]
});
