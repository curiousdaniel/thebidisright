"use client";

import { useState, useEffect } from "react";
import { RevealItem, AccuracyTier, Prediction } from "@/types/game";
import { createClient } from "@/lib/supabase/client";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function useRevealQueue() {
  const [reveals, setReveals] = useState<RevealItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReveals = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: player } = await supabase
      .from("players")
      .select("id")
      .eq("supabase_auth_id", user.id)
      .single();

    if (!player) {
      setLoading(false);
      return;
    }

    const { data: results } = await supabase
      .from("prediction_results")
      .select(`
        *,
        predictions(*),
        am_items:am_item_id(title, image_url, lot_number, category, am_auction_id)
      `)
      .eq("player_id", player.id)
      .order("scored_at", { ascending: false })
      .limit(50);

    const items: RevealItem[] = (results || []).map((r: any) => ({
      prediction: (r.predictions || {}) as Prediction,
      result: {
        id: String(r.id),
        prediction_id: String(r.prediction_id),
        player_id: String(r.player_id),
        am_item_id: Number(r.am_item_id),
        predicted_price: Number(r.predicted_price),
        hammer_price: Number(r.hammer_price),
        deviation: Number(r.deviation),
        accuracy_score: Number(r.accuracy_score),
        points_earned: Number(r.points_earned),
        accuracy_tier: String(r.accuracy_tier) as AccuracyTier,
        scored_at: String(r.scored_at),
      },
      item: r.am_items || {
        title: "Unknown Item",
        image_url: null,
        lot_number: null,
        category: null,
        am_auction_id: 0,
      },
      auction_title: "",
    }));

    setReveals(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchReveals();
  }, []);

  return { reveals, loading, refetch: fetchReveals };
}
