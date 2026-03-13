-- BidIQ Schema: Run this in Supabase Dashboard > SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- 1. Tables
CREATE TABLE IF NOT EXISTS am_auctions (
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

CREATE TABLE IF NOT EXISTS am_items (
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

CREATE INDEX IF NOT EXISTS idx_items_auction ON am_items(am_auction_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON am_items(status);
CREATE INDEX IF NOT EXISTS idx_items_closes ON am_items(closes_at);
CREATE INDEX IF NOT EXISTS idx_items_category ON am_items(category);

CREATE TABLE IF NOT EXISTS players (
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

CREATE TABLE IF NOT EXISTS predictions (
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

CREATE INDEX IF NOT EXISTS idx_predictions_item ON predictions(am_item_id);
CREATE INDEX IF NOT EXISTS idx_predictions_player ON predictions(player_id);
CREATE INDEX IF NOT EXISTS idx_predictions_auction ON predictions(am_auction_id);

CREATE TABLE IF NOT EXISTS prediction_results (
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

CREATE INDEX IF NOT EXISTS idx_results_player ON prediction_results(player_id);
CREATE INDEX IF NOT EXISTS idx_results_scored ON prediction_results(scored_at);

CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  criteria JSONB
);

CREATE TABLE IF NOT EXISTS player_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  badge_id INTEGER NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(player_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_player_badges_player ON player_badges(player_id);

CREATE TABLE IF NOT EXISTS game_config (
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

-- 2. Helper function
CREATE OR REPLACE FUNCTION refresh_leaderboards()
RETURNS void AS $$
BEGIN
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- 3. Row Level Security
ALTER TABLE am_auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE am_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_config ENABLE ROW LEVEL SECURITY;

-- 4. Policies (drop first if re-running)
DROP POLICY IF EXISTS "Anyone can read auctions" ON am_auctions;
DROP POLICY IF EXISTS "Anyone can read items" ON am_items;
DROP POLICY IF EXISTS "Anyone can read badges" ON badges;
DROP POLICY IF EXISTS "Anyone can read players" ON players;
DROP POLICY IF EXISTS "Players can update own record" ON players;
DROP POLICY IF EXISTS "Players can read own predictions" ON predictions;
DROP POLICY IF EXISTS "Players can insert predictions" ON predictions;
DROP POLICY IF EXISTS "Players can update own predictions" ON predictions;
DROP POLICY IF EXISTS "Players can read own results" ON prediction_results;
DROP POLICY IF EXISTS "Players can read own badges" ON player_badges;
DROP POLICY IF EXISTS "Anyone can read config" ON game_config;

-- Service role bypasses RLS; these policies are for anon/authenticated
CREATE POLICY "Anyone can read auctions" ON am_auctions FOR SELECT USING (true);
CREATE POLICY "Anyone can read items" ON am_items FOR SELECT USING (true);
CREATE POLICY "Anyone can read badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Anyone can read players" ON players FOR SELECT USING (true);
CREATE POLICY "Players can update own record" ON players
  FOR UPDATE USING (supabase_auth_id = auth.uid());
CREATE POLICY "Players can read own predictions" ON predictions
  FOR SELECT USING (player_id IN (SELECT id FROM players WHERE supabase_auth_id = auth.uid()));
CREATE POLICY "Players can insert predictions" ON predictions
  FOR INSERT WITH CHECK (player_id IN (SELECT id FROM players WHERE supabase_auth_id = auth.uid()));
CREATE POLICY "Players can update own predictions" ON predictions
  FOR UPDATE USING (player_id IN (SELECT id FROM players WHERE supabase_auth_id = auth.uid()));
CREATE POLICY "Players can read own results" ON prediction_results
  FOR SELECT USING (player_id IN (SELECT id FROM players WHERE supabase_auth_id = auth.uid()));
CREATE POLICY "Players can read own badges" ON player_badges
  FOR SELECT USING (player_id IN (SELECT id FROM players WHERE supabase_auth_id = auth.uid()));
CREATE POLICY "Anyone can read config" ON game_config FOR SELECT USING (true);

-- 5. Realtime for live score updates (omit if re-running and you get "already member" error)
ALTER PUBLICATION supabase_realtime ADD TABLE prediction_results;

-- 6. Seed data
INSERT INTO game_config (site_domain) VALUES ('default') ON CONFLICT (site_domain) DO NOTHING;

INSERT INTO badges (slug, name, description, icon, category, criteria) VALUES
  ('first-bullseye', 'First Bullseye', 'Get your first Bullseye (within 5%)', '🎯', 'accuracy', '{"type": "bullseye_count", "count": 1}'),
  ('10-bullseyes', '10 Bullseyes', 'Get 10 Bullseyes', '🎯', 'accuracy', '{"type": "bullseye_count", "count": 10}'),
  ('50-bullseyes', '50 Bullseyes', 'Get 50 Bullseyes', '🎯', 'accuracy', '{"type": "bullseye_count", "count": 50}'),
  ('sniper', 'Sniper', 'Get 100 Bullseyes', '🎯', 'accuracy', '{"type": "bullseye_count", "count": 100}'),
  ('hot-streak', 'Hot Streak', '5 Hot Reads in a row', '🔥', 'accuracy', '{"type": "accuracy_streak", "tier": "hot_read", "count": 5}'),
  ('ice-cold', 'Ice Cold', '10 predictions in a row off by more than 50%', '🧊', 'accuracy', '{"type": "cold_streak", "count": 10}'),
  ('first-prediction', 'First Prediction', 'Make your first prediction', '📋', 'volume', '{"type": "prediction_count", "count": 1}'),
  ('century-club', 'Century Club', 'Make 100 predictions', '📋', 'volume', '{"type": "prediction_count", "count": 100}'),
  ('volume-dealer', 'Volume Dealer', 'Make 500 predictions', '📋', 'volume', '{"type": "prediction_count", "count": 500}'),
  ('obsessed', 'Obsessed', 'Make 1000 predictions', '📋', 'volume', '{"type": "prediction_count", "count": 1000}'),
  ('cat-vehicles', 'Vehicle Expert', '25 predictions in Vehicles with 70+ avg accuracy', '🚗', 'category', '{"type": "category_specialist", "category": "Vehicles", "count": 25, "min_accuracy": 70}'),
  ('cat-jewelry', 'Jewelry Expert', '25 predictions in Jewelry with 70+ avg accuracy', '💎', 'category', '{"type": "category_specialist", "category": "Jewelry", "count": 25, "min_accuracy": 70}'),
  ('cat-art', 'Art Expert', '25 predictions in Art with 70+ avg accuracy', '🎨', 'category', '{"type": "category_specialist", "category": "Art", "count": 25, "min_accuracy": 70}'),
  ('cat-tools', 'Tools Expert', '25 predictions in Tools with 70+ avg accuracy', '🔧', 'category', '{"type": "category_specialist", "category": "Tools", "count": 25, "min_accuracy": 70}'),
  ('cat-realestate', 'Real Estate Expert', '25 predictions in Real Estate with 70+ avg accuracy', '🏠', 'category', '{"type": "category_specialist", "category": "Real Estate", "count": 25, "min_accuracy": 70}'),
  ('speed-demon', 'Speed Demon', 'Complete 10 Quick Play rounds', '⚡', 'special', '{"type": "quick_play_count", "count": 10}'),
  ('early-bird', 'Early Bird', 'Predict within 1 hour of an auction going live', '🌅', 'special', '{"type": "early_bird"}'),
  ('last-call', 'Last Call', 'Lock in during the final 5 minutes before lockout', '🕐', 'special', '{"type": "last_call"}'),
  ('sweep', 'Sweep', 'Predict every lot in an auction with 25+ lots', '🧹', 'special', '{"type": "auction_sweep", "min_lots": 25}'),
  ('contrarian', 'Contrarian', 'Predict 30%+ different from crowd median AND be more accurate', '📊', 'special', '{"type": "contrarian"}'),
  ('penny-perfect', 'Penny Perfect', 'Predict the exact hammer price to the dollar', '🎰', 'special', '{"type": "exact_match"}')
ON CONFLICT (slug) DO NOTHING;
