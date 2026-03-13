export interface BadgeSeed {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: "accuracy" | "volume" | "category" | "special";
  criteria: Record<string, unknown>;
}

export const BADGE_DEFINITIONS: BadgeSeed[] = [
  // Accuracy badges
  {
    slug: "first-bullseye",
    name: "First Bullseye",
    description: "Get your first Bullseye (within 5%)",
    icon: "🎯",
    category: "accuracy",
    criteria: { type: "bullseye_count", count: 1 },
  },
  {
    slug: "10-bullseyes",
    name: "10 Bullseyes",
    description: "Get 10 Bullseyes",
    icon: "🎯",
    category: "accuracy",
    criteria: { type: "bullseye_count", count: 10 },
  },
  {
    slug: "50-bullseyes",
    name: "50 Bullseyes",
    description: "Get 50 Bullseyes",
    icon: "🎯",
    category: "accuracy",
    criteria: { type: "bullseye_count", count: 50 },
  },
  {
    slug: "sniper",
    name: "Sniper",
    description: "Get 100 Bullseyes",
    icon: "🎯",
    category: "accuracy",
    criteria: { type: "bullseye_count", count: 100 },
  },
  {
    slug: "hot-streak",
    name: "Hot Streak",
    description: "5 Hot Reads in a row",
    icon: "🔥",
    category: "accuracy",
    criteria: { type: "accuracy_streak", tier: "hot_read", count: 5 },
  },
  {
    slug: "ice-cold",
    name: "Ice Cold",
    description: "10 predictions in a row off by more than 50%",
    icon: "🧊",
    category: "accuracy",
    criteria: { type: "cold_streak", count: 10 },
  },

  // Volume badges
  {
    slug: "first-prediction",
    name: "First Prediction",
    description: "Make your first prediction",
    icon: "📋",
    category: "volume",
    criteria: { type: "prediction_count", count: 1 },
  },
  {
    slug: "century-club",
    name: "Century Club",
    description: "Make 100 predictions",
    icon: "📋",
    category: "volume",
    criteria: { type: "prediction_count", count: 100 },
  },
  {
    slug: "volume-dealer",
    name: "Volume Dealer",
    description: "Make 500 predictions",
    icon: "📋",
    category: "volume",
    criteria: { type: "prediction_count", count: 500 },
  },
  {
    slug: "obsessed",
    name: "Obsessed",
    description: "Make 1000 predictions",
    icon: "📋",
    category: "volume",
    criteria: { type: "prediction_count", count: 1000 },
  },

  // Category specialist badges
  {
    slug: "cat-vehicles",
    name: "Vehicle Expert",
    description: "25 predictions in Vehicles with 70+ avg accuracy",
    icon: "🚗",
    category: "category",
    criteria: { type: "category_specialist", category: "Vehicles", count: 25, min_accuracy: 70 },
  },
  {
    slug: "cat-jewelry",
    name: "Jewelry Expert",
    description: "25 predictions in Jewelry with 70+ avg accuracy",
    icon: "💎",
    category: "category",
    criteria: { type: "category_specialist", category: "Jewelry", count: 25, min_accuracy: 70 },
  },
  {
    slug: "cat-art",
    name: "Art Expert",
    description: "25 predictions in Art with 70+ avg accuracy",
    icon: "🎨",
    category: "category",
    criteria: { type: "category_specialist", category: "Art", count: 25, min_accuracy: 70 },
  },
  {
    slug: "cat-tools",
    name: "Tools Expert",
    description: "25 predictions in Tools with 70+ avg accuracy",
    icon: "🔧",
    category: "category",
    criteria: { type: "category_specialist", category: "Tools", count: 25, min_accuracy: 70 },
  },
  {
    slug: "cat-realestate",
    name: "Real Estate Expert",
    description: "25 predictions in Real Estate with 70+ avg accuracy",
    icon: "🏠",
    category: "category",
    criteria: { type: "category_specialist", category: "Real Estate", count: 25, min_accuracy: 70 },
  },

  // Special badges
  {
    slug: "speed-demon",
    name: "Speed Demon",
    description: "Complete 10 Quick Play rounds",
    icon: "⚡",
    category: "special",
    criteria: { type: "quick_play_count", count: 10 },
  },
  {
    slug: "early-bird",
    name: "Early Bird",
    description: "Predict within 1 hour of an auction going live",
    icon: "🌅",
    category: "special",
    criteria: { type: "early_bird" },
  },
  {
    slug: "last-call",
    name: "Last Call",
    description: "Lock in during the final 5 minutes before lockout",
    icon: "🕐",
    category: "special",
    criteria: { type: "last_call" },
  },
  {
    slug: "sweep",
    name: "Sweep",
    description: "Predict every lot in an auction with 25+ lots",
    icon: "🧹",
    category: "special",
    criteria: { type: "auction_sweep", min_lots: 25 },
  },
  {
    slug: "contrarian",
    name: "Contrarian",
    description: "Predict 30%+ different from crowd median AND be more accurate",
    icon: "📊",
    category: "special",
    criteria: { type: "contrarian" },
  },
  {
    slug: "penny-perfect",
    name: "Penny Perfect",
    description: "Predict the exact hammer price to the dollar",
    icon: "🎰",
    category: "special",
    criteria: { type: "exact_match" },
  },
];
