"use client";

import Link from "next/link";
import { Spinner } from "@heroui/react";
import { Minus } from "lucide-react";
import { parseNum, formatCurrency } from "@/lib/utils";
import { PriceFlash } from "./price-flash";
import type { TopMover } from "@/types";

interface TopMoversTableProps {
  movers: TopMover[];
  isLoading?: boolean;
}

export function TopMoversTable({ movers, isLoading }: TopMoversTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="sm" />
      </div>
    );
  }

  if (!movers || movers.length === 0) {
    return (
      <div className="text-center py-12 text-white/30">
        <Minus className="w-5 h-5 mx-auto mb-2 opacity-30" />
        <p className="text-[11px]">No movers yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="grid grid-cols-[24px_1fr_48px_64px_56px_72px] gap-2 px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/25 font-semibold border-b border-white/[0.04]">
        <span>#</span>
        <span>Market</span>
        <span>Plat</span>
        <span className="text-right">Price</span>
        <span className="text-right">Chg</span>
        <span className="text-right">Vol</span>
      </div>

      {/* Rows */}
      {movers.map((mover, i) => {
        const price = parseNum(mover.latest_price) * 100;
        const change = parseNum(mover.price_change) * 100;
        const isUp = change >= 0;

        return (
          <Link
            key={mover.id}
            href={`/markets/${mover.id}`}
            className="grid grid-cols-[24px_1fr_48px_64px_56px_72px] gap-2 items-center px-3 hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0"
            style={{ height: "32px" }}
          >
            <span className="text-[10px] text-white/25 font-mono tabnum">{i + 1}</span>
            <span className="text-[12px] text-white/70 truncate">{mover.title}</span>
            <span className={`text-[10px] font-bold ${
              mover.platform === "polymarket" ? "text-violet-400" : "text-blue-400"
            }`}>
              {mover.platform === "polymarket" ? "PM" : "KAL"}
            </span>
            <PriceFlash value={price}>
              <span className="text-[12px] font-mono font-bold text-white/80 tabnum text-right block">
                {price.toFixed(1)}%
              </span>
            </PriceFlash>
            <span className={`text-[11px] font-mono font-bold tabnum text-right ${
              isUp ? "text-emerald-400" : "text-red-400"
            }`}>
              {isUp ? "+" : ""}{change.toFixed(1)}
            </span>
            <span className="text-[10px] font-mono text-white/30 tabnum text-right">
              {formatCurrency(mover.volume)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
