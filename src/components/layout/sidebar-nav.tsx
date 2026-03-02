"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Store,
  Waves,
  Trophy,
  ArrowLeftRight,
  CreditCard,
  User,
  Lock,
  Heart,
  Wallet,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserPlan } from "@/hooks/use-user";

const PLAN_LEVELS: Record<string, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

const NAV_SECTIONS = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard, minPlan: "free" as const },
      { label: "Markets", href: "/markets", icon: Store, minPlan: "free" as const },
      { label: "Watchlist", href: "/watchlist", icon: Heart, minPlan: "free" as const },
      { label: "Portfolio", href: "/portfolio", icon: Wallet, minPlan: "pro" as const },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { label: "Whales", href: "/whales", icon: Waves, minPlan: "pro" as const },
      { label: "Leaderboard", href: "/leaderboard", icon: Trophy, minPlan: "free" as const },
      { label: "Arbitrage", href: "/arbitrage", icon: ArrowLeftRight, minPlan: "pro" as const },
      { label: "Traders", href: "/leaderboard", icon: Users, minPlan: "free" as const },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { label: "Account", href: "/account", icon: User, minPlan: "free" as const },
      { label: "Pricing", href: "/pricing", icon: CreditCard, minPlan: "free" as const },
    ],
  },
];

const PLAN_BADGE: Record<string, { label: string; color: string }> = {
  free: { label: "FREE", color: "text-white/30" },
  pro: { label: "PRO", color: "text-amber-400" },
  enterprise: { label: "ENT", color: "text-violet-400" },
};

export function SidebarNav() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { data } = useUserPlan();
  const userPlan = data?.plan ?? "free";
  const userLevel = PLAN_LEVELS[userPlan] ?? 0;

  const badge = PLAN_BADGE[userPlan] ?? PLAN_BADGE.free;

  return (
    <aside className="w-[200px] bg-[#0d0d0f] border-r border-white/[0.06] flex flex-col shrink-0 overflow-y-auto">
      <nav className="flex-1 py-4 px-2 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/25 px-3 mb-2">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                const isLocked =
                  (PLAN_LEVELS[item.minPlan] ?? 0) > userLevel;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] font-medium transition-colors relative",
                      isActive
                        ? "text-amber-400 bg-amber-400/[0.06]"
                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-amber-400 rounded-r" />
                    )}
                    <Icon className="w-[14px] h-[14px]" />
                    {item.label}
                    {isLocked && (
                      <Lock className="w-[10px] h-[10px] text-white/20 ml-auto" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.04] px-4 py-3">
        {isSignedIn && (
          <p className={cn("text-[9px] font-bold font-mono tracking-wider mb-1", badge.color)}>
            {badge.label}
          </p>
        )}
        <p className="text-[9px] text-white/20 font-mono">v0.1.0</p>
        <p className="text-[9px] text-white/20 font-mono mt-0.5">Data: 30s refresh</p>
      </div>
    </aside>
  );
}
