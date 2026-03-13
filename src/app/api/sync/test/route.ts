import { NextResponse } from "next/server";
import { fetchAuctions } from "@/lib/amapi";

export const dynamic = "force-dynamic";

/**
 * Test endpoint: returns what fetchAuctions() returns in the sync context.
 * GET /api/sync/test — helps diagnose why sync shows 0 auctions.
 */
export async function GET() {
  try {
    const auctions = await fetchAuctions();
    const first = auctions[0] as Record<string, unknown> | undefined;
    return NextResponse.json({
      auctionCount: auctions.length,
      firstAuctionId: first?.id ?? first?.auction_id,
      firstAuctionHasItems: Array.isArray(first?.items),
      firstAuctionItemsLength: Array.isArray(first?.items) ? (first.items as unknown[]).length : 0,
      firstAuctionKeys: first ? Object.keys(first).slice(0, 20) : null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
