"use client";

import { useState } from "react";
import { Pagination, Spinner } from "@heroui/react";
import { Trophy, Medal } from "lucide-react";
import { useLeaderboard } from "@/hooks/use-markets";
import { formatCurrency, formatPercent, truncateAddress, parseNum, formatNumber } from "@/lib/utils";
import type { Platform } from "@/types";
import Link from "next/link";

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const [platform, setPlatform] = useState<Platform | "all">("all");

  const { data, isLoading } = useLeaderboard({
    page,
    limit: 25,
    platform: platform === "all" ? undefined : platform,
  });

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h1 className="text-lg font-bold tracking-tight">Leaderboard</h1>
          <span className="text-[10px] text-white/30 font-mono">Top traders by profit</span>
        </div>
        <div className="flex gap-1">
          {(["all", "polymarket", "kalshi"] as const).map((p) => (
            <button
              key={p}
              onClick={() => { setPlatform(p); setPage(1); }}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                platform === p
                  ? "bg-amber-400/10 text-amber-400"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              {p === "all" ? "All" : p === "polymarket" ? "PM" : "Kalshi"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="panel overflow-hidden">
            <div className="divide-y divide-white/[0.04]">
              <div className="hidden sm:grid grid-cols-[48px_1fr_60px_100px_80px_60px_60px] gap-3 px-4 py-2 text-[9px] uppercase tracking-widest text-white/30 font-semibold">
                <span>Rank</span>
                <span>Trader</span>
                <span>Platform</span>
                <span className="text-right">P&L</span>
                <span className="text-right">Volume</span>
                <span className="text-right">Trades</span>
                <span className="text-right">Win %</span>
              </div>
              {(data?.data ?? []).map((entry) => (
                <div key={entry.id} className="grid grid-cols-[48px_1fr_60px_100px_80px_60px_60px] gap-3 items-center px-4 py-2 hover:bg-white/[0.02] transition-colors text-[11px]">
                  <span className="font-bold text-white/40 flex items-center gap-1">
                    {entry.rank <= 3 ? (
                      <Medal className={`w-3.5 h-3.5 ${entry.rank === 1 ? "text-amber-400" : entry.rank === 2 ? "text-gray-400" : "text-amber-700"}`} />
                    ) : (
                      <span className="font-mono tabnum">#{entry.rank}</span>
                    )}
                  </span>
                  <Link href={`/traders/${entry.traderAddress}`} className="font-medium truncate text-[12px] hover:text-amber-400 transition-colors">
                    {entry.displayName || truncateAddress(entry.traderAddress)}
                  </Link>
                  <span className={`text-[10px] font-semibold ${
                    entry.platform === "polymarket" ? "text-violet-400" : "text-blue-400"
                  }`}>
                    {entry.platform === "polymarket" ? "PM" : "KAL"}
                  </span>
                  <span className={`font-mono font-semibold text-right tabnum ${
                    parseNum(entry.profitLoss) >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {parseNum(entry.profitLoss) >= 0 ? "+" : ""}{formatCurrency(entry.profitLoss)}
                  </span>
                  <span className="font-mono text-right text-white/40 tabnum">{formatCurrency(entry.volume)}</span>
                  <span className="font-mono text-right text-white/40 tabnum">{formatNumber(entry.numTrades)}</span>
                  <span className="font-mono text-right text-white/40 tabnum">
                    {entry.winRate != null ? formatPercent(parseNum(entry.winRate)) : "--"}
                  </span>
                </div>
              ))}
            </div>
            {(!data?.data || data.data.length === 0) && (
              <div className="text-center py-16 text-white/30 text-[11px]">No leaderboard data yet</div>
            )}
          </div>

          {data && data.meta.totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination total={data.meta.totalPages} page={page} onChange={setPage} showControls classNames={{ cursor: "bg-amber-500" }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
