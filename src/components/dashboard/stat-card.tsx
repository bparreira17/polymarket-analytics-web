"use client";

import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <div className="glass rounded-xl p-4 animate-fade-in group hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-white/[0.05] text-default-400 group-hover:text-primary transition-colors">{icon}</div>
        {trend && (
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
              trend.positive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight leading-none mb-1">{value}</p>
      <p className="text-[11px] text-default-500">{title}{subtitle ? ` · ${subtitle}` : ""}</p>
    </div>
  );
}
