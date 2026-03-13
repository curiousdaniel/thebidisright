"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AMItem } from "@/types/auction";
import { isAuctionEligibleForGame } from "@/lib/auction-filters";
import { CrowdStats } from "@/types/game";
import PriceSlider from "@/components/game/PriceSlider";
import CrowdHeatmap from "@/components/game/CrowdHeatmap";
import CountdownTimer from "@/components/game/CountdownTimer";
import Badge from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { usePrediction } from "@/hooks/usePrediction";
import { formatPrice } from "@/lib/utils";
import { calculateCrowdStats } from "@/lib/crowd-stats";
import { ArrowLeft, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function LotDetailPage() {
  const params = useParams();
  const itemId = Number(params.itemId);
  const [item, setItem] = useState<AMItem | null>(null);
  const [auctionTitle, setAuctionTitle] = useState("");
  const [auctionEligible, setAuctionEligible] = useState(true);
  const [crowdStats, setCrowdStats] = useState<CrowdStats | null>(null);
  const [myPrediction, setMyPrediction] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const { submitPrediction, loading: submitting, error } = usePrediction({
    onSuccess: () => {
      setIsLocked(true);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: itemData } = await supabase
        .from("am_items")
        .select("*")
        .eq("am_item_id", itemId)
        .single();

      if (itemData) {
        setItem(itemData as AMItem);

        const { data: auction } = await supabase
          .from("am_auctions")
          .select("title, published, start_time")
          .eq("am_auction_id", itemData.am_auction_id)
          .single();

        if (auction) {
          setAuctionTitle(auction.title);
          setAuctionEligible(isAuctionEligibleForGame(auction));
        } else {
          setAuctionEligible(false);
        }
      }

      // Get crowd stats
      const { data: predictions } = await supabase
        .from("predictions")
        .select("predicted_price")
        .eq("am_item_id", itemId);

      if (predictions && predictions.length > 0) {
        const prices = predictions.map((p: { predicted_price: number }) => p.predicted_price);
        setCrowdStats(calculateCrowdStats(prices));
      }

      // Get my prediction
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: player } = await supabase
          .from("players")
          .select("id")
          .eq("supabase_auth_id", user.id)
          .single();

        if (player) {
          const { data: myPred } = await supabase
            .from("predictions")
            .select("predicted_price")
            .eq("player_id", player.id)
            .eq("am_item_id", itemId)
            .single();

          if (myPred) {
            setMyPrediction(myPred.predicted_price);
            setIsLocked(true);
          }
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [itemId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#1E1E30] rounded w-1/4" />
        <div className="aspect-[16/9] bg-[#1E1E30] rounded-xl" />
        <div className="h-40 bg-[#1E1E30] rounded-xl" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <p className="text-[#555570]">Item not found</p>
        <Link href="/browse" className="text-[#D4A843] text-sm mt-2 block">
          Back to browse
        </Link>
      </div>
    );
  }

  const images = item.image_urls?.length
    ? item.image_urls
    : item.image_url
    ? [item.image_url]
    : [];

  const maxPrice = Math.max((item.starting_bid || 100) * 3, 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/browse"
          className="text-[#8888A0] hover:text-[#F1F1F5] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-[#555570]">
            <span>{auctionTitle}</span>
            {item.lot_number && <span>Lot #{item.lot_number}</span>}
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#F1F1F5] truncate">
            {item.title}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Image and details */}
        <div className="lg:col-span-3 space-y-4">
          {/* Image gallery */}
          <div className="relative aspect-[4/3] bg-[#141420] rounded-xl overflow-hidden border border-[#2A2A40]">
            {images.length > 0 ? (
              <>
                <img
                  src={images[activeImage]}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImage(
                          (activeImage - 1 + images.length) % images.length
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#0A0A0F]/70 rounded-full p-2 hover:bg-[#0A0A0F] transition-colors"
                    >
                      <ChevronLeft size={18} className="text-[#F1F1F5]" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImage((activeImage + 1) % images.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0A0A0F]/70 rounded-full p-2 hover:bg-[#0A0A0F] transition-colors"
                    >
                      <ChevronRight size={18} className="text-[#F1F1F5]" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i === activeImage ? "bg-[#D4A843]" : "bg-[#555570]"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon size={64} className="text-[#2A2A40]" />
              </div>
            )}
          </div>

          {/* Item details */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-wrap gap-2">
                {item.category && (
                  <Badge variant="gold" size="md">
                    {item.category}
                  </Badge>
                )}
                <Badge
                  variant={item.status === "open" ? "green" : "red"}
                  size="md"
                >
                  {item.status === "open" ? "Open" : "Closed"}
                </Badge>
              </div>

              {item.description && (
                <p className="text-sm text-[#8888A0] leading-relaxed">
                  {item.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#2A2A40]">
                {item.starting_bid && (
                  <div>
                    <p className="text-xs text-[#555570]">Starting Bid</p>
                    <p className="font-mono text-lg text-[#F1F1F5]">
                      {formatPrice(item.starting_bid)}
                    </p>
                  </div>
                )}
                {item.closes_at && (
                  <div>
                    <p className="text-xs text-[#555570]">Time Remaining</p>
                    <CountdownTimer closesAt={item.closes_at} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — Prediction */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-5">
              {!auctionEligible && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-400">
                  Predictions are closed for this lot — the auction&apos;s bidding
                  period has already started.
                </div>
              )}
              <PriceSlider
                startingBid={item.starting_bid || 100}
                maxPrice={maxPrice}
                currentPrediction={myPrediction}
                isLocked={isLocked}
                onSubmit={(price) => submitPrediction(itemId, price)}
                disabled={!auctionEligible || item.status !== "open" || submitting}
              />

              {error && (
                <p className="text-sm text-[#F87171] mt-3">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Crowd stats (shown after lock-in) */}
          {isLocked && crowdStats && (
            <Card>
              <CardContent className="p-5">
                <CrowdHeatmap
                  stats={crowdStats}
                  maxPrice={maxPrice}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
