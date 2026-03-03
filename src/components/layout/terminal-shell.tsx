"use client";

import { useState, useCallback } from "react";
import { TopBar } from "./top-bar";
import { TickerTape } from "./ticker-tape";
import { SidebarNav } from "./sidebar-nav";
import { CommandPalette } from "./command-palette";
import { ShortcutsModal } from "./shortcuts-modal";
import { useWebSocket } from "@/hooks/use-websocket";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export function TerminalShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Connect to WebSocket for real-time updates
  useWebSocket();

  const { shortcutsOpen, setShortcutsOpen } = useKeyboardShortcuts(setSearchOpen);

  const handleSearchOpen = useCallback(() => setSearchOpen(true), []);
  const handleSearchClose = useCallback(() => setSearchOpen(false), []);
  const handleShortcutsClose = useCallback(() => setShortcutsOpen(false), [setShortcutsOpen]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#09090b]">
      <TopBar onSearchOpen={handleSearchOpen} />
      <TickerTape />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav onShortcutsOpen={() => setShortcutsOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <CommandPalette open={searchOpen} onClose={handleSearchClose} />
      <ShortcutsModal open={shortcutsOpen} onClose={handleShortcutsClose} />
    </div>
  );
}
