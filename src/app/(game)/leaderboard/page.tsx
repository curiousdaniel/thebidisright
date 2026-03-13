"use client";

import { useLeaderboard } from "@/hooks/useLeaderboard";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import LeaderboardFilter from "@/components/leaderboard/LeaderboardFilter";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const { view, setView, entries, loading } = useLeaderboard();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="text-[#D4A843]" size={24} />
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#F1F1F5]">
            Leaderboard
          </h1>
          <p className="text-sm text-[#8888A0]">
            The best appraisers in the game
          </p>
        </div>
      </div>

      <LeaderboardFilter current={view} onChange={setView} />

      <LeaderboardTable entries={entries} loading={loading} />
    </div>
  );
}
