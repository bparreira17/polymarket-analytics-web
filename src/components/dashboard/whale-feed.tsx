"use client";

import { Spinner } from "@heroui/react";
import { Waves } from "lucide-react";
import type { Trade } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface WhaleFeedProps {
  trades: Trade[];
  isLoading?: boolean;
}

export function WhaleFeed({ trades, isLoading }: WhaleFeedProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="sm" />
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <div className="text-center py-8 text-white/30">
        <Waves className="w-5 h-5 mx-auto mb-2 opacity-30" />
        <p className="text-[11px]">No whale trades yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden" style={{ maxHeight: "384px" }}>
      {/* Header */}
      <div className="grid grid-cols-[48px_32px_1fr_56px] gap-1.5 px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/25 font-semibold border-b border-white/[0.04]">
        <span>Time</span>
        <span>Side</span>
        <span>Market</span>
        <span className="text-right">Amt</span>
      </div>

      {trades.slice(0, 12).map((trade) => {
        const time = new Date(trade.timestamp);
        const hms = time.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const isBuy = trade.side === "buy";

        return (
          <div
            key={trade.id}
            className="grid grid-cols-[48px_32px_1fr_56px] gap-1.5 items-center px-3 border-b border-white/[0.02] last:border-0"
            style={{ height: "30px" }}
          >
            <span className="text-[10px] text-white/30 font-mono tabnum">{hms}</span>
            <span className={`text-[9px] font-bold ${isBuy ? "text-emerald-400" : "text-red-400"}`}>
              {isBuy ? "BUY" : "SELL"}
            </span>
            <span className="text-[11px] text-white/60 truncate">{trade.marketTitle || "Unknown"}</span>
            <span className="text-[11px] font-mono font-semibold text-white/70 tabnum text-right">
              {formatCurrency(trade.amount)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
