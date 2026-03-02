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
  platformId: string;
  title: string;
  description: string | null;
  category: string;
  status: MarketStatus;
  volume: string;
  liquidity: string | null;
  endDate: string | null;
  imageUrl: string | null;
  url: string;
  outcomes: MarketOutcome[];
  metadata: Record<string, unknown> | null;
  matchedMarketId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PricePoint {
  timestamp: string;
  price: number;
  volume: number | null;
}

export interface Trade {
  id: number;
  marketId: string;
  marketTitle?: string;
  platform: Platform;
  traderAddress: string | null;
  side: TradeSide;
  outcomeIndex: number;
  amount: string;
  price: string;
  timestamp: string;
  isWhale: boolean;
}

export interface LeaderboardEntry {
  id: number;
  platform: Platform;
  traderAddress: string;
  displayName: string | null;
  profitLoss: string;
  volume: string;
  numTrades: number;
  winRate: string | null;
  rank: number;
}

export interface ArbitrageOpportunity {
  id: number;
  marketAId: string;
  marketBId: string;
  marketATitle?: string;
  marketBTitle?: string;
  marketAPlatform?: Platform;
  marketBPlatform?: Platform;
  outcome: string;
  priceA: string;
  priceB: string;
  spread: string;
  detectedAt: string;
  isActive: boolean;
}

export interface TopMover {
  id: string;
  title: string;
  platform: Platform;
  category: string;
  volume: string;
  outcomes: MarketOutcome[];
  latest_price: string;
  old_price: string;
  price_change: string;
  abs_change: string;
  image_url: string | null;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiDataResponse<T> {
  data: T;
}
