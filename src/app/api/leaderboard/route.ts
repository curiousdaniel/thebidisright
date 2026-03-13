import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRankForPoints } from "@/lib/ranks";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") || "alltime";
  const limit = Math.min(Number(searchParams.get("limit") || 50), 100);

  const supabase = createAdminClient();

  switch (view) {
    case "alltime": {
      const { data } = await supabase
        .from("players")
        .select(
          "id, display_name, avatar_url, total_points, total_predictions, average_accuracy, rank_title, current_daily_streak"
        )
        .order("total_points", { ascending: false })
        .limit(limit);

      const entries = (data || []).map((p, i) => {
        const rank = getRankForPoints(p.total_points);
        return {
          rank: i + 1,
          player_id: p.id,
          display_name: p.display_name,
          avatar_url: p.avatar_url,
          rank_title: rank.title,
          rank_icon: rank.icon,
          stat_value: p.total_points,
          stat_label: "points",
          total_predictions: p.total_predictions,
          top_badges: [],
        };
      });

      return NextResponse.json({ entries });
    }

    case "weekly": {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("prediction_results")
        .select("player_id, points_earned, players(display_name, avatar_url, total_points)")
        .gte("scored_at", weekAgo);

      const playerMap = new Map<
        string,
        { points: number; display_name: string; avatar_url: string | null; total_points: number }
      >();
      for (const r of data || []) {
        const playerData = r.players as unknown as Record<string, unknown> | null;
        const existing = playerMap.get(r.player_id) || {
          points: 0,
          display_name: (playerData?.display_name as string) || "Unknown",
          avatar_url: (playerData?.avatar_url as string | null) || null,
          total_points: (playerData?.total_points as number) || 0,
        };
        existing.points += r.points_earned;
        playerMap.set(r.player_id, existing);
      }

      const entries = Array.from(playerMap.entries())
        .sort((a, b) => b[1].points - a[1].points)
        .slice(0, limit)
        .map(([pid, p], i) => {
          const rank = getRankForPoints(p.total_points);
          return {
            rank: i + 1,
            player_id: pid,
            display_name: p.display_name,
            avatar_url: p.avatar_url,
            rank_title: rank.title,
            rank_icon: rank.icon,
            stat_value: p.points,
            stat_label: "weekly pts",
            total_predictions: 0,
            top_badges: [],
          };
        });

      return NextResponse.json({ entries });
    }

    case "accuracy": {
      const { data } = await supabase
        .from("players")
        .select("id, display_name, avatar_url, total_points, average_accuracy, total_predictions")
        .gte("total_predictions", 25)
        .order("average_accuracy", { ascending: false })
        .limit(limit);

      const entries = (data || []).map((p, i) => {
        const rank = getRankForPoints(p.total_points);
        return {
          rank: i + 1,
          player_id: p.id,
          display_name: p.display_name,
          avatar_url: p.avatar_url,
          rank_title: rank.title,
          rank_icon: rank.icon,
          stat_value: Math.round(p.average_accuracy * 10) / 10,
          stat_label: "avg accuracy",
          total_predictions: p.total_predictions,
          top_badges: [],
        };
      });

      return NextResponse.json({ entries });
    }

    case "streak": {
      const { data } = await supabase
        .from("players")
        .select("id, display_name, avatar_url, total_points, current_daily_streak")
        .gt("current_daily_streak", 0)
        .order("current_daily_streak", { ascending: false })
        .limit(limit);

      const entries = (data || []).map((p, i) => {
        const rank = getRankForPoints(p.total_points);
        return {
          rank: i + 1,
          player_id: p.id,
          display_name: p.display_name,
          avatar_url: p.avatar_url,
          rank_title: rank.title,
          rank_icon: rank.icon,
          stat_value: p.current_daily_streak,
          stat_label: "day streak",
          total_predictions: 0,
          top_badges: [],
        };
      });

      return NextResponse.json({ entries });
    }

    default:
      return NextResponse.json({ entries: [] });
  }
}
