import { describe, expectTypeOf, it } from "vitest";
import type { SDKConfig as ClientSDKConfig } from "../client";
import type { SDKConfig as RootSDKConfig } from "../index";
import type { FlagsProviderProps } from "../provider";
import type { SDKConfig as ServerSDKConfig } from "../server";

describe("public exports", () => {
  it("re-exports SDKConfig from root, client, and server entry points", () => {
    expectTypeOf<RootSDKConfig>().toEqualTypeOf<ClientSDKConfig>();
    expectTypeOf<ClientSDKConfig>().toEqualTypeOf<ServerSDKConfig>();
    expectTypeOf<ClientSDKConfig>().toEqualTypeOf<
      FlagsProviderProps["config"]
    >();
  });
});
