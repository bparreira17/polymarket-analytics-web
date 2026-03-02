"use client";

import { useParams } from "next/navigation";
import { Spinner, Button } from "@heroui/react";
import { ArrowLeft, UserPlus, UserMinus, Trophy, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useTraderProfile, useFollowTrader, useUnfollowTrader } from "@/hooks/use-traders";
import { formatCurrency, truncateAddress, formatRelativeTime, cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

export default function TraderDetailPage() {
  const params = useParams();
  const address = params.address as string;
  const { isSignedIn } = useAuth();
  const { data: profile, isLoading } = useTraderProfile(address);
  const follow = useFollowTrader();
  const unfollow = useUnfollowTrader();

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="text-white/40 text-sm">Trader not found</p>
      </div>
    );
  }

  const lb = profile.leaderboard;

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Breadcrumb */}
      <Link
        href="/leaderboard"
        className="inline-flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 mb-3 transition-colors"
      >
        <ArrowLeft className="w-3 h-3" /> Leaderboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-base font-bold tracking-tight font-mono">
            {lb?.displayName || truncateAddress(address)}
          </h1>
          <p className="text-[11px] text-white/40 font-mono mt-0.5">{address}</p>
          {lb && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                <Trophy className="w-3 h-3" /> Rank #{lb.rank}
              </span>
              <span className="text-[10px] text-white/40">{lb.platform}</span>
            </div>
          )}
        </div>
        {isSignedIn && (
          <Button
            size="sm"
            variant="flat"
            onPress={() =>
              profile.isFollowing
                ? unfollow.mutate(address)
                : follow.mutate(address)
            }
            isLoading={follow.isPending || unfollow.isPending}
            className={cn(
              "text-xs font-semibold h-8",
              profile.isFollowing
                ? "bg-white/[0.06] text-white/60"
                : "bg-amber-400/10 text-amber-400",
            )}
            startContent={
              profile.isFollowing ? (
                <UserMinus className="w-3 h-3" />
              ) : (
                <UserPlus className="w-3 h-3" />
              )
            }
          >
            {profile.isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Stats */}
          {lb && (
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "P&L", value: formatCurrency(lb.profitLoss), color: parseFloat(lb.profitLoss) >= 0 ? "text-emerald-400" : "text-red-400" },
                { label: "Volume", value: formatCurrency(lb.volume), color: "text-white" },
                { label: "Trades", value: String(lb.numTrades), color: "text-white" },
                { label: "Win Rate", value: lb.winRate ? `${(parseFloat(lb.winRate) * 100).toFixed(1)}%` : "N/A", color: "text-white" },
              ].map((stat) => (
                <div key={stat.label} className="panel p-3">
                  <p className="text-[9px] uppercase tracking-wider text-white/30 mb-1">{stat.label}</p>
                  <p className={cn("text-sm font-bold font-mono tabnum", stat.color)}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recent trades */}
          <div className="panel overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/[0.04]">
              <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Recent Trades</h2>
            </div>
            {profile.recentTrades.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[11px] text-white/30">No trades found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      {["Market", "Side", "Amount", "Price", "Time"].map((h) => (
                        <th key={h} className="text-left text-[9px] font-semibold text-white/30 uppercase tracking-wider px-4 py-2">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {profile.recentTrades.map((trade) => (
                      <tr key={trade.id} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                        <td className="px-4 py-2">
                          <Link
                            href={`/markets/${trade.marketId}`}
                            className="text-[11px] font-medium hover:text-amber-400 transition-colors line-clamp-1"
                          >
                            {trade.marketTitle}
                          </Link>
                        </td>
                        <td className={cn("px-4 py-2 text-[11px] font-medium", trade.side === "buy" ? "text-emerald-400" : "text-red-400")}>
                          {trade.side.toUpperCase()}
                        </td>
                        <td className="px-4 py-2 text-[11px] font-mono tabnum">{formatCurrency(trade.amount)}</td>
                        <td className="px-4 py-2 text-[11px] font-mono tabnum">{(parseFloat(trade.price) * 100).toFixed(1)}%</td>
                        <td className="px-4 py-2 text-[10px] text-white/40">{formatRelativeTime(trade.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar - Category breakdown */}
        <div className="space-y-4">
          <div className="panel p-4">
            <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BarChart3 className="w-3 h-3" /> Category Breakdown
            </h2>
            <div className="space-y-2">
              {Object.entries(profile.categoryBreakdown)
                .sort(([, a], [, b]) => b.volume - a.volume)
                .map(([category, stats]) => (
                  <div key={category} className="flex justify-between text-[11px]">
                    <span className="text-white/50">{category}</span>
                    <div className="text-right">
                      <span className="font-mono tabnum">{formatCurrency(stats.volume)}</span>
                      <span className="text-white/30 ml-2">{stats.trades} trades</span>
                    </div>
                  </div>
                ))}
              {Object.keys(profile.categoryBreakdown).length === 0 && (
                <p className="text-[11px] text-white/30">No category data</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
