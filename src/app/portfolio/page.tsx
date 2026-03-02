"use client";

import { useState } from "react";
import { Spinner, Button, Input } from "@heroui/react";
import { Wallet, TrendingUp, TrendingDown, Unplug } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { usePortfolio, useConnectWallet, useDisconnectWallet } from "@/hooks/use-portfolio";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import Link from "next/link";

export default function PortfolioPage() {
  const { isSignedIn } = useAuth();
  const { data, isLoading } = usePortfolio();
  const connectWallet = useConnectWallet();
  const disconnectWallet = useDisconnectWallet();
  const [walletInput, setWalletInput] = useState("");

  if (!isSignedIn) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Wallet className="w-10 h-10 text-white/10" />
        <p className="text-white/40 text-sm">Sign in to track your portfolio</p>
        <Link
          href="/sign-in"
          className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const portfolios = data?.portfolios ?? [];
  const positions = data?.positions ?? [];
  const summary = data?.summary ?? { totalValue: "0", unrealizedPnl: "0", positionCount: 0 };
  const pnl = parseFloat(summary.unrealizedPnl);

  return (
    <div className="h-full overflow-y-auto p-4">
      <h1 className="text-base font-bold tracking-tight mb-4">Portfolio</h1>

      {/* Connect wallet section */}
      {portfolios.length === 0 ? (
        <div className="panel p-6 mb-4">
          <div className="flex flex-col items-center gap-4">
            <Wallet className="w-8 h-8 text-white/10" />
            <div className="text-center">
              <p className="text-sm font-medium mb-1">Connect your wallet</p>
              <p className="text-[11px] text-white/40">
                Enter your Polymarket wallet address to track positions and P&L
              </p>
            </div>
            <div className="flex gap-2 w-full max-w-md">
              <Input
                placeholder="0x..."
                value={walletInput}
                onValueChange={setWalletInput}
                size="sm"
                classNames={{
                  input: "text-xs font-mono",
                  inputWrapper: "bg-white/[0.04] border border-white/[0.06]",
                }}
              />
              <Button
                size="sm"
                isLoading={connectWallet.isPending}
                onPress={() => {
                  if (walletInput.length >= 10) {
                    connectWallet.mutate({ walletAddress: walletInput });
                    setWalletInput("");
                  }
                }}
                className="bg-amber-400/10 text-amber-400 font-semibold text-xs shrink-0"
              >
                Connect
              </Button>
            </div>
            <p className="text-[10px] text-white/20">Pro plan required</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary strip */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="panel p-3">
              <p className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Portfolio Value</p>
              <p className="text-lg font-bold font-mono tabnum">{formatCurrency(summary.totalValue)}</p>
            </div>
            <div className="panel p-3">
              <p className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Unrealized P&L</p>
              <p className={cn(
                "text-lg font-bold font-mono tabnum",
                pnl >= 0 ? "text-emerald-400" : "text-red-400",
              )}>
                {pnl >= 0 ? "+" : ""}{formatCurrency(summary.unrealizedPnl)}
              </p>
            </div>
            <div className="panel p-3">
              <p className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Positions</p>
              <p className="text-lg font-bold font-mono tabnum">{summary.positionCount}</p>
            </div>
          </div>

          {/* Connected wallets */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Wallets</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {portfolios.map((p) => (
                <div key={p.id} className="panel px-3 py-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/60">
                    {p.walletAddress.slice(0, 6)}...{p.walletAddress.slice(-4)}
                  </span>
                  <button
                    onClick={() => disconnectWallet.mutate(p.id)}
                    className="text-white/20 hover:text-red-400 transition-colors"
                    title="Disconnect"
                  >
                    <Unplug className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add another wallet..."
                  value={walletInput}
                  onValueChange={setWalletInput}
                  size="sm"
                  classNames={{
                    base: "w-48",
                    input: "text-[10px] font-mono",
                    inputWrapper: "bg-white/[0.02] border border-white/[0.04] h-7 min-h-7",
                  }}
                />
                <Button
                  size="sm"
                  isLoading={connectWallet.isPending}
                  onPress={() => {
                    if (walletInput.length >= 10) {
                      connectWallet.mutate({ walletAddress: walletInput });
                      setWalletInput("");
                    }
                  }}
                  className="bg-white/[0.04] text-white/60 text-[10px] h-7 min-w-0 px-3"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Positions table */}
          <div className="panel overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/[0.04]">
              <h2 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Positions</h2>
            </div>
            {positions.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[11px] text-white/30">No positions found. Positions sync every 5 minutes.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      {["Market", "Outcome", "Shares", "Avg Price", "Current", "P&L"].map((h) => (
                        <th key={h} className="text-left text-[9px] font-semibold text-white/30 uppercase tracking-wider px-4 py-2">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos) => {
                      const positionPnl = parseFloat(pos.unrealizedPnl);
                      return (
                        <tr key={pos.id} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                          <td className="px-4 py-2">
                            <Link href={`/markets/${pos.marketId}`} className="text-[11px] font-medium hover:text-amber-400 transition-colors line-clamp-1">
                              {pos.marketTitle}
                            </Link>
                          </td>
                          <td className="px-4 py-2 text-[11px] text-white/60">{pos.outcome}</td>
                          <td className="px-4 py-2 text-[11px] font-mono tabnum">{parseFloat(pos.shares).toFixed(2)}</td>
                          <td className="px-4 py-2 text-[11px] font-mono tabnum">{formatPercent(parseFloat(pos.avgPrice))}</td>
                          <td className="px-4 py-2 text-[11px] font-mono tabnum">{formatPercent(parseFloat(pos.currentPrice))}</td>
                          <td className={cn(
                            "px-4 py-2 text-[11px] font-mono tabnum font-medium",
                            positionPnl >= 0 ? "text-emerald-400" : "text-red-400",
                          )}>
                            <span className="flex items-center gap-1">
                              {positionPnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {positionPnl >= 0 ? "+" : ""}{formatCurrency(pos.unrealizedPnl)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
