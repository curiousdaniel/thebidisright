export interface Player {
  id: string;
  supabase_auth_id: string;
  display_name: string;
  avatar_url: string | null;
  total_points: number;
  total_predictions: number;
  average_accuracy: number;
  current_daily_streak: number;
  longest_daily_streak: number;
  current_accuracy_streak: number;
  longest_accuracy_streak: number;
  rank_title: string;
  last_prediction_date: string | null;
  created_at: string;
}

export interface RankDefinition {
  threshold: number;
  title: string;
  icon: string;
}

export const RANKS: RankDefinition[] = [
  { threshold: 0, title: "Browsing Bidder", icon: "🟢" },
  { threshold: 500, title: "Keen Eye", icon: "👁️" },
  { threshold: 2_000, title: "Appraiser", icon: "🔍" },
  { threshold: 5_000, title: "Market Watcher", icon: "📈" },
  { threshold: 15_000, title: "Sharp Dealer", icon: "🃏" },
  { threshold: 40_000, title: "Eagle Eye", icon: "🦅" },
  { threshold: 100_000, title: "Master Appraiser", icon: "🏆" },
  { threshold: 250_000, title: "The Oracle", icon: "🔮" },
];

export interface LeaderboardEntry {
  rank: number;
  player_id: string;
  display_name: string;
  avatar_url: string | null;
  rank_title: string;
  rank_icon: string;
  stat_value: number;
  stat_label: string;
  total_predictions: number;
  top_badges: string[];
}

export type LeaderboardView =
  | "alltime"
  | "weekly"
  | "auction"
  | "category"
  | "accuracy"
  | "streak";
