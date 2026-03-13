import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Debug endpoint to inspect auction/item data.
 * Call GET /api/debug to see what's in the database and why lots might not appear.
 * Remove or restrict this in production.
 */
export async function GET() {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  // 1. All auctions (no filter)
  const { data: allAuctions } = await supabase
    .from("am_auctions")
    .select("am_auction_id, title, published, start_time, end_time, status")
    .order("am_auction_id");

  // 2. Auctions that pass our browse filter (published + start_time > now)
  const { data: eligibleAuctions } = await supabase
    .from("am_auctions")
    .select("am_auction_id, title, published, start_time")
    .eq("published", true)
    .gt("start_time", now);

  // 3. Item counts
  const { data: itemCounts } = await supabase
    .from("am_items")
    .select("am_auction_id, status");

  const itemsByAuction = (itemCounts || []).reduce(
    (acc: Record<number, { open: number; closed: number }>, item: { am_auction_id: number; status: string }) => {
      if (!acc[item.am_auction_id]) acc[item.am_auction_id] = { open: 0, closed: 0 };
      if (item.status === "open") acc[item.am_auction_id].open++;
      else acc[item.am_auction_id].closed++;
      return acc;
    },
    {}
  );

  // Get raw_data from first auction to inspect API field names
  const { data: sampleAuction } = await supabase
    .from("am_auctions")
    .select("am_auction_id, raw_data")
    .limit(1)
    .single();

  return NextResponse.json({
    debug: {
      serverTime: now,
      note: "Auction needs published=true AND start_time > serverTime. Check raw_data keys if start_time is null.",
    },
    allAuctions: (allAuctions || []).map((a) => ({
      ...a,
      start_time_type: typeof a.start_time,
      published_type: typeof a.published,
      wouldPassFilter:
        a.published === true &&
        a.start_time != null &&
        a.start_time > now,
      itemCounts: itemsByAuction[a.am_auction_id] || { open: 0, closed: 0 },
    })),
    eligibleAuctionsCount: eligibleAuctions?.length ?? 0,
    eligibleAuctionIds: eligibleAuctions?.map((a) => a.am_auction_id) ?? [],
    totalItems: itemCounts?.length ?? 0,
    sampleRawDataKeys: sampleAuction?.raw_data
      ? Object.keys(sampleAuction.raw_data as object)
      : null,
  });
}
