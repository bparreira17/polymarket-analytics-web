"use client";

import { useArbitrage } from "@/hooks/use-markets";
import { parseNum, formatPercent } from "@/lib/utils";

export function ArbitrageScanner() {
  const { data } = useArbitrage({ limit: 5, min_spread: 0.01 });

  const opportunities = data?.data ?? [];

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-8 text-white/30 text-[11px]">
        No active opportunities
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-[1fr_56px_56px_48px] gap-1.5 px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/25 font-semibold border-b border-white/[0.04]">
        <span>Event</span>
        <span className="text-center">PM</span>
        <span className="text-center">KAL</span>
        <span className="text-right">Spread</span>
      </div>

      {opportunities.map((arb) => {
        const spread = parseNum(arb.spread);
        return (
          <div
            key={arb.id}
            className="grid grid-cols-[1fr_56px_56px_48px] gap-1.5 items-center px-3 border-b border-white/[0.02] last:border-0"
            style={{ height: "30px" }}
          >
            <span className="text-[11px] text-white/60 truncate">{arb.marketATitle ?? "Unknown"}</span>
            <span className="text-[10px] text-center font-mono text-violet-400 tabnum">
              {formatPercent(parseNum(arb.priceA))}
            </span>
            <span className="text-[10px] text-center font-mono text-blue-400 tabnum">
              {formatPercent(parseNum(arb.priceB))}
            </span>
            <span className={`text-[10px] text-right font-mono font-bold tabnum ${
              spread >= 0.05 ? "text-emerald-400" : spread >= 0.02 ? "text-amber-400" : "text-white/40"
            }`}>
              {formatPercent(spread)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
