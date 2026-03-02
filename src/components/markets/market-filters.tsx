"use client";

import { Input } from "@heroui/react";
import { Search, X } from "lucide-react";
import type { Platform } from "@/types";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Politics", value: "politics" },
  { label: "Crypto", value: "crypto" },
  { label: "Sports", value: "sports" },
  { label: "Science", value: "science" },
  { label: "Tech", value: "technology" },
  { label: "Economics", value: "economics" },
];

interface MarketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  platform: Platform | "all";
  onPlatformChange: (value: Platform | "all") => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

export function MarketFilters({
  search,
  onSearchChange,
  platform,
  onPlatformChange,
  category,
  onCategoryChange,
}: MarketFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search markets..."
        value={search}
        onValueChange={onSearchChange}
        startContent={<Search className="w-4 h-4 text-default-400" />}
        endContent={
          search ? (
            <button onClick={() => onSearchChange("")} className="hover:text-foreground">
              <X className="w-3.5 h-3.5 text-default-400" />
            </button>
          ) : null
        }
        size="sm"
        classNames={{
          inputWrapper: "glass !bg-white/[0.03] border-white/[0.06] h-10",
          input: "text-sm",
        }}
      />

      <div className="flex flex-wrap gap-2">
        {/* Platform filters */}
        {(["all", "polymarket", "kalshi"] as const).map((p) => (
          <button
            key={p}
            onClick={() => onPlatformChange(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              platform === p
                ? "bg-primary/15 text-primary border border-primary/20"
                : "bg-white/[0.03] text-default-500 border border-white/[0.06] hover:text-foreground hover:border-white/[0.1]"
            }`}
          >
            {p === "all" ? "All Platforms" : p === "polymarket" ? "Polymarket" : "Kalshi"}
          </button>
        ))}

        <div className="w-px bg-white/[0.06] mx-1" />

        {/* Category filters */}
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              category === cat.value
                ? "bg-primary/15 text-primary border border-primary/20"
                : "bg-white/[0.03] text-default-500 border border-white/[0.06] hover:text-foreground hover:border-white/[0.1]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
