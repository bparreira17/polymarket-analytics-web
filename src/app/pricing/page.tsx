"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@heroui/react";
import { Check, Zap, Crown, Building2, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

const STRIPE_PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "";
const STRIPE_ENTERPRISE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID ?? "";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Explore prediction markets",
    icon: <Zap className="w-4 h-4" />,
    features: [
      "Market Explorer (PM + Kalshi)",
      "Price Charts",
      "Market Overview & Top Movers",
      "Cross-Platform Comparison",
      "Public Leaderboard (Top 20)",
      "1 Price Alert",
    ],
    cta: "Get Started",
    popular: false,
    priceId: null as string | null,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    annualNote: "$23/mo billed annually",
    description: "For active traders seeking edge",
    icon: <Crown className="w-4 h-4" />,
    features: [
      "Everything in Free",
      "Whale Tracker ($10K+ trades)",
      "Arbitrage Scanner (cross-platform)",
      "Full Leaderboard (Top 100+)",
      "Portfolio Tracker",
      "Orderbook Depth",
      "Unlimited Smart Alerts",
      "AI Daily Briefing",
    ],
    cta: "Start Pro Trial",
    popular: true,
    priceId: STRIPE_PRO_PRICE_ID,
  },
  {
    name: "Enterprise",
    price: "$79",
    period: "/mo",
    annualNote: "$63/mo billed annually",
    description: "For bots, devs, and power users",
    icon: <Building2 className="w-4 h-4" />,
    features: [
      "Everything in Pro",
      "REST API Access",
      "Webhook Alerts (Discord, Telegram)",
      "Historical Data Export",
      "Custom Dashboards",
      "Backtesting (beta)",
      "Priority Support",
    ],
    cta: "Get Enterprise",
    popular: false,
    priceId: STRIPE_ENTERPRISE_PRICE_ID,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: (typeof plans)[number]) => {
    if (!plan.priceId) {
      // Free plan — redirect to sign-up
      router.push("/sign-up");
      return;
    }

    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    setLoading(plan.name);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const { url } = await api.billing.checkout(plan.priceId, token);
      window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Hero */}
      <div className="text-center mb-12 pt-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          The <span className="text-amber-400">Bloomberg Terminal</span>
          <br />for Prediction Markets
        </h1>
        <p className="text-sm text-white/40 max-w-lg mx-auto">
          Real-time analytics, whale tracking, and cross-platform arbitrage
          for Polymarket and Kalshi.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative panel p-5 flex flex-col ${
              plan.popular ? "border-amber-400/20 ring-1 ring-amber-400/10" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-[9px] font-bold text-amber-400 tracking-wide uppercase">
                Most Popular
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-400">{plan.icon}</span>
              <h2 className="text-base font-bold">{plan.name}</h2>
            </div>
            <p className="text-[11px] text-white/40 mb-3">{plan.description}</p>
            <div className="mb-1">
              <span className="text-2xl font-bold tracking-tight">{plan.price}</span>
              <span className="text-white/40 text-[11px]">{plan.period}</span>
            </div>
            {plan.annualNote && (
              <p className="text-[10px] text-white/30 mb-4">{plan.annualNote}</p>
            )}
            {!plan.annualNote && <div className="mb-4" />}

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-white/60">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              fullWidth
              size="sm"
              isLoading={loading === plan.name}
              className={
                plan.popular
                  ? "bg-amber-400/20 text-amber-400 font-semibold border border-amber-400/20 hover:bg-amber-400/30"
                  : "bg-white/[0.04] text-white/60 font-medium border border-white/[0.06] hover:bg-white/[0.06]"
              }
              endContent={loading !== plan.name ? <ArrowRight className="w-3.5 h-3.5" /> : undefined}
              onPress={() => handleSubscribe(plan)}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
