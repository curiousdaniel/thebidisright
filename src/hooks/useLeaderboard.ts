"use client";

import { useState, useEffect, useCallback } from "react";
import { LeaderboardEntry, LeaderboardView } from "@/types/player";

export function useLeaderboard(initialView: LeaderboardView = "alltime") {
  const [view, setView] = useState<LeaderboardView>(initialView);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?view=${view}&limit=50`);
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { view, setView, entries, loading, refetch: fetchLeaderboard };
}
