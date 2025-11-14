import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Flag } from "@basestack/flags-js";
import { useFlagsContext } from "./context";

export interface UseFlagOptions<TPayload = unknown> {
  readonly defaultEnabled?: boolean;
  readonly defaultPayload?: TPayload;
  readonly fetch?: boolean;
}

export interface UseFlagResult<TPayload = unknown> {
  readonly flag?: Flag;
  readonly enabled: boolean;
  readonly payload: TPayload | undefined;
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly refresh: () => Promise<Flag | undefined>;
}

export const useFlag = <TPayload = unknown>(
  slug: string,
  options?: UseFlagOptions<TPayload>,
): UseFlagResult<TPayload> => {
  if (!slug) {
    throw new Error("useFlag requires a non-empty flag slug.");
  }

  const { flags, loading: providerLoading, error: providerError, client, upsertFlag } = useFlagsContext();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<Error | null>(null);
  const requestedRef = useRef(false);
  const slugRef = useRef(slug);

  if (slugRef.current !== slug) {
    slugRef.current = slug;
    requestedRef.current = false;
  }

  const cachedFlag = flags.get(slug);

  const refresh = useCallback(async () => {
    setLocalLoading(true);
    setLocalError(null);

    try {
      const flag = await client.getFlag(slug);
      upsertFlag(flag);
      return flag;
    } catch (err) {
      const resolved = err instanceof Error ? err : new Error(String(err));
      setLocalError(resolved);
      return undefined;
    } finally {
      setLocalLoading(false);
    }
  }, [client, slug, upsertFlag]);

  useEffect(() => {
    if (!cachedFlag && options?.fetch !== false && !providerLoading && !requestedRef.current) {
      requestedRef.current = true;
      void refresh();
    } else if (cachedFlag) {
      requestedRef.current = true;
    }
  }, [cachedFlag, options?.fetch, providerLoading, refresh]);

  const enabled = cachedFlag?.enabled ?? options?.defaultEnabled ?? false;
  const payload = (cachedFlag?.payload ?? options?.defaultPayload) as TPayload | undefined;

  return {
    flag: cachedFlag,
    enabled,
    payload,
    isLoading: providerLoading || localLoading || (!cachedFlag && !requestedRef.current),
    error: localError ?? providerError,
    refresh,
  };
};

export const useFlags = () => {
  const { flags, loading, error, refresh } = useFlagsContext();

  const flagList = useMemo(() => Array.from(flags.values()), [flags]);
  const flagRecord = useMemo(() => Object.fromEntries(flags) as Record<string, Flag>, [flags]);

  return {
    flags: flagList,
    flagsBySlug: flagRecord,
    isLoading: loading,
    error,
    refresh,
  };
};

export const useFlagsClient = () => {
  const { client } = useFlagsContext();
  return client;
};
