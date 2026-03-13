import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { lotAppraisalToCSV } from "@/lib/export";
import { calculateCrowdStats, crowdVsStartingBid, crowdVsHammerPrice } from "@/lib/crowd-stats";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") || "all-lots";
  const auctionId = searchParams.get("auctionId");

  const supabase = createAdminClient();

  if (scope === "all-lots" || (scope === "auction" && auctionId)) {
    let query = supabase
      .from("am_items")
      .select("am_item_id, title, lot_number, category, starting_bid, hammer_price, status, am_auction_id");

    if (auctionId) {
      query = query.eq("am_auction_id", Number(auctionId));
    }

    const { data: items } = await query;
    const { data: predictions } = await supabase
      .from("predictions")
      .select("am_item_id, predicted_price");

    const predByItem = new Map<number, number[]>();
    for (const p of predictions || []) {
      const arr = predByItem.get(p.am_item_id) || [];
      arr.push(p.predicted_price);
      predByItem.set(p.am_item_id, arr);
    }

    const rows = (items || []).map((item) => {
      const prices = predByItem.get(item.am_item_id) || [];
      const stats = calculateCrowdStats(prices);
      return {
        am_item_id: item.am_item_id,
        title: item.title,
        lot_number: item.lot_number,
        category: item.category,
        starting_bid: item.starting_bid,
        hammer_price: item.hammer_price,
        status: item.status,
        crowd_median: stats?.median || 0,
        crowd_mean: stats?.mean || 0,
        prediction_min: stats?.min || 0,
        prediction_max: stats?.max || 0,
        std_deviation: stats?.std_dev || 0,
        prediction_count: stats?.count || 0,
        confidence_score: stats?.confidence_score || 0,
        vs_starting_bid: stats
          ? crowdVsStartingBid(stats.median, item.starting_bid)
          : null,
        vs_hammer_price: stats
          ? crowdVsHammerPrice(stats.median, item.hammer_price)
          : null,
      };
    });

    const csv = lotAppraisalToCSV(rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="bidiq-${scope}-${Date.now()}.csv"`,
      },
    });
  }

  if (scope === "players") {
    const { data: players } = await supabase
      .from("players")
      .select("*")
      .order("total_points", { ascending: false });

    const header = "Player ID,Name,Points,Predictions,Avg Accuracy,Rank,Daily Streak";
    const rows = (players || []).map(
      (p) =>
        `"${p.id}","${p.display_name}",${p.total_points},${p.total_predictions},${p.average_accuracy},"${p.rank_title}",${p.current_daily_streak}`
    );

    return new NextResponse([header, ...rows].join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="bidiq-players-${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
}
