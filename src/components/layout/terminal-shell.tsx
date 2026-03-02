"use client";

import { useState, useCallback, useEffect } from "react";
import { TopBar } from "./top-bar";
import { TickerTape } from "./ticker-tape";
import { SidebarNav } from "./sidebar-nav";
import { CommandPalette } from "./command-palette";
import { useWebSocket } from "@/hooks/use-websocket";

export function TerminalShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Connect to WebSocket for real-time updates
  useWebSocket();

  const handleSearchOpen = useCallback(() => setSearchOpen(true), []);
  const handleSearchClose = useCallback(() => setSearchOpen(false), []);

  // Cmd+K shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#09090b]">
      <TopBar onSearchOpen={handleSearchOpen} />
      <TickerTape />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <CommandPalette open={searchOpen} onClose={handleSearchClose} />
    </div>
  );
}
