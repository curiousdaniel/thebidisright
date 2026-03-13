import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { isWithinLockout } from "@/lib/utils";
import { isNewDay, shouldResetDailyStreak } from "@/lib/streaks";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { itemId, predictedPrice } = body;

  if (!itemId || typeof predictedPrice !== "number" || predictedPrice < 0) {
    return NextResponse.json(
      { error: "Invalid prediction data" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Get the item
  const { data: item, error: itemError } = await admin
    .from("am_items")
    .select("*")
    .eq("am_item_id", itemId)
    .single();

  if (itemError || !item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (item.status !== "open") {
    return NextResponse.json({ error: "Item is closed" }, { status: 400 });
  }

  // Check lockout
  const { data: config } = await admin
    .from("game_config")
    .select("lockout_minutes")
    .limit(1)
    .single();

  const lockoutMinutes = config?.lockout_minutes ?? 30;
  if (isWithinLockout(item.closes_at, lockoutMinutes)) {
    return NextResponse.json(
      { error: "Prediction lockout period has started" },
      { status: 400 }
    );
  }

  // Get player
  const { data: player } = await admin
    .from("players")
    .select("*")
    .eq("supabase_auth_id", user.id)
    .single();

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  // Upsert prediction
  const { data: existing } = await admin
    .from("predictions")
    .select("id, revision_count")
    .eq("player_id", player.id)
    .eq("am_item_id", itemId)
    .single();

  if (existing) {
    const { error } = await admin
      .from("predictions")
      .update({
        predicted_price: predictedPrice,
        revised_at: new Date().toISOString(),
        revision_count: existing.revision_count + 1,
      })
      .eq("id", existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, action: "revised" });
  }

  // New prediction
  const { error: insertError } = await admin.from("predictions").insert({
    player_id: player.id,
    am_item_id: itemId,
    am_auction_id: item.am_auction_id,
    predicted_price: predictedPrice,
    source: "browse",
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Update streaks
  const updates: Record<string, unknown> = {
    last_prediction_date: new Date().toISOString().split("T")[0],
  };

  if (isNewDay(player.last_prediction_date)) {
    if (shouldResetDailyStreak(player.last_prediction_date)) {
      updates.current_daily_streak = 1;
    } else {
      const newStreak = player.current_daily_streak + 1;
      updates.current_daily_streak = newStreak;
      updates.longest_daily_streak = Math.max(
        newStreak,
        player.longest_daily_streak
      );
    }
  }

  await admin.from("players").update(updates).eq("id", player.id);

  return NextResponse.json({ success: true, action: "created" });
}

export async function GET() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: player } = await admin
    .from("players")
    .select("id")
    .eq("supabase_auth_id", user.id)
    .single();

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  const { data: predictions } = await admin
    .from("predictions")
    .select("*")
    .eq("player_id", player.id)
    .order("locked_at", { ascending: false });

  return NextResponse.json({ predictions: predictions || [] });
}
