"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRightCircle, Calculator } from 'lucide-react';

interface FloatingFormula {
  id: string;
  value: string;
  left: string;
  top: string;
  delay: string;
  color: string;
  size: string;
  opacity: number;
}

export default function DoTheMath() {
  const [floatingFormulas, setFloatingFormulas] = useState<FloatingFormula[]>([]);

  // Generate random mathematical formula
  const generateRandomFormula = () => {
    const formulas = [
      "E = mc²",
      "∑(n²) = n(n+1)(2n+1)/6",
      "∫f(x)dx = F(x) + C",
      "π = 3.14159265359",
      "(x + y)² = x² + 2xy + y²",
      "y = mx + b",
      "a² + b² = c²",
      "∞ → ∞",
      "δy/δx = f'(x)",
      "f'(x) = lim[h→0] [f(x+h) - f(x)]/h",
      "∮ E·dl = -dΦB/dt",
      "∇ × B = μ₀J + μ₀ε₀∂E/∂t",
      "eiπ + 1 = 0",
      "P(A|B) = P(B|A)P(A)/P(B)",
      "F = G(m₁m₂)/r²",
      "∇ · E = ρ/ε₀",
      "dS ≥ 0",
      "ψ(x,t) = Ae^(i(kx-ωt))",
      "∫e^x dx = e^x + C",
      "sin²θ + cos²θ = 1",
      "∇²ψ + (2m/ℏ²)(E-V)ψ = 0",
      "ds² = gμνdxᵘdxᵛ",
      "R_μν - (R/2)g_μν = 8πGT_μν",
      "[x,p] = iℏ",
      "∂ψ/∂t = -(iℏ/2m)∇²ψ",
      "S = k_B ln(W)",
      "F = ma",
      "E = hf",
      "PV = nRT",
      "dQ = TdS"
    ];
    return formulas[Math.floor(Math.random() * formulas.length)];
  };

  useEffect(() => {
    // Generate floating formulas periodically
    const generateFormula = () => {
      const newFormula = {
        id: `${Date.now()}-${Math.random()}`,
        value: generateRandomFormula(),
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 90 + 5}%`,
        delay: `${Math.random() * 1}s`,
        color: Math.random() > 0.5 ? '#9945FF' : '#14F195',
        size: `${Math.random() * 0.5 + 0.8}rem`,
        opacity: Math.random() * 0.3 + 0.1
      };

      setFloatingFormulas(prev => [...prev, newFormula]);

      setTimeout(() => {
        setFloatingFormulas(prev => prev.filter(formula => formula.id !== newFormula.id));
      }, 4000);
    };

    // Generate formulas more frequently
    const interval = setInterval(generateFormula, 800);

    // Initial set of formulas
    for (let i = 0; i < 15; i++) {
      generateFormula();
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/20 via-purple-900/10 to-[#14F195]/20 animate-gradient-slow" />
      
      {/* Content wrapper with floating formulas */}
      <div className="relative z-10">
        {/* Floating Formulas */}
        {floatingFormulas.map((formula) => (
          <div
            key={formula.id}
            className="absolute animate-float-formula font-sophie"
            style={{
              left: formula.left,
              top: formula.top,
              animationDelay: formula.delay,
              color: formula.color,
              opacity: formula.opacity,
              fontSize: formula.size
            }}
          >
            {formula.value}
          </div>
        ))}

        {/* Hero Section */}
        <div className="pt-20 px-6">
          <div className="max-w-5xl mx-auto text-center space-y-8">
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
                    Do the math...
                  </span>
                </span>
              </h1>
              
              <p className="text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-medium">
                Discover how our unique reward system multiplies your earnings over time.
              </p>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 relative">
              {/* Market Cap Multiplier Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300 flex flex-col min-h-[420px]">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#14F195]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#14F195] transform -rotate-12">
                  <Calculator className="w-8 h-8 text-[#14F195]" />
                </div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#9945FF]/5 rounded-full flex items-center justify-center transform rotate-12 group-hover:rotate-6 transition-transform">
                  <Image
                    src="/solana.png"
                    alt="Solana"
                    width={48}
                    height={48}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold mb-6 text-[#14F195] mt-8">Market Cap Multipliers</h2>
                  <div className="space-y-4 mb-auto">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <h3 className="text-lg font-semibold text-[#14F195] mb-2">Reward Calculation</h3>
                      <pre className="text-sm font-mono bg-black/50 p-3 rounded overflow-x-auto">
{`function calculateMarketMultiplier(
  tokenBalance: number,
  totalSupply: number
): number {
  // Calculate holder's share of total supply
  const sharePercentage = 
    tokenBalance / totalSupply;
  
  // Apply multiplier based on holding size
  return BASE_MULTIPLIER * 
    (1 + (sharePercentage * MARKET_BONUS));
}`}
                      </pre>
                      <p className="text-white/70 mt-3 text-sm">
                        Your rewards increase based on your share of the total token supply.
                      </p>
                    </div>
                    <div className="bg-[#14F195]/10 rounded-lg p-4 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-2">Distribution Details</h3>
                      <ul className="list-disc list-inside text-white/70 space-y-2 text-sm">
                        <li>Pump.fun token tracking</li>
                        <li>30-minute reward cycles</li>
                        <li>Automatic balance checks</li>
                        <li>Real-time multiplier updates</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <a 
                      href="https://pump.fun"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-900/40 hover:bg-purple-900/60 text-white/70 hover:text-white/90 px-4 py-2 rounded-lg text-sm transition-all flex items-center group font-sophie border-2 border-white/10 hover:border-white/20"
                    >
                      View on Pump.fun
                      <ArrowRightCircle className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Time Multiplier Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300 flex flex-col min-h-[420px]">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#14F195]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#14F195] transform -rotate-12">
                  <Image
                    src="/clock.gif"
                    alt="Timer"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#9945FF]/5 rounded-full flex items-center justify-center transform rotate-12 group-hover:rotate-6 transition-transform">
                  <Image
                    src="/solana.png"
                    alt="Solana"
                    width={48}
                    height={48}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold mb-6 text-[#14F195] mt-8">Time Multipliers</h2>
                  <div className="space-y-4 mb-auto">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <h3 className="text-lg font-semibold text-[#14F195] mb-2">Time-Based Rewards</h3>
                      <pre className="text-sm font-mono bg-black/50 p-3 rounded overflow-x-auto">
{`function calculateTimeMultiplier(
  firstSeen: Date,
  currentTime: Date
): number {
  const holdingDays = 
    (currentTime - firstSeen) / (1000 * 60 * 60 * 24);
  
  // Increase multiplier based on holding time
  const timeBonus = Math.min(
    holdingDays * DAILY_BONUS,
    MAX_TIME_MULTIPLIER
  );
  
  return BASE_MULTIPLIER + timeBonus;
}`}
                      </pre>
                      <p className="text-white/70 mt-3 text-sm">
                        Diamond hands get rewarded - hold longer, earn more.
                      </p>
                    </div>
                    <div className="bg-[#14F195]/10 rounded-lg p-4 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-2">Reward Schedule</h3>
                      <ul className="list-disc list-inside text-white/70 space-y-2 text-sm">
                        <li>Base multiplier: 1.0x</li>
                        <li>+0.1x per week held</li>
                        <li>Maximum bonus: 2.5x</li>
                        <li>Continuous tracking</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <a 
                      href="#calculator"
                      className="bg-purple-900/40 hover:bg-purple-900/60 text-white/70 hover:text-white/90 px-4 py-2 rounded-lg text-sm transition-all flex items-center group font-sophie border-2 border-white/10 hover:border-white/20"
                    >
                      Calculate Rewards
                      <ArrowRightCircle className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution System Card */}
            <div className="mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-6 text-[#14F195]">Automated Distribution System</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                        <h3 className="text-lg font-semibold text-[#14F195] mb-2">Distribution Process</h3>
                        <pre className="text-sm font-mono bg-black/50 p-3 rounded overflow-x-auto">
{`async function processRewards() {
  // Get all token holders from Pump.fun
  const holders = await fetchPumpHolders();
  const rewardPool = await getRewardPool();

  for (const holder of holders) {
    // Calculate time & market multipliers
    const timeMultiplier = 
      calculateTimeMultiplier(
        holder.firstSeen,
        new Date()
      );
    
    const marketMultiplier = 
      calculateMarketMultiplier(
        holder.balance,
        holder.totalSupply
      );
    
    // Calculate final reward
    const reward = 
      holder.balance * 
      timeMultiplier * 
      marketMultiplier;
    
    // Queue reward for distribution
    await queueReward(holder.address, reward);
  }
}`}
                        </pre>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-[#14F195]/10 rounded-lg p-4 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-2">System Features</h3>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                          <li>Pump.fun API integration</li>
                          <li>30-minute distribution cycles</li>
                          <li>Automatic balance tracking</li>
                          <li>Holding time calculation</li>
                          <li>Reward pool management</li>
                          <li>Transaction verification</li>
                        </ul>
                      </div>
                      <div className="bg-[#14F195]/10 rounded-lg p-4 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-2">Technical Stack</h3>
                        <ul className="list-disc list-inside text-white/70 space-y-2">
                          <li>Pump.fun token tracking</li>
                          <li>Node.js distribution system</li>
                          <li>Redis for holder data</li>
                          <li>Automated SOL transfers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 