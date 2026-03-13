"use client";

import Tabs from "@/components/ui/Tabs";
import { Trophy, Clock, Target, Flame, BarChart3, Grid3X3 } from "lucide-react";
import { LeaderboardView } from "@/types/player";

interface LeaderboardFilterProps {
  current: LeaderboardView;
  onChange: (view: LeaderboardView) => void;
}

const views = [
  { id: "alltime" as const, label: "All-Time", icon: <Trophy size={14} /> },
  { id: "weekly" as const, label: "This Week", icon: <Clock size={14} /> },
  { id: "accuracy" as const, label: "Accuracy", icon: <Target size={14} /> },
  { id: "streak" as const, label: "Streaks", icon: <Flame size={14} /> },
  { id: "auction" as const, label: "By Auction", icon: <Grid3X3 size={14} /> },
  { id: "category" as const, label: "By Category", icon: <BarChart3 size={14} /> },
];

export default function LeaderboardFilter({
  current,
  onChange,
}: LeaderboardFilterProps) {
  return (
    <Tabs
      tabs={views}
      defaultTab={current}
      onTabChange={(id) => onChange(id as LeaderboardView)}
    />
  );
}
