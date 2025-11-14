import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Flag, SDKConfig } from "@basestack/flags-js";
import { FlagsSDK } from "@basestack/flags-js";
import { FlagsContext } from "./context";

export interface FlagsProviderProps {
  readonly config: SDKConfig;
  readonly children: ReactNode;
  readonly initialFlags?: Flag[];
  readonly preload?: boolean;
  readonly onError?: (error: Error) => void;
}

const EMPTY_FLAGS: Flag[] = [];

const mapFromFlags = (flags: Flag[]): Map<string, Flag> => {
  const next = new Map<string, Flag>();

  for (const flag of flags) {
    next.set(flag.slug, flag);
  }

  return next;
};

export function FlagsProvider({
  config,
  children,
  initialFlags,
  preload = true,
  onError,
}: FlagsProviderProps) {
  const providedFlags = initialFlags ?? EMPTY_FLAGS;
  const hasInitialFlags = providedFlags.length > 0;
  const [flags, setFlags] = useState<Map<string, Flag>>(() => mapFromFlags(providedFlags));
  const [loading, setLoading] = useState<boolean>(preload && !hasInitialFlags);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  const client = useMemo(() => new FlagsSDK(config), [config]);

  const safeSetFlags = useCallback(
    (updater: (previous: Map<string, Flag>) => Map<string, Flag>) => {
      if (!isMounted.current) return;
      setFlags(updater);
    },
    [],
  );

  const safeSetLoading = useCallback((value: boolean) => {
    if (!isMounted.current) return;
    setLoading(value);
  }, []);

  const safeSetError = useCallback((value: Error | null) => {
    if (!isMounted.current) return;
    setError(value);
  }, []);

  useEffect(() => {
    if (!initialFlags || initialFlags.length === 0) return;
    safeSetFlags(() => mapFromFlags(initialFlags));
  }, [initialFlags, safeSetFlags]);

  useEffect(() => {
    if (hasInitialFlags) {
      safeSetLoading(false);
    }
  }, [hasInitialFlags, safeSetLoading]);

  const upsertFlag = useCallback(
    (flag: Flag) => {
      safeSetFlags((previous) => {
        const next = new Map(previous);
        next.set(flag.slug, flag);
        return next;
      });
    },
    [safeSetFlags],
  );

  const upsertFlags = useCallback(
    (list: Flag[]) => {
      safeSetFlags((previous) => {
        const next = new Map(previous);

        for (const flag of list) {
          next.set(flag.slug, flag);
        }

        return next;
      });
    },
    [safeSetFlags],
  );

  const normalizeError = useCallback(
    (err: unknown) => {
      const resolved = err instanceof Error ? err : new Error(String(err));
      safeSetError(resolved);
      onError?.(resolved);
      return resolved;
    },
    [onError, safeSetError],
  );

  const fetchAllOrPreload = useCallback(async () => {
    if (config.preloadFlags && config.preloadFlags.length > 0) {
      const fetched = await Promise.all(config.preloadFlags.map((slug) => client.getFlag(slug)));
      upsertFlags(fetched);
      return;
    }

    const { flags: fetched } = await client.getAllFlags();
    upsertFlags(fetched);
  }, [client, config.preloadFlags, upsertFlags]);

  const refresh = useCallback(async () => {
    safeSetLoading(true);
    safeSetError(null);

    try {
      await fetchAllOrPreload();
    } catch (err) {
      throw normalizeError(err);
    } finally {
      safeSetLoading(false);
    }
  }, [fetchAllOrPreload, normalizeError, safeSetError, safeSetLoading]);

  useEffect(() => {
    if (!preload || hasInitialFlags) {
      safeSetLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      safeSetLoading(true);
      safeSetError(null);

      try {
        await fetchAllOrPreload();
      } catch (err) {
        const resolved = normalizeError(err);
        if (cancelled) throw resolved;
      } finally {
        if (!cancelled) {
          safeSetLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [fetchAllOrPreload, hasInitialFlags, normalizeError, preload, safeSetError, safeSetLoading]);

  const value = useMemo(
    () => ({
      client,
      flags,
      loading,
      error,
      refresh,
      upsertFlag,
    }),
    [client, error, flags, loading, refresh, upsertFlag],
  );

  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}
