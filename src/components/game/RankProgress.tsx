"use client";

import { getRankProgress } from "@/lib/ranks";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RankProgressProps {
  totalPoints: number;
  className?: string;
}

export default function RankProgress({ totalPoints, className }: RankProgressProps) {
  const { current, next, progress, pointsToNext } = getRankProgress(totalPoints);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{current.icon}</span>
          <span className="text-sm font-semibold text-[#F1F1F5]">
            {current.title}
          </span>
        </div>
        {next && (
          <div className="flex items-center gap-2 text-sm text-[#555570]">
            <span>{next.icon}</span>
            <span>{next.title}</span>
          </div>
        )}
      </div>

      <div className="h-2 bg-[#1E1E30] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D4A843] to-[#F0D78C] rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-[#8888A0]">
          {formatNumber(totalPoints)} pts
        </span>
        {next ? (
          <span className="text-[#555570]">
            {formatNumber(pointsToNext)} pts to {next.title}
          </span>
        ) : (
          <span className="text-[#D4A843]">Max rank achieved!</span>
        )}
      </div>
    </div>
  );
}
