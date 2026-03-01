import type {
  Market,
  PricePoint,
  Trade,
  LeaderboardEntry,
  ArbitrageOpportunity,
  TopMover,
  PaginatedResponse,
  Platform,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchAPI<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url.toString(), { next: { revalidate: 30 } });

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
      return fetchAPI<PaginatedResponse<Market>>("/api/markets", queryParams);
    },

    get(id: string) {
      return fetchAPI<Market>(`/api/markets/${id}`);
    },

    history(id: string, interval?: string, outcomeIndex?: number) {
      const params: Record<string, string> = {};
      if (interval) params.interval = interval;
      if (outcomeIndex !== undefined) params.outcome_index = String(outcomeIndex);
      return fetchAPI<PricePoint[]>(`/api/markets/${id}/history`, params);
    },
  },

  topMovers(limit?: number) {
    const params: Record<string, string> = {};
    if (limit) params.limit = String(limit);
    return fetchAPI<TopMover[]>("/api/top-movers", params);
  },

  leaderboard(params?: { page?: number; limit?: number; platform?: Platform }) {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.platform) queryParams.platform = params.platform;
    return fetchAPI<PaginatedResponse<LeaderboardEntry>>("/api/leaderboard", queryParams);
  },

  whaleTrades(params?: {
    page?: number;
    limit?: number;
    market_id?: string;
    min_amount?: number;
  }) {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.market_id) queryParams.market_id = params.market_id;
    if (params?.min_amount) queryParams.min_amount = String(params.min_amount);
    return fetchAPI<PaginatedResponse<Trade>>("/api/whale-trades", queryParams);
  },

  arbitrage(params?: { page?: number; limit?: number; min_spread?: number }) {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.min_spread) queryParams.min_spread = String(params.min_spread);
    return fetchAPI<PaginatedResponse<ArbitrageOpportunity>>("/api/arbitrage", queryParams);
  },
};
