import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAuctions, fetchItems } from "@/lib/amapi";
import { ensureTables } from "@/lib/db-migrate";

const AM_DOMAIN = process.env.AM_DOMAIN || "";
const AM_EMAIL = process.env.AM_EMAIL || "";
const AM_PASSWORD = process.env.AM_PASSWORD || "";

/** Fallback: fetch auctions directly (same as /api/debug/am) when amapi returns empty */
async function fetchAuctionsDirect(): Promise<Array<Record<string, unknown>>> {
  const base = `https://${AM_DOMAIN}`;
  const authRes = await fetch(`${base}/amapi/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: AM_EMAIL, password: AM_PASSWORD }),
  });
  if (!authRes.ok) return [];
  const authData = (await authRes.json()) as { token?: string; access_token?: string };
  const token = authData.token || authData.access_token;
  if (!token) return [];

  const auctionsRes = await fetch(`${base}/amapi/admin/auctions?offset=0&limit=100`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!auctionsRes.ok) return [];
  const data = (await auctionsRes.json()) as Record<string, unknown>;
  const arr = data.auctions ?? data.data ?? data.results ?? data.auction ?? data.auction_list;
  if (Array.isArray(arr)) return arr as Array<Record<string, unknown>>;
  if (arr && typeof arr === "object") return [arr as Record<string, unknown>];
  return [];
}

export interface SyncResult {
  success: boolean;
  auctions?: number;
  items?: number;
  closed?: number;
  errors?: string[];
  error?: string;
  raw_auctions?: number;
}

function toNum(v: unknown): number | null {
  if (typeof v === "number" && !isNaN(v)) return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  }
  return null;
}

/** Extract first valid full image URL from item (API now returns full URLs) */
function extractItemImageUrl(item: Record<string, unknown>): string | null {
  const fields = [
    "lead_image_url",
    "lead_image_thumb_url",
    "image_url",
    "thumb_url",
    "lead_image",
    "lead_image_thumb",
    "image",
  ];
  for (const key of fields) {
    const val = item[key];
    if (typeof val === "string" && val.startsWith("http")) return val;
  }
  const firstFromArray = (item.images as Array<{ url?: string }>)?.[0]?.url;
  if (typeof firstFromArray === "string" && firstFromArray.startsWith("http")) return firstFromArray;
  return null;
}

/** Fallback: build URL from path (for legacy API responses) */
function buildImageUrlFromPath(path: unknown): string | null {
  if (!path || typeof path !== "string") return null;
  const p = (path as string).replace(/^\//, "");
  if (p.startsWith("http")) return p;
  const domain = AM_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return domain ? `https://${domain}/${p}` : null;
}

export async function runSync(): Promise<SyncResult> {
  const supabase = createAdminClient();
  const results = { auctions: 0, items: 0, closed: 0, errors: [] as string[] };

  try {
    await ensureTables();

    let auctions: Array<Record<string, unknown>> = (await fetchAuctions()) as unknown as Array<Record<string, unknown>>;
    if (auctions.length === 0) {
      auctions = await fetchAuctionsDirect();
    }
    const rawCount = auctions.length;

    for (const auction of auctions) {
      const raw = auction;
      // AuctionMethod: status "1" or front_page "1" = published
      const isPublished =
        auction.published === true ||
        raw.is_published === true ||
        auction.status === "published" ||
        raw.status === "published" ||
        String(raw.status) === "1" ||
        String(raw.front_page) === "1";

      // AuctionMethod: starts/ends are ISO; start_time/end_time often null
      const startTime =
        auction.start_time ||
        raw.starts ||
        raw.start_date ||
        raw.sale_date ||
        raw.auction_start ||
        null;
      const endTime =
        auction.end_time ||
        raw.ends ||
        raw.end_date ||
        raw.auction_end ||
        null;

      const auctionIdRaw = auction.id ?? raw.auction_id ?? raw.id;
      const auctionId = toNum(auctionIdRaw) ?? (typeof auctionIdRaw === "string" ? parseInt(auctionIdRaw, 10) : null);
      if (auctionId == null) continue;

      const { error: auctionError } = await supabase
        .from("am_auctions")
        .upsert(
          {
            am_auction_id: auctionId,
            title: auction.title,
            description: auction.description || null,
            start_time: startTime,
            end_time: endTime,
            status: auction.status ?? String(raw.status ?? ""),
            published: isPublished,
            city: auction.city || null,
            state: auction.state || null,
            timezone: auction.timezone || raw.timezone || null,
            image_url: auction.image || raw.image_url || raw.slider_image_url || null,
            raw_data: auction,
            synced_at: new Date().toISOString(),
          },
          { onConflict: "am_auction_id" }
        );

      if (auctionError) {
        results.errors.push(`Auction ${auctionId}: ${auctionError.message}`);
        continue;
      }
      results.auctions++;

      // AuctionMethod embeds items in auction.items; fallback to fetchItems
      let items: Array<Record<string, unknown>> = [];
      if (Array.isArray(raw.items) && raw.items.length > 0) {
        items = raw.items as Array<Record<string, unknown>>;
      } else {
        try {
          items = (await fetchItems(auctionId)) as unknown as Array<Record<string, unknown>>;
        } catch (err) {
          results.errors.push(
            `Items for auction ${auctionId}: ${err instanceof Error ? err.message : "Unknown error"}`
          );
          continue;
        }
      }

      for (const item of items) {
        const itemId = toNum(item.id) ?? toNum(item.item_id);
        if (itemId == null) continue;

        // AuctionMethod items: end_time is Unix seconds
        let closesAt: Date | null = null;
        const endTimeUnix = item.end_time ?? item.closes_at;
        if (typeof endTimeUnix === "number") {
          closesAt = new Date(endTimeUnix * 1000);
        } else if (typeof endTimeUnix === "string") {
          const parsed = new Date(endTimeUnix);
          closesAt = isNaN(parsed.getTime()) ? null : parsed;
        }
        const isClosed = closesAt ? closesAt < new Date() : false;

        // API now returns full URLs; fall back to path-based build for legacy responses
        const itemRaw = item as Record<string, unknown>;
        const primaryImage =
          extractItemImageUrl(itemRaw) ||
          buildImageUrlFromPath(item.lead_image) ||
          buildImageUrlFromPath(item.lead_image_thumb) ||
          buildImageUrlFromPath(item.image) ||
          null;

        const { error: itemError } = await supabase
          .from("am_items")
          .upsert(
            {
              am_item_id: itemId,
              am_auction_id: auctionId,
              title: item.title || "",
              description: item.description || null,
              lot_number: item.lot_number != null ? String(item.lot_number) : null,
              category: item.category != null ? String(item.category) : null,
              category_id: toNum(item.category_id) ?? toNum(item.category),
              starting_bid: toNum(item.starting_bid) ?? toNum(item.minimum_bid),
              current_bid: toNum(item.current_bid),
              hammer_price: isClosed ? (toNum(item.current_bid) ?? toNum(item.final_price)) : null,
              image_url: primaryImage,
              image_urls: null,
              status: isClosed ? "closed" : "open",
              closes_at: closesAt ? closesAt.toISOString() : null,
              raw_data: item,
              synced_at: new Date().toISOString(),
            },
            { onConflict: "am_item_id" }
          );

        if (itemError) {
          results.errors.push(`Item ${itemId}: ${itemError.message}`);
        } else {
          results.items++;
          if (isClosed) results.closed++;
        }
      }
    }

    try {
      await supabase.rpc("refresh_leaderboards");
    } catch {
      // View may not exist yet
    }

    return { success: true, raw_auctions: rawCount, ...results };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      raw_auctions: 0,
      ...results,
    };
  }
}
