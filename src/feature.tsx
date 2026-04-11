"use client";

import type { ReactNode } from "react";
import { type UseFlagOptions, type UseFlagResult, useFlag } from "./hooks";

export type FeatureRenderContent<TPayload = unknown> =
  | ReactNode
  | ((flag: UseFlagResult<TPayload>) => ReactNode);

export interface FeatureProps<TPayload = unknown>
  extends UseFlagOptions<TPayload> {
  readonly slug: string;
  readonly children?: FeatureRenderContent<TPayload>;
  readonly fallback?: FeatureRenderContent<TPayload>;
  readonly loading?: FeatureRenderContent<TPayload>;
}

const renderContent = <TPayload,>(
  content: FeatureRenderContent<TPayload> | undefined,
  flag: UseFlagResult<TPayload>,
) => {
  if (typeof content === "function") {
    return content(flag);
  }

  return content ?? null;
};

export const Feature = <TPayload = unknown>({
  slug,
  children,
  fallback,
  loading,
  ...options
}: FeatureProps<TPayload>) => {
  const flag = useFlag<TPayload>(slug, options);

  if (typeof children === "function") {
    return <>{children(flag)}</>;
  }

  if (flag.isLoading && loading !== undefined) {
    return <>{renderContent(loading, flag)}</>;
  }

  if (flag.enabled) {
    return <>{renderContent(children, flag)}</>;
  }

  return <>{renderContent(fallback, flag)}</>;
};
