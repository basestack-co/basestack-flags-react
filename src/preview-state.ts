"use client";

/** LocalStorage key where preview-enabled flag keys are stored by @basestack/flags-wc */
export const BS_FLAGS_PREVIEW_STATE_KEY = "bs-flags-preview-state";

/**
 * Reads the preview state from localStorage.
 * When a user enables a feature in the preview modal, the flag key is stored here.
 * After refresh, useFlag will consider this and return enabled: true for those keys.
 */
export function getPreviewState(): Record<string, boolean> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(BS_FLAGS_PREVIEW_STATE_KEY);
    if (raw == null) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return {};
    const result: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof key === "string" && value === true) result[key] = true;
    }
    return result;
  } catch {
    return {};
  }
}
