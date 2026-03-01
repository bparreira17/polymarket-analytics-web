"use client";

import { useQuery } from "@tanstack/react-query";
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
    queryFn: () => api.markets.get(id),
    enabled: !!id,
  });
}

export function useMarketHistory(id: string, interval?: string, outcomeIndex?: number) {
  return useQuery({
    queryKey: ["market-history", id, interval, outcomeIndex],
    queryFn: () => api.markets.history(id, interval, outcomeIndex),
    enabled: !!id,
  });
}

export function useTopMovers(limit?: number) {
  return useQuery({
    queryKey: ["top-movers", limit],
    queryFn: () => api.topMovers(limit),
  });
}

export function useLeaderboard(params?: {
  page?: number;
  limit?: number;
  platform?: Platform;
}) {
  return useQuery({
    queryKey: ["leaderboard", params],
    queryFn: () => api.leaderboard(params),
  });
}

export function useWhaleTrades(params?: {
  page?: number;
  limit?: number;
  market_id?: string;
  min_amount?: number;
}) {
  return useQuery({
    queryKey: ["whale-trades", params],
    queryFn: () => api.whaleTrades(params),
  });
}

export function useArbitrage(params?: {
  page?: number;
  limit?: number;
  min_spread?: number;
}) {
  return useQuery({
    queryKey: ["arbitrage", params],
    queryFn: () => api.arbitrage(params),
  });
}
