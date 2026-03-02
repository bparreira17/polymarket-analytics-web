"use client";

import { useLeaderboard } from "@/hooks/use-markets";
import { formatCurrency, truncateAddress, parseNum, formatPercent } from "@/lib/utils";

export function MiniLeaderboard() {
  const { data } = useLeaderboard({ limit: 5 });

  const entries = data?.data ?? [];

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-white/30 text-[11px]">
        No leaderboard data
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-[20px_1fr_64px_48px] gap-1.5 px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/25 font-semibold border-b border-white/[0.04]">
        <span>#</span>
        <span>Trader</span>
        <span className="text-right">P&L</span>
        <span className="text-right">Win</span>
      </div>

      {entries.map((entry) => {
        const pnl = parseNum(entry.profitLoss);
        return (
          <div
            key={entry.id}
            className="grid grid-cols-[20px_1fr_64px_48px] gap-1.5 items-center px-3 border-b border-white/[0.02] last:border-0"
            style={{ height: "30px" }}
          >
            <span className="text-[10px] text-white/25 font-mono tabnum">{entry.rank}</span>
            <span className="text-[11px] text-white/60 truncate">
              {entry.displayName || truncateAddress(entry.traderAddress)}
            </span>
            <span className={`text-[10px] font-mono font-semibold text-right tabnum ${
              pnl >= 0 ? "text-emerald-400" : "text-red-400"
            }`}>
              {pnl >= 0 ? "+" : ""}{formatCurrency(entry.profitLoss)}
            </span>
            <span className="text-[10px] font-mono text-white/40 text-right tabnum">
              {entry.winRate != null ? formatPercent(parseNum(entry.winRate)) : "--"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
