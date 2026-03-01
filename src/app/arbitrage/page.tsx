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
  Card,
  CardBody,
} from "@heroui/react";
import { ArrowLeftRight, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useArbitrage } from "@/hooks/use-markets";
import { formatPercent, formatRelativeTime } from "@/lib/utils";

export default function ArbitragePage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useArbitrage({
    page,
    limit: 25,
    min_spread: 0.01,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <ArrowLeftRight className="w-8 h-8 text-warning" />
            Arbitrage Scanner
          </h1>
          <p className="text-default-400">
            Cross-platform price differences between Polymarket and Kalshi on
            the same events
          </p>
        </div>

        <Card className="bg-warning/5 border border-warning/20 mb-6">
          <CardBody className="flex flex-row items-center gap-3">
            <Zap className="w-5 h-5 text-warning shrink-0" />
            <div>
              <p className="text-sm font-medium">How it works</p>
              <p className="text-xs text-default-400">
                When the same event trades at different prices on Polymarket vs
                Kalshi, there may be an arbitrage opportunity. Buy low on one
                platform, sell high on the other.
              </p>
            </div>
          </CardBody>
        </Card>

        <Chip variant="flat" color="warning" className="mb-4">
          Pro Feature — Free preview (top opportunities only)
        </Chip>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" label="Scanning for arbitrage..." />
          </div>
        ) : (
          <>
            <Table
              aria-label="Arbitrage opportunities"
              removeWrapper
              classNames={{
                th: "bg-default-100 text-default-500 text-xs uppercase",
                td: "py-3",
              }}
            >
              <TableHeader>
                <TableColumn>Event</TableColumn>
                <TableColumn>Outcome</TableColumn>
                <TableColumn align="center">Polymarket</TableColumn>
                <TableColumn align="center">Kalshi</TableColumn>
                <TableColumn align="end">Spread</TableColumn>
                <TableColumn>Detected</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No arbitrage opportunities found">
                {(data?.data ?? []).map((arb) => (
                  <TableRow key={arb.id}>
                    <TableCell>
                      <span className="text-sm line-clamp-1 max-w-[250px]">
                        {arb.market_a.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{arb.outcome}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <Chip size="sm" variant="flat" color="secondary">
                          {formatPercent(
                            arb.market_a.platform === "polymarket"
                              ? arb.price_a
                              : arb.price_b
                          )}
                        </Chip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <Chip size="sm" variant="flat" color="primary">
                          {formatPercent(
                            arb.market_b.platform === "kalshi"
                              ? arb.price_b
                              : arb.price_a
                          )}
                        </Chip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-bold ${
                          arb.spread >= 0.05
                            ? "text-success"
                            : arb.spread >= 0.02
                            ? "text-warning"
                            : "text-default-400"
                        }`}
                      >
                        {formatPercent(arb.spread)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-default-400">
                        {formatRelativeTime(arb.detected_at)}
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
