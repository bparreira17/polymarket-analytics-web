"use client";

import { Chip } from "@heroui/react";
import Link from "next/link";
import type { Market } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { WatchlistButton } from "./watchlist-button";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const yesOutcome = market.outcomes[0];
  const noOutcome = market.outcomes[1];
  const yesPrice = yesOutcome?.price ?? 0;

  return (
    <Link href={`/markets/${market.id}`} className="group block">
      <div className="glass rounded-2xl p-4 h-full transition-all duration-300 hover:border-primary/20 hover:glow-sm group-hover:translate-y-[-2px]">
        <div className="flex items-start gap-3 mb-3">
          {market.imageUrl ? (
            <img
              src={market.imageUrl}
              alt=""
              className="w-10 h-10 rounded-xl object-cover shrink-0 bg-white/5"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Chip
                size="sm"
                variant="flat"
                classNames={{
                  base: market.platform === "polymarket"
                    ? "bg-violet-500/10 text-violet-400"
                    : "bg-blue-500/10 text-blue-400",
                  content: "text-[10px] font-semibold tracking-wide",
                }}
              >
                {market.platform === "polymarket" ? "PM" : "KAL"}
              </Chip>
              <span className="text-[10px] text-default-500">{market.category}</span>
            </div>
            <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-foreground transition-colors">
              {market.title}
            </p>
          </div>
          <WatchlistButton marketId={market.id} size="sm" className="shrink-0 mt-1" />
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-emerald-400">
              {yesOutcome?.name || "Yes"} {formatPercent(yesPrice)}
            </span>
            <span className="text-red-400">
              {noOutcome?.name || "No"} {formatPercent(noOutcome?.price ?? 1 - yesPrice)}
            </span>
          </div>
          <div className="relative h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
              style={{ width: `${yesPrice * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-default-500 mt-3 pt-3 border-t border-white/[0.04]">
          <span>Vol {formatCurrency(market.volume)}</span>
          {market.liquidity && <span>Liq {formatCurrency(market.liquidity)}</span>}
          {market.endDate && (
            <span>{new Date(market.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
