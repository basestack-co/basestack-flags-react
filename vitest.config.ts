import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@basestack/flags-wc": path.resolve(
        __dirname,
        "src/__mocks__/basestack-flags-wc.ts",
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
    },
  },
});
