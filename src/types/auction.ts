export interface AMAuction {
  id: number;
  am_auction_id: number;
  title: string;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
  published: boolean;
  city: string | null;
  state: string | null;
  timezone: string | null;
  image_url: string | null;
  raw_data: Record<string, unknown> | null;
  synced_at: string;
  created_at: string;
}

export interface AMItem {
  id: number;
  am_item_id: number;
  am_auction_id: number;
  title: string;
  description: string | null;
  lot_number: string | null;
  category: string | null;
  category_id: number | null;
  starting_bid: number | null;
  current_bid: number | null;
  hammer_price: number | null;
  image_url: string | null;
  image_urls: string[] | null;
  status: "open" | "closed" | "no_sale";
  closes_at: string | null;
  raw_data: Record<string, unknown> | null;
  synced_at: string;
  created_at: string;
}

export interface AMAuctionWithItems extends AMAuction {
  items: AMItem[];
  item_count: number;
  prediction_count: number;
}

export interface AMApiAuction {
  id: number;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  published?: boolean;
  city?: string;
  state?: string;
  timezone?: string;
  image?: string;
  [key: string]: unknown;
}

export interface AMApiItem {
  id: number;
  auction_id: number;
  title: string;
  description?: string;
  lot_number?: string;
  category?: string;
  category_id?: number;
  starting_bid?: number;
  current_bid?: number;
  image?: string;
  images?: Array<{ url: string }>;
  status?: string;
  closes_at?: string;
  [key: string]: unknown;
}
