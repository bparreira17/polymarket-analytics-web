"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const GO_ROUTES: Record<string, string> = {
  d: "/",
  m: "/markets",
  w: "/watchlist",
  p: "/portfolio",
  l: "/leaderboard",
  h: "/whales",
  a: "/arbitrage",
  $: "/pricing",
};

const PENDING_TIMEOUT = 800;

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

interface UseKeyboardShortcutsReturn {
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export function useKeyboardShortcuts(
  searchOpenSetter: (fn: (prev: boolean) => boolean) => void
): UseKeyboardShortcutsReturn {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const router = useRouter();
  const pendingG = useRef(false);
  const pendingTimer = useRef<ReturnType<typeof setTimeout>>();

  const setSearchOpen = useCallback(
    (open: boolean) => searchOpenSetter(() => open),
    [searchOpenSetter]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Cmd/Ctrl+K — toggle command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchOpenSetter((prev) => !prev);
        return;
      }

      // Ignore shortcuts when typing in editable fields
      if (isEditableTarget(e.target)) return;
      // Ignore if any modifier is held (except shift for ?)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Second key of g→x sequence
      if (pendingG.current) {
        pendingG.current = false;
        if (pendingTimer.current) clearTimeout(pendingTimer.current);
        const route = GO_ROUTES[e.key];
        if (route) {
          e.preventDefault();
          router.push(route);
        }
        return;
      }

      // ? — toggle shortcuts modal
      if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
        return;
      }

      // g — start go sequence
      if (e.key === "g") {
        pendingG.current = true;
        pendingTimer.current = setTimeout(() => {
          pendingG.current = false;
        }, PENDING_TIMEOUT);
        return;
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
    };
  }, [router, searchOpenSetter]);

  return { shortcutsOpen, setShortcutsOpen, setSearchOpen };
}
