import { getRankForPoints } from "@/lib/ranks";
import type { LeaderboardEntry } from "@/types/player";

/** Deterministic hash for reproducible fake data */
function hash(s: string): number {
  return s.split("").reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
}

/** Seeded pseudo-random in [0, 1) */
function seeded(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateFakePredictionsForItem(
  startingBid: number,
  itemId: number,
  count: number
): number[] {
  const base = startingBid || 100;
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    const h = hash(`pred-${itemId}-${i}`);
    const factor = 0.7 + (Math.abs(h) % 60) / 100; // 0.7–1.3
    result.push(Math.round(base * factor * 100) / 100);
  }
  return result.sort((a, b) => a - b);
}

export function generateFakeHammerPrice(
  startingBid: number,
  itemId: number
): number {
  const base = startingBid || 100;
  const h = hash(`hammer-${itemId}`);
  const factor = 0.85 + (Math.abs(h) % 30) / 100; // 0.85–1.15
  return Math.round(base * factor * 100) / 100;
}

const FAKE_NAMES = [
  "Ace Appraiser",
  "Bid Master",
  "Crystal Ball",
  "Deal Seeker",
  "Eagle Eye",
  "Fair Value",
  "Gold Rush",
  "Hot Hand",
  "Iron Bid",
  "Jade Trader",
  "Keen Eye",
  "Lucky Lot",
  "Market Maven",
  "Number Cruncher",
  "Oracle",
];

export function generateFakeLeaderboardEntries(
  view: "alltime" | "weekly" | "accuracy" | "streak" = "alltime",
  limit = 15
): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = [];
  for (let i = 0; i < limit; i++) {
    const seed = hash(`leaderboard-${view}-${i}`);
    const points = 500 + Math.abs(seed) % 45000;
    const rank = getRankForPoints(points);
    const name = FAKE_NAMES[i % FAKE_NAMES.length];
    const accuracy = 60 + (Math.abs(hash(`acc-${i}`)) % 35);
    const streak = view === "streak" ? 1 + (Math.abs(seed) % 14) : 0;

    entries.push({
      rank: i + 1,
      player_id: `demo-${i}`,
      display_name: name,
      avatar_url: null,
      rank_title: rank.title,
      rank_icon: rank.icon,
      stat_value:
        view === "alltime"
          ? points
          : view === "weekly"
            ? Math.round(points * 0.15 * (1 + seeded(seed)))
            : view === "accuracy"
              ? accuracy
              : streak,
      stat_label:
        view === "alltime"
          ? "points"
          : view === "weekly"
            ? "weekly pts"
            : view === "accuracy"
              ? "avg accuracy"
              : "day streak",
      total_predictions: view === "alltime" ? 25 + (Math.abs(seed) % 75) : 0,
      top_badges: [],
    });
  }
  return entries;
}
