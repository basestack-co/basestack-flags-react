"use client";

import type { Flag, FlagsSDK } from "@basestack/flags-js";
import { createContext, useContext } from "react";

interface FlagsContextValue {
  client: FlagsSDK;
  flags: Map<string, Flag>;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  upsertFlag: (flag: Flag) => void;
}

export const FlagsContext = createContext<FlagsContextValue | null>(null);

export const useFlagsContext = (): FlagsContextValue => {
  const ctx = useContext(FlagsContext);

  if (!ctx) {
    throw new Error("FlagsProvider is missing in the component tree.");
  }

  return ctx;
};
