// Allow self-signed certs for AuctionMethod API (set before any TLS connection)
if (typeof process !== "undefined") process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { NextResponse } from "next/server";
import { runSync } from "@/lib/sync";

export const dynamic = "force-dynamic";

/**
 * One-click sync trigger. Runs sync directly (no internal fetch).
 * Add a "Sync Now" button in the dashboard that fetches this route.
 */
export async function POST() {
  try {
    const result = await runSync();

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(result, { status: 500 });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Sync failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
