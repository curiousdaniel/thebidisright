"use client";

import { useState, useEffect } from "react";
import { Player } from "@/types/player";
import { createClient } from "@/lib/supabase/client";

export function usePlayerStats() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchPlayer = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);

    const { data } = await supabase
      .from("players")
      .select("*")
      .eq("supabase_auth_id", user.id)
      .single();

    setPlayer(data as Player | null);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayer();
  }, []);

  return { player, loading, isAuthenticated, refetch: fetchPlayer };
}
