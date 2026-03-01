"use client";

import { Card, CardBody } from "@heroui/react";
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
    <Card className="bg-default-50 border border-default-100">
      <CardBody className="flex flex-row items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">{icon}</div>
        <div className="flex-1">
          <p className="text-xs text-default-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center gap-2">
            {subtitle && <p className="text-xs text-default-400">{subtitle}</p>}
            {trend && (
              <span
                className={`text-xs font-medium ${
                  trend.positive ? "text-success" : "text-danger"
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
