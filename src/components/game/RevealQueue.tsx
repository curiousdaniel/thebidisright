"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RevealItem } from "@/types/game";
import RevealAnimation from "./RevealAnimation";
import { getItemImageUrl, getItemImageProxyUrl } from "@/lib/image-url";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { ACCURACY_TIERS } from "@/types/game";
import { ChevronRight, Layers } from "lucide-react";

interface RevealQueueProps {
  reveals: RevealItem[];
}

export default function RevealQueue({ reveals }: RevealQueueProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [revealedAll, setRevealedAll] = useState(false);

  if (reveals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#555570]">
        <span className="text-5xl mb-4">✨</span>
        <p className="text-lg font-medium">All caught up!</p>
        <p className="text-sm mt-1">
          Your reveals will appear here when lots close
        </p>
      </div>
    );
  }

  if (showAnimation && currentIndex < reveals.length) {
    const current = reveals[currentIndex];
    return (
      <RevealAnimation
        itemTitle={current.item.title}
        imageUrl={current.item.image_url}
        proxyUrl={getItemImageProxyUrl(current.item.image_url) ?? ""}
        predictedPrice={current.result.predicted_price}
        hammerPrice={current.result.hammer_price}
        accuracyTier={current.result.accuracy_tier}
        pointsEarned={current.result.points_earned}
        onComplete={() => {
          if (currentIndex + 1 < reveals.length) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setShowAnimation(false);
            setRevealedAll(true);
          }
        }}
      />
    );
  }

  if (revealedAll) {
    const totalPoints = reveals.reduce(
      (sum, r) => sum + r.result.points_earned,
      0
    );
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-serif font-bold text-[#F1F1F5]">
            Reveal Summary
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <p className="text-3xl font-bold text-[#34D399]">
              +{totalPoints} points
            </p>
            <p className="text-sm text-[#8888A0] mt-1">
              from {reveals.length} reveals
            </p>
          </div>
          <div className="space-y-2">
            {reveals.map((reveal, i) => {
              const tier = ACCURACY_TIERS[reveal.result.accuracy_tier];
              return (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-[#2A2A40] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{tier.emoji}</span>
                    <div>
                      <p className="text-sm text-[#F1F1F5] line-clamp-1">
                        {reveal.item.title}
                      </p>
                      <p className="text-xs text-[#555570]">
                        {formatPrice(reveal.result.predicted_price)} vs{" "}
                        {formatPrice(reveal.result.hammer_price)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-[#34D399]">
                    +{reveal.result.points_earned}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[#D4A843]" />
          <span className="text-sm text-[#8888A0]">
            {reveals.length} reveal{reveals.length !== 1 ? "s" : ""} pending
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRevealedAll(true)}
          >
            Reveal All
          </Button>
          <Button size="sm" onClick={() => setShowAnimation(true)}>
            <ChevronRight size={16} className="mr-1" />
            Next Reveal
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {reveals.map((reveal, i) => {
          const imgSrc = getItemImageUrl(reveal.item.image_url);
          return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-3 flex items-center gap-3">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#1E1E30]" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F1F1F5] truncate">
                  {reveal.item.title}
                </p>
                <p className="text-xs text-[#555570]">
                  {reveal.auction_title}
                </p>
              </div>
              <span className="text-xs text-[#8888A0]">Ready</span>
            </Card>
          </motion.div>
          );
        })}
      </div>
    </div>
  );
}
