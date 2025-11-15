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
): Promise<Flag[]> => {
  const client = createServerFlagsClient(config);

  if (slugs && slugs.length > 0) {
    return Promise.all(slugs.map((slug) => client.getFlag(slug)));
  }

  const { flags } = await client.getAllFlags();
  return flags;
};

export {
  FlagsHydrationScript,
  DEFAULT_FLAGS_GLOBAL,
} from "./hydration";
export type { CacheConfig, Flag, SDKConfig } from "@basestack/flags-js";
export { FlagsSDK } from "@basestack/flags-js";
