"use client";

import { useState } from "react";
import { Pagination, Spinner } from "@heroui/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MarketCard } from "@/components/markets/market-card";
import { MarketFilters } from "@/components/markets/market-filters";
import { useMarkets } from "@/hooks/use-markets";
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
    status: "active",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Market Explorer</h1>
          <p className="text-default-400">
            Browse {data?.total?.toLocaleString() ?? "..."} active prediction
            markets across Polymarket and Kalshi
          </p>
        </div>

        <div className="mb-6">
          <MarketFilters
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            platform={platform}
            onPlatformChange={(v) => {
              setPlatform(v);
              setPage(1);
            }}
            category={category}
            onCategoryChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" label="Loading markets..." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {data?.data.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>

            {data && data.total_pages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  total={data.total_pages}
                  page={page}
                  onChange={setPage}
                  showControls
                  color="primary"
                />
              </div>
            )}

            {data?.data.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-default-400">No markets found</p>
                <p className="text-sm text-default-300">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
