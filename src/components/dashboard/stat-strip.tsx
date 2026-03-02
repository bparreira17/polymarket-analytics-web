"use client";

import { useStats } from "@/hooks/use-markets";
import { formatNumber, formatCurrency } from "@/lib/utils";

export function StatStrip() {
  const { data: stats } = useStats();

  const items = [
    { label: "MARKETS", value: stats ? formatNumber(stats.activeMarkets) : "--" },
    { label: "24H VOL", value: stats ? formatCurrency(stats.volume24h) : "--" },
    { label: "TRADERS", value: stats ? formatNumber(stats.trackedTraders) : "--" },
    { label: "WHALE TRADES", value: stats ? formatNumber(stats.whaleTradesTotal) : "--" },
  ];

  return (
    <div className="panel flex items-center divide-x divide-white/[0.06] overflow-x-auto">
      {items.map((item) => (
        <div key={item.label} className="flex-1 min-w-[120px] px-4 py-2.5">
          <p className="text-[9px] uppercase tracking-[0.12em] text-white/30 font-medium mb-0.5">
            {item.label}
          </p>
          <p className="text-lg font-bold font-mono tabnum text-white/90 leading-none">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
