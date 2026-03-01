export type Platform = "polymarket" | "kalshi";
export type MarketStatus = "active" | "resolved" | "closed";
export type TradeSide = "buy" | "sell";

export interface MarketOutcome {
  name: string;
  price: number;
  token_id?: string;
}

export interface Market {
  id: string;
  platform: Platform;
  platform_id: string;
  title: string;
  description: string | null;
  category: string;
  status: MarketStatus;
  volume: number;
  liquidity: number | null;
  end_date: string | null;
  image_url: string | null;
  url: string;
  outcomes: MarketOutcome[];
  metadata: Record<string, unknown> | null;
  matched_market_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PricePoint {
  timestamp: string;
  price: number;
  volume: number | null;
}

export interface Trade {
  id: number;
  market_id: string;
  market_title?: string;
  platform: Platform;
  trader_address: string | null;
  side: TradeSide;
  outcome_index: number;
  amount: number;
  price: number;
  timestamp: string;
  is_whale: boolean;
}

export interface LeaderboardEntry {
  id: number;
  platform: Platform;
  trader_address: string;
  display_name: string | null;
  profit_loss: number;
  volume: number;
  num_trades: number;
  win_rate: number | null;
  rank: number;
}

export interface ArbitrageOpportunity {
  id: number;
  market_a: { id: string; title: string; platform: Platform };
  market_b: { id: string; title: string; platform: Platform };
  outcome: string;
  price_a: number;
  price_b: number;
  spread: number;
  detected_at: string;
}

export interface TopMover {
  id: string;
  title: string;
  platform: Platform;
  category: string;
  volume: number;
  outcomes: MarketOutcome[];
  current_price: number;
  previous_price: number;
  change: number;
  image_url: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
