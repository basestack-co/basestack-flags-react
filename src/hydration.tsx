import type { Flag } from "@basestack/flags-js";

export const DEFAULT_FLAGS_GLOBAL = "__BASESTACK_FLAGS__";

export interface FlagsHydrationScriptProps {
  readonly flags: Flag[];
  readonly id?: string;
  readonly nonce?: string;
  readonly globalKey?: string;
}

const encodeFlagsForScript = (flags: Flag[]) => JSON.stringify(flags).replace(/</g, "\\u003C");

export function FlagsHydrationScript({
  flags,
  id = "basestack-flags-hydration",
  nonce,
  globalKey = DEFAULT_FLAGS_GLOBAL,
}: FlagsHydrationScriptProps) {
  const payload = encodeFlagsForScript(flags);
  const script = `globalThis[${JSON.stringify(globalKey)}] = ${payload};`;

  return (
    <script
      id={id}
      nonce={nonce}
      suppressHydrationWarning
    >
      {script}
    </script>
  );
}

interface HydratedWindow extends Window {
  [key: string]: unknown;
}

export const readHydratedFlags = (globalKey = DEFAULT_FLAGS_GLOBAL): Flag[] | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const flags = (window as HydratedWindow)[globalKey];
  return Array.isArray(flags) ? (flags as Flag[]) : undefined;
};
