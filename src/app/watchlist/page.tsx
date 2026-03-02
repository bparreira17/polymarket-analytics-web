"use client";

import { Spinner } from "@heroui/react";
import { Heart, Star } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useWatchlist } from "@/hooks/use-watchlist";
import { MarketCard } from "@/components/markets/market-card";
import Link from "next/link";

export default function WatchlistPage() {
  const { isSignedIn } = useAuth();
  const { data, isLoading } = useWatchlist();

  if (!isSignedIn) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Heart className="w-10 h-10 text-white/10" />
        <p className="text-white/40 text-sm">Sign in to create your watchlist</p>
        <Link
          href="/sign-in"
          className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const entries = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-bold tracking-tight">Watchlist</h1>
          <p className="text-[11px] text-white/40 mt-0.5">
            {entries.length} / {meta?.limit ?? "?"} markets saved
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Star className="w-8 h-8 text-white/10" />
          <p className="text-white/30 text-sm">No markets in your watchlist yet</p>
          <Link
            href="/markets"
            className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors"
          >
            Browse Markets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {entries.map((entry) => (
            <MarketCard key={entry.id} market={entry.market} />
          ))}
        </div>
      )}
    </div>
  );
}
