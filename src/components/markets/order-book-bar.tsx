"use client";

import { parseNum } from "@/lib/utils";

interface OrderbookProps {
  orderbook: {
    bids: Array<{ price: string; size: string }>;
    asks: Array<{ price: string; size: string }>;
  };
}

export function OrderBookBar({ orderbook }: OrderbookProps) {
  const { bids, asks } = orderbook;

  if (bids.length === 0 && asks.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-[11px] text-white/30">
        No orderbook data available
      </div>
    );
  }

  // Take top 8 levels each
  const topBids = bids.slice(0, 8);
  const topAsks = asks.slice(0, 8);

  const maxSize = Math.max(
    ...topBids.map((b) => parseNum(b.size)),
    ...topAsks.map((a) => parseNum(a.size)),
    1,
  );

  return (
    <div className="px-3 py-2 space-y-0.5">
      {/* Header */}
      <div className="grid grid-cols-3 text-[9px] text-white/30 uppercase tracking-wider px-1 mb-1">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Depth</span>
      </div>

      {/* Asks (reversed — highest at top) */}
      {[...topAsks].reverse().map((ask, i) => {
        const size = parseNum(ask.size);
        const pct = (size / maxSize) * 100;
        return (
          <div key={`ask-${i}`} className="relative grid grid-cols-3 items-center text-[11px] font-mono px-1 py-0.5 rounded">
            <div
              className="absolute right-0 top-0 bottom-0 bg-red-500/[0.08] rounded"
              style={{ width: `${pct}%` }}
            />
            <span className="text-red-400 tabnum relative">{(parseNum(ask.price) * 100).toFixed(1)}%</span>
            <span className="text-right text-white/50 tabnum relative">{size.toFixed(0)}</span>
            <span className="text-right text-white/30 tabnum relative">{pct.toFixed(0)}%</span>
          </div>
        );
      })}

      {/* Spread divider */}
      <div className="border-t border-white/[0.06] my-1" />

      {/* Bids */}
      {topBids.map((bid, i) => {
        const size = parseNum(bid.size);
        const pct = (size / maxSize) * 100;
        return (
          <div key={`bid-${i}`} className="relative grid grid-cols-3 items-center text-[11px] font-mono px-1 py-0.5 rounded">
            <div
              className="absolute right-0 top-0 bottom-0 bg-emerald-500/[0.08] rounded"
              style={{ width: `${pct}%` }}
            />
            <span className="text-emerald-400 tabnum relative">{(parseNum(bid.price) * 100).toFixed(1)}%</span>
            <span className="text-right text-white/50 tabnum relative">{size.toFixed(0)}</span>
            <span className="text-right text-white/30 tabnum relative">{pct.toFixed(0)}%</span>
          </div>
        );
      })}
    </div>
  );
}
