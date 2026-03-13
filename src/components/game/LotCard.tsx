"use client";

import Link from "next/link";
import { AMItem } from "@/types/auction";
import { formatPrice } from "@/lib/utils";
import { getItemImageUrl } from "@/lib/image-url";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import CountdownTimer from "./CountdownTimer";
import { ImageIcon } from "lucide-react";

interface LotCardProps {
  item: AMItem;
  auctionTitle?: string;
  predictionStatus?: "locked" | "draft" | "none";
  predictionCount?: number;
}

export default function LotCard({
  item,
  auctionTitle,
  predictionStatus = "none",
  predictionCount = 0,
}: LotCardProps) {
  const statusBadge = {
    locked: { label: "Locked", variant: "gold" as const, icon: "🔒" },
    draft: { label: "Draft", variant: "blue" as const, icon: "✏️" },
    none: { label: "Not Yet", variant: "default" as const, icon: "⏳" },
  }[predictionStatus];

  const imageSrc = getItemImageUrl(item.image_url);

  return (
    <Link href={`/lot/${item.am_item_id}`}>
      <Card className="group hover:border-[#D4A843]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4A843]/5">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-[#0A0A0F] overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={48} className="text-[#2A2A40]" />
            </div>
          )}

          {/* Status overlay */}
          {item.status === "closed" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-red-400 font-bold text-lg">CLOSED</span>
            </div>
          )}

          {/* Category badge */}
          {item.category && (
            <div className="absolute top-2 left-2">
              <Badge variant="gold" size="sm">
                {item.category}
              </Badge>
            </div>
          )}

          {/* Countdown */}
          {item.status === "open" && item.closes_at && (
            <div className="absolute bottom-2 right-2">
              <div className="bg-[#0A0A0F]/80 backdrop-blur-sm rounded-lg px-2 py-1">
                <CountdownTimer closesAt={item.closes_at} compact />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-[#F1F1F5] line-clamp-2 group-hover:text-[#D4A843] transition-colors">
              {item.title}
            </h3>
            {item.lot_number && (
              <span className="text-xs text-[#555570] whitespace-nowrap">
                Lot {item.lot_number}
              </span>
            )}
          </div>

          {auctionTitle && (
            <p className="text-xs text-[#555570] truncate">{auctionTitle}</p>
          )}

          <div className="flex items-center justify-between pt-1">
            <div>
              {item.starting_bid && (
                <div className="text-xs text-[#8888A0]">
                  Starting{" "}
                  <span className="font-mono text-[#F1F1F5]">
                    {formatPrice(item.starting_bid)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {predictionCount > 0 && (
                <span className="text-xs text-[#555570]">
                  {predictionCount} calls
                </span>
              )}
              <Badge variant={statusBadge.variant} size="sm">
                {statusBadge.icon} {statusBadge.label}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
