"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

export function useUserPlan() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["billing-status"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return api.billing.status(token);
    },
    enabled: !!isSignedIn,
    staleTime: 60_000,
  });
}
