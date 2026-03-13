export interface GameConfig {
  id: number;
  site_domain: string;
  show_current_bid: boolean;
  lockout_minutes: number;
  crowd_stats_visibility: "hidden" | "after_lockin" | "always";
  quick_play_enabled: boolean;
  season_mode: "off" | "monthly" | "quarterly" | "custom";
  max_predictions_per_day: number | null;
  require_registration: boolean;
  share_cards_enabled: boolean;
  operator_logo_url: string | null;
  operator_accent_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface LotAppraisalData {
  am_item_id: number;
  title: string;
  lot_number: string | null;
  category: string | null;
  starting_bid: number | null;
  hammer_price: number | null;
  status: string;
  crowd_median: number;
  crowd_mean: number;
  prediction_min: number;
  prediction_max: number;
  std_deviation: number;
  prediction_count: number;
  confidence_score: number;
  vs_starting_bid: number | null;
  vs_hammer_price: number | null;
}

export interface AuctionAppraisalData {
  am_auction_id: number;
  title: string;
  total_predicted_value: number;
  total_hammer_value: number | null;
  crowd_accuracy: number | null;
  total_predictions: number;
  unique_players: number;
  avg_predictions_per_lot: number;
  hottest_lots: LotAppraisalData[];
  controversial_lots: LotAppraisalData[];
  sleeper_lots: LotAppraisalData[];
}

export interface PortfolioData {
  total_inventory_value: number;
  historical_accuracy: Array<{ date: string; accuracy: number }>;
  category_breakdown: Array<{ category: string; value: number; count: number }>;
  volume_trends: Array<{ date: string; count: number }>;
  engagement_funnel: {
    registered: number;
    active: number;
    predictions_made: number;
    returned: number;
  };
  top_predictors: Array<{
    player_id: string;
    display_name: string;
    accuracy: number;
    predictions: number;
  }>;
}
