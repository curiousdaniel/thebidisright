-- Seed badge definitions

INSERT INTO badges (slug, name, description, icon, category, criteria) VALUES
  -- Accuracy badges
  ('first-bullseye', 'First Bullseye', 'Get your first Bullseye (within 5%)', '🎯', 'accuracy', '{"type": "bullseye_count", "count": 1}'),
  ('10-bullseyes', '10 Bullseyes', 'Get 10 Bullseyes', '🎯', 'accuracy', '{"type": "bullseye_count", "count": 10}'),
  ('50-bullseyes', '50 Bullseyes', 'Get 50 Bullseyes', '🎯', 'accuracy', '{"type": "bullseye_count", "count": 50}'),
  ('sniper', 'Sniper', 'Get 100 Bullseyes', '🎯', 'accuracy', '{"type": "bullseye_count", "count": 100}'),
  ('hot-streak', 'Hot Streak', '5 Hot Reads in a row', '🔥', 'accuracy', '{"type": "accuracy_streak", "tier": "hot_read", "count": 5}'),
  ('ice-cold', 'Ice Cold', '10 predictions in a row off by more than 50%', '🧊', 'accuracy', '{"type": "cold_streak", "count": 10}'),

  -- Volume badges
  ('first-prediction', 'First Prediction', 'Make your first prediction', '📋', 'volume', '{"type": "prediction_count", "count": 1}'),
  ('century-club', 'Century Club', 'Make 100 predictions', '📋', 'volume', '{"type": "prediction_count", "count": 100}'),
  ('volume-dealer', 'Volume Dealer', 'Make 500 predictions', '📋', 'volume', '{"type": "prediction_count", "count": 500}'),
  ('obsessed', 'Obsessed', 'Make 1000 predictions', '📋', 'volume', '{"type": "prediction_count", "count": 1000}'),

  -- Category specialist badges
  ('cat-vehicles', 'Vehicle Expert', '25 predictions in Vehicles with 70+ avg accuracy', '🚗', 'category', '{"type": "category_specialist", "category": "Vehicles", "count": 25, "min_accuracy": 70}'),
  ('cat-jewelry', 'Jewelry Expert', '25 predictions in Jewelry with 70+ avg accuracy', '💎', 'category', '{"type": "category_specialist", "category": "Jewelry", "count": 25, "min_accuracy": 70}'),
  ('cat-art', 'Art Expert', '25 predictions in Art with 70+ avg accuracy', '🎨', 'category', '{"type": "category_specialist", "category": "Art", "count": 25, "min_accuracy": 70}'),
  ('cat-tools', 'Tools Expert', '25 predictions in Tools with 70+ avg accuracy', '🔧', 'category', '{"type": "category_specialist", "category": "Tools", "count": 25, "min_accuracy": 70}'),
  ('cat-realestate', 'Real Estate Expert', '25 predictions in Real Estate with 70+ avg accuracy', '🏠', 'category', '{"type": "category_specialist", "category": "Real Estate", "count": 25, "min_accuracy": 70}'),

  -- Special badges
  ('speed-demon', 'Speed Demon', 'Complete 10 Quick Play rounds', '⚡', 'special', '{"type": "quick_play_count", "count": 10}'),
  ('early-bird', 'Early Bird', 'Predict within 1 hour of an auction going live', '🌅', 'special', '{"type": "early_bird"}'),
  ('last-call', 'Last Call', 'Lock in during the final 5 minutes before lockout', '🕐', 'special', '{"type": "last_call"}'),
  ('sweep', 'Sweep', 'Predict every lot in an auction with 25+ lots', '🧹', 'special', '{"type": "auction_sweep", "min_lots": 25}'),
  ('contrarian', 'Contrarian', 'Predict 30%+ different from crowd median AND be more accurate', '📊', 'special', '{"type": "contrarian"}'),
  ('penny-perfect', 'Penny Perfect', 'Predict the exact hammer price to the dollar', '🎰', 'special', '{"type": "exact_match"}')
ON CONFLICT (slug) DO NOTHING;
