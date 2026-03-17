"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AMItem } from "@/types/auction";
import QuickPlayRound from "@/components/game/QuickPlayRound";
import Button from "@/components/ui/Button";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { Zap, RefreshCw } from "lucide-react";

export default function QuickPlayPage() {
  const demo = useDemoMode();
  const [items, setItems] = useState<AMItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const fetchRandomItems = async () => {
    setLoading(true);
    const supabase = createClient();
    const now = new Date().toISOString();

    // Only items from published auctions where bidding has not yet started
    const { data: auctionsData } = await supabase
      .from("am_auctions")
      .select("am_auction_id")
      .eq("published", true)
      .gt("start_time", now);

    const eligibleAuctionIds =
      auctionsData?.map((a) => a.am_auction_id) || [];

    if (eligibleAuctionIds.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("am_items")
      .select("*")
      .eq("status", "open")
      .in("am_auction_id", eligibleAuctionIds);

    if (data && data.length > 0) {
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setItems(shuffled.slice(0, 5) as AMItem[]);
    } else {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomItems();
  }, []);

  const handleComplete = async (
    predictions: Array<{ itemId: number; price: number }>
  ) => {
    if (demo?.isDemoMode) {
      for (const pred of predictions) {
        const item = items.find((i) => i.am_item_id === pred.itemId);
        demo.addDemoPrediction(
          pred.itemId,
          pred.price,
          item?.am_auction_id ?? 0
        );
      }
      setCompleted(true);
      return;
    }
    for (const pred of predictions) {
      await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: pred.itemId,
          predictedPrice: pred.price,
        }),
      });
    }
    setCompleted(true);
  };

  const handleNewRound = () => {
    setStarted(false);
    setCompleted(false);
    fetchRandomItems();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-[#D4A843] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D4A843]/10 rounded-full">
          <Zap size={40} className="text-[#D4A843]" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#F1F1F5]">
          Quick Play
        </h1>
        <p className="text-[#8888A0] max-w-sm mx-auto">
          5 random lots. 60 seconds. Predict them all for a speed bonus. How
          fast is your eye?
        </p>
        <div className="space-y-3">
          <Button onClick={() => setStarted(true)} size="lg">
            <Zap size={18} className="mr-2" />
            Start Round
          </Button>
          <p className="text-xs text-[#555570]">
            {items.length} open lots available
          </p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <span className="text-6xl">🎉</span>
        <h2 className="text-2xl font-serif font-bold text-[#F1F1F5]">
          Round Complete!
        </h2>
        <p className="text-[#8888A0]">
          Your predictions have been locked in. Check your reveals once the lots
          close.
        </p>
        <Button onClick={handleNewRound}>
          <RefreshCw size={16} className="mr-2" />
          Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <QuickPlayRound items={items} onComplete={handleComplete} />
    </div>
  );
}
