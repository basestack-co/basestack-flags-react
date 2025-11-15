"use client";

import { useFlag } from "../../../dist/client";

export default function HomePage() {
  const { enabled, payload, isLoading } = useFlag<{ variant?: string }>(
    "header"
  );

  if (isLoading)
    return <p style={{ fontFamily: "sans-serif" }}>Checking feature flags…</p>;

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Next.js App Router Example</h1>
      <p>
        Flag <code>header</code> is {enabled ? "enabled" : "disabled"}
      </p>
      {enabled && payload ? (
        <p>Variant: {JSON.stringify(payload, null, 2)}</p>
      ) : null}
    </main>
  );
}
