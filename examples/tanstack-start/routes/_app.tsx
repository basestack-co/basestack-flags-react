import type { Flag } from "@basestack/flags-js";
import { FlagsProvider, fetchFlags } from "@basestack/flags-react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { flagsConfig } from "../app/config/flags";

export const Route = createFileRoute("/_app")({
  loader: async () => ({ flags: await fetchFlags(flagsConfig) }),
  component: () => {
    const { flags } = Route.useLoaderData() as { flags: Flag[] };
    return (
      <FlagsProvider config={flagsConfig} initialFlags={flags} preload={false}>
        <Outlet />
      </FlagsProvider>
    );
  },
});
