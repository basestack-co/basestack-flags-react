import type { Flag } from "@basestack/flags-js";
import { FlagsProvider } from "../../../dist/client";
import { fetchFlags } from "../../../dist/server";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { flagsConfig } from "./flagsConfig";

async function bootstrap() {
  const container = document.getElementById("root");

  if (!container) {
    throw new Error("Root container #root was not found.");
  }

  let initialFlags: Flag[] = [];

  try {
    initialFlags = await fetchFlags(flagsConfig);
  } catch (error) {
    console.error("Failed to preload flags", error);
  }

  const root = createRoot(container);

  root.render(
    <StrictMode>
      <FlagsProvider
        config={flagsConfig}
        initialFlags={initialFlags}
        preload={initialFlags.length === 0}
      >
        <App />
      </FlagsProvider>
    </StrictMode>,
  );
}

void bootstrap();
