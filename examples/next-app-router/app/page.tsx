"use client";

import { useFlag, useFeatureFlagModals, Feature } from "../../../dist/client";

export default function HomePage() {
  const {
    enabled,
    payload,
    isLoading,
    openFeedbackModal: openHeaderFeedbackModal,
  } = useFlag<{ variant?: string }>("initiative_overview");
  const {
    ready,
    error: modalsError,
    openPreviewModal,
    openFeedbackModal,
  } = useFeatureFlagModals();

  if (isLoading)
    return <p style={{ fontFamily: "sans-serif" }}>Checking feature flags…</p>;

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Next.js App Router Example</h1>
      <p>
        Flag <code>header</code> is {enabled ? "enabled" : "disabled"}
      </p>
      {enabled && payload ? (
        <p>Variant: {JSON.stringify(payload, null, 2)}</p>
      ) : null}
      {enabled ? (
        <button
          type="button"
          onClick={() =>
            openHeaderFeedbackModal({
              featureName: "Initiative Overview",
              metadata: {
                userId: "usr_001",
                subscription: "pro",
                source: "initiative-overview",
              },
            })
          }
          disabled={!ready}
          style={{
            marginTop: "0.5rem",
            padding: "0.25rem 0.5rem",
            fontSize: "0.875rem",
          }}
        >
          Leave feedback for this feature
        </button>
      ) : null}

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>
          Feature flag modals
        </h2>
        {modalsError ? (
          <p style={{ color: "crimson" }}>
            Modals unavailable: {modalsError.message}. Ensure @basestack/flags-wc
            is installed and components are registered.
          </p>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={openPreviewModal}
            disabled={!ready}
            style={{ padding: "0.5rem 0.75rem", maxWidth: "20rem" }}
          >
            Open feature preview modal
          </button>
          <button
            type="button"
            onClick={() =>
              openFeedbackModal("initiative_overview", {
                featureName: "Initiative Overview",
                metadata: {
                  userId: "usr_001",
                  subscription: "pro",
                  source: "initiative-overview",
                },
              })
            }
            disabled={!ready}
            style={{
              marginTop: "0.25rem",
              padding: "0.5rem 0.75rem",
              maxWidth: "20rem",
            }}
          >
            Leave feedback for “initiative overview”
          </button>
        </div>


        <Feature slug="initiative_overview">
          <article className="card accent">
            <h2>Component reference</h2>
            <p>initiative_overview is wrapped in a Feature component.</p>
          </article>
        </Feature>
      </section>
    </main>
  );
}
