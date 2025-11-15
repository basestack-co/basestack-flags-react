import { fetchFlags } from "../../../../dist/server";
import { flagsConfig } from "../flags-config";
import { ServerActionDemo } from "./ServerActionDemo";

export const metadata = {
  title: "Server Functions Demo",
};

export default async function ServerFunctionsPage() {
  const flags = await fetchFlags(flagsConfig);

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Server Functions / Server Actions</h1>
      <p>This page renders entirely on the server and lists the current flags.</p>
      <ul>
        {flags.map((flag) => (
          <li key={flag.slug}>
            <strong>{flag.slug}</strong>: {flag.enabled ? "enabled" : "disabled"}
          </li>
        ))}
      </ul>
      <ServerActionDemo />
    </main>
  );
}
