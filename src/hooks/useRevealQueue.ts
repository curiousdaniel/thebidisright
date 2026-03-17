"use client";

import { useState, useEffect } from "react";
import { RevealItem, AccuracyTier, Prediction } from "@/types/game";
import { createClient } from "@/lib/supabase/client";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { generateFakeHammerPrice } from "@/lib/demo-data";
import { scorePrediction } from "@/lib/scoring";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function useRevealQueue() {
  const [reveals, setReveals] = useState<RevealItem[]>([]);
  const [loading, setLoading] = useState(true);
  const demo = useDemoMode();

  const fetchReveals = async () => {
    setLoading(true);

    if (demo?.isDemoMode) {
      const supabase = createClient();
      const revealItems: RevealItem[] = [];

      if (demo.demoPredictions.size > 0) {
        const itemIds = Array.from(demo.demoPredictions.keys());
        const { data: itemsData } = await supabase
          .from("am_items")
          .select("am_item_id, title, image_url, lot_number, category, am_auction_id, starting_bid")
          .in("am_item_id", itemIds);

        const itemsMap = new Map(
          (itemsData || []).map((i) => [i.am_item_id, i])
        );

        for (const [itemId, pred] of Array.from(demo.demoPredictions.entries())) {
          const item = itemsMap.get(itemId);
          const startingBid = Number(item?.starting_bid) || 100;
          const hammerPrice = generateFakeHammerPrice(startingBid, itemId);
          const score = scorePrediction(pred.predictedPrice, hammerPrice);

          revealItems.push({
            prediction: {
              id: `demo-${itemId}`,
              player_id: "demo",
              am_item_id: itemId,
              am_auction_id: pred.amAuctionId,
              predicted_price: pred.predictedPrice,
              locked_at: pred.lockedAt,
              revised_at: null,
              revision_count: 0,
              source: "browse",
            } as Prediction,
            result: {
              id: `demo-result-${itemId}`,
              prediction_id: `demo-${itemId}`,
              player_id: "demo",
              am_item_id: itemId,
              predicted_price: pred.predictedPrice,
              hammer_price: hammerPrice,
              deviation: score.deviation,
              accuracy_score: score.accuracyScore,
              points_earned: score.pointsEarned,
              accuracy_tier: score.accuracyTier as AccuracyTier,
              scored_at: pred.lockedAt,
            },
            item: item
              ? {
                  title: item.title || "Unknown",
                  image_url: item.image_url,
                  lot_number: item.lot_number,
                  category: item.category,
                  am_auction_id: item.am_auction_id,
                }
              : {
                  title: "Unknown Item",
                  image_url: null,
                  lot_number: null,
                  category: null,
                  am_auction_id: 0,
                },
            auction_title: "",
          });
        }
      }

      if (revealItems.length === 0) {
        const { generateFakePredictionsForItem } = await import("@/lib/demo-data");
        const { data: itemsData } = await supabase
          .from("am_items")
          .select("am_item_id, title, image_url, lot_number, category, am_auction_id, starting_bid")
          .eq("status", "open")
          .limit(5);

        const items = (itemsData || []) as Array<{
          am_item_id: number;
          title: string | null;
          image_url: string | null;
          lot_number: string | null;
          category: string | null;
          am_auction_id: number;
          starting_bid?: number;
        }>;

        if (items.length > 0) {
          for (const item of items) {
            const startingBid = Number(item.starting_bid) || 100;
            const fakePreds = generateFakePredictionsForItem(startingBid, item.am_item_id, 1);
            const predictedPrice = fakePreds[0] ?? startingBid;
            const hammerPrice = generateFakeHammerPrice(startingBid, item.am_item_id);
            const score = scorePrediction(predictedPrice, hammerPrice);
            const now = new Date().toISOString();

            revealItems.push({
              prediction: {
                id: `demo-sample-${item.am_item_id}`,
                player_id: "demo",
                am_item_id: item.am_item_id,
                am_auction_id: item.am_auction_id,
                predicted_price: predictedPrice,
                locked_at: now,
                revised_at: null,
                revision_count: 0,
                source: "browse",
              } as Prediction,
              result: {
                id: `demo-result-sample-${item.am_item_id}`,
                prediction_id: `demo-sample-${item.am_item_id}`,
                player_id: "demo",
                am_item_id: item.am_item_id,
                predicted_price: predictedPrice,
                hammer_price: hammerPrice,
                deviation: score.deviation,
                accuracy_score: score.accuracyScore,
                points_earned: score.pointsEarned,
                accuracy_tier: score.accuracyTier as AccuracyTier,
                scored_at: now,
              },
              item: {
                title: item.title || "Unknown",
                image_url: item.image_url,
                lot_number: item.lot_number,
                category: item.category,
                am_auction_id: item.am_auction_id,
              },
              auction_title: "",
            });
          }
        } else {
          const sampleItems = [
            { id: 9001, title: "Vintage Mid-Century Sideboard", startingBid: 450 },
            { id: 9002, title: "Signed Limited Edition Print", startingBid: 180 },
            { id: 9003, title: "Antique Brass Telescope", startingBid: 320 },
          ];
          for (const s of sampleItems) {
            const predictedPrice = s.startingBid * (0.85 + (s.id % 20) / 100);
            const hammerPrice = generateFakeHammerPrice(s.startingBid, s.id);
            const score = scorePrediction(predictedPrice, hammerPrice);
            const now = new Date().toISOString();
            revealItems.push({
              prediction: {
                id: `demo-sample-${s.id}`,
                player_id: "demo",
                am_item_id: s.id,
                am_auction_id: 0,
                predicted_price: predictedPrice,
                locked_at: now,
                revised_at: null,
                revision_count: 0,
                source: "browse",
              } as Prediction,
              result: {
                id: `demo-result-sample-${s.id}`,
                prediction_id: `demo-sample-${s.id}`,
                player_id: "demo",
                am_item_id: s.id,
                predicted_price: predictedPrice,
                hammer_price: hammerPrice,
                deviation: score.deviation,
                accuracy_score: score.accuracyScore,
                points_earned: score.pointsEarned,
                accuracy_tier: score.accuracyTier as AccuracyTier,
                scored_at: now,
              },
              item: {
                title: s.title,
                image_url: null,
                lot_number: null,
                category: null,
                am_auction_id: 0,
              },
              auction_title: "Demo Auction",
            });
          }
        }
      }

      revealItems.sort(
        (a, b) =>
          new Date(b.result.scored_at).getTime() -
          new Date(a.result.scored_at).getTime()
      );
      setReveals(revealItems);
      setLoading(false);
      return;
    }

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
  }, [demo?.isDemoMode, demo?.demoPredictions?.size]);

  return { reveals, loading, refetch: fetchReveals };
}
