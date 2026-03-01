"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  ButtonGroup,
  Button,
  Progress,
  Spinner,
  Image,
  Link as HeroLink,
} from "@heroui/react";
import { ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PriceChart } from "@/components/charts/price-chart";
import { useMarket, useMarketHistory } from "@/hooks/use-markets";
import { formatCurrency, formatPercent } from "@/lib/utils";

const INTERVALS = [
  { label: "1H", value: "1h" },
  { label: "6H", value: "6h" },
  { label: "1D", value: "1d" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
];

export default function MarketDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [interval, setInterval] = useState("7d");

  const { data: market, isLoading: marketLoading } = useMarket(id);
  const { data: history, isLoading: historyLoading } = useMarketHistory(
    id,
    interval
  );

  if (marketLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Spinner size="lg" label="Loading market..." />
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-default-400">Market not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Back link */}
        <Link
          href="/markets"
          className="inline-flex items-center gap-1 text-sm text-default-400 hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Markets
        </Link>

        {/* Market Header */}
        <div className="flex items-start gap-4 mb-6">
          {market.image_url && (
            <Image
              src={market.image_url}
              alt={market.title}
              className="w-16 h-16 rounded-xl object-cover"
              width={64}
              height={64}
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Chip
                variant="flat"
                color={
                  market.platform === "polymarket" ? "secondary" : "primary"
                }
              >
                {market.platform === "polymarket" ? "Polymarket" : "Kalshi"}
              </Chip>
              <Chip variant="flat" color="default">
                {market.category}
              </Chip>
              <Chip
                variant="flat"
                color={market.status === "active" ? "success" : "default"}
              >
                {market.status}
              </Chip>
            </div>
            <h1 className="text-2xl font-bold mb-2">{market.title}</h1>
            {market.description && (
              <p className="text-default-400 text-sm max-w-3xl">
                {market.description}
              </p>
            )}
          </div>
          <HeroLink
            href={market.url}
            isExternal
            showAnchorIcon
            className="shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
          </HeroLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart — 2/3 */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-default-50 border border-default-100">
              <CardHeader className="flex justify-between items-center">
                <h2 className="font-semibold">Price History</h2>
                <ButtonGroup size="sm" variant="flat">
                  {INTERVALS.map((int) => (
                    <Button
                      key={int.value}
                      color={interval === int.value ? "primary" : "default"}
                      onPress={() => setInterval(int.value)}
                    >
                      {int.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </CardHeader>
              <Divider />
              <CardBody>
                {historyLoading ? (
                  <div className="flex justify-center py-16">
                    <Spinner />
                  </div>
                ) : history && history.length > 0 ? (
                  <PriceChart data={history} showVolume height={350} />
                ) : (
                  <div className="text-center py-16 text-default-400">
                    No price data available
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Cross-platform match */}
            {market.matched_market_id && (
              <Card className="bg-default-50 border border-primary/20">
                <CardBody className="flex flex-row items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Cross-platform match detected
                    </p>
                    <p className="text-xs text-default-400">
                      This market has a matching event on{" "}
                      {market.platform === "polymarket" ? "Kalshi" : "Polymarket"}
                    </p>
                  </div>
                  <Button
                    as={Link}
                    href={`/markets/${market.matched_market_id}`}
                    size="sm"
                    variant="flat"
                    color="primary"
                  >
                    Compare
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Sidebar — 1/3 */}
          <div className="space-y-4">
            {/* Outcomes */}
            <Card className="bg-default-50 border border-default-100">
              <CardHeader>
                <h2 className="font-semibold">Outcomes</h2>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-3">
                {market.outcomes.map((outcome, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{outcome.name}</span>
                      <span className="font-semibold">
                        {formatPercent(outcome.price)}
                      </span>
                    </div>
                    <Progress
                      value={outcome.price * 100}
                      color={i === 0 ? "success" : "danger"}
                      size="sm"
                    />
                  </div>
                ))}
              </CardBody>
            </Card>

            {/* Stats */}
            <Card className="bg-default-50 border border-default-100">
              <CardHeader>
                <h2 className="font-semibold">Market Stats</h2>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-default-400">Volume</span>
                    <span className="font-medium">
                      {formatCurrency(market.volume)}
                    </span>
                  </div>
                  {market.liquidity && (
                    <div className="flex justify-between">
                      <span className="text-default-400">Liquidity</span>
                      <span className="font-medium">
                        {formatCurrency(market.liquidity)}
                      </span>
                    </div>
                  )}
                  {market.end_date && (
                    <div className="flex justify-between">
                      <span className="text-default-400">End Date</span>
                      <span className="font-medium">
                        {new Date(market.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-default-400">Platform</span>
                    <span className="font-medium capitalize">
                      {market.platform}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
