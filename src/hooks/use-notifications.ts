"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

export function useNotifications(params?: { page?: number; limit?: number }) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const token = (await getToken()) ?? undefined;
      return api.notifications.list({ ...params, token });
    },
    enabled: !!isSignedIn,
    refetchInterval: 60_000,
  });
}

export function useUnreadCount() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["notifications-unread"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const res = await api.notifications.unreadCount(token);
      return res.data.unread;
    },
    enabled: !!isSignedIn,
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return api.notifications.markRead(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
}

export function useMarkAllRead() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return api.notifications.markAllRead(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
}
