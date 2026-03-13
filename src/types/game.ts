export type AccuracyTier =
  | "bullseye"
  | "hot_read"
  | "good_eye"
  | "miss"
  | "way_off";

export type PredictionSource = "browse" | "quick_play" | "challenge";

export interface Prediction {
  id: string;
  player_id: string;
  am_item_id: number;
  am_auction_id: number;
  predicted_price: number;
  locked_at: string;
  revised_at: string | null;
  revision_count: number;
  source: PredictionSource;
}

export interface PredictionResult {
  id: string;
  prediction_id: string;
  player_id: string;
  am_item_id: number;
  predicted_price: number;
  hammer_price: number;
  deviation: number;
  accuracy_score: number;
  points_earned: number;
  accuracy_tier: AccuracyTier;
  scored_at: string;
}

export type BadgeCategory = "accuracy" | "volume" | "category" | "special";

export interface Badge {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: BadgeCategory | null;
  criteria: Record<string, unknown> | null;
}

export interface PlayerBadge {
  id: string;
  player_id: string;
  badge_id: number;
  earned_at: string;
  badge?: Badge;
}

export interface RevealItem {
  prediction: Prediction;
  result: PredictionResult;
  item: {
    title: string;
    image_url: string | null;
    lot_number: string | null;
    category: string | null;
    am_auction_id: number;
  };
  auction_title: string;
}

export interface CrowdStats {
  median: number;
  mean: number;
  min: number;
  max: number;
  std_dev: number;
  count: number;
  confidence_score: number;
}

export const ACCURACY_TIERS: Record<
  AccuracyTier,
  { label: string; emoji: string; minDeviation: number; maxDeviation: number }
> = {
  bullseye: { label: "Bullseye!", emoji: "🎯", minDeviation: 0, maxDeviation: 0.05 },
  hot_read: { label: "Hot Read!", emoji: "🔥", minDeviation: 0.05, maxDeviation: 0.1 },
  good_eye: { label: "Good Eye", emoji: "👍", minDeviation: 0.1, maxDeviation: 0.2 },
  miss: { label: "Swing and a Miss", emoji: "😬", minDeviation: 0.2, maxDeviation: 0.5 },
  way_off: { label: "Way Off", emoji: "💀", minDeviation: 0.5, maxDeviation: Infinity },
};
