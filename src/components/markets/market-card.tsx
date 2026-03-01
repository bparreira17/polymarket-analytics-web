"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  Progress,
  Image,
} from "@heroui/react";
import Link from "next/link";
import type { Market } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const yesOutcome = market.outcomes[0];
  const noOutcome = market.outcomes[1];
  const yesPrice = yesOutcome?.price ?? 0;

  return (
    <Card
      as={Link}
      href={`/markets/${market.id}`}
      isPressable
      className="bg-default-50 border border-default-100 hover:border-primary/50 transition-colors"
    >
      <CardBody className="gap-3">
        <div className="flex items-start gap-3">
          {market.image_url && (
            <Image
              src={market.image_url}
              alt={market.title}
              className="w-10 h-10 rounded-lg object-cover shrink-0"
              width={40}
              height={40}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Chip
                size="sm"
                variant="flat"
                color={market.platform === "polymarket" ? "secondary" : "primary"}
              >
                {market.platform === "polymarket" ? "PM" : "Kalshi"}
              </Chip>
              <Chip size="sm" variant="flat" color="default">
                {market.category}
              </Chip>
            </div>
            <p className="text-sm font-medium line-clamp-2">{market.title}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-success">{yesOutcome?.name || "Yes"} {formatPercent(yesPrice)}</span>
            <span className="text-danger">{noOutcome?.name || "No"} {formatPercent(noOutcome?.price ?? 1 - yesPrice)}</span>
          </div>
          <Progress
            value={yesPrice * 100}
            color="success"
            size="sm"
            className="max-w-full"
          />
        </div>
      </CardBody>

      <CardFooter className="justify-between text-xs text-default-400 pt-0">
        <span>Vol: {formatCurrency(market.volume)}</span>
        {market.liquidity && <span>Liq: {formatCurrency(market.liquidity)}</span>}
        {market.end_date && (
          <span>Ends: {new Date(market.end_date).toLocaleDateString()}</span>
        )}
      </CardFooter>
    </Card>
  );
}
