"use client";

import { Card, CardBody, Chip, Spinner } from "@heroui/react";
import { Waves } from "lucide-react";
import type { Trade } from "@/types";
import { formatCurrency, formatRelativeTime, truncateAddress } from "@/lib/utils";

interface WhaleFeedProps {
  trades: Trade[];
  isLoading?: boolean;
}

export function WhaleFeed({ trades, isLoading }: WhaleFeedProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!trades.length) {
    return (
      <div className="text-center py-8 text-default-400">
        <Waves className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No whale trades detected yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {trades.map((trade) => (
        <Card key={trade.id} className="bg-default-50 border border-default-100">
          <CardBody className="flex flex-row items-center gap-3 py-2 px-3">
            <div
              className={`w-2 h-2 rounded-full ${
                trade.side === "buy" ? "bg-success" : "bg-danger"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm line-clamp-1">
                <span className="font-medium">
                  {trade.trader_address
                    ? truncateAddress(trade.trader_address)
                    : "Unknown"}
                </span>{" "}
                <span className={trade.side === "buy" ? "text-success" : "text-danger"}>
                  {trade.side === "buy" ? "bought" : "sold"}
                </span>{" "}
                <span className="font-medium">{formatCurrency(trade.amount)}</span>
              </p>
              <p className="text-xs text-default-400 line-clamp-1">
                {trade.market_title}
              </p>
            </div>
            <div className="text-right shrink-0">
              <Chip
                size="sm"
                variant="flat"
                color={trade.platform === "polymarket" ? "secondary" : "primary"}
              >
                {trade.platform === "polymarket" ? "PM" : "Kalshi"}
              </Chip>
              <p className="text-xs text-default-400 mt-1">
                {formatRelativeTime(trade.timestamp)}
              </p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
