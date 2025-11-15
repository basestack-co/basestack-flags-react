# Basestack Feature Flags React Integration

React bindings for the [Basestack Flags JS SDK](https://github.com/basestack-co/basestack-flags-js). This package exposes a provider, hooks, hydration helpers, and SSR utilities that work across Vite, Next.js (App or Pages Router), and TanStack Start.

## Features

- **Zero-config provider** powered by the official `@basestack/flags-js` client.
- **Hooks for component-level reads** (`useFlag`, `useFlags`, `useFlagsClient`).
- **Server utilities** to preload flags in frameworks with data loaders or RSC.
- **Hydration helpers** for streaming initial flag snapshots safely to the client.
- **Tree-shakeable ESM output** built with [`tsdown`](https://github.com/egoist/tsdown) and linted/formatted via [Biome](https://biomejs.dev/).

## Installation

```bash
bun install @basestack/flags-react @basestack/flags-js
```

React 18+ is required and should already exist in your project. The package ships as pure ESM and targets modern browsers/runtime APIs.

## Quick start (React + Vite)

```tsx
import { FlagsProvider, useFlag } from "@basestack/flags-react/client";

const config = {
  projectKey: process.env.VITE_BASESTACK_PROJECT_KEY!,
  environmentKey: process.env.VITE_BASESTACK_ENVIRONMENT_KEY!,
};

function App() {
  return (
    <FlagsProvider config={config}>
      <HomePage />
    </FlagsProvider>
  );
}

function HomePage() {
  const { enabled, payload, isLoading } = useFlag<{ variant: string }>(
    "header"
  );

  if (isLoading) return <p>Loading…</p>;
  return enabled ? (
    <NewHomepage variant={payload?.variant} />
  ) : (
    <LegacyHomepage />
  );
}
```

- The provider accepts the exact `SDKConfig` used by `@basestack/flags-js` plus optional props:
  - `initialFlags`: preload data, usually from SSR.
  - `preload` (default `true`): automatically fetch missing flags when `initialFlags` is empty.
  - `onError`: observe network/caching errors.
- Hooks keep a shared cache, so subsequent components reuse already fetched flags.
- Call `refresh()` from either `useFlag` or `useFlags` to re-query the API.

## Import paths

Use the subpath that matches your runtime to avoid loading client-only hooks on the server:

- `@basestack/flags-react/client` &mdash; `FlagsProvider`, hooks, `readHydratedFlags`, and SDK types. The file itself includes the `"use client"` directive.
- `@basestack/flags-react/server` &mdash; `fetchFlag`, `fetchFlags`, `createServerFlagsClient`, `FlagsHydrationScript`, and shared constants.
- `@basestack/flags-react` &mdash; server-friendly exports (no hooks or provider). Prefer the explicit `/client` and `/server` paths for new integrations.

## Next.js (App Router)

```tsx
// app/flags-config.ts
export const flagsConfig = {
  projectKey: process.env.BASESTACK_PROJECT_KEY!,
  environmentKey: process.env.BASESTACK_ENVIRONMENT_KEY!,
};
```

```tsx
// app/layout.tsx
import { FlagsHydrationScript, fetchFlags } from "@basestack/flags-react/server";
import { Providers } from "./providers";
import { flagsConfig } from "./flags-config";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
```

```tsx
// app/providers.tsx
"use client";

import { FlagsProvider } from "@basestack/flags-react/client";
import type { Flag } from "@basestack/flags-js";
import type { ReactNode } from "react";
import { flagsConfig } from "./flags-config";

export function Providers({
  children,
  initialFlags,
}: {
  children: ReactNode;
  initialFlags?: Flag[];
}) {
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
```

Use `fetchFlag()` inside Server Components or Route Handlers if you only need a single slug.

### Route Handler + Server Functions demo

The App Router example also includes:

- `GET /api/flags` (`app/api/flags/route.ts`) to prove the SDK works inside a Route Handler / API route.
- A `/server-functions` page that lists current flag states on the server and ships a `ServerActionDemo` client component which invokes a server action powered by `fetchFlag`.

## Next.js (Pages Router)

```tsx
// pages/_app.tsx
import type { AppProps } from "next/app";
import { FlagsProvider } from "@basestack/flags-react/client";

const config = {
  projectKey: process.env.NEXT_PUBLIC_BASESTACK_PROJECT_KEY!,
  environmentKey: process.env.NEXT_PUBLIC_BASESTACK_ENVIRONMENT_KEY!,
};

export default function MyApp({ Component, pageProps }: AppProps<{ flags?: Flag[] }>) {
  const initialFlags = pageProps.flags ?? [];

  return (
    <FlagsProvider config={config} initialFlags={initialFlags} preload={!initialFlags.length}>
      <Component {...pageProps} />
    </FlagsProvider>
  );
}
```

```tsx
// pages/index.tsx
import { fetchFlags } from "@basestack/flags-react/server";
import { useFlag } from "@basestack/flags-react/client";
import type { GetServerSideProps } from "next";
import type { Flag } from "@basestack/flags-js";

export const getServerSideProps: GetServerSideProps<{ flags: Flag[] }> = async () => {
  const flags = await fetchFlags({
    projectKey: process.env.BASESTACK_PROJECT_KEY!,
    environmentKey: process.env.BASESTACK_ENVIRONMENT_KEY!,
  });

  return {
    props: { flags },
  };
};

### API Route

Add a legacy API route that relies on the same server helper:

```ts
// pages/api/flags.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchFlags } from "@basestack/flags-react/server";
import { flagsConfig } from "../../flags-config";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const flags = await fetchFlags(flagsConfig);
    res.status(200).json({ flags });
  } catch (error) {
    res.status(500).json({ message: "Unable to load flags" });
  }
}
```
```

## TanStack Start

```tsx
// app/config/flags.ts
export const flagsConfig = {
  projectKey: process.env.BASESTACK_PROJECT_KEY!,
  environmentKey: process.env.BASESTACK_ENVIRONMENT_KEY!,
};
```

```tsx
// routes/_app.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FlagsProvider } from "@basestack/flags-react/client";
import { fetchFlags } from "@basestack/flags-react/server";
import { flagsConfig } from "../config/flags";

export const Route = createFileRoute("/_app")({
  loader: async () => ({ flags: await fetchFlags(flagsConfig) }),
  component: () => {
    const { flags } = Route.useLoaderData();
    return (
      <FlagsProvider config={flagsConfig} initialFlags={flags} preload={false}>
        <Outlet />
      </FlagsProvider>
    );
  },
});
```

## Hooks reference

Import these from `@basestack/flags-react/client`.

- `useFlag(slug, options)`
  - Returns `{ flag, enabled, payload, isLoading, error, refresh }`.
  - Automatically fetches the flag once per mount (unless `options.fetch === false`).
  - `options.defaultEnabled` and `options.defaultPayload` let you provide fallbacks while loading.
- `useFlags()`
  - Returns `{ flags, flagsBySlug, isLoading, error, refresh }`.
  - Ideal for Admin/Settings UIs or debugging views.
- `useFlagsClient()`
  - Provides direct access to the underlying `FlagsSDK` instance for advanced operations.

## Server utilities

All server helpers live in the `/server` subpath:

```ts
import {
  fetchFlags,
  fetchFlag,
  createServerFlagsClient,
} from "@basestack/flags-react/server";
```

- `fetchFlags(config, slugs?)`: returns a `Flag[]`. When `slugs` is omitted, it loads the full project.
- `fetchFlag(slug, config)`: fetch exactly one flag.
- `createServerFlagsClient(config)`: returns a configured `FlagsSDK` so you can call low-level methods inside loaders.

## Hydration helpers

```tsx
import { FlagsHydrationScript } from "@basestack/flags-react/server";
import { readHydratedFlags } from "@basestack/flags-react/client";

// Server: embed the payload after the provider so client components can read it
<FlagsHydrationScript flags={flags} globalKey="__BASESTACK_FLAGS__" />;

// Client: read during bootstrapping (before rendering) if you need to avoid prop-drilling
const hydrated = readHydratedFlags();
```

`FlagsHydrationScript` encodes the snapshot using `globalThis["__BASESTACK_FLAGS__"]`. Pass `globalKey` to customize the name or set a CSP `nonce` when needed. `readHydratedFlags` only works in the browser, so import it from `/client`.

## Scripts

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `bun run build`  | Bundle ESM + type declarations with `tsdown` |
| `bun run dev`    | Watch-mode build for local development       |
| `bun run lint`   | Run Biome lint rules                         |
| `bun run format` | Format the entire repo with Biome            |
| `bun run test`   | Execute the Vitest suite in JSDOM            |

Use `bun run prepublishOnly` locally before releasing to ensure lint + tests stay green.

## Development notes

- Source lives in `src/` and is compiled to `dist/` via `tsdown` (ESM only).
- The package exposes only modern ESM/Node 20+ syntax; no CommonJS output is produced.
- Biome powers linting/formatting, so please keep editor integrations enabled.

## Examples

Minimal framework demos live in `examples/`. Each project links `@basestack/flags-react` to `dist/` so you can test the SDK locally without publishing:

- `examples/next-app-router`
- `examples/next-pages-router`
- `examples/tanstack-start`
- `examples/react-vite`

Follow the per-project instructions in `examples/README.md` to install dependencies with Bun and run the dev servers.
