"use client";

export type { CacheConfig, Flag, SDKConfig } from "@basestack/flags-js";
export { FlagsSDK } from "@basestack/flags-js";
export type { FeatureProps, FeatureRenderContent } from "./feature";
export { Feature } from "./feature";
export type { UseFlagOptions, UseFlagResult } from "./hooks";
export { useFlag, useFlags, useFlagsClient } from "./hooks";
export { DEFAULT_FLAGS_GLOBAL, readHydratedFlags } from "./hydration";
export { BS_FLAGS_PREVIEW_STATE_KEY, getPreviewState } from "./preview-state";
export type { FlagsProviderProps } from "./provider";
export { FlagsProvider } from "./provider";
export type {
  FeatureFlagFeedbackModalConfig,
  FeatureFlagModalsConfig,
  FeatureFlagModalsProviderProps,
  FeatureFlagPreviewModalConfig,
  OpenFeedbackModalOptions,
} from "./wc-modals";
export {
  FeatureFlagModalsProvider,
  useFeatureFlagModals,
  useFeatureFlagModalsOptional,
} from "./wc-modals";
