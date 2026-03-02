"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import type { Platform } from "@/types";

export function useMarkets(params?: {
  page?: number;
  limit?: number;
  platform?: Platform;
  category?: string;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["markets", params],
    queryFn: () => api.markets.list(params),
  });
}

export function useMarket(id: string) {
  return useQuery({
    queryKey: ["market", id],
    queryFn: async () => {
      const res = await api.markets.get(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useMarketHistory(id: string, interval?: string, outcomeIndex?: number) {
  return useQuery({
    queryKey: ["market-history", id, interval, outcomeIndex],
    queryFn: async () => {
      const res = await api.markets.history(id, interval, outcomeIndex);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useTopMovers(limit?: number) {
  return useQuery({
    queryKey: ["top-movers", limit],
    queryFn: async () => {
      const res = await api.topMovers(limit);
      return res.data;
    },
  });
}

export function useLeaderboard(params?: {
  page?: number;
  limit?: number;
  platform?: Platform;
}) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["leaderboard", params],
    queryFn: async () => {
      const token = (await getToken()) ?? undefined;
      return api.leaderboard({ ...params, token });
    },
  });
}

export function useWhaleTrades(params?: {
  page?: number;
  limit?: number;
  market_id?: string;
  min_amount?: number;
}) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["whale-trades", params],
    queryFn: async () => {
      const token = (await getToken()) ?? undefined;
      return api.whaleTrades({ ...params, token });
    },
  });
}

export function useArbitrage(params?: {
  page?: number;
  limit?: number;
  min_spread?: number;
}) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["arbitrage", params],
    queryFn: async () => {
      const token = (await getToken()) ?? undefined;
      return api.arbitrage({ ...params, token });
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await api.stats();
      return res.data;
    },
  });
}

export function useOrderbook(marketId: string) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["orderbook", marketId],
    queryFn: async () => {
      const token = (await getToken()) ?? undefined;
      const res = await api.markets_orderbook(marketId, token);
      return res.data;
    },
    enabled: !!marketId,
    refetchInterval: 15_000,
  });
}

export function useMarketTrades(marketId: string, limit?: number) {
  return useQuery({
    queryKey: ["market-trades", marketId, limit],
    queryFn: async () => {
      const res = await api.markets_trades(marketId, limit);
      return res.data;
    },
    enabled: !!marketId,
    refetchInterval: 15_000,
  });
}
