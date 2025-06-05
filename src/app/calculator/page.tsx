"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calculator, ArrowUp, ArrowDown } from "lucide-react";
import { PublicKey } from "@solana/web3.js";

interface TradeHistory {
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: Date;
}

interface WalletData {
  balance: number;
  firstSeen: Date | null;
  isValid: boolean;
  traderStatus: string;
  trades: TradeHistory[];
  totalVolume: number;
}

// Helper function to determine trader status
const getTraderStatus = (balance: number): string => {
  if (balance >= 1000000) return "🐋 Whale";
  if (balance >= 500000) return "🦈 Shark";
  if (balance >= 100000) return "🐬 Dolphin";
  if (balance >= 10000) return "🦐 Shrimp";
  return "🐟 Fish";
};

export default function CalculatorPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    firstSeen: null,
    isValid: false,
    traderStatus: "",
    trades: [],
    totalVolume: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rewards, setRewards] = useState<number | null>(null);

  // Validate Solana address
  const validateSolanaAddress = (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  // Calculate rewards based on balance and time
  const calculateRewards = (balance: number, firstSeen: Date) => {
    const now = new Date();
    const holdingDays = (now.getTime() - firstSeen.getTime()) / (1000 * 60 * 60 * 24);
    
    // Base multiplier
    const BASE_MULTIPLIER = 1.0;
    const DAILY_BONUS = 0.014285714; // 0.1 per week
    const MAX_TIME_MULTIPLIER = 2.5;
    
    // Calculate time multiplier
    const timeBonus = Math.min(holdingDays * DAILY_BONUS, MAX_TIME_MULTIPLIER - BASE_MULTIPLIER);
    const timeMultiplier = BASE_MULTIPLIER + timeBonus;
    
    // Calculate market multiplier (simplified for now)
    const MARKET_BONUS = 1.5;
    const marketMultiplier = BASE_MULTIPLIER * (1 + (balance / 1000000) * MARKET_BONUS);
    
    // Calculate final reward in SOL (example conversion rate)
    const TIMER_TO_SOL_RATE = 0.00001; // Example rate
    return (balance * timeMultiplier * marketMultiplier) * TIMER_TO_SOL_RATE;
  };

  // Fetch wallet data
  const fetchWalletData = async (address: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Here we would integrate with Pump.fun API
      // For now using mock data
      const mockTrades: TradeHistory[] = [
        {
          type: 'buy',
          amount: 50000,
          price: 0.00001,
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          type: 'buy',
          amount: 50000,
          price: 0.000012,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          type: 'sell',
          amount: 10000,
          price: 0.000015,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ];

      const mockData = {
        balance: 100000,
        firstSeen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        trades: mockTrades,
        totalVolume: mockTrades.reduce((acc, trade) => acc + (trade.amount * trade.price), 0)
      };
      
      setWalletData({
        ...mockData,
        isValid: true,
        traderStatus: getTraderStatus(mockData.balance)
      });
      
      // Calculate rewards
      const calculatedRewards = calculateRewards(mockData.balance, mockData.firstSeen);
      setRewards(calculatedRewards);
      
    } catch (err) {
      setError("Failed to fetch wallet data");
      setWalletData({
        balance: 0,
        firstSeen: null,
        isValid: false,
        traderStatus: "",
        trades: [],
        totalVolume: 0
      });
      setRewards(null);
    }
    
    setIsLoading(false);
  };

  // Handle address input
  const handleAddressChange = (address: string) => {
    setWalletAddress(address);
    const isValid = validateSolanaAddress(address);
    
    if (isValid) {
      fetchWalletData(address);
    } else {
      setWalletData({
        balance: 0,
        firstSeen: null,
        isValid: false,
        traderStatus: "",
        trades: [],
        totalVolume: 0
      });
      setRewards(null);
      if (address) {
        setError("Invalid Solana address");
      } else {
        setError("");
      }
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
              
              <p className="text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed font-medium">
                Check your potential SOL rewards by entering your Solana wallet address.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow" />
              
              <div className="relative z-10">
                {/* Wallet Input */}
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      placeholder="Enter your Solana wallet address"
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#14F195]/50 font-mono text-sm"
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 text-red-500 text-sm">
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Results */}
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14F195] mx-auto"></div>
                    </div>
                  ) : walletData.isValid && walletData.firstSeen ? (
                    <div className="space-y-6 mt-8">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <h3 className="text-[#14F195] font-semibold mb-1">$TIMER Balance</h3>
                          <p className="text-2xl font-mono">{walletData.balance.toLocaleString()}</p>
                          <p className="text-sm font-mono text-white/50 mt-1">{walletData.traderStatus}</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <h3 className="text-[#14F195] font-semibold mb-1">Holding Since</h3>
                          <p className="text-xl font-mono">
                            {walletData.firstSeen?.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })}
                          </p>
                          <p className="text-lg font-mono text-white/70">
                            {walletData.firstSeen?.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            })}
                          </p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <h3 className="text-[#14F195] font-semibold mb-1">Total Volume</h3>
                          <p className="text-2xl font-mono">
                            {walletData.totalVolume.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })} SOL
                          </p>
                        </div>
                      </div>

                      {rewards !== null && (
                        <div className="bg-[#14F195]/10 rounded-lg p-6 border border-[#14F195]/20">
                          <h3 className="text-[#14F195] font-semibold mb-2">Estimated SOL Rewards</h3>
                          <p className="text-4xl font-mono font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                            {rewards.toLocaleString(undefined, {
                              minimumFractionDigits: 4,
                              maximumFractionDigits: 4
                            })} SOL
                          </p>
                          <p className="text-white/50 text-sm mt-2">
                            Based on current $TIMER balance and holding period
                          </p>
                        </div>
                      )}

                      {/* Trading History */}
                      <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                        <h3 className="text-[#14F195] font-semibold mb-4">Trading History</h3>
                        <div className="space-y-2">
                          {walletData.trades.map((trade, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {trade.type === 'buy' ? (
                                  <ArrowUp className="w-4 h-4 text-green-400" />
                                ) : (
                                  <ArrowDown className="w-4 h-4 text-red-400" />
                                )}
                                <span className="font-mono">
                                  {trade.amount.toLocaleString()} $TIMER
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-mono text-white/70">
                                  {trade.price.toFixed(8)} SOL
                                </span>
                                <span className="text-sm text-white/50">
                                  {trade.timestamp.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 