"use client";

import { LeaderboardEntry } from "@/types/player";
import LeaderboardEntryRow from "./LeaderboardEntry";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading?: boolean;
}

export default function LeaderboardTable({
  entries,
  loading = false,
}: LeaderboardTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-[#1E1E30] rounded-xl animate-pulse"
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#555570]">
        <span className="text-4xl mb-3">🏆</span>
        <p className="text-lg font-medium">No entries yet</p>
        <p className="text-sm">Start predicting to climb the ranks!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {entries.map((entry) => (
        <LeaderboardEntryRow key={entry.player_id} entry={entry} />
      ))}
    </div>
  );
}
