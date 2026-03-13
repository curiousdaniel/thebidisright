"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { createClient } from "@/lib/supabase/client";
import { Badge as BadgeType, PlayerBadge } from "@/types/game";
import Avatar from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import RankProgress from "@/components/game/RankProgress";
import StreakIndicator from "@/components/game/StreakIndicator";
import Button from "@/components/ui/Button";
import { formatNumber } from "@/lib/utils";
import { getRankForPoints } from "@/lib/ranks";
import { LogOut, Award, Target, BarChart3, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { player, loading, isAuthenticated } = usePlayerStats();
  const [badges, setBadges] = useState<{
    earned: Array<PlayerBadge & { badges: BadgeType }>;
    all: BadgeType[];
  }>({ earned: [], all: [] });
  const router = useRouter();

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch("/api/badges");
        if (res.ok) {
          const data = await res.json();
          setBadges(data);
        }
      } catch {}
    };

    if (isAuthenticated) fetchBadges();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-48 bg-[#141420] rounded-xl" />
        <div className="h-32 bg-[#141420] rounded-xl" />
      </div>
    );
  }

  if (!isAuthenticated || !player) {
    return (
      <div className="max-w-sm mx-auto text-center py-20 space-y-4">
        <span className="text-5xl">👋</span>
        <h2 className="text-2xl font-serif font-bold text-[#F1F1F5]">
          Sign in to view your profile
        </h2>
        <Button onClick={() => router.push("/login")}>Sign In</Button>
      </div>
    );
  }

  const rank = getRankForPoints(player.total_points);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                src={player.avatar_url}
                name={player.display_name}
                size="lg"
              />
              <div>
                <h1 className="text-xl font-bold text-[#F1F1F5]">
                  {player.display_name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">{rank.icon}</span>
                  <span className="text-sm text-[#D4A843] font-medium">
                    {rank.title}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
            </Button>
          </div>

          <RankProgress totalPoints={player.total_points} className="mt-6" />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Points",
            value: formatNumber(player.total_points),
            icon: <BarChart3 size={16} />,
          },
          {
            label: "Predictions",
            value: formatNumber(player.total_predictions),
            icon: <Target size={16} />,
          },
          {
            label: "Avg Accuracy",
            value: `${player.average_accuracy.toFixed(1)}%`,
            icon: <Award size={16} />,
          },
          {
            label: "Member Since",
            value: new Date(player.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            icon: <Calendar size={16} />,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className="text-[#D4A843] flex justify-center mb-2">
                {stat.icon}
              </div>
              <p className="font-mono font-bold text-lg text-[#F1F1F5]">
                {stat.value}
              </p>
              <p className="text-[10px] text-[#555570] uppercase mt-0.5">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Streaks */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-[#F1F1F5]">Streaks</h2>
        </CardHeader>
        <CardContent>
          <StreakIndicator
            dailyStreak={player.current_daily_streak}
            accuracyStreak={player.current_accuracy_streak}
          />
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#2A2A40]">
            <div>
              <p className="text-xs text-[#555570]">Longest Daily</p>
              <p className="font-mono text-[#F1F1F5]">
                {player.longest_daily_streak} days
              </p>
            </div>
            <div>
              <p className="text-xs text-[#555570]">Best Accuracy</p>
              <p className="font-mono text-[#F1F1F5]">
                {player.longest_accuracy_streak} in a row
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#F1F1F5]">Badges</h2>
            <span className="text-sm text-[#555570]">
              {badges.earned.length} / {badges.all.length}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {badges.all.length === 0 ? (
            <p className="text-sm text-[#555570] text-center py-4">
              No badges available yet
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {badges.all.map((badge) => {
                const earned = badges.earned.some(
                  (eb) => eb.badge_id === badge.id
                );
                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors ${
                      earned
                        ? "bg-[#D4A843]/5 border-[#D4A843]/30"
                        : "bg-[#0A0A0F] border-[#2A2A40] opacity-40"
                    }`}
                    title={`${badge.name}: ${badge.description}`}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-[10px] text-[#8888A0] text-center leading-tight">
                      {badge.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
