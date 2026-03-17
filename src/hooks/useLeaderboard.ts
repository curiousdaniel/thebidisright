"use client";

import { useState, useEffect, useCallback } from "react";
import { LeaderboardEntry, LeaderboardView } from "@/types/player";
import { useDemoMode } from "@/contexts/DemoModeContext";

export function useLeaderboard(initialView: LeaderboardView = "alltime") {
  const [view, setView] = useState<LeaderboardView>(initialView);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const demo = useDemoMode();

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const demoParam = demo?.isDemoMode ? "&demo=true" : "";
      const res = await fetch(
        `/api/leaderboard?view=${view}&limit=50${demoParam}`
      );
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [view, demo?.isDemoMode]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { view, setView, entries, loading, refetch: fetchLeaderboard };
}
