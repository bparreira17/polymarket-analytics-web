"use client";

import { parseNum } from "@/lib/utils";

interface Trade {
  id: number;
  side: string;
  amount: string;
  price: string;
  timestamp: string;
  traderAddress?: string | null;
}

export function TradesFeed({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-[11px] text-white/30">
        No recent trades
      </div>
    );
  }

  return (
    <div className="max-h-[280px] overflow-y-auto">
      {/* Header */}
      <div className="grid grid-cols-[50px_40px_1fr_60px] text-[9px] text-white/30 uppercase tracking-wider px-3 py-1.5 sticky top-0 bg-[#111113]">
        <span>Time</span>
        <span>Side</span>
        <span className="text-right">Price</span>
        <span className="text-right">Amount</span>
      </div>

      {trades.map((trade) => {
        const time = new Date(trade.timestamp);
        const hms = time.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const isBuy = trade.side === "buy";
        const price = parseNum(trade.price) * 100;
        const amount = parseNum(trade.amount);

        return (
          <div
            key={trade.id}
            className="grid grid-cols-[50px_40px_1fr_60px] items-center text-[11px] font-mono px-3 py-1 hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-white/40 tabnum">{hms}</span>
            <span className={`font-bold text-[10px] ${isBuy ? "text-emerald-400" : "text-red-400"}`}>
              {isBuy ? "BUY" : "SELL"}
            </span>
            <span className="text-right text-white/70 tabnum">{price.toFixed(1)}%</span>
            <span className="text-right text-white/50 tabnum">
              ${amount >= 1000 ? `${(amount / 1000).toFixed(1)}K` : amount.toFixed(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
