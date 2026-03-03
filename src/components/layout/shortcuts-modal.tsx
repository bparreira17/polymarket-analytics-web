"use client";

import { useEffect } from "react";
import { Keyboard } from "lucide-react";

interface ShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["g", "d"], description: "Go to Dashboard" },
      { keys: ["g", "m"], description: "Go to Markets" },
      { keys: ["g", "w"], description: "Go to Watchlist" },
      { keys: ["g", "p"], description: "Go to Portfolio" },
      { keys: ["g", "l"], description: "Go to Leaderboard" },
      { keys: ["g", "h"], description: "Go to Whales" },
      { keys: ["g", "a"], description: "Go to Arbitrage" },
      { keys: ["g", "$"], description: "Go to Pricing" },
    ],
  },
  {
    title: "Actions",
    shortcuts: [
      { keys: ["⌘", "K"], description: "Command Palette" },
      { keys: ["?"], description: "Keyboard Shortcuts" },
    ],
  },
];

export function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#111113] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
          <Keyboard className="w-4 h-4 text-white/40" />
          <h2 className="text-sm font-semibold text-white/80">Keyboard Shortcuts</h2>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-5">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/25 mb-2.5">
                {section.title}
              </h3>
              <div className="space-y-1.5">
                {section.shortcuts.map((s) => (
                  <div
                    key={s.description}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-[12px] text-white/60">{s.description}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((key, i) => (
                        <span key={i}>
                          <kbd className="inline-block bg-white/[0.06] rounded px-1.5 py-0.5 text-[10px] font-mono text-white/50 min-w-[20px] text-center">
                            {key}
                          </kbd>
                          {i < s.keys.length - 1 && (
                            <span className="text-[10px] text-white/20 mx-0.5">→</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
