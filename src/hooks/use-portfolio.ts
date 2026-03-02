"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

export function usePortfolio() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const res = await api.portfolio.get(token);
      return res.data;
    },
    enabled: !!isSignedIn,
    refetchInterval: 60_000,
  });
}

export function usePortfolioHistory(params?: { page?: number; limit?: number }) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["portfolio-history", params],
    queryFn: async () => {
      const token = (await getToken()) ?? undefined;
      return api.portfolio.history({ ...params, token });
    },
    enabled: !!isSignedIn,
  });
}

export function useConnectWallet() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ walletAddress, platform }: { walletAddress: string; platform?: "polymarket" | "kalshi" }) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return api.portfolio.connect(walletAddress, token, platform);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}

export function useDisconnectWallet() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return api.portfolio.disconnect(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}
