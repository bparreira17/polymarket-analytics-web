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
  ButtonGroup,
  Button,
  Spinner,
} from "@heroui/react";
import { Trophy } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLeaderboard } from "@/hooks/use-markets";
import { formatCurrency, formatPercent, truncateAddress } from "@/lib/utils";
import type { Platform } from "@/types";

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const [platform, setPlatform] = useState<Platform | "all">("all");

  const { data, isLoading } = useLeaderboard({
    page,
    limit: 25,
    platform: platform === "all" ? undefined : platform,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Trophy className="w-8 h-8 text-warning" />
              Leaderboard
            </h1>
            <p className="text-default-400">
              Top traders ranked by profit across prediction markets
            </p>
          </div>
          <ButtonGroup size="sm" variant="flat">
            <Button
              color={platform === "all" ? "primary" : "default"}
              onPress={() => { setPlatform("all"); setPage(1); }}
            >
              All
            </Button>
            <Button
              color={platform === "polymarket" ? "primary" : "default"}
              onPress={() => { setPlatform("polymarket"); setPage(1); }}
            >
              Polymarket
            </Button>
            <Button
              color={platform === "kalshi" ? "primary" : "default"}
              onPress={() => { setPlatform("kalshi"); setPage(1); }}
            >
              Kalshi
            </Button>
          </ButtonGroup>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" label="Loading leaderboard..." />
          </div>
        ) : (
          <>
            <Table
              aria-label="Leaderboard"
              removeWrapper
              classNames={{
                th: "bg-default-100 text-default-500 text-xs uppercase",
                td: "py-3",
              }}
            >
              <TableHeader>
                <TableColumn>Rank</TableColumn>
                <TableColumn>Trader</TableColumn>
                <TableColumn>Platform</TableColumn>
                <TableColumn align="end">P&L</TableColumn>
                <TableColumn align="end">Volume</TableColumn>
                <TableColumn align="end">Trades</TableColumn>
                <TableColumn align="end">Win Rate</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No data available">
                {(data?.data ?? []).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <span className="font-bold text-default-400">
                        #{entry.rank}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {entry.display_name ||
                          truncateAddress(entry.trader_address)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          entry.platform === "polymarket"
                            ? "secondary"
                            : "primary"
                        }
                      >
                        {entry.platform === "polymarket" ? "PM" : "Kalshi"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          entry.profit_loss >= 0 ? "text-success" : "text-danger"
                        }`}
                      >
                        {entry.profit_loss >= 0 ? "+" : ""}
                        {formatCurrency(entry.profit_loss)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-default-400">
                        {formatCurrency(entry.volume)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-default-400">
                        {entry.num_trades.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-default-400">
                        {entry.win_rate != null
                          ? formatPercent(entry.win_rate)
                          : "--"}
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
