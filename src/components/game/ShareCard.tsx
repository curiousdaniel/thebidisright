"use client";

import { formatPrice } from "@/lib/utils";
import { ACCURACY_TIERS, AccuracyTier } from "@/types/game";
import { Card, CardContent } from "@/components/ui/Card";
import { Share2 } from "lucide-react";

interface ShareCardProps {
  itemTitle: string;
  imageUrl: string | null;
  predictedPrice: number;
  hammerPrice: number;
  accuracyTier: AccuracyTier;
  playerName: string;
  rankTitle: string;
}

export default function ShareCard({
  itemTitle,
  imageUrl,
  predictedPrice,
  hammerPrice,
  accuracyTier,
  playerName,
  rankTitle,
}: ShareCardProps) {
  const tier = ACCURACY_TIERS[accuracyTier];
  const deviation = Math.abs(predictedPrice - hammerPrice) / hammerPrice;
  const accuracy = Math.max(0, 100 - deviation * 100);

  return (
    <Card className="max-w-sm mx-auto bg-gradient-to-b from-[#141420] to-[#0A0A0F] border-[#D4A843]/30">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-serif font-bold text-[#D4A843]">
              BidIQ
            </span>
          </div>
          <button className="text-[#555570] hover:text-[#D4A843] transition-colors">
            <Share2 size={16} />
          </button>
        </div>

        {/* Item image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={itemTitle}
            className="w-full aspect-[16/9] object-cover rounded-lg"
          />
        )}

        {/* Item title */}
        <p className="text-sm font-medium text-[#F1F1F5] line-clamp-2">
          {itemTitle}
        </p>

        {/* Result */}
        <div className="text-center py-3">
          <span className="text-4xl">{tier.emoji}</span>
          <h3 className="text-xl font-serif font-bold text-[#F1F1F5] mt-1">
            {tier.label}
          </h3>
          <p className="text-sm text-[#D4A843] mt-1">
            {accuracy.toFixed(1)}% accuracy
          </p>
        </div>

        {/* Price comparison */}
        <div className="flex justify-between bg-[#0A0A0F] rounded-lg p-3">
          <div className="text-center">
            <p className="text-[10px] text-[#555570] uppercase">My Call</p>
            <p className="font-mono text-lg text-[#F1F1F5]">
              {formatPrice(predictedPrice)}
            </p>
          </div>
          <div className="flex items-center text-[#555570]">vs</div>
          <div className="text-center">
            <p className="text-[10px] text-[#555570] uppercase">Hammer</p>
            <p className="font-mono text-lg text-[#D4A843]">
              {formatPrice(hammerPrice)}
            </p>
          </div>
        </div>

        {/* Player footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2A2A40]">
          <span className="text-xs text-[#8888A0]">{playerName}</span>
          <span className="text-xs text-[#555570]">{rankTitle}</span>
        </div>
      </CardContent>
    </Card>
  );
}
