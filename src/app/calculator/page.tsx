"use client";

import { useState } from "react";
import Image from "next/image";
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
    } catch {}
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
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
            </div>
          </div>
        </div>
      </div>

      {walletAddress && (
        <WalletAnalyzer address={walletAddress} />
      )}
    </div>
  );
} 