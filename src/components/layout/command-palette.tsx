"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { parseNum } from "@/lib/utils";
import type { Market } from "@/types";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Market[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.markets.list({ search: q, limit: 8 });
      setResults(res.data);
      setSelectedIndex(0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 150);
  };

  const navigate = (market: Market) => {
    onClose();
    router.push(`/markets/${market.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Palette */}
      <div className="relative w-full max-w-lg bg-[#111113] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <Search className="w-4 h-4 text-white/30" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search markets..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
          <kbd className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/30 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-[320px] overflow-y-auto py-1">
            {results.map((market, i) => {
              const price = parseNum(market.outcomes?.[0]?.price) * 100;
              return (
                <button
                  key={market.id}
                  onClick={() => navigate(market)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selectedIndex
                      ? "bg-amber-400/[0.08]"
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-white/80 truncate">{market.title}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">
                      {market.platform === "polymarket" ? "PM" : "KAL"} · {market.category}
                    </p>
                  </div>
                  <span className="text-[12px] font-mono font-bold text-white/70 tabnum">
                    {price.toFixed(1)}%
                  </span>
                  <ArrowRight className="w-3 h-3 text-white/20" />
                </button>
              );
            })}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && !loading && (
          <div className="px-4 py-8 text-center text-[12px] text-white/30">
            No markets found
          </div>
        )}

        {loading && (
          <div className="px-4 py-6 text-center text-[11px] text-white/30">
            Searching...
          </div>
        )}
      </div>
    </div>
  );
}
