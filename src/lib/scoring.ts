import { AccuracyTier } from "@/types/game";

export function calculateDeviation(
  predicted: number,
  hammerPrice: number
): number {
  if (hammerPrice === 0) return predicted === 0 ? 0 : 1;
  return Math.abs(predicted - hammerPrice) / hammerPrice;
}

export function calculateAccuracyScore(deviation: number): number {
  return Math.max(0, 100 - deviation * 100);
}

export function getAccuracyTier(deviation: number): AccuracyTier {
  if (deviation <= 0.05) return "bullseye";
  if (deviation <= 0.1) return "hot_read";
  if (deviation <= 0.2) return "good_eye";
  if (deviation <= 0.5) return "miss";
  return "way_off";
}

const TIER_BONUS: Record<AccuracyTier, number> = {
  bullseye: 200,
  hot_read: 100,
  good_eye: 50,
  miss: 0,
  way_off: 0,
};

const PARTICIPATION_POINTS = 10;

export function calculatePoints(
  accuracyScore: number,
  tier: AccuracyTier
): number {
  const accuracyBonus = Math.round(accuracyScore * 5);
  return PARTICIPATION_POINTS + accuracyBonus + TIER_BONUS[tier];
}

export interface ScoreResult {
  deviation: number;
  accuracyScore: number;
  accuracyTier: AccuracyTier;
  pointsEarned: number;
}

export function scorePrediction(
  predictedPrice: number,
  hammerPrice: number
): ScoreResult {
  const deviation = calculateDeviation(predictedPrice, hammerPrice);
  const accuracyScore = calculateAccuracyScore(deviation);
  const accuracyTier = getAccuracyTier(deviation);
  const pointsEarned = calculatePoints(accuracyScore, accuracyTier);

  return {
    deviation: Math.round(deviation * 10000) / 10000,
    accuracyScore: Math.round(accuracyScore * 100) / 100,
    accuracyTier,
    pointsEarned,
  };
}
