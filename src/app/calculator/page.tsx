"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import WalletAnalyzer from "@/components/WalletAnalyzer";

export default function CalculatorPage() {
  const [walletAddress, setWalletAddress] = useState("");

  // Handle address input
  const handleAddressChange = (address: string) => {
    setWalletAddress(address);
    
    try {
      if (address) {
        new PublicKey(address);
      }
    } catch (error) {
      // setError("Invalid Solana address");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/20 via-purple-900/10 to-[#14F195]/20 animate-gradient-slow" />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="pt-20 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-[-30%] bg-gradient-to-r from-[#9945FF]/40 via-purple-500/20 to-[#14F195]/40 rounded-full blur-2xl animate-pulse" />
              <Image
                src="/clock.gif"
                alt="Timer"
                width={128}
                height={128}
                className="relative rounded-full"
              />
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl font-bold tracking-tight relative">
                <span className="relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20 blur-lg opacity-30" />
                  <span className="relative bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                    Reward Calculator
                  </span>
                </span>
              </h1>
              
              <p className="text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Calculate your potential SOL rewards based on your holding patterns and market impact.
              </p>
            </div>

            {/* Wallet Input */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="Enter your Solana wallet address"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#14F195]/50 font-mono text-sm"
                />
                {/* {error && (
                  <p className="absolute -bottom-6 left-0 text-red-500 text-sm">
                    {error}
                  </p>
                )} */}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {/* {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14F195]"></div>
          </div>
        ) : analysis && rewards ? ( */}
          <div className="px-6 py-12">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Tier Badge */}
              <div className="flex justify-center">
                <div 
                  className="inline-flex items-center px-4 py-2 rounded-full border"
                  style={{ 
                    borderColor: rewards.tier.color,
                    backgroundColor: `${rewards.tier.color}10`
                  }}
                >
                  <span className="text-lg font-semibold" style={{ color: rewards.tier.color }}>
                    {rewards.tier.name} Tier
                  </span>
                </div>
              </div>

              {/* Reward Cards */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Base Stats */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-[#14F195] font-semibold mb-4">Base Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Balance</span>
                      <span className="font-mono">{analysis.timerBalance.toLocaleString()} $TIMER</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Volume</span>
                      <span className="font-mono">{analysis.totalVolume.toFixed(2)} SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Holding Score</span>
                      <span className="font-mono">{analysis.holdingScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* Multipliers */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-[#14F195] font-semibold mb-4">Multipliers</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Time</span>
                      <span className="font-mono">{rewards.timeMultiplier.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Market</span>
                      <span className="font-mono">{rewards.marketMultiplier.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Holding</span>
                      <span className="font-mono">{rewards.holdingBonus.toFixed(2)}x</span>
                    </div>
                  </div>
                </div>

                {/* Trade History */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-[#14F195] font-semibold mb-4">Recent Trades</h3>
                  <div className="space-y-2 max-h-[120px] overflow-y-auto">
                    {analysis.trades.slice(0, 5).map((trade, index) => (
                      <div key={index} className="flex items-center justify-between">
                        {trade.type === 'buy' ? (
                          <ArrowUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className="font-mono text-sm">
                          {trade.amount.toLocaleString()} $TIMER
                        </span>
                        <span className="text-white/50 text-sm">
                          {trade.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projected Rewards */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-[#14F195] font-semibold mb-4">Projected Rewards</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Daily</span>
                      <span className="font-mono">{rewards.projectedDaily.toFixed(4)} SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Weekly</span>
                      <span className="font-mono">{rewards.projectedWeekly.toFixed(4)} SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Monthly</span>
                      <span className="font-mono">{rewards.projectedMonthly.toFixed(4)} SOL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-[#14F195] font-semibold mb-4">Holding Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70">First Seen</span>
                        <span className="font-mono">
                          {analysis.firstSeen.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70">Average Holding Time</span>
                        <span className="font-mono">
                          {Math.round(analysis.averageHoldingTime / (24 * 60 * 60 * 1000))} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Last Active</span>
                        <span className="font-mono">
                          {analysis.lastActive.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-[#14F195] font-semibold mb-4">Reward Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70">Base Reward</span>
                        <span className="font-mono">{rewards.baseReward.toFixed(6)} SOL</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70">Tier Multiplier</span>
                        <span className="font-mono">{rewards.tier.multiplier.toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Total Per Distribution</span>
                        <span className="font-mono">{rewards.totalReward.toFixed(6)} SOL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* ) : null} */}

        {walletAddress && !error && (
          <WalletAnalyzer address={walletAddress} />
        )}
      </div>
    </div>
  );
} 