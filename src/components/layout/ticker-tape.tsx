"use client";

import { useTopMovers } from "@/hooks/use-markets";
import { parseNum } from "@/lib/utils";

export function TickerTape() {
  const { data: movers } = useTopMovers(20);

  if (!movers || movers.length === 0) return null;

  const items = movers.map((m) => {
    const price = parseNum(m.latest_price) * 100;
    const change = parseNum(m.price_change) * 100;
    const isUp = change >= 0;
    return {
      id: m.id,
      title: m.title.length > 40 ? m.title.slice(0, 40) + "..." : m.title,
      price: price.toFixed(1),
      change: `${isUp ? "+" : ""}${change.toFixed(1)}pp`,
      isUp,
    };
  });

  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className="h-7 bg-[#0a0a0c] border-b border-white/[0.04] overflow-hidden shrink-0 relative group">
      <div className="animate-marquee flex items-center h-full whitespace-nowrap group-hover:[animation-play-state:paused]">
        {allItems.map((item, i) => (
          <span key={`${item.id}-${i}`} className="inline-flex items-center gap-1.5 mx-4">
            <span className="text-[11px] font-mono text-white/60">{item.title}</span>
            <span className="text-[11px] font-mono font-bold text-white/90">{item.price}%</span>
            <span
              className={`text-[10px] font-mono font-bold ${
                item.isUp ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {item.isUp ? "\u25B2" : "\u25BC"}{item.change}
            </span>
            <span className="text-white/10 mx-2">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
