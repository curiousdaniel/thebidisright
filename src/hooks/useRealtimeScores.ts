"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useRealtimeScores(
  playerId: string | null,
  onNewScore: (payload: Record<string, unknown>) => void
) {
  useEffect(() => {
    if (!playerId) return;

    const supabase = createClient();

    const channel = supabase
      .channel("scores")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "prediction_results",
          filter: `player_id=eq.${playerId}`,
        },
        (payload) => {
          onNewScore(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [playerId, onNewScore]);
}
