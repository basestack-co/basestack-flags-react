import type { FeatureFlagModalsConfig } from "../../../dist/client";

export const flagsWcConfig: FeatureFlagModalsConfig = {
  preview: {
    theme: "light",
    heading: "Feature Preview",
    subtitle:
      "Select and enable previews that fit your workflow.",
    selectionPrompt: "Choose a preview to view",
    selectionPlaceholder:
      "Select a feature on the left to see more details.",
    enableLabel: "Enable",
    enabledLabel: "Disable",
    loadingLabel: "Loading feature previews…",
    emptyLabel: "No feature previews are currently available.",
    previewBadgeLabel: "Preview",
    expiresSoonLabel: "Expiring soon",
    learnMoreLabel: "Learn more",
  },
  feedback: {
    theme: "light",
    heading: "Feedback",
    moodPrompt: "How did this feature make you feel?",
    ratingPrompt: "How would you rate the quality of this feature?",
    feedbackLabel: "Your Feedback",
    feedbackPlaceholder:
      "Is there anything you'd like to share? We appreciate your insights.",
    submitLabel: "Submit Feedback",
    privacyPolicyUrl: "https://basestack.co/legal/privacy",
    privacyPolicyLabel:
      "To help keep your data safe, please don't include any personal or sensitive information.",
    privacyPolicyLinkLabel: "More details",
  },
};
