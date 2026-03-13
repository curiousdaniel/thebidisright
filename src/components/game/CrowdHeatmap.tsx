"use client";

import { cn, formatPrice } from "@/lib/utils";
import { CrowdStats } from "@/types/game";

interface CrowdHeatmapProps {
  stats: CrowdStats | null;
  maxPrice: number;
  className?: string;
}

export default function CrowdHeatmap({
  stats,
  maxPrice,
  className,
}: CrowdHeatmapProps) {
  if (!stats || stats.count === 0) {
    return (
      <div className={cn("text-center py-4 text-sm text-[#555570]", className)}>
        No community predictions yet
      </div>
    );
  }

  const medianPct = (stats.median / maxPrice) * 100;
  const meanPct = (stats.mean / maxPrice) * 100;
  const minPct = (stats.min / maxPrice) * 100;
  const maxPct = (stats.max / maxPrice) * 100;
  const spreadPct = maxPct - minPct;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-xs text-[#8888A0]">
        <span>Community Predictions</span>
        <span>{stats.count} calls</span>
      </div>

      {/* Visual spread */}
      <div className="relative h-6 bg-[#1E1E30] rounded-full overflow-hidden">
        {/* Spread range */}
        <div
          className="absolute top-0 h-full bg-[#60A5FA]/10 rounded-full"
          style={{ left: `${minPct}%`, width: `${spreadPct}%` }}
        />
        {/* Median line */}
        <div
          className="absolute top-0 h-full w-0.5 bg-[#60A5FA]"
          style={{ left: `${medianPct}%` }}
        />
        {/* Mean dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#60A5FA]/60 border border-[#60A5FA]"
          style={{ left: `${meanPct}%`, transform: `translateX(-50%) translateY(-50%)` }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-[10px] text-[#555570] uppercase">Median</p>
          <p className="text-sm font-mono text-[#60A5FA]">
            {formatPrice(stats.median)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#555570] uppercase">Spread</p>
          <p className="text-sm font-mono text-[#8888A0]">
            {formatPrice(stats.min)} — {formatPrice(stats.max)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#555570] uppercase">Confidence</p>
          <p className="text-sm font-mono text-[#F1F1F5]">
            {stats.confidence_score}%
          </p>
        </div>
      </div>
    </div>
  );
}
