"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
} from "@heroui/react";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { TopMover } from "@/types";
import { formatCurrency, formatPercent, formatPercentChange } from "@/lib/utils";

interface TopMoversTableProps {
  movers: TopMover[];
  isLoading?: boolean;
}

export function TopMoversTable({ movers, isLoading }: TopMoversTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Table
      aria-label="Top movers"
      removeWrapper
      classNames={{
        th: "bg-default-100 text-default-500 text-xs uppercase",
        td: "py-3",
      }}
    >
      <TableHeader>
        <TableColumn>Market</TableColumn>
        <TableColumn>Platform</TableColumn>
        <TableColumn align="end">Price</TableColumn>
        <TableColumn align="end">24h Change</TableColumn>
        <TableColumn align="end">Volume</TableColumn>
      </TableHeader>
      <TableBody emptyContent="No movers found">
        {movers.map((mover) => (
          <TableRow
            key={mover.id}
            as={Link}
            href={`/markets/${mover.id}`}
            className="cursor-pointer hover:bg-default-50"
          >
            <TableCell>
              <span className="text-sm font-medium line-clamp-1">
                {mover.title}
              </span>
            </TableCell>
            <TableCell>
              <Chip
                size="sm"
                variant="flat"
                color={mover.platform === "polymarket" ? "secondary" : "primary"}
              >
                {mover.platform === "polymarket" ? "PM" : "Kalshi"}
              </Chip>
            </TableCell>
            <TableCell>
              <span className="text-sm">{formatPercent(mover.current_price)}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                {mover.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-danger" />
                )}
                <span
                  className={`text-sm font-medium ${
                    mover.change >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {formatPercentChange(mover.change)}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-default-400">
                {formatCurrency(mover.volume)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
