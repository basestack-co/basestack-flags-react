"use server";

import type { Flag } from "@basestack/flags-js";
import { fetchFlag } from "../../../../dist/server";
import { flagsConfig } from "../flags-config";

export async function getHeaderFlagAction(slug = "header"): Promise<Flag> {
  return fetchFlag(slug, flagsConfig);
}
