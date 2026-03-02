"use client";

import { Heart } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useWatchlistIds, useAddToWatchlist, useRemoveFromWatchlist } from "@/hooks/use-watchlist";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  marketId: string;
  size?: "sm" | "md";
  className?: string;
}

export function WatchlistButton({ marketId, size = "sm", className }: WatchlistButtonProps) {
  const { isSignedIn } = useAuth();
  const { data: watchlistIds } = useWatchlistIds();
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  if (!isSignedIn) return null;

  const isWatchlisted = watchlistIds?.includes(marketId) ?? false;
  const isLoading = addMutation.isPending || removeMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;

    if (isWatchlisted) {
      removeMutation.mutate(marketId);
    } else {
      addMutation.mutate(marketId);
    }
  };

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200",
        isWatchlisted
          ? "text-red-400 hover:text-red-300"
          : "text-white/20 hover:text-white/50",
        isLoading && "opacity-50",
        className,
      )}
      title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Heart
        className={cn(iconSize, isWatchlisted && "fill-current")}
      />
    </button>
  );
}
