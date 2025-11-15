"use client";

import type { ReactNode } from "react";
import type { Flag } from "@basestack/flags-js";
import { FlagsProvider } from "../../../dist/client";
import { flagsConfig } from "./flags-config";

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
      {children}
    </FlagsProvider>
  );
}
