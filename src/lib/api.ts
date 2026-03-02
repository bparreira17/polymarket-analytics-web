import type {
  Market,
  PricePoint,
  Trade,
  LeaderboardEntry,
  ArbitrageOpportunity,
  TopMover,
  ApiPaginatedResponse,
  ApiDataResponse,
  Platform,
  WatchlistEntry,
  Notification,
  PortfolioData,
  TraderProfile,
  FollowedTrader,
  SocialData,
  CustomDashboard,
  MarketCorrelation,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchAPI<T>(
  path: string,
  params?: Record<string, string>,
  options?: { token?: string; method?: string; body?: unknown },
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }

  const headers: Record<string, string> = {};
  if (options?.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }
  if (options?.body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
    method: options?.method ?? "GET",
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  markets: {
    list(params?: {
      page?: number;
      limit?: number;
      platform?: Platform;
      category?: string;
      status?: string;
      search?: string;
    }) {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams.page = String(params.page);
      if (params?.limit) queryParams.limit = String(params.limit);
      if (params?.platform) queryParams.platform = params.platform;
      if (params?.category) queryParams.category = params.category;
      if (params?.status) queryParams.status = params.status;
      if (params?.search) queryParams.search = params.search;
      return fetchAPI<ApiPaginatedResponse<Market>>("/api/markets", queryParams);
    },

    get(id: string) {
      return fetchAPI<ApiDataResponse<Market>>(`/api/markets/${id}`);
    },

    history(id: string, interval?: string, outcomeIndex?: number) {
      const params: Record<string, string> = {};
      if (interval) params.interval = interval;
      if (outcomeIndex !== undefined) params.outcome_index = String(outcomeIndex);
      return fetchAPI<ApiDataResponse<PricePoint[]>>(`/api/markets/${id}/history`, params);
    },
  },

  topMovers(limit?: number) {
    const params: Record<string, string> = {};
    if (limit) params.limit = String(limit);
    return fetchAPI<ApiDataResponse<TopMover[]>>("/api/top-movers", params);
  },

  leaderboard(params?: { page?: number; limit?: number; platform?: Platform; token?: string }) {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.platform) queryParams.platform = params.platform;
    return fetchAPI<ApiPaginatedResponse<LeaderboardEntry>>("/api/leaderboard", queryParams, { token: params?.token });
  },

  whaleTrades(params?: {
    page?: number;
    limit?: number;
    market_id?: string;
    min_amount?: number;
    token?: string;
  }) {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.market_id) queryParams.market_id = params.market_id;
    if (params?.min_amount) queryParams.min_amount = String(params.min_amount);
    return fetchAPI<ApiPaginatedResponse<Trade>>("/api/whale-trades", queryParams, { token: params?.token });
  },

  arbitrage(params?: { page?: number; limit?: number; min_spread?: number; token?: string }) {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.min_spread) queryParams.min_spread = String(params.min_spread);
    return fetchAPI<ApiPaginatedResponse<ArbitrageOpportunity>>("/api/arbitrage", queryParams, { token: params?.token });
  },

  stats() {
    return fetchAPI<ApiDataResponse<{
      activeMarkets: number;
      volume24h: string;
      trackedTraders: number;
      whaleTradesTotal: number;
    }>>("/api/stats");
  },

  markets_orderbook(marketId: string, token?: string) {
    return fetchAPI<ApiDataResponse<{
      bids: Array<{ price: string; size: string }>;
      asks: Array<{ price: string; size: string }>;
    }>>(`/api/markets/${marketId}/orderbook`, undefined, { token });
  },

  markets_trades(marketId: string, limit?: number) {
    const params: Record<string, string> = {};
    if (limit) params.limit = String(limit);
    return fetchAPI<ApiDataResponse<Trade[]>>(`/api/markets/${marketId}/trades`, params);
  },

  // Watchlists
  watchlists: {
    list(token: string) {
      return fetchAPI<{ data: WatchlistEntry[]; meta: { count: number; limit: number } }>(
        "/api/watchlists",
        undefined,
        { token },
      );
    },
    ids(token: string) {
      return fetchAPI<{ data: string[] }>("/api/watchlists/ids", undefined, { token });
    },
    add(marketId: string, token: string) {
      return fetchAPI<{ data: WatchlistEntry }>("/api/watchlists", undefined, {
        token,
        method: "POST",
        body: { marketId },
      });
    },
    remove(marketId: string, token: string) {
      return fetchAPI<{ deleted: boolean }>(`/api/watchlists/${marketId}`, undefined, {
        token,
        method: "DELETE",
      });
    },
  },

  // Notifications
  notifications: {
    list(params?: { page?: number; limit?: number; token?: string }) {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams.page = String(params.page);
      if (params?.limit) queryParams.limit = String(params.limit);
      return fetchAPI<ApiPaginatedResponse<Notification>>("/api/notifications", queryParams, {
        token: params?.token,
      });
    },
    unreadCount(token: string) {
      return fetchAPI<{ data: { unread: number } }>("/api/notifications/unread-count", undefined, {
        token,
      });
    },
    markRead(id: number, token: string) {
      return fetchAPI<{ data: { id: number } }>(`/api/notifications/${id}/read`, undefined, {
        token,
        method: "POST",
      });
    },
    markAllRead(token: string) {
      return fetchAPI<{ success: boolean }>("/api/notifications/read-all", undefined, {
        token,
        method: "POST",
      });
    },
  },

  // Portfolio
  portfolio: {
    connect(walletAddress: string, token: string, platform?: Platform) {
      return fetchAPI<{ data: { id: string } }>("/api/portfolio/connect", undefined, {
        token,
        method: "POST",
        body: { walletAddress, platform: platform ?? "polymarket" },
      });
    },
    get(token: string) {
      return fetchAPI<{ data: PortfolioData }>("/api/portfolio", undefined, { token });
    },
    history(params?: { page?: number; limit?: number; token?: string }) {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams.page = String(params.page);
      if (params?.limit) queryParams.limit = String(params.limit);
      return fetchAPI<ApiPaginatedResponse<Trade & { marketTitle: string }>>(
        "/api/portfolio/history",
        queryParams,
        { token: params?.token },
      );
    },
    disconnect(id: string, token: string) {
      return fetchAPI<{ deleted: boolean }>(`/api/portfolio/${id}`, undefined, {
        token,
        method: "DELETE",
      });
    },
  },

  // Traders
  traders: {
    profile(address: string, token?: string) {
      return fetchAPI<{ data: TraderProfile }>(`/api/traders/${address}`, undefined, { token });
    },
    trades(address: string, params?: { page?: number; limit?: number }) {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams.page = String(params.page);
      if (params?.limit) queryParams.limit = String(params.limit);
      return fetchAPI<{ data: (Trade & { marketTitle: string })[] }>(
        `/api/traders/${address}/trades`,
        queryParams,
      );
    },
    follow(address: string, token: string) {
      return fetchAPI<{ data: { id: number } }>(`/api/traders/${address}/follow`, undefined, {
        token,
        method: "POST",
      });
    },
    unfollow(address: string, token: string) {
      return fetchAPI<{ deleted: boolean }>(`/api/traders/${address}/unfollow`, undefined, {
        token,
        method: "DELETE",
      });
    },
    following(token: string) {
      return fetchAPI<{ data: FollowedTrader[] }>("/api/traders/following/list", undefined, {
        token,
      });
    },
  },

  // Social
  social: {
    marketMentions(marketId: string, days?: number) {
      const params: Record<string, string> = {};
      if (days) params.days = String(days);
      return fetchAPI<{ data: SocialData }>(`/api/markets/${marketId}/social`, params);
    },
    trending(limit?: number) {
      const params: Record<string, string> = {};
      if (limit) params.limit = String(limit);
      return fetchAPI<{ data: Array<Record<string, unknown>> }>("/api/trending", params);
    },
  },

  // Correlations
  correlations: {
    related(marketId: string, limit?: number) {
      const params: Record<string, string> = {};
      if (limit) params.limit = String(limit);
      return fetchAPI<{ data: MarketCorrelation[] }>(`/api/markets/${marketId}/related`, params);
    },
  },

  // Dashboards (Enterprise)
  dashboards: {
    list(token: string) {
      return fetchAPI<{ data: CustomDashboard[] }>("/api/dashboards", undefined, { token });
    },
    get(id: string, token: string) {
      return fetchAPI<{ data: CustomDashboard }>(`/api/dashboards/${id}`, undefined, { token });
    },
    create(name: string, token: string) {
      return fetchAPI<{ data: CustomDashboard }>("/api/dashboards", undefined, {
        token,
        method: "POST",
        body: { name, layout: [] },
      });
    },
    update(id: string, data: { name?: string; layout?: CustomDashboard["layout"] }, token: string) {
      return fetchAPI<{ data: CustomDashboard }>(`/api/dashboards/${id}`, undefined, {
        token,
        method: "PUT",
        body: data,
      });
    },
    delete(id: string, token: string) {
      return fetchAPI<{ deleted: boolean }>(`/api/dashboards/${id}`, undefined, {
        token,
        method: "DELETE",
      });
    },
  },

  // Export
  exportData: {
    tradesUrl(token: string) {
      return `${API_BASE}/api/export/trades?token=${token}`;
    },
    portfolioUrl(token: string) {
      return `${API_BASE}/api/export/portfolio?token=${token}`;
    },
  },

  // Billing
  billing: {
    checkout(priceId: string, token: string) {
      return fetchAPI<{ url: string }>("/api/billing/checkout", undefined, {
        token,
        method: "POST",
        body: { priceId },
      });
    },
    portal(token: string) {
      return fetchAPI<{ url: string }>("/api/billing/portal", undefined, {
        token,
        method: "POST",
      });
    },
    status(token: string) {
      return fetchAPI<{
        plan: "free" | "pro" | "enterprise";
        subscriptionStatus: string | null;
        currentPeriodEnd: string | null;
      }>("/api/billing/status", undefined, { token });
    },
  },
};
