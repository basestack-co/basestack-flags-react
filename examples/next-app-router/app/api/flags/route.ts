import { NextResponse } from "next/server";
import { fetchFlags } from "../../../../../dist/server";
import { flagsConfig } from "../../flags-config";

export async function GET() {
  try {
    const flags = await fetchFlags(flagsConfig);
    return NextResponse.json({ flags });
  } catch (error) {
    console.error("Failed to load flags", error);
    return NextResponse.json({ message: "Unable to load flags" }, { status: 500 });
  }
}
