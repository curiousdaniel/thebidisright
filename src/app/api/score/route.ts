import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { scorePrediction } from "@/lib/scoring";
import { getRankForPoints } from "@/lib/ranks";
import { isAccuracyStreakEligible } from "@/lib/streaks";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  let scored = 0;
  const errors: string[] = [];

  try {
    // Find closed items that have unscored predictions
    const { data: unscoredItems } = await supabase
      .from("am_items")
      .select("am_item_id, hammer_price")
      .eq("status", "closed")
      .not("hammer_price", "is", null);

    if (!unscoredItems || unscoredItems.length === 0) {
      return NextResponse.json({ success: true, scored: 0 });
    }

    for (const item of unscoredItems) {
      // Get predictions without results
      const { data: predictions } = await supabase
        .from("predictions")
        .select("id, player_id, am_item_id, predicted_price")
        .eq("am_item_id", item.am_item_id);

      if (!predictions || predictions.length === 0) continue;

      // Check which already have results
      const { data: existingResults } = await supabase
        .from("prediction_results")
        .select("prediction_id")
        .in(
          "prediction_id",
          predictions.map((p) => p.id)
        );

      const existingIds = new Set(
        existingResults?.map((r) => r.prediction_id) || []
      );
      const toScore = predictions.filter((p) => !existingIds.has(p.id));

      for (const prediction of toScore) {
        try {
          const result = scorePrediction(
            prediction.predicted_price,
            item.hammer_price!
          );

          // Write result
          const { error: resultError } = await supabase
            .from("prediction_results")
            .insert({
              prediction_id: prediction.id,
              player_id: prediction.player_id,
              am_item_id: prediction.am_item_id,
              predicted_price: prediction.predicted_price,
              hammer_price: item.hammer_price,
              deviation: result.deviation,
              accuracy_score: result.accuracyScore,
              points_earned: result.pointsEarned,
              accuracy_tier: result.accuracyTier,
            });

          if (resultError) {
            errors.push(`Result for ${prediction.id}: ${resultError.message}`);
            continue;
          }

          // Update player stats
          const { data: player } = await supabase
            .from("players")
            .select("*")
            .eq("id", prediction.player_id)
            .single();

          if (player) {
            const newTotal = player.total_points + result.pointsEarned;
            const newPredictions = player.total_predictions + 1;
            const newAvgAccuracy =
              (player.average_accuracy * player.total_predictions +
                result.accuracyScore) /
              newPredictions;

            const isGoodResult = isAccuracyStreakEligible(result.accuracyTier);
            const newAccuracyStreak = isGoodResult
              ? player.current_accuracy_streak + 1
              : 0;

            const rank = getRankForPoints(newTotal);

            await supabase
              .from("players")
              .update({
                total_points: newTotal,
                total_predictions: newPredictions,
                average_accuracy: Math.round(newAvgAccuracy * 100) / 100,
                current_accuracy_streak: newAccuracyStreak,
                longest_accuracy_streak: Math.max(
                  newAccuracyStreak,
                  player.longest_accuracy_streak
                ),
                rank_title: rank.title,
              })
              .eq("id", player.id);
          }

          scored++;
        } catch (err) {
          errors.push(
            `Scoring ${prediction.id}: ${err instanceof Error ? err.message : "Unknown"}`
          );
        }
      }
    }

    try {
      await supabase.rpc("refresh_leaderboards");
    } catch {
      // View may not exist yet
    }

    return NextResponse.json({ success: true, scored, errors });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
