"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Player } from "@/types/player";
import { Card, CardContent } from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";
import { getRankForPoints } from "@/lib/ranks";
import { Users } from "lucide-react";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("players")
        .select("*")
        .order("total_points", { ascending: false })
        .limit(100);

      setPlayers((data as Player[]) || []);
      setLoading(false);
    };

    fetchPlayers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="text-[#D4A843]" size={24} />
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F1F1F5]">
            Player Engagement
          </h1>
          <p className="text-sm text-[#8888A0]">
            {players.length} registered players
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 border-b border-[#2A2A40] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#555570] text-xs border-b border-[#2A2A40]">
                    <th className="text-left p-4 font-medium">Player</th>
                    <th className="text-right p-4 font-medium">Rank</th>
                    <th className="text-right p-4 font-medium">Points</th>
                    <th className="text-right p-4 font-medium">Predictions</th>
                    <th className="text-right p-4 font-medium">Accuracy</th>
                    <th className="text-right p-4 font-medium">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => {
                    const rank = getRankForPoints(player.total_points);
                    return (
                      <tr
                        key={player.id}
                        className="border-b border-[#2A2A40] hover:bg-[#1E1E30] transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={player.avatar_url}
                              name={player.display_name}
                              size="sm"
                            />
                            <span className="text-[#F1F1F5] font-medium">
                              {player.display_name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Badge variant="gold" size="sm">
                            {rank.icon} {rank.title}
                          </Badge>
                        </td>
                        <td className="p-4 text-right font-mono text-[#D4A843]">
                          {formatNumber(player.total_points)}
                        </td>
                        <td className="p-4 text-right font-mono text-[#8888A0]">
                          {formatNumber(player.total_predictions)}
                        </td>
                        <td className="p-4 text-right font-mono text-emerald-400">
                          {player.average_accuracy.toFixed(1)}%
                        </td>
                        <td className="p-4 text-right font-mono text-amber-400">
                          {player.current_daily_streak}d
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
