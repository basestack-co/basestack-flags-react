import type { ReactNode } from "react";
import {
  FlagsHydrationScript,
  fetchFlags,
} from "../../../dist/server";
import { flagsConfig } from "./flags-config";
import { Providers } from "./Providers";

export const metadata = {
  title: "Basestack Flags • Next.js App Router",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const flags = await fetchFlags(flagsConfig);

  return (
    <html lang="en">
      <body>
        <Providers initialFlags={flags}>{children}</Providers>
        <FlagsHydrationScript flags={flags} />
      </body>
    </html>
  );
}
