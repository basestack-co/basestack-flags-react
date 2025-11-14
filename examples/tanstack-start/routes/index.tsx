import { useFlag } from "@basestack/flags-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { enabled, payload, isLoading } = useFlag<{ variant?: string }>(
    "header",
  );

  return (
    <section style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>TanStack Start Example</h1>
      <p>
        Flag <code>header</code> is{" "}
        {isLoading ? "checking" : enabled ? "enabled" : "disabled"}
      </p>
      {enabled && payload?.variant ? <p>Variant: {payload.variant}</p> : null}
    </section>
  );
}
