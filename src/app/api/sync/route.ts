import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAuctions, fetchItems } from "@/lib/amapi";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const results = { auctions: 0, items: 0, closed: 0, errors: [] as string[] };

  try {
    const auctions = await fetchAuctions();

    for (const auction of auctions) {
      const isPublished =
        auction.published === true ||
        (auction as Record<string, unknown>).is_published === true ||
        auction.status === "published";
      if (!isPublished) continue;

      // Support alternate API field names (AuctionMethod may use start_date, sale_date, etc.)
      const startTime =
        auction.start_time ||
        (auction as Record<string, unknown>).start_date ||
        (auction as Record<string, unknown>).sale_date ||
        (auction as Record<string, unknown>).auction_start ||
        null;
      const endTime =
        auction.end_time ||
        (auction as Record<string, unknown>).end_date ||
        (auction as Record<string, unknown>).auction_end ||
        null;

      const { error: auctionError } = await supabase
        .from("am_auctions")
        .upsert(
          {
            am_auction_id: auction.id,
            title: auction.title,
            description: auction.description || null,
            start_time: startTime,
            end_time: endTime,
            status: auction.status || null,
            published: isPublished,
            city: auction.city || null,
            state: auction.state || null,
            timezone: auction.timezone || null,
            image_url: auction.image || null,
            raw_data: auction,
            synced_at: new Date().toISOString(),
          },
          { onConflict: "am_auction_id" }
        );

      if (auctionError) {
        results.errors.push(`Auction ${auction.id}: ${auctionError.message}`);
        continue;
      }
      results.auctions++;

      try {
        const items = await fetchItems(auction.id);

        for (const item of items) {
          const now = new Date();
          const closesAt = item.closes_at ? new Date(item.closes_at) : null;
          const isClosed = closesAt && closesAt < now;

          const imageUrls = item.images?.map((img) => img.url) || null;
          const primaryImage = item.image || imageUrls?.[0] || null;

          const { error: itemError } = await supabase
            .from("am_items")
            .upsert(
              {
                am_item_id: item.id,
                am_auction_id: auction.id,
                title: item.title,
                description: item.description || null,
                lot_number: item.lot_number || null,
                category: item.category || null,
                category_id: item.category_id || null,
                starting_bid: item.starting_bid || null,
                current_bid: item.current_bid || null,
                hammer_price: isClosed ? (item.current_bid || null) : null,
                image_url: primaryImage,
                image_urls: imageUrls,
                status: isClosed ? "closed" : "open",
                closes_at: item.closes_at || null,
                raw_data: item,
                synced_at: new Date().toISOString(),
              },
              { onConflict: "am_item_id" }
            );

          if (itemError) {
            results.errors.push(`Item ${item.id}: ${itemError.message}`);
          } else {
            results.items++;
            if (isClosed) results.closed++;
          }
        }
      } catch (err) {
        results.errors.push(
          `Items for auction ${auction.id}: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      }
    }

    try {
      await supabase.rpc("refresh_leaderboards");
    } catch {
      // View may not exist yet
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
        ...results,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
