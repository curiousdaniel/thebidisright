import { NextResponse } from "next/server";
import { ensureTables } from "@/lib/db-migrate";

export const dynamic = "force-dynamic";

/**
 * Ensures BidIQ tables exist. Called automatically before first data fetch.
 */
export async function GET() {
  try {
    await ensureTables();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Migration failed" },
      { status: 500 }
    );
  }
}
