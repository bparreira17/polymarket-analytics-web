"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

/**
 * Hook that returns a function to get the current auth token.
 * Use this in hooks that call gated endpoints.
 */
export function useAuthToken() {
  const { getToken } = useAuth();

  const getAuthToken = useCallback(async () => {
    try {
      return (await getToken()) ?? undefined;
    } catch {
      return undefined;
    }
  }, [getToken]);

  return getAuthToken;
}
