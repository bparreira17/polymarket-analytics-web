"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

export function useWatchlist() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return api.watchlists.list(token);
    },
    enabled: !!isSignedIn,
  });
}

export function useWatchlistIds() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["watchlist-ids"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const res = await api.watchlists.ids(token);
      return res.data;
    },
    enabled: !!isSignedIn,
    staleTime: 30_000,
  });
}

export function useAddToWatchlist() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (marketId: string) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return api.watchlists.add(marketId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      queryClient.invalidateQueries({ queryKey: ["watchlist-ids"] });
    },
  });
}

export function useRemoveFromWatchlist() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (marketId: string) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return api.watchlists.remove(marketId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      queryClient.invalidateQueries({ queryKey: ["watchlist-ids"] });
    },
  });
}
