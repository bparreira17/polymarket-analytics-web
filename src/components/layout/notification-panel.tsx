"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllRead } from "@/hooks/use-notifications";
import { cn, formatRelativeTime } from "@/lib/utils";

const TYPE_COLORS: Record<string, string> = {
  price_alert: "text-amber-400",
  whale_detected: "text-blue-400",
  market_resolved: "text-emerald-400",
  trader_activity: "text-violet-400",
};

export function NotificationPanel() {
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { data: unreadCount } = useUnreadCount();
  const { data: notificationData } = useNotifications({ limit: 20 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!isSignedIn) return null;

  const notifications = notificationData?.data ?? [];
  const count = unreadCount ?? 0;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all"
      >
        <Bell className="w-4 h-4" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#111113] border border-white/[0.06] rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
            <h3 className="text-[12px] font-semibold">Notifications</h3>
            {count > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="w-6 h-6 text-white/10 mx-auto mb-2" />
                <p className="text-[11px] text-white/30">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    if (!n.read) markRead.mutate(n.id);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-white/[0.02] transition-colors hover:bg-white/[0.02]",
                    !n.read && "bg-amber-400/[0.03]",
                  )}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[11px] font-medium", TYPE_COLORS[n.type] ?? "text-white/70")}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-white/40 mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-[9px] text-white/20 mt-1">{formatRelativeTime(n.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
