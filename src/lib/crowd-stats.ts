import { CrowdStats } from "@/types/game";

export function calculateCrowdStats(predictions: number[]): CrowdStats | null {
  if (predictions.length === 0) return null;

  const sorted = [...predictions].sort((a, b) => a - b);
  const count = sorted.length;

  const mean = sorted.reduce((sum, v) => sum + v, 0) / count;

  let median: number;
  if (count % 2 === 0) {
    median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
  } else {
    median = sorted[Math.floor(count / 2)];
  }

  const min = sorted[0];
  const max = sorted[count - 1];

  const variance =
    sorted.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / count;
  const std_dev = Math.sqrt(variance);

  const cv = mean > 0 ? std_dev / mean : 1;
  const countFactor = Math.min(1, count / 20);
  const agreementFactor = Math.max(0, 1 - cv);
  const confidence_score =
    Math.round((countFactor * 0.4 + agreementFactor * 0.6) * 100);

  return {
    median: Math.round(median * 100) / 100,
    mean: Math.round(mean * 100) / 100,
    min,
    max,
    std_dev: Math.round(std_dev * 100) / 100,
    count,
    confidence_score: Math.min(100, Math.max(0, confidence_score)),
  };
}

export function crowdVsStartingBid(
  crowdMedian: number,
  startingBid: number | null
): number | null {
  if (!startingBid || startingBid === 0) return null;
  return Math.round((crowdMedian / startingBid) * 100) / 100;
}

export function crowdVsHammerPrice(
  crowdMedian: number,
  hammerPrice: number | null
): number | null {
  if (!hammerPrice || hammerPrice === 0) return null;
  const deviation = Math.abs(crowdMedian - hammerPrice) / hammerPrice;
  return Math.round((1 - deviation) * 10000) / 100;
}
