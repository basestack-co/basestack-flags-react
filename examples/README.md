# Examples

This folder contains minimal projects that mirror the integration patterns in the main README. Each example consumes the local build output from `../../dist` via explicit bundler aliases so you can exercise the React SDK without first publishing to npm.

## How to use

1. From the repository root run `bun run build` to emit `dist/`.
2. Pick one of the example folders below, `cd` into it, and install dependencies with `bun install`.
3. Provide the `BASESTACK_*` env vars (or keep the default demo keys) and run the local dev command listed for that example.

> All projects pin `packageManager` to `bun@1.3.2`. Feel free to use `bun run dev`, `bun run build`, etc.

### Included projects

| Example | Path | Dev command |
| --- | --- | --- |
| Next.js 16 App Router | `examples/next-app-router` | `bun run dev` |
| Next.js 16 Pages Router | `examples/next-pages-router` | `bun run dev` |
| TanStack Start | `examples/tanstack-start` | `bun run dev` |
| React + Vite | `examples/react-vite` | `bun run dev` |

Each project ships with:
- A framework-specific provider wrapper showing where to fetch flags (`fetchFlags`) on the server.
- A simple component that calls `useFlag("header")` to conditionally render UI.
- Tooling configs (`next.config.mjs`, `vite.config.ts`, or `tanstack.config.ts`) that alias `@basestack/flags-react` plus the `/client` and `/server` subpaths to the matching files inside `../../dist`.

When you are ready to test against a production build from npm, remove the alias and add `@basestack/flags-react` as a normal dependency instead.
