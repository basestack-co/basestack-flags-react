"use client";

import type { Flag } from "@basestack/flags-js";
import { useState, useTransition } from "react";
import { getHeaderFlagAction } from "./actions";

export function ServerActionDemo() {
  const [flag, setFlag] = useState<Flag | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      const latest = await getHeaderFlagAction();
      setFlag(latest);
    });
  };

  return (
    <section style={{ fontFamily: "sans-serif", padding: "1rem", border: "1px solid #e5e5e5" }}>
      <h2>Server Function Demo</h2>
      <p>
        This button calls a Next.js Server Action that uses the Basestack server SDK to fetch the
        <code>header</code> flag before returning the result to the client.
      </p>
      <button type="button" onClick={handleRefresh} disabled={isPending}>
        {isPending ? "Loading flag…" : "Invoke server function"}
      </button>
      {flag ? (
        <pre style={{ marginTop: "1rem", background: "#111", color: "#0f0", padding: "1rem" }}>
          {JSON.stringify({ enabled: flag.enabled, payload: flag.payload }, null, 2)}
        </pre>
      ) : (
        <p style={{ marginTop: "1rem" }}>No flag fetched yet.</p>
      )}
    </section>
  );
}
