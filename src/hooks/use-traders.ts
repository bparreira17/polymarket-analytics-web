"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

export function useTraderProfile(address: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["trader-profile", address],
    queryFn: async () => {
      const token = (await getToken()) ?? undefined;
      const res = await api.traders.profile(address, token);
      return res.data;
    },
    enabled: !!address,
  });
}

export function useTraderTrades(address: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["trader-trades", address, params],
    queryFn: async () => {
      const res = await api.traders.trades(address, params);
      return res.data;
    },
    enabled: !!address,
  });
}

export function useFollowTrader() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: string) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return api.traders.follow(address, token);
    },
    onSuccess: (_, address) => {
      queryClient.invalidateQueries({ queryKey: ["trader-profile", address] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });
}

export function useUnfollowTrader() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: string) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return api.traders.unfollow(address, token);
    },
    onSuccess: (_, address) => {
      queryClient.invalidateQueries({ queryKey: ["trader-profile", address] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });
}

export function useFollowingTraders() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["following"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const res = await api.traders.following(token);
      return res.data;
    },
    enabled: !!isSignedIn,
  });
}
