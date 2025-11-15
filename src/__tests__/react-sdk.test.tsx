import type { Flag, SDKConfig } from "@basestack/flags-js";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_FLAGS_GLOBAL,
  FlagsProvider,
  readHydratedFlags,
  useFlag,
  useFlags,
} from "../client";
import { FlagsHydrationScript } from "../server";

const flagsStore: Record<string, Flag> = {};

const setMockFlags = (flags: Flag[]) => {
  Object.keys(flagsStore).forEach((slug) => {
    delete flagsStore[slug];
  });
  for (const flag of flags) {
    flagsStore[flag.slug] = flag;
  }
};

vi.mock("@basestack/flags-js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@basestack/flags-js")>();

  class MockFlagsSDK {
    readonly config: SDKConfig;

    constructor(config: SDKConfig) {
      this.config = config;
    }

    async getFlag(slug: string): Promise<Flag> {
      const flag = flagsStore[slug];
      if (!flag) {
        throw new Error(`Flag ${slug} was not found`);
      }

      return flag;
    }

    async getAllFlags(): Promise<{ flags: Flag[] }> {
      return {
        flags: Object.values(flagsStore),
      };
    }
  }

  return {
    ...actual,
    FlagsSDK: MockFlagsSDK,
  };
});

const createFlag = (overrides: Partial<Flag> = {}): Flag => ({
  slug: "beta",
  enabled: true,
  payload: { variant: "A" },
  expiredAt: null,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  description: "test flag",
  ...overrides,
});

const config: SDKConfig = {
  projectKey: "test-project",
  environmentKey: "test-env",
};

const createWrapper = (
  value: Partial<Parameters<typeof FlagsProvider>[0]> = {},
) => {
  const props = { config, preload: false, ...value } satisfies Partial<
    Parameters<typeof FlagsProvider>[0]
  >;

  return ({ children }: { children: ReactNode }) => (
    <FlagsProvider {...props}>{children}</FlagsProvider>
  );
};

describe("FlagsProvider + hooks", () => {
  beforeEach(() => {
    setMockFlags([
      createFlag(),
      createFlag({ slug: "secondary", enabled: false }),
    ]);
  });

  it("exposes initial flags immediately", () => {
    const wrapper = createWrapper({ initialFlags: [createFlag()] });
    const { result } = renderHook(() => useFlag("beta"), { wrapper });

    expect(result.current.flag?.slug).toBe("beta");
    expect(result.current.enabled).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("fetches missing flags once and shares cache", async () => {
    const wrapper = createWrapper({ initialFlags: [createFlag()] });

    const { result } = renderHook(
      () => ({
        single: useFlag("secondary"),
        collection: useFlags(),
      }),
      { wrapper },
    );

    expect(result.current.single.isLoading).toBe(true);

    await act(async () => {
      await result.current.single.refresh();
    });

    expect(result.current.single.flag?.slug).toBe("secondary");
    expect(result.current.collection.flagsBySlug.secondary.enabled).toBe(false);
    expect(result.current.collection.flags).toHaveLength(2);
  });
});

describe("hydration helpers", () => {
  it("renders a safe hydration script", () => {
    const markup = renderToStaticMarkup(
      <FlagsHydrationScript flags={[createFlag({ payload: "<script>" })]} />,
    );

    expect(markup).toContain(DEFAULT_FLAGS_GLOBAL);
    expect(markup).toContain("\\u003Cscript");
    expect(markup).not.toContain("<script>"); // script text stays escaped inside JSON
  });

  it("reads hydrated flags from the window object", () => {
    const flags = [createFlag({ slug: "hydrated" })];
    (window as typeof window & Record<string, Flag[]>)[DEFAULT_FLAGS_GLOBAL] =
      flags;

    expect(readHydratedFlags()).toEqual(flags);

    delete (window as typeof window & Record<string, Flag[]>)[
      DEFAULT_FLAGS_GLOBAL
    ];
  });
});
