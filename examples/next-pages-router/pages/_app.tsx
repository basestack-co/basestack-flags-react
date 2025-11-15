import type { Flag } from "@basestack/flags-js";
import { FlagsProvider } from "../../../dist/client";
import type { AppProps } from "next/app";
import { flagsConfig } from "../flags-config";

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{ flags?: Flag[] }>) {
  const initialFlags = pageProps.flags ?? [];

  return (
    <FlagsProvider
      config={flagsConfig}
      initialFlags={initialFlags}
      preload={initialFlags.length === 0}
    >
      <Component {...pageProps} />
    </FlagsProvider>
  );
}
