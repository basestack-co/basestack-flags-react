import type { Flag, SDKConfig } from "@basestack/flags-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createServerFlagsClient, fetchFlag, fetchFlags } from "../server";

const getFlag = vi.fn<(slug: string) => Promise<Flag>>();
const getAllFlags = vi.fn<() => Promise<{ flags: Flag[] }>>();
const createdConfigs: SDKConfig[] = [];

vi.mock("@basestack/flags-js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@basestack/flags-js")>();

  class MockFlagsSDK {
    readonly config: SDKConfig;

    constructor(config: SDKConfig) {
      createdConfigs.push(config);
      this.config = config;
    }

    getFlag = getFlag;
    getAllFlags = getAllFlags;
  }

  return {
    ...actual,
    FlagsSDK: MockFlagsSDK,
  };
});

const config: SDKConfig = {
  projectKey: "server-test",
  environmentKey: "dev",
};

const sampleFlag: Flag = {
  slug: "header",
  enabled: true,
  payload: { variant: "A" },
  expiredAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  description: "demo",
};

beforeEach(() => {
  createdConfigs.length = 0;
  getFlag.mockReset();
  getAllFlags.mockReset();
  getFlag.mockResolvedValue(sampleFlag);
  getAllFlags.mockResolvedValue({ flags: [sampleFlag] });
});

describe("server helpers", () => {
  it("creates a server client using the provided config", () => {
    const client = createServerFlagsClient(config);
    expect(client).toBeDefined();
    expect(createdConfigs).toContain(config);
  });

  it("fetchFlag throws when slug is missing", async () => {
    await expect(fetchFlag("", config)).rejects.toThrow(
      "fetchFlag requires a flag slug.",
    );
  });

  it("fetchFlag delegates to the SDK", async () => {
    const flag = await fetchFlag("header", config);
    expect(getFlag).toHaveBeenCalledWith("header");
    expect(flag).toEqual(sampleFlag);
  });

  it("fetchFlags fetches a specific set of slugs", async () => {
    await fetchFlags(config, ["a", "b"]);
    expect(getFlag).toHaveBeenNthCalledWith(1, "a");
    expect(getFlag).toHaveBeenNthCalledWith(2, "b");
  });

  it("fetchFlags loads every flag when slugs are omitted", async () => {
    const flags = await fetchFlags(config);
    expect(getAllFlags).toHaveBeenCalled();
    expect(flags).toEqual([sampleFlag]);
  });
});
