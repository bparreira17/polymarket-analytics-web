"use client";

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

const WS_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001")
  .replace(/^http/, "ws") + "/ws";

export function useWebSocket() {
  const queryClient = useQueryClient();
  const { getToken, isSignedIn } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (!isSignedIn) return; // Skip WS if user is not signed in

    try {
      const token = await getToken();
      if (!token) return;

      const ws = new WebSocket(`${WS_BASE}?token=${token}`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "update") {
            // Invalidate relevant queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ["whale-trades"] });
            queryClient.invalidateQueries({ queryKey: ["top-movers"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
          }
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        // Reconnect after 10s
        reconnectTimeoutRef.current = setTimeout(connect, 10_000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      // WebSocket connection failed, retry
      reconnectTimeoutRef.current = setTimeout(connect, 10_000);
    }
  }, [queryClient, getToken, isSignedIn]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);
}
