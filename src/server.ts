import type { Flag, SDKConfig } from "@basestack/flags-js";
import { FlagsSDK } from "@basestack/flags-js";

export const createServerFlagsClient = (config: SDKConfig): FlagsSDK =>
  new FlagsSDK(config);

export const fetchFlag = async (
  slug: string,
  config: SDKConfig,
): Promise<Flag> => {
  if (!slug) {
    throw new Error("fetchFlag requires a flag slug.");
  }

  const client = createServerFlagsClient(config);
  return client.getFlag(slug);
};

export const fetchFlags = async (
  config: SDKConfig,
  slugs?: string[],
  options?: {
    fallback?: Flag[];
    onError?: (error: unknown) => void;
  },
): Promise<Flag[]> => {
  const client = createServerFlagsClient(config);
  const fallback = options?.fallback ?? [];

  try {
    if (slugs && slugs.length > 0) {
      const results = await Promise.allSettled(
        slugs.map((slug) => client.getFlag(slug)),
      );

      const flags = results
        .filter(
          (r): r is PromiseFulfilledResult<Flag> => r.status === "fulfilled",
        )
        .map((r) => r.value);

      if (flags.length !== slugs.length) {
        options?.onError?.(new Error("Some flags could not be fetched."));

        return fallback;
      }

      return flags;
    }

    const { flags } = await client.getAllFlags();

    return flags;
  } catch (error) {
    options?.onError?.(error);
    return fallback;
  }
};

export type { CacheConfig, Flag, SDKConfig } from "@basestack/flags-js";
export { FlagsSDK } from "@basestack/flags-js";
export { DEFAULT_FLAGS_GLOBAL, FlagsHydrationScript } from "./hydration";
