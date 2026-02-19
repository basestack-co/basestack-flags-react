"use client";

import { registerFeatureFlagComponents } from "@basestack/flags-wc";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFlagsContext } from "./context";
import type {
  FeatureFlagFeedbackModalElement,
  FeatureFlagPreviewModalElement,
} from "./wc";

export interface FeatureFlagPreviewModalConfig {
  theme?: "light" | "dark";
  /** When omitted, uses baseURL from FlagsProvider config + "/flags/preview". */
  apiEndpoint?: string;
  /** When omitted, uses projectKey from FlagsProvider config. */
  projectKey?: string;
  /** When omitted, uses environmentKey from FlagsProvider config. */
  environmentKey?: string;
  heading?: string;
  subtitle?: string;
  selectionPrompt?: string;
  selectionPlaceholder?: string;
  enableLabel?: string;
  enabledLabel?: string;
  loadingLabel?: string;
  emptyLabel?: string;
  previewBadgeLabel?: string;
  expiresSoonLabel?: string;
  learnMoreLabel?: string;
}

export interface FeatureFlagFeedbackModalConfig {
  theme?: "light" | "dark";
  /** When omitted, uses baseURL from FlagsProvider config + "/flags/preview/feedback". */
  apiEndpoint?: string;
  /** When omitted, uses projectKey from FlagsProvider config. */
  projectKey?: string;
  /** When omitted, uses environmentKey from FlagsProvider config. */
  environmentKey?: string;
  heading?: string;
  moodPrompt?: string;
  ratingPrompt?: string;
  feedbackLabel?: string;
  feedbackPlaceholder?: string;
  submitLabel?: string;
  privacyPolicyUrl?: string;
  privacyPolicyLabel?: string;
  privacyPolicyLinkLabel?: string;
}

export interface FeatureFlagModalsConfig {
  preview: FeatureFlagPreviewModalConfig;
  feedback: FeatureFlagFeedbackModalConfig;
}

export interface OpenFeedbackModalOptions {
  featureName?: string;
  metadata?: Record<string, unknown>;
}

interface FeatureFlagModalsContextValue {
  ready: boolean;
  error: Error | null;
  openPreviewModal: () => void;
  openFeedbackModal: (
    flagKey: string,
    options?: OpenFeedbackModalOptions,
  ) => void;
}

const FeatureFlagModalsContext =
  createContext<FeatureFlagModalsContextValue | null>(null);

export function useFeatureFlagModals(): FeatureFlagModalsContextValue {
  const ctx = useContext(FeatureFlagModalsContext);
  if (!ctx) {
    throw new Error(
      "useFeatureFlagModals must be used within FeatureFlagModalsProvider.",
    );
  }
  return ctx;
}

/** Returns modals API or null when not inside FeatureFlagModalsProvider. Use from useFlag to optionally open the feedback modal. */
export function useFeatureFlagModalsOptional(): FeatureFlagModalsContextValue | null {
  return useContext(FeatureFlagModalsContext);
}

export interface FeatureFlagModalsProviderProps {
  config: FeatureFlagModalsConfig;
  children: ReactNode;
  onError?: (error: Error) => void;
}

export function FeatureFlagModalsProvider({
  config,
  children,
  onError,
}: FeatureFlagModalsProviderProps) {
  const { projectKey, environmentKey, baseURL } = useFlagsContext();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const previewRef = useRef<FeatureFlagPreviewModalElement | null>(null);
  const feedbackRef = useRef<FeatureFlagFeedbackModalElement | null>(null);

  const resolvedProjectKey = config.preview.projectKey ?? projectKey;
  const resolvedEnvironmentKey =
    config.preview.environmentKey ?? environmentKey;
  const resolvedPreviewEndpoint =
    config.preview.apiEndpoint ?? `${baseURL}/flags/preview`;
  const resolvedFeedbackEndpoint =
    config.feedback.apiEndpoint ?? `${baseURL}/flags/preview/feedback`;

  useEffect(() => {
    let cancelled = false;

    registerFeatureFlagComponents()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err: unknown) => {
        const resolved = err instanceof Error ? err : new Error(String(err));
        if (!cancelled) {
          setError(resolved);
          onError?.(resolved);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [onError]);

  const openPreviewModal = useCallback(() => {
    const el = previewRef.current;
    if (el) el.open = true;
  }, []);

  const openFeedbackModal = useCallback(
    (flagKey: string, options?: OpenFeedbackModalOptions) => {
      const el = feedbackRef.current;
      if (!el) return;
      el.setAttribute("flag-key", flagKey);
      if (options?.featureName != null) {
        el.setAttribute("feature-name", options.featureName);
      } else {
        el.removeAttribute("feature-name");
      }
      el.metadata = options?.metadata;
      el.open = true;
    },
    [],
  );

  const value = useMemo<FeatureFlagModalsContextValue>(
    () => ({
      ready,
      error,
      openPreviewModal,
      openFeedbackModal,
    }),
    [error, openFeedbackModal, openPreviewModal, ready],
  );

  const { preview, feedback } = config;
  const theme = preview.theme ?? "light";

  return (
    <FeatureFlagModalsContext.Provider value={value}>
      {children}
      {ready && (
        <>
          <feature-flag-preview-modal
            ref={previewRef}
            theme={theme}
            api-endpoint={resolvedPreviewEndpoint}
            project-key={resolvedProjectKey}
            environment-key={resolvedEnvironmentKey}
            heading={preview.heading}
            subtitle={preview.subtitle}
            selection-prompt={preview.selectionPrompt}
            selection-placeholder={preview.selectionPlaceholder}
            enable-label={preview.enableLabel}
            enabled-label={preview.enabledLabel}
            loading-label={preview.loadingLabel}
            empty-label={preview.emptyLabel}
            preview-badge-label={preview.previewBadgeLabel}
            expires-soon-label={preview.expiresSoonLabel}
            learn-more-label={preview.learnMoreLabel}
          />
          <feature-flag-feedback-modal
            ref={feedbackRef}
            flag-key=""
            theme={feedback.theme ?? theme}
            api-endpoint={resolvedFeedbackEndpoint}
            project-key={feedback.projectKey ?? resolvedProjectKey}
            environment-key={feedback.environmentKey ?? resolvedEnvironmentKey}
            heading={feedback.heading}
            mood-prompt={feedback.moodPrompt}
            rating-prompt={feedback.ratingPrompt}
            feedback-label={feedback.feedbackLabel}
            feedback-placeholder={feedback.feedbackPlaceholder}
            submit-label={feedback.submitLabel}
            privacy-policy-url={feedback.privacyPolicyUrl}
            privacy-policy-label={feedback.privacyPolicyLabel}
            privacy-policy-link-label={feedback.privacyPolicyLinkLabel}
          />
        </>
      )}
    </FeatureFlagModalsContext.Provider>
  );
}
