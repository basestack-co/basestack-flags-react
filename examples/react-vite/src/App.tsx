import { useFlag } from "@basestack/flags-react";

export function App() {
  const { enabled, payload, isLoading, refresh } = useFlag<{
    variant?: string;
  }>("header");

  return (
    <section style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>React + Vite Example</h1>
      <p>
        Flag <code>header</code> is{" "}
        {isLoading ? "checking" : enabled ? "enabled" : "disabled"}
      </p>
      {enabled && payload?.variant ? <p>Variant: {payload.variant}</p> : null}
      <button type="button" onClick={() => refresh()}>
        Refresh flag
      </button>
    </section>
  );
}
