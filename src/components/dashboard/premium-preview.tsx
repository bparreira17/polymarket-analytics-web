"use client";

import { useAuth } from "@clerk/nextjs";
import { useUserPlan } from "@/hooks/use-user";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@heroui/react";
import Link from "next/link";

const PLAN_LEVELS: Record<string, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

interface PremiumPreviewProps {
  requiredPlan: "pro" | "enterprise";
  featureName: string;
  children: React.ReactNode;
}

export function PremiumPreview({ requiredPlan, featureName, children }: PremiumPreviewProps) {
  const { isSignedIn } = useAuth();
  const { data } = useUserPlan();

  const userLevel = PLAN_LEVELS[data?.plan ?? "free"] ?? 0;
  const requiredLevel = PLAN_LEVELS[requiredPlan] ?? 1;
  const hasAccess = isSignedIn && userLevel >= requiredLevel;

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Blurred content */}
      <div className="blur-[3px] pointer-events-none select-none">{children}</div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent flex flex-col items-center justify-center gap-3">
        <div className="p-2.5 rounded-full bg-amber-400/10">
          <Lock className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-[12px] font-semibold text-white/70">{featureName}</p>
        <Button
          as={Link}
          href="/pricing"
          size="sm"
          radius="lg"
          className="bg-gradient-to-r from-blue-500 to-violet-600 text-white text-[11px] font-semibold h-8 px-4 shadow-lg shadow-blue-500/20"
          startContent={<Sparkles className="w-3 h-3" />}
        >
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}
