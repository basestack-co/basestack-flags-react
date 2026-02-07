"use client";

import type { ReactNode } from "react";
import type { Flag } from "@basestack/flags-js";
import {
  FeatureFlagModalsProvider,
  FlagsProvider,
} from "../../../dist/client";
import { flagsConfig } from "./flags-config";
import { flagsWcConfig } from "./flags-wc-config";

export interface ProvidersProps {
  readonly children: ReactNode;
  readonly initialFlags?: Flag[];
}

export function Providers({ children, initialFlags }: ProvidersProps) {
  return (
    <FlagsProvider
      config={flagsConfig}
      initialFlags={initialFlags}
      preload={!initialFlags?.length}
    >
      <FeatureFlagModalsProvider
        config={flagsWcConfig}
        onError={(err) => console.error("[FeatureFlagModals]", err)}
      >
        {children}
      </FeatureFlagModalsProvider>
    </FlagsProvider>
  );
}
