"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Waves,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopMoversTable } from "@/components/dashboard/top-movers-table";
import { WhaleFeed } from "@/components/dashboard/whale-feed";
import { useTopMovers, useWhaleTrades, useMarkets } from "@/hooks/use-markets";

export default function DashboardPage() {
  const { data: moversData, isLoading: moversLoading } = useTopMovers(10);
  const { data: whalesData, isLoading: whalesLoading } = useWhaleTrades({
    limit: 10,
  });
  const { data: marketsData } = useMarkets({ limit: 1 });

  const totalMarkets = marketsData?.total ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-default-400">
            Real-time analytics for Polymarket & Kalshi prediction markets
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Active Markets"
            value={totalMarkets.toLocaleString()}
            subtitle="Polymarket + Kalshi"
            icon={<BarChart3 className="w-5 h-5" />}
          />
          <StatCard
            title="24h Volume"
            value="--"
            subtitle="Across all markets"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard
            title="Top Traders"
            value="--"
            subtitle="On leaderboard"
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            title="Whale Trades"
            value={String(whalesData?.total ?? 0)}
            subtitle="$10K+ trades"
            icon={<Waves className="w-5 h-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Movers — 2/3 width */}
          <Card className="lg:col-span-2 bg-default-50 border border-default-100">
            <CardHeader className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Top Movers (24h)</h2>
                <p className="text-xs text-default-400">
                  Biggest probability changes
                </p>
              </div>
              <Link
                href="/markets"
                className="text-primary text-sm flex items-center gap-1 hover:underline"
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              <TopMoversTable
                movers={moversData ?? []}
                isLoading={moversLoading}
              />
            </CardBody>
          </Card>

          {/* Whale Feed — 1/3 width */}
          <Card className="bg-default-50 border border-default-100">
            <CardHeader className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Whale Tracker</h2>
                <p className="text-xs text-default-400">Recent $10K+ trades</p>
              </div>
              <Link
                href="/whales"
                className="text-primary text-sm flex items-center gap-1 hover:underline"
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <Divider />
            <CardBody>
              <WhaleFeed
                trades={whalesData?.data ?? []}
                isLoading={whalesLoading}
              />
            </CardBody>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
