"use client";

import { cn } from "@/lib/utils";
import { Flame, Target } from "lucide-react";

interface StreakIndicatorProps {
  dailyStreak: number;
  accuracyStreak: number;
  compact?: boolean;
  className?: string;
}

export default function StreakIndicator({
  dailyStreak,
  accuracyStreak,
  compact = false,
  className,
}: StreakIndicatorProps) {
  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {dailyStreak > 0 && (
          <div className="flex items-center gap-1 text-amber-400">
            <Flame size={14} />
            <span className="text-xs font-mono font-bold">{dailyStreak}</span>
          </div>
        )}
        {accuracyStreak > 0 && (
          <div className="flex items-center gap-1 text-emerald-400">
            <Target size={14} />
            <span className="text-xs font-mono font-bold">
              {accuracyStreak}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex items-center gap-2 bg-[#1E1E30] rounded-lg px-3 py-2">
        <Flame
          size={18}
          className={dailyStreak > 0 ? "text-amber-400" : "text-[#555570]"}
        />
        <div>
          <p className="text-xs text-[#555570]">Daily Streak</p>
          <p
            className={cn(
              "font-mono font-bold",
              dailyStreak > 0 ? "text-amber-400" : "text-[#555570]"
            )}
          >
            {dailyStreak} day{dailyStreak !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-[#1E1E30] rounded-lg px-3 py-2">
        <Target
          size={18}
          className={
            accuracyStreak > 0 ? "text-emerald-400" : "text-[#555570]"
          }
        />
        <div>
          <p className="text-xs text-[#555570]">Accuracy Streak</p>
          <p
            className={cn(
              "font-mono font-bold",
              accuracyStreak > 0 ? "text-emerald-400" : "text-[#555570]"
            )}
          >
            {accuracyStreak} in a row
          </p>
        </div>
      </div>
    </div>
  );
}
