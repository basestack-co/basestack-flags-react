import type { NextApiRequest, NextApiResponse } from "next";
import { fetchFlags } from "../../../../dist/server";
import { flagsConfig } from "../../flags-config";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const flags = await fetchFlags(flagsConfig);
    res.status(200).json({ flags });
  } catch (error) {
    console.error("Failed to load flags", error);
    res.status(500).json({ message: "Unable to load flags" });
  }
}
