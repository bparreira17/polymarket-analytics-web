"use client";

import { useState } from "react";
import { Pagination, Spinner } from "@heroui/react";
import { Waves } from "lucide-react";
import { useWhaleTrades } from "@/hooks/use-markets";
import { formatCurrency, truncateAddress, parseNum } from "@/lib/utils";
import { PlanGate } from "@/components/plan-gate";

export default function WhalesPage() {
  return (
    <PlanGate requiredPlan="pro">
      <WhalesContent />
    </PlanGate>
  );
}

function WhalesContent() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useWhaleTrades({ page, limit: 25, min_amount: 10000 });

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <Waves className="w-4 h-4 text-amber-400" />
        <h1 className="text-lg font-bold tracking-tight">Whale Tracker</h1>
        <span className="text-[10px] text-white/30 font-mono">$10K+ trades</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="panel overflow-hidden">
            <div className="divide-y divide-white/[0.04]">
              <div className="hidden sm:grid grid-cols-[60px_40px_80px_1fr_36px_72px_48px] gap-3 px-4 py-2 text-[9px] uppercase tracking-widest text-white/30 font-semibold">
                <span>Time</span>
                <span>Side</span>
                <span>Platform</span>
                <span>Market</span>
                <span></span>
                <span className="text-right">Amount</span>
                <span className="text-right">Price</span>
              </div>
              {(data?.data ?? []).map((trade) => {
                const isBuy = trade.side === "buy";
                return (
                  <div key={trade.id} className="grid grid-cols-[60px_40px_80px_1fr_36px_72px_48px] gap-3 items-center px-4 py-2 hover:bg-white/[0.02] transition-colors text-[11px] font-mono">
                    <span className="text-white/40 tabnum">
                      {new Date(trade.timestamp).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                    <span className={`font-bold text-[10px] ${isBuy ? "text-emerald-400" : "text-red-400"}`}>
                      {isBuy ? "BUY" : "SELL"}
                    </span>
                    <span className={`text-[10px] font-semibold ${
                      trade.platform === "polymarket" ? "text-violet-400" : "text-blue-400"
                    }`}>
                      {trade.platform === "polymarket" ? "PM" : "KAL"}
                    </span>
                    <span className="text-white/60 truncate font-sans text-[12px]">{trade.marketTitle ?? "Unknown"}</span>
                    <span className="text-white/20 truncate text-[10px]">
                      {trade.traderAddress ? truncateAddress(trade.traderAddress) : ""}
                    </span>
                    <span className="text-right font-semibold text-white/80 tabnum">{formatCurrency(trade.amount)}</span>
                    <span className="text-right text-white/40 tabnum">{(parseNum(trade.price) * 100).toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
            {(!data?.data || data.data.length === 0) && (
              <div className="text-center py-16 text-white/30">
                <Waves className="w-6 h-6 mx-auto mb-2 opacity-30" />
                <p className="text-[11px]">No whale trades detected yet</p>
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
