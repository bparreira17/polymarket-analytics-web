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

// Watchlist
export interface WatchlistEntry {
  id: number;
  marketId: string;
  createdAt: string;
  market: Market;
}

// Notifications
export interface Notification {
  id: number;
  userId: string;
  type: "price_alert" | "whale_detected" | "market_resolved" | "trader_activity";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

// Portfolio
export interface Portfolio {
  id: string;
  userId: string;
  walletAddress: string;
  platform: Platform;
  createdAt: string;
}

export interface Position {
  id: number;
  portfolioId: string;
  marketId: string;
  outcome: string;
  shares: string;
  avgPrice: string;
  currentPrice: string;
  unrealizedPnl: string;
  updatedAt: string;
  marketTitle: string;
  marketPlatform: Platform;
  marketStatus: MarketStatus;
  marketOutcomes: MarketOutcome[];
  marketImageUrl: string | null;
}

export interface PortfolioData {
  portfolios: Portfolio[];
  positions: Position[];
  summary: {
    totalValue: string;
    unrealizedPnl: string;
    positionCount: number;
  };
}

// Trader Profile
export interface TraderProfile {
  address: string;
  leaderboard: LeaderboardEntry | null;
  recentTrades: (Trade & { marketTitle: string; marketCategory: string })[];
  categoryBreakdown: Record<string, { trades: number; volume: number }>;
  isFollowing: boolean;
}

export interface FollowedTrader {
  id: number;
  traderAddress: string;
  createdAt: string;
  leaderboard: {
    displayName: string | null;
    profitLoss: string;
    volume: string;
    winRate: string | null;
    rank: number;
  } | null;
}

// Social
export interface SocialMention {
  id: number;
  marketId: string;
  platform: "twitter" | "reddit";
  mentionCount: number;
  sentiment: "positive" | "neutral" | "negative";
  date: string;
}

export interface SocialData {
  mentions: SocialMention[];
  summary: {
    totalMentions: number;
    sentimentCounts: { positive: number; neutral: number; negative: number };
    avgDailyMentions: number;
  };
}

// Custom Dashboards
export interface DashboardWidget {
  widgetType: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config?: Record<string, unknown>;
}

export interface CustomDashboard {
  id: string;
  userId: string;
  name: string;
  layout: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
}

// Correlations
export interface MarketCorrelation {
  correlation: string;
  computedAt: string;
  market: {
    id: string;
    title: string;
    platform: Platform;
    category: string;
    outcomes: MarketOutcome[];
    volume: string;
    imageUrl: string | null;
  } | null;
}
