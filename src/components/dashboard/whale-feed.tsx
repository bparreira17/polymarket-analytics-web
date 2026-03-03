"use client";

import { Spinner } from "@heroui/react";
import { Waves } from "lucide-react";
import type { Trade } from "@/types";
import { formatCurrency } from "@/lib/utils";

const PREVIEW_TRADES: Trade[] = [
  { id: 901, marketId: "", platform: "polymarket", traderAddress: null, outcomeIndex: 0, price: "0.65", isWhale: true, timestamp: new Date().toISOString(), side: "buy", marketTitle: "Presidential Election 2028 Winner", amount: "125000" },
  { id: 902, marketId: "", platform: "polymarket", traderAddress: null, outcomeIndex: 0, price: "0.42", isWhale: true, timestamp: new Date(Date.now() - 60000).toISOString(), side: "sell", marketTitle: "Fed Rate Cut by June", amount: "89500" },
  { id: 903, marketId: "", platform: "polymarket", traderAddress: null, outcomeIndex: 0, price: "0.71", isWhale: true, timestamp: new Date(Date.now() - 120000).toISOString(), side: "buy", marketTitle: "Bitcoin above $100k by EOY", amount: "210000" },
  { id: 904, marketId: "", platform: "kalshi", traderAddress: null, outcomeIndex: 0, price: "0.38", isWhale: true, timestamp: new Date(Date.now() - 180000).toISOString(), side: "sell", marketTitle: "AI Regulation Bill Passes", amount: "67000" },
  { id: 905, marketId: "", platform: "polymarket", traderAddress: null, outcomeIndex: 0, price: "0.55", isWhale: true, timestamp: new Date(Date.now() - 240000).toISOString(), side: "buy", marketTitle: "SpaceX Starship Orbital Flight", amount: "45000" },
  { id: 906, marketId: "", platform: "kalshi", traderAddress: null, outcomeIndex: 0, price: "0.82", isWhale: true, timestamp: new Date(Date.now() - 300000).toISOString(), side: "buy", marketTitle: "US GDP Growth > 3%", amount: "155000" },
];

interface WhaleFeedProps {
  trades: Trade[];
  isLoading?: boolean;
  previewMode?: boolean;
}

export function WhaleFeed({ trades, isLoading, previewMode }: WhaleFeedProps) {
  const displayTrades = previewMode ? PREVIEW_TRADES : trades;
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="sm" />
      </div>
    );
  }

  if (!displayTrades || displayTrades.length === 0) {
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

      {displayTrades.slice(0, 12).map((trade) => {
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
