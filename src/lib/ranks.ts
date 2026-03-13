import { RANKS, type RankDefinition } from "@/types/player";

export function getRankForPoints(points: number): RankDefinition {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (points >= rank.threshold) {
      current = rank;
    } else {
      break;
    }
  }
  return current;
}

export function getNextRank(points: number): RankDefinition | null {
  for (const rank of RANKS) {
    if (rank.threshold > points) {
      return rank;
    }
  }
  return null;
}

export function getRankProgress(points: number): {
  current: RankDefinition;
  next: RankDefinition | null;
  progress: number;
  pointsToNext: number;
} {
  const current = getRankForPoints(points);
  const next = getNextRank(points);

  if (!next) {
    return { current, next: null, progress: 1, pointsToNext: 0 };
  }

  const rangeTotal = next.threshold - current.threshold;
  const rangeProgress = points - current.threshold;
  const progress = rangeTotal > 0 ? rangeProgress / rangeTotal : 0;

  return {
    current,
    next,
    progress: Math.min(1, Math.max(0, progress)),
    pointsToNext: next.threshold - points,
  };
}
