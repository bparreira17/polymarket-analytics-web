"use client";

import { useAuth, UserProfile } from "@clerk/nextjs";
import { Button, Spinner } from "@heroui/react";
import { CreditCard, ExternalLink } from "lucide-react";
import { useUserPlan } from "@/hooks/use-user";
import { api } from "@/lib/api";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

const PLAN_COLORS: Record<string, string> = {
  free: "text-white/50",
  pro: "text-amber-400",
  enterprise: "text-violet-400",
};

export default function AccountPage() {
  const { getToken } = useAuth();
  const { data, isLoading } = useUserPlan();

  const handleManageBilling = async () => {
    const token = await getToken();
    if (!token) return;
    try {
      const { url } = await api.billing.portal(token);
      window.location.href = url;
    } catch (err) {
      console.error("Failed to open billing portal:", err);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-4 h-4 text-amber-400" />
        <h1 className="text-lg font-bold tracking-tight">Account</h1>
      </div>

      {/* Billing section */}
      <div className="panel p-5 max-w-lg">
        <h2 className="text-sm font-bold mb-4">Billing</h2>
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-white/40">Current Plan</span>
              <span className={`text-[13px] font-bold ${PLAN_COLORS[data?.plan ?? "free"]}`}>
                {PLAN_LABELS[data?.plan ?? "free"]}
              </span>
            </div>
            {data?.subscriptionStatus && (
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-white/40">Status</span>
                <span className="text-[12px] text-emerald-400 font-medium capitalize">
                  {data.subscriptionStatus}
                </span>
              </div>
            )}
            {data?.currentPeriodEnd && (
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-white/40">Next billing</span>
                <span className="text-[12px] text-white/60 font-mono">
                  {new Date(data.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="pt-2 flex gap-2">
              {data?.plan === "free" ? (
                <Button
                  as="a"
                  href="/pricing"
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-violet-600 text-white text-xs font-semibold"
                >
                  Upgrade Plan
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="flat"
                  className="text-xs"
                  endContent={<ExternalLink className="w-3 h-3" />}
                  onPress={handleManageBilling}
                >
                  Manage Billing
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Clerk profile */}
      <div className="max-w-lg">
        <UserProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none border border-white/[0.06] rounded-xl",
            },
          }}
        />
      </div>
    </div>
  );
}
