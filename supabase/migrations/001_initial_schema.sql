-- BidIQ Initial Schema
-- Synced from AuctionMethod (read cache)

CREATE TABLE am_auctions (
  id SERIAL PRIMARY KEY,
  am_auction_id INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  status TEXT,
  published BOOLEAN DEFAULT false,
  city TEXT,
  state TEXT,
  timezone TEXT,
  image_url TEXT,
  raw_data JSONB,
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE am_items (
  id SERIAL PRIMARY KEY,
  am_item_id INTEGER UNIQUE NOT NULL,
  am_auction_id INTEGER NOT NULL REFERENCES am_auctions(am_auction_id),
  title TEXT NOT NULL,
  description TEXT,
  lot_number TEXT,
  category TEXT,
  category_id INTEGER,
  starting_bid DECIMAL(12,2),
  current_bid DECIMAL(12,2),
  hammer_price DECIMAL(12,2),
  image_url TEXT,
  image_urls JSONB,
  status TEXT DEFAULT 'open',
  closes_at TIMESTAMPTZ,
  raw_data JSONB,
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_items_auction ON am_items(am_auction_id);
CREATE INDEX idx_items_status ON am_items(status);
CREATE INDEX idx_items_closes ON am_items(closes_at);
CREATE INDEX idx_items_category ON am_items(category);

-- Game data

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_auth_id UUID UNIQUE REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  total_predictions INTEGER DEFAULT 0,
  average_accuracy DECIMAL(5,2) DEFAULT 0,
  current_daily_streak INTEGER DEFAULT 0,
  longest_daily_streak INTEGER DEFAULT 0,
  current_accuracy_streak INTEGER DEFAULT 0,
  longest_accuracy_streak INTEGER DEFAULT 0,
  rank_title TEXT DEFAULT 'Browsing Bidder',
  last_prediction_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  am_item_id INTEGER NOT NULL REFERENCES am_items(am_item_id),
  am_auction_id INTEGER NOT NULL,
  predicted_price DECIMAL(12,2) NOT NULL,
  locked_at TIMESTAMPTZ DEFAULT now(),
  revised_at TIMESTAMPTZ,
  revision_count INTEGER DEFAULT 0,
  source TEXT DEFAULT 'browse',
  UNIQUE(player_id, am_item_id)
);

CREATE INDEX idx_predictions_item ON predictions(am_item_id);
CREATE INDEX idx_predictions_player ON predictions(player_id);
CREATE INDEX idx_predictions_auction ON predictions(am_auction_id);

CREATE TABLE prediction_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID UNIQUE NOT NULL REFERENCES predictions(id),
  player_id UUID NOT NULL REFERENCES players(id),
  am_item_id INTEGER NOT NULL,
  predicted_price DECIMAL(12,2) NOT NULL,
  hammer_price DECIMAL(12,2) NOT NULL,
  deviation DECIMAL(8,4) NOT NULL,
  accuracy_score DECIMAL(5,2) NOT NULL,
  points_earned INTEGER NOT NULL,
  accuracy_tier TEXT NOT NULL,
  scored_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_results_player ON prediction_results(player_id);
CREATE INDEX idx_results_scored ON prediction_results(scored_at);

CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  criteria JSONB
);

CREATE TABLE player_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  badge_id INTEGER NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(player_id, badge_id)
);

CREATE INDEX idx_player_badges_player ON player_badges(player_id);

CREATE TABLE game_config (
  id SERIAL PRIMARY KEY,
  site_domain TEXT UNIQUE NOT NULL,
  show_current_bid BOOLEAN DEFAULT false,
  lockout_minutes INTEGER DEFAULT 30,
  crowd_stats_visibility TEXT DEFAULT 'after_lockin',
  quick_play_enabled BOOLEAN DEFAULT true,
  season_mode TEXT DEFAULT 'off',
  max_predictions_per_day INTEGER,
  require_registration BOOLEAN DEFAULT true,
  share_cards_enabled BOOLEAN DEFAULT true,
  operator_logo_url TEXT,
  operator_accent_color TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Helper function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_leaderboards()
RETURNS void AS $$
BEGIN
  -- Placeholder for materialized view refresh
  -- Views will be created once we have data
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security

ALTER TABLE am_auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE am_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_config ENABLE ROW LEVEL SECURITY;

-- Public read on auctions and items
CREATE POLICY "Anyone can read auctions" ON am_auctions FOR SELECT USING (true);
CREATE POLICY "Anyone can read items" ON am_items FOR SELECT USING (true);
CREATE POLICY "Anyone can read badges" ON badges FOR SELECT USING (true);

-- Players can read all players (for leaderboard)
CREATE POLICY "Anyone can read players" ON players FOR SELECT USING (true);

-- Players can update their own record
CREATE POLICY "Players can update own record" ON players
  FOR UPDATE USING (supabase_auth_id = auth.uid());

-- Predictions: read own, insert own
CREATE POLICY "Players can read own predictions" ON predictions
  FOR SELECT USING (player_id IN (SELECT id FROM players WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Players can insert predictions" ON predictions
  FOR INSERT WITH CHECK (player_id IN (SELECT id FROM players WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Players can update own predictions" ON predictions
  FOR UPDATE USING (player_id IN (SELECT id FROM players WHERE supabase_auth_id = auth.uid()));

-- Results: read own
CREATE POLICY "Players can read own results" ON prediction_results
  FOR SELECT USING (player_id IN (SELECT id FROM players WHERE supabase_auth_id = auth.uid()));

-- Player badges: read own
CREATE POLICY "Players can read own badges" ON player_badges
  FOR SELECT USING (player_id IN (SELECT id FROM players WHERE supabase_auth_id = auth.uid()));

-- Config: public read
CREATE POLICY "Anyone can read config" ON game_config FOR SELECT USING (true);

-- Enable realtime on prediction_results
ALTER PUBLICATION supabase_realtime ADD TABLE prediction_results;

-- Insert default config
INSERT INTO game_config (site_domain) VALUES ('default') ON CONFLICT DO NOTHING;
