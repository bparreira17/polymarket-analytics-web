"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { StatStrip } from "@/components/dashboard/stat-strip";
import { TopMoversTable } from "@/components/dashboard/top-movers-table";
import { WhaleFeed } from "@/components/dashboard/whale-feed";
import { ArbitrageScanner } from "@/components/dashboard/arbitrage-scanner";
import { MiniLeaderboard } from "@/components/dashboard/mini-leaderboard";
import { CategoryHeatMap } from "@/components/dashboard/category-heat-map";
import { PremiumPreview } from "@/components/dashboard/premium-preview";
import { useTopMovers, useWhaleTrades } from "@/hooks/use-markets";
import { useUserPlan } from "@/hooks/use-user";

const PLAN_LEVELS: Record<string, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

export default function DashboardPage() {
  const { data: moversData, isLoading: moversLoading } = useTopMovers(10);
  const { data: whalesData, isLoading: whalesLoading } = useWhaleTrades({ limit: 12 });
  const { isSignedIn } = useAuth();
  const { data: planData } = useUserPlan();

  const hasPro = isSignedIn && (PLAN_LEVELS[planData?.plan ?? "free"] ?? 0) >= 1;

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Stat Strip — full width */}
      <StatStrip />

      {/* Row 1: Top Movers (8/12) + Whale Feed (4/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 panel overflow-hidden">
          <div className="flex justify-between items-center px-3 py-2 border-b border-white/[0.04]">
            <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Top Movers</h2>
            <Link href="/markets" className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <TopMoversTable movers={moversData ?? []} isLoading={moversLoading} />
          </div>
        </div>

        <div className="lg:col-span-4 panel overflow-hidden">
          <div className="flex justify-between items-center px-3 py-2 border-b border-white/[0.04]">
            <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Whale Feed</h2>
            <Link href="/whales" className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <PremiumPreview requiredPlan="pro" featureName="Whale Tracker">
            <WhaleFeed trades={whalesData?.data ?? []} isLoading={whalesLoading} previewMode={!hasPro} />
          </PremiumPreview>
        </div>
      </div>

      {/* Row 2: Categories (4/12) + Arbitrage (5/12) + Leaderboard (3/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 panel overflow-hidden">
          <div className="px-3 py-2 border-b border-white/[0.04]">
            <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Categories</h2>
          </div>
          <CategoryHeatMap />
        </div>

        <div className="lg:col-span-5 panel overflow-hidden">
          <div className="flex justify-between items-center px-3 py-2 border-b border-white/[0.04]">
            <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Arbitrage</h2>
            <Link href="/arbitrage" className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <PremiumPreview requiredPlan="pro" featureName="Arbitrage Scanner">
            <ArbitrageScanner previewMode={!hasPro} />
          </PremiumPreview>
        </div>

        <div className="lg:col-span-3 panel overflow-hidden">
          <div className="flex justify-between items-center px-3 py-2 border-b border-white/[0.04]">
            <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Leaderboard</h2>
            <Link href="/leaderboard" className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <MiniLeaderboard />
        </div>
      </div>
    </div>
  );
}
