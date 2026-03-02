"use client";

import { useState } from "react";
import { Pagination, Spinner } from "@heroui/react";
import { Store } from "lucide-react";
import { MarketCard } from "@/components/markets/market-card";
import { MarketFilters } from "@/components/markets/market-filters";
import { useMarkets } from "@/hooks/use-markets";
import { formatNumber } from "@/lib/utils";
import type { Platform } from "@/types";

export default function MarketsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [category, setCategory] = useState("");

  const { data, isLoading } = useMarkets({
    page,
    limit: 24,
    platform: platform === "all" ? undefined : platform,
    category: category || undefined,
    search: search || undefined,
  });

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Store className="w-4 h-4 text-amber-400" />
          <h1 className="text-lg font-bold tracking-tight">Markets</h1>
          <span className="text-[11px] text-white/40 font-mono tabnum">
            {data?.meta?.total ? formatNumber(data.meta.total) : "..."}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <MarketFilters
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          platform={platform}
          onPlatformChange={(v) => { setPlatform(v); setPage(1); }}
          category={category}
          onCategoryChange={(v) => { setCategory(v); setPage(1); }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
            {data?.data.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>

          {data && data.meta.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                total={data.meta.totalPages}
                page={page}
                onChange={setPage}
                showControls
                classNames={{ cursor: "bg-amber-500" }}
              />
            </div>
          )}

          {data?.data.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm text-white/40">No markets found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
