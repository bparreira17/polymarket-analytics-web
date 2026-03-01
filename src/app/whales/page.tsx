"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Spinner,
} from "@heroui/react";
import { Waves } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useWhaleTrades } from "@/hooks/use-markets";
import { formatCurrency, formatRelativeTime, truncateAddress } from "@/lib/utils";

export default function WhalesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useWhaleTrades({
    page,
    limit: 25,
    min_amount: 10000,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Waves className="w-8 h-8 text-primary" />
            Whale Tracker
          </h1>
          <p className="text-default-400">
            Monitor large trades ($10K+) across Polymarket and Kalshi in
            real-time
          </p>
        </div>

        <Chip variant="flat" color="warning" className="mb-4">
          Pro Feature — Free preview (limited to 25 entries)
        </Chip>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" label="Loading whale trades..." />
          </div>
        ) : (
          <>
            <Table
              aria-label="Whale trades"
              removeWrapper
              classNames={{
                th: "bg-default-100 text-default-500 text-xs uppercase",
                td: "py-3",
              }}
            >
              <TableHeader>
                <TableColumn>Time</TableColumn>
                <TableColumn>Trader</TableColumn>
                <TableColumn>Market</TableColumn>
                <TableColumn>Side</TableColumn>
                <TableColumn>Platform</TableColumn>
                <TableColumn align="end">Amount</TableColumn>
                <TableColumn align="end">Price</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No whale trades detected yet">
                {(data?.data ?? []).map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>
                      <span className="text-default-400 text-sm">
                        {formatRelativeTime(trade.timestamp)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {trade.trader_address
                          ? truncateAddress(trade.trader_address)
                          : "Unknown"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm line-clamp-1 max-w-[300px]">
                        {trade.market_title ?? trade.market_id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={trade.side === "buy" ? "success" : "danger"}
                      >
                        {trade.side.toUpperCase()}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          trade.platform === "polymarket"
                            ? "secondary"
                            : "primary"
                        }
                      >
                        {trade.platform === "polymarket" ? "PM" : "Kalshi"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatCurrency(trade.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-default-400">
                        {(trade.price * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {data && data.total_pages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  total={data.total_pages}
                  page={page}
                  onChange={setPage}
                  showControls
                  color="primary"
                />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
