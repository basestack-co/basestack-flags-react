import type { Flag } from "@basestack/flags-js";
import { useFlag } from "@basestack/flags-react/client";
import { fetchFlags } from "@basestack/flags-react/server";
import type { GetServerSideProps } from "next";
import { flagsConfig } from "../flags-config";

export default function Home({ flags }: { flags: Flag[] }) {
  // Client components can still call useFlag thanks to the provider in _app
  const { enabled, payload, isLoading } = useFlag<{ variant?: string }>(
    "header",
  );

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Next.js Pages Router Example</h1>
      <p>Server delivered {flags.length} flag(s).</p>
      <p>
        Flag <code>header</code> is{" "}
        {isLoading ? "loading" : enabled ? "enabled" : "disabled"}
      </p>
      {enabled && payload?.variant ? <p>Variant: {payload.variant}</p> : null}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<{
  flags: Flag[];
}> = async () => {
  const flags = await fetchFlags(flagsConfig);

  return {
    props: { flags },
  };
};
