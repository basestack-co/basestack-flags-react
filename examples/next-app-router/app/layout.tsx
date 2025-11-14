import {
  FlagsHydrationScript,
  FlagsProvider,
  fetchFlags,
  readHydratedFlags,
} from "@basestack/flags-react";
import type { ReactNode } from "react";
import { flagsConfig } from "./flags-config";

export const metadata = {
  title: "Basestack Flags • Next.js App Router",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Reuse hydrated flags during fast refresh to avoid double-fetching locally
  const hydrated = readHydratedFlags();
  const flags = hydrated ?? (await fetchFlags(flagsConfig));

  return (
    <html lang="en">
      <body>
        <FlagsProvider
          config={flagsConfig}
          initialFlags={flags}
          preload={!flags?.length}
        >
          {children}
        </FlagsProvider>
        {flags ? <FlagsHydrationScript flags={flags} /> : null}
      </body>
    </html>
  );
}
