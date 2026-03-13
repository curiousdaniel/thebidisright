"use client";

import { AMItem } from "@/types/auction";
import LotCard from "./LotCard";

interface LotGridProps {
  items: AMItem[];
  auctionTitle?: string;
  predictions?: Map<number, { status: "locked" | "draft" | "none" }>;
  predictionCounts?: Map<number, number>;
}

export default function LotGrid({
  items,
  auctionTitle,
  predictions,
  predictionCounts,
}: LotGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#555570]">
        <span className="text-5xl mb-4">🔍</span>
        <p className="text-lg font-medium">No lots found</p>
        <p className="text-sm mt-1">Check back soon for new auction items</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <LotCard
          key={item.am_item_id}
          item={item}
          auctionTitle={auctionTitle}
          predictionStatus={predictions?.get(item.am_item_id)?.status || "none"}
          predictionCount={predictionCounts?.get(item.am_item_id) || 0}
        />
      ))}
    </div>
  );
}
