"use client";

import Link from "next/link";
import { Search, Sparkles } from "lucide-react";

export function TopBar({ onSearchOpen }: { onSearchOpen?: () => void }) {
  return (
    <header className="h-12 bg-[#0d0d0f] border-b border-white/[0.06] flex items-center px-4 shrink-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-6">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
          <span className="text-[9px] font-black text-black">PA</span>
        </div>
        <span className="text-[13px] font-bold tracking-tight text-white/90">
          POLY<span className="text-amber-400">ANALYTICS</span>
        </span>
      </Link>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5 mr-auto">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
          Live
        </span>
      </div>

      {/* Search button */}
      <button
        onClick={onSearchOpen}
        className="flex items-center gap-2 h-7 px-3 rounded-md bg-white/[0.04] border border-white/[0.06] text-default-500 hover:text-foreground hover:bg-white/[0.06] transition-colors mr-3"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="text-[11px]">Search</span>
        <kbd className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-default-500 ml-2 font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Upgrade */}
      <Link
        href="/pricing"
        className="flex items-center gap-1.5 h-7 px-3 rounded-md bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/20 text-amber-400 text-[11px] font-semibold hover:from-amber-500/30 hover:to-amber-600/30 transition-all"
      >
        <Sparkles className="w-3 h-3" />
        Upgrade
      </Link>
    </header>
  );
}
