"use client";

import { useAuth } from "@clerk/nextjs";
import { useUserPlan } from "@/hooks/use-user";
import { Button } from "@heroui/react";
import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";

const PLAN_LEVELS: Record<string, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

interface PlanGateProps {
  requiredPlan: "pro" | "enterprise";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function DefaultUpgradePrompt({ requiredPlan }: { requiredPlan: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="p-3 rounded-full bg-amber-400/10 mb-4">
        <Lock className="w-6 h-6 text-amber-400" />
      </div>
      <h2 className="text-lg font-bold mb-2">
        {requiredPlan === "pro" ? "Pro" : "Enterprise"} Feature
      </h2>
      <p className="text-sm text-white/40 text-center max-w-sm mb-6">
        This feature requires a {requiredPlan === "pro" ? "Pro" : "Enterprise"} plan.
        Upgrade to unlock whale tracking, arbitrage scanning, and more.
      </p>
      <Button
        as={Link}
        href="/pricing"
        size="sm"
        radius="lg"
        className="bg-gradient-to-r from-blue-500 to-violet-600 text-white text-xs font-semibold h-9 px-5 shadow-lg shadow-blue-500/20"
        startContent={<Sparkles className="w-3.5 h-3.5" />}
      >
        View Plans
      </Button>
    </div>
  );
}

export function PlanGate({ requiredPlan, children, fallback }: PlanGateProps) {
  const { isSignedIn } = useAuth();
  const { data } = useUserPlan();

  // If not signed in, show upgrade prompt
  if (!isSignedIn) {
    return fallback ?? <DefaultUpgradePrompt requiredPlan={requiredPlan} />;
  }

  const userLevel = PLAN_LEVELS[data?.plan ?? "free"] ?? 0;
  const requiredLevel = PLAN_LEVELS[requiredPlan] ?? 1;

  if (userLevel < requiredLevel) {
    return fallback ?? <DefaultUpgradePrompt requiredPlan={requiredPlan} />;
  }

  return <>{children}</>;
}
