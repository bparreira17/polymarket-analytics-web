"use client";

import { Input, Select, SelectItem, Button, ButtonGroup } from "@heroui/react";
import { Search, X } from "lucide-react";
import type { Platform } from "@/types";

const CATEGORIES = [
  "All",
  "Politics",
  "Crypto",
  "Sports",
  "Science",
  "Entertainment",
  "Economics",
  "Technology",
  "World",
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
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Input
        placeholder="Search markets..."
        value={search}
        onValueChange={onSearchChange}
        startContent={<Search className="w-4 h-4 text-default-400" />}
        endContent={
          search ? (
            <button onClick={() => onSearchChange("")}>
              <X className="w-4 h-4 text-default-400" />
            </button>
          ) : null
        }
        size="sm"
        className="flex-1 min-w-[200px]"
      />

      <ButtonGroup size="sm" variant="flat">
        <Button
          color={platform === "all" ? "primary" : "default"}
          onPress={() => onPlatformChange("all")}
        >
          All
        </Button>
        <Button
          color={platform === "polymarket" ? "primary" : "default"}
          onPress={() => onPlatformChange("polymarket")}
        >
          Polymarket
        </Button>
        <Button
          color={platform === "kalshi" ? "primary" : "default"}
          onPress={() => onPlatformChange("kalshi")}
        >
          Kalshi
        </Button>
      </ButtonGroup>

      <Select
        size="sm"
        selectedKeys={[category]}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full sm:w-[180px]"
        aria-label="Category filter"
      >
        {CATEGORIES.map((cat) => (
          <SelectItem key={cat === "All" ? "" : cat.toLowerCase()}>
            {cat}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
