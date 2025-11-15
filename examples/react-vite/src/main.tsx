import { FlagsProvider } from "../../../dist/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { flagsConfig } from "./flagsConfig";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container #root was not found.");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <FlagsProvider config={flagsConfig} preload>
      <App />
    </FlagsProvider>
  </StrictMode>,
);
