"use client";

export { FlagsProvider } from "./provider";
export type { FlagsProviderProps } from "./provider";
export { useFlag, useFlags, useFlagsClient } from "./hooks";
export type { UseFlagOptions, UseFlagResult } from "./hooks";
export { readHydratedFlags, DEFAULT_FLAGS_GLOBAL } from "./hydration";
export type { Flag, CacheConfig, SDKConfig } from "@basestack/flags-js";
export { FlagsSDK } from "@basestack/flags-js";
