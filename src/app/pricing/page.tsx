"use client";

import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
  Divider,
} from "@heroui/react";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Explore prediction markets",
    icon: <Zap className="w-6 h-6" />,
    color: "default" as const,
    features: [
      "Market Explorer (Polymarket + Kalshi)",
      "Price Charts",
      "Market Overview & Top Movers",
      "Cross-Platform Comparison (teaser)",
      "Public Leaderboard (Top 20)",
      "1 Price Alert",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    annualPrice: "$23/mo billed annually",
    description: "For active prediction market traders",
    icon: <Crown className="w-6 h-6" />,
    color: "primary" as const,
    features: [
      "Everything in Free",
      "Whale Tracker (trades $10K+)",
      "Arbitrage Scanner (cross-platform)",
      "Full Leaderboard (Top 100+)",
      "Portfolio Tracker",
      "Orderbook Depth",
      "Unlimited Smart Alerts",
      "AI Daily Briefing",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$79",
    period: "/month",
    annualPrice: "$63/mo billed annually",
    description: "For bots, devs, and power users",
    icon: <Building2 className="w-6 h-6" />,
    color: "secondary" as const,
    features: [
      "Everything in Pro",
      "REST API Access",
      "Webhook Alerts (Discord, Telegram)",
      "Historical Data Export (CSV/Parquet)",
      "Custom Dashboards",
      "Backtesting (beta)",
      "Priority Support",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            The Bloomberg Terminal for{" "}
            <span className="text-primary">Prediction Markets</span>
          </h1>
          <p className="text-lg text-default-400 max-w-2xl mx-auto">
            Real-time analytics, whale tracking, and cross-platform arbitrage
            for Polymarket and Kalshi — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`border ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10 scale-105"
                  : "border-default-100"
              } bg-default-50 relative`}
            >
              {plan.popular && (
                <Chip
                  color="primary"
                  variant="solid"
                  size="sm"
                  className="absolute -top-2 left-1/2 -translate-x-1/2"
                >
                  Most Popular
                </Chip>
              )}
              <CardHeader className="flex flex-col items-center pt-8 pb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary mb-3">
                  {plan.icon}
                </div>
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="text-sm text-default-400">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-default-400">{plan.period}</span>
                </div>
                {plan.annualPrice && (
                  <p className="text-xs text-default-400 mt-1">
                    {plan.annualPrice}
                  </p>
                )}
              </CardHeader>
              <Divider />
              <CardBody className="py-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter className="pt-0">
                <Button
                  fullWidth
                  color={plan.popular ? "primary" : "default"}
                  variant={plan.popular ? "solid" : "flat"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
