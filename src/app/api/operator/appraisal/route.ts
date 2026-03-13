import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateCrowdStats, crowdVsStartingBid, crowdVsHammerPrice } from "@/lib/crowd-stats";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") || "portfolio";
  const auctionId = searchParams.get("auctionId");
  const itemId = searchParams.get("itemId");

  const supabase = createAdminClient();

  if (scope === "lot" && itemId) {
    const { data: item } = await supabase
      .from("am_items")
      .select("*")
      .eq("am_item_id", Number(itemId))
      .single();

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const { data: predictions } = await supabase
      .from("predictions")
      .select("predicted_price")
      .eq("am_item_id", Number(itemId));

    const prices = predictions?.map((p) => p.predicted_price) || [];
    const stats = calculateCrowdStats(prices);

    return NextResponse.json({
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
      predictions: prices,
    });
  }

  if (scope === "auction" && auctionId) {
    const { data: auction } = await supabase
      .from("am_auctions")
      .select("*")
      .eq("am_auction_id", Number(auctionId))
      .single();

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    const { data: items } = await supabase
      .from("am_items")
      .select("am_item_id, title, lot_number, category, starting_bid, hammer_price, status")
      .eq("am_auction_id", Number(auctionId));

    const { data: allPredictions } = await supabase
      .from("predictions")
      .select("am_item_id, predicted_price, player_id")
      .eq("am_auction_id", Number(auctionId));

    const predByItem = new Map<number, number[]>();
    const uniquePlayers = new Set<string>();
    for (const p of allPredictions || []) {
      const arr = predByItem.get(p.am_item_id) || [];
      arr.push(p.predicted_price);
      predByItem.set(p.am_item_id, arr);
      uniquePlayers.add(p.player_id);
    }

    const lotData = (items || []).map((item) => {
      const prices = predByItem.get(item.am_item_id) || [];
      const stats = calculateCrowdStats(prices);
      return {
        am_item_id: item.am_item_id,
        title: item.title,
        lot_number: item.lot_number,
        category: item.category,
        starting_bid: item.starting_bid,
        hammer_price: item.hammer_price,
        crowd_median: stats?.median || 0,
        crowd_mean: stats?.mean || 0,
        prediction_count: stats?.count || 0,
        confidence_score: stats?.confidence_score || 0,
        std_deviation: stats?.std_dev || 0,
      };
    });

    const totalPredicted = lotData.reduce((s, l) => s + l.crowd_median, 0);
    const totalHammer = lotData.reduce(
      (s, l) => s + (l.hammer_price || 0),
      0
    );

    return NextResponse.json({
      am_auction_id: auction.am_auction_id,
      title: auction.title,
      total_predicted_value: totalPredicted,
      total_hammer_value: totalHammer || null,
      crowd_accuracy:
        totalHammer > 0
          ? Math.round((1 - Math.abs(totalPredicted - totalHammer) / totalHammer) * 10000) / 100
          : null,
      total_predictions: allPredictions?.length || 0,
      unique_players: uniquePlayers.size,
      avg_predictions_per_lot:
        items && items.length > 0
          ? Math.round(((allPredictions?.length || 0) / items.length) * 10) / 10
          : 0,
      hottest_lots: [...lotData]
        .sort((a, b) => b.prediction_count - a.prediction_count)
        .slice(0, 5),
      controversial_lots: [...lotData]
        .sort((a, b) => b.std_deviation - a.std_deviation)
        .slice(0, 5),
      sleeper_lots: [...lotData]
        .filter((l) => l.prediction_count < 3 && (l.hammer_price || 0) > 0)
        .sort((a, b) => (b.hammer_price || 0) - (a.hammer_price || 0))
        .slice(0, 5),
    });
  }

  // Portfolio view
  const { data: allItems } = await supabase
    .from("am_items")
    .select("am_item_id, category, hammer_price, status");

  const { data: allPreds } = await supabase
    .from("predictions")
    .select("am_item_id, predicted_price, player_id, locked_at");

  const predByItem = new Map<number, number[]>();
  for (const p of allPreds || []) {
    const arr = predByItem.get(p.am_item_id) || [];
    arr.push(p.predicted_price);
    predByItem.set(p.am_item_id, arr);
  }

  let totalValue = 0;
  const categoryMap = new Map<string, { value: number; count: number }>();
  for (const item of allItems || []) {
    const prices = predByItem.get(item.am_item_id) || [];
    const stats = calculateCrowdStats(prices);
    if (stats) {
      totalValue += stats.median;
      const cat = item.category || "Other";
      const existing = categoryMap.get(cat) || { value: 0, count: 0 };
      existing.value += stats.median;
      existing.count++;
      categoryMap.set(cat, existing);
    }
  }

  const { data: players } = await supabase
    .from("players")
    .select("id, display_name, average_accuracy, total_predictions")
    .gte("total_predictions", 10)
    .order("average_accuracy", { ascending: false })
    .limit(10);

  const { count: registeredCount } = await supabase
    .from("players")
    .select("*", { count: "exact", head: true });

  const uniqueActivePlayers = new Set(allPreds?.map((p) => p.player_id) || []);

  return NextResponse.json({
    total_inventory_value: totalValue,
    historical_accuracy: [],
    category_breakdown: Array.from(categoryMap.entries()).map(([cat, data]) => ({
      category: cat,
      value: data.value,
      count: data.count,
    })),
    volume_trends: [],
    engagement_funnel: {
      registered: registeredCount || 0,
      active: uniqueActivePlayers.size,
      predictions_made: allPreds?.length || 0,
      returned: 0,
    },
    top_predictors: (players || []).map((p) => ({
      player_id: p.id,
      display_name: p.display_name,
      accuracy: p.average_accuracy,
      predictions: p.total_predictions,
    })),
  });
}
