"use client";

import { useState } from "react";
import { Pagination, Spinner } from "@heroui/react";
import { ArrowLeftRight } from "lucide-react";
import { useArbitrage } from "@/hooks/use-markets";
import { formatPercent, formatRelativeTime, parseNum } from "@/lib/utils";
import { PlanGate } from "@/components/plan-gate";

export default function ArbitragePage() {
  return (
    <PlanGate requiredPlan="pro">
      <ArbitrageContent />
    </PlanGate>
  );
}

function ArbitrageContent() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useArbitrage({ page, limit: 25, min_spread: 0.01 });

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeftRight className="w-4 h-4 text-amber-400" />
        <h1 className="text-lg font-bold tracking-tight">Arbitrage Scanner</h1>
        <span className="text-[10px] text-white/30 font-mono">Cross-platform spreads</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="panel overflow-hidden">
            <div className="divide-y divide-white/[0.04]">
              <div className="hidden sm:grid grid-cols-[1fr_100px_80px_80px_64px_72px] gap-3 px-4 py-2 text-[9px] uppercase tracking-widest text-white/30 font-semibold">
                <span>Event</span>
                <span>Outcome</span>
                <span className="text-center">PM</span>
                <span className="text-center">Kalshi</span>
                <span className="text-right">Spread</span>
                <span>Detected</span>
              </div>
              {(data?.data ?? []).map((arb) => {
                const spread = parseNum(arb.spread);
                return (
                  <div key={arb.id} className="grid grid-cols-[1fr_100px_80px_80px_64px_72px] gap-3 items-center px-4 py-2 hover:bg-white/[0.02] transition-colors text-[11px]">
                    <span className="truncate text-[12px] text-white/70">{arb.marketATitle ?? "Unknown"}</span>
                    <span className="text-white/50">{arb.outcome}</span>
                    <span className="text-center font-mono text-violet-400 font-medium tabnum">
                      {formatPercent(parseNum(arb.priceA))}
                    </span>
                    <span className="text-center font-mono text-blue-400 font-medium tabnum">
                      {formatPercent(parseNum(arb.priceB))}
                    </span>
                    <span className={`text-right font-mono font-bold tabnum ${
                      spread >= 0.05 ? "text-emerald-400" : spread >= 0.02 ? "text-amber-400" : "text-white/40"
                    }`}>
                      {formatPercent(spread)}
                    </span>
                    <span className="text-[10px] text-white/30">{formatRelativeTime(arb.detectedAt)}</span>
                  </div>
                );
              })}
            </div>
            {(!data?.data || data.data.length === 0) && (
              <div className="text-center py-16 text-white/30">
                <ArrowLeftRight className="w-5 h-5 mx-auto mb-2 opacity-30" />
                <p className="text-[11px]">No arbitrage opportunities found</p>
                <p className="text-[10px] text-white/20 mt-1">Scanner runs every 5 minutes</p>
              </div>
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
