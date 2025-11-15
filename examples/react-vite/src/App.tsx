import { useFlag } from "../../../dist/client";

export function App() {
  const { enabled, payload, isLoading, refresh } = useFlag<{
    color?: string;
  }>("header");

  return (
    <section style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>React + Vite Example</h1>
      <p>
        Flag <code>header</code> is{" "}
        {isLoading ? "checking" : enabled ? "enabled" : "disabled"}
      </p>
      {enabled && payload ? (
        <p>Payload: {JSON.stringify(payload, null, 2)}</p>
      ) : null}
      <button type="button" onClick={() => refresh()}>
        Refresh flag
      </button>
    </section>
  );
}
