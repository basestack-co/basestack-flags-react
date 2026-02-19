import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { useFlag } from "../hooks";
import { FlagsProvider } from "../provider";
import type { FeatureFlagFeedbackModalElement } from "../wc";
import { FeatureFlagModalsProvider, useFeatureFlagModals } from "../wc-modals";

const flagsConfig = {
  projectKey: "test-project",
  environmentKey: "test-environment",
};

const modalsConfig = {
  preview: {},
  feedback: {},
};

const Providers = ({ children }: { children: ReactNode }) => (
  <FlagsProvider config={flagsConfig} preload={false}>
    <FeatureFlagModalsProvider config={modalsConfig}>
      {children}
    </FeatureFlagModalsProvider>
  </FlagsProvider>
);

function ModalsHarness() {
  const { ready, openFeedbackModal } = useFeatureFlagModals();

  return (
    <section>
      <span data-testid="ready-state">{ready ? "ready" : "loading"}</span>
      <button
        type="button"
        onClick={() =>
          openFeedbackModal("checkout", {
            featureName: "Checkout",
            metadata: {
              userId: "usr_123",
              subscription: "pro",
              experiments: ["checkout-redesign"],
            },
          })
        }
      >
        Open with metadata
      </button>
      <button type="button" onClick={() => openFeedbackModal("checkout")}>
        Open without metadata
      </button>
    </section>
  );
}

function UseFlagHarness() {
  const { openFeedbackModal } = useFlag("header", { fetch: false });

  return (
    <button
      type="button"
      onClick={() =>
        openFeedbackModal({
          featureName: "Header",
          metadata: { userId: "usr_456", plan: "business" },
        })
      }
    >
      Open from useFlag
    </button>
  );
}

const getFeedbackModal = (): FeatureFlagFeedbackModalElement => {
  const el = document.querySelector("feature-flag-feedback-modal");
  expect(el).not.toBeNull();
  return el as FeatureFlagFeedbackModalElement;
};

describe("FeatureFlagModalsProvider", () => {
  it("sets metadata when opening feedback modal and clears it when omitted", async () => {
    render(<ModalsHarness />, { wrapper: Providers });

    await waitFor(() => {
      expect(screen.getByTestId("ready-state").textContent).toBe("ready");
    });

    fireEvent.click(screen.getByRole("button", { name: "Open with metadata" }));

    const modal = getFeedbackModal();
    expect(modal.open).toBe(true);
    expect(modal.getAttribute("flag-key")).toBe("checkout");
    expect(modal.getAttribute("feature-name")).toBe("Checkout");
    expect(modal.metadata).toEqual({
      userId: "usr_123",
      subscription: "pro",
      experiments: ["checkout-redesign"],
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Open without metadata" }),
    );

    expect(modal.getAttribute("feature-name")).toBeNull();
    expect(modal.metadata).toBeUndefined();
  });

  it("allows useFlag.openFeedbackModal to forward metadata and featureName", async () => {
    render(<UseFlagHarness />, { wrapper: Providers });

    await waitFor(() => {
      expect(
        document.querySelector("feature-flag-feedback-modal"),
      ).not.toBeNull();
    });

    fireEvent.click(screen.getByRole("button", { name: "Open from useFlag" }));

    const modal = getFeedbackModal();
    expect(modal.getAttribute("flag-key")).toBe("header");
    expect(modal.getAttribute("feature-name")).toBe("Header");
    expect(modal.metadata).toEqual({
      userId: "usr_456",
      plan: "business",
    });
  });
});
