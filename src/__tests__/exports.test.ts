import { describe, expectTypeOf, it } from "vitest";
import type { CacheConfig as ClientCacheConfig } from "../client";
import type { Flag as ClientFlag } from "../client";
import type { SDKConfig as ClientSDKConfig } from "../client";
import type { CacheConfig as RootCacheConfig } from "../index";
import type { Flag as RootFlag } from "../index";
import type { SDKConfig as RootSDKConfig } from "../index";
import type { FlagsProviderProps } from "../provider";
import type { CacheConfig as ServerCacheConfig } from "../server";
import type { Flag as ServerFlag } from "../server";
import type { SDKConfig as ServerSDKConfig } from "../server";

describe("public exports", () => {
  it("re-exports SDKConfig from root, client, and server entry points", () => {
    expectTypeOf<RootSDKConfig>().toEqualTypeOf<ClientSDKConfig>();
    expectTypeOf<ClientSDKConfig>().toEqualTypeOf<ServerSDKConfig>();
    expectTypeOf<ClientSDKConfig>().toEqualTypeOf<
      FlagsProviderProps["config"]
    >();
  });

  it("re-exports Flag from root, client, and server entry points", () => {
    expectTypeOf<RootFlag>().toEqualTypeOf<ClientFlag>();
    expectTypeOf<ClientFlag>().toEqualTypeOf<ServerFlag>();
  });

  it("re-exports CacheConfig from root, client, and server entry points", () => {
    expectTypeOf<RootCacheConfig>().toEqualTypeOf<ClientCacheConfig>();
    expectTypeOf<ClientCacheConfig>().toEqualTypeOf<ServerCacheConfig>();
  });
});
