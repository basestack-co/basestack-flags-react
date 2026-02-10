import type { RefAttributes } from "react";

export interface FeatureFlagPreviewModalElement extends HTMLElement {
  open: boolean;
}

export interface FeatureFlagFeedbackModalElement extends HTMLElement {
  open: boolean;
  flagKey: string;
  featureName?: string;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "feature-flag-preview-modal": RefAttributes<FeatureFlagPreviewModalElement> & {
        "api-endpoint": string;
        "project-key": string;
        "environment-key": string;
      } & Partial<{
          theme: string;
          heading: string;
          subtitle: string;
          "selection-prompt": string;
          "selection-placeholder": string;
          "enable-label": string;
          "enabled-label": string;
          "loading-label": string;
          "empty-label": string;
          "preview-badge-label": string;
          "expires-soon-label": string;
          "learn-more-label": string;
        }>;

      "feature-flag-feedback-modal": RefAttributes<FeatureFlagFeedbackModalElement> & {
        "api-endpoint": string;
        "project-key": string;
        "environment-key": string;
      } & Partial<{
          theme: string;
          "flag-key": string;
          "feature-name": string;
          heading: string;
          "mood-prompt": string;
          "rating-prompt": string;
          "feedback-label": string;
          "feedback-placeholder": string;
          "submit-label": string;
          "privacy-policy-url": string;
          "privacy-policy-label": string;
          "privacy-policy-link-label": string;
        }>;
    }
  }
}
