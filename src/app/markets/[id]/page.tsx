"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Spinner, Button } from "@heroui/react";
import { ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PriceChart } from "@/components/charts/price-chart";
import { OrderBookBar } from "@/components/markets/order-book-bar";
import { TradesFeed } from "@/components/markets/trades-feed";
import { useMarket, useMarketHistory, useOrderbook, useMarketTrades } from "@/hooks/use-markets";
import { formatCurrency, formatPercent } from "@/lib/utils";

const INTERVALS = [
  { label: "1H", value: "1h" },
  { label: "6H", value: "6h" },
  { label: "1D", value: "1d" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
];

export default function MarketDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [interval, setInterval] = useState("7d");
  const [chartType, setChartType] = useState<"area" | "candlestick">("area");

  const { data: market, isLoading: marketLoading } = useMarket(id);
  const { data: history, isLoading: historyLoading } = useMarketHistory(id, interval);
  const { data: orderbook } = useOrderbook(id);
  const { data: recentTrades } = useMarketTrades(id, 20);

  if (marketLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!market) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="text-white/40 text-sm">Market not found</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Breadcrumb */}
      <Link
        href="/markets"
        className="inline-flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 mb-3 transition-colors"
      >
        <ArrowLeft className="w-3 h-3" /> Markets
      </Link>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase ${
              market.platform === "polymarket" ? "text-violet-400" : "text-blue-400"
            }`}>
              {market.platform === "polymarket" ? "PM" : "KAL"}
            </span>
            <span className="text-[10px] text-white/30">{market.category}</span>
            <span className={`text-[10px] font-medium ${
              market.status === "active" ? "text-emerald-400" : "text-white/30"
            }`}>
              {market.status}
            </span>
          </div>
          <h1 className="text-base font-bold tracking-tight leading-tight">{market.title}</h1>
          {market.description && (
            <p className="text-[11px] text-white/40 mt-1 line-clamp-1">{market.description}</p>
          )}
        </div>
        <a href={market.url} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main grid: Chart left, sidebar right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Chart panel */}
          <div className="panel overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2.5 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Price</h2>
                <div className="flex gap-0.5 ml-2">
                  {(["area", "candlestick"] as const).map((ct) => (
                    <button
                      key={ct}
                      onClick={() => setChartType(ct)}
                      className={`px-2 py-0.5 rounded text-[9px] font-medium transition-all ${
                        chartType === ct
                          ? "bg-amber-400/10 text-amber-400"
                          : "text-white/30 hover:text-white/50"
                      }`}
                    >
                      {ct === "area" ? "Area" : "Candle"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-0.5">
                {INTERVALS.map((int) => (
                  <button
                    key={int.value}
                    onClick={() => setInterval(int.value)}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                      interval === int.value
                        ? "bg-amber-400/10 text-amber-400"
                        : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                    }`}
                  >
                    {int.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-2 pb-2">
              {historyLoading ? (
                <div className="flex justify-center py-16"><Spinner /></div>
              ) : history && history.length > 0 ? (
                <PriceChart data={history} showVolume height={320} chartType={chartType} />
              ) : (
                <div className="text-center py-16 text-white/30 text-[11px]">No price data</div>
              )}
            </div>
          </div>

          {/* Orderbook + Trades row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="panel overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/[0.04]">
                <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Order Book</h2>
              </div>
              <OrderBookBar orderbook={orderbook ?? { bids: [], asks: [] }} />
            </div>

            <div className="panel overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/[0.04]">
                <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Recent Trades</h2>
              </div>
              <TradesFeed trades={recentTrades ?? []} />
            </div>
          </div>

          {/* Cross-platform match */}
          {market.matchedMarketId && (
            <div className="panel p-3 border-amber-400/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-amber-400">Cross-platform match</p>
                  <p className="text-[10px] text-white/30">
                    Same event on {market.platform === "polymarket" ? "Kalshi" : "Polymarket"}
                  </p>
                </div>
                <Button as={Link} href={`/markets/${market.matchedMarketId}`} size="sm" variant="flat" className="text-amber-400 bg-amber-400/10 h-7 text-[11px]">
                  Compare
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Outcomes */}
          <div className="panel p-4">
            <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-3">Outcomes</h2>
            <div className="space-y-3">
              {market.outcomes.map((outcome, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-white/70">{outcome.name}</span>
                    <span className={`font-bold font-mono tabnum ${i === 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {formatPercent(outcome.price)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        i === 0 ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{ width: `${outcome.price * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="panel p-4">
            <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-3">Stats</h2>
            <div className="space-y-2">
              {[
                { label: "Volume", value: formatCurrency(market.volume) },
                ...(market.liquidity ? [{ label: "Liquidity", value: formatCurrency(market.liquidity) }] : []),
                ...(market.endDate ? [{ label: "End Date", value: new Date(market.endDate).toLocaleDateString("en-US") }] : []),
                { label: "Platform", value: market.platform === "polymarket" ? "Polymarket" : "Kalshi" },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between text-[12px]">
                  <span className="text-white/40">{stat.label}</span>
                  <span className="font-medium font-mono tabnum">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
