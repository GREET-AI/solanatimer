"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import WalletAnalyzer from "@/components/WalletAnalyzer";
import { TIMER_MINT } from '@/constants/timer';

const FEE_PERCENT = 0.0005; // 0.05%
const REWARD_SHARE = 1.0; // 100%
const REWARD_CYCLE_MINUTES = 30;

const TOKEN_MULTIPLIERS = [
  { min: 5_000_001, mult: 3 },
  { min: 1_000_001, mult: 2 },
  { min: 500_001, mult: 1.5 },
  { min: 100_000, mult: 1 },
];
const TIME_MULTIPLIERS = [
  { min: 24 * 60 + 1, mult: 2 },
  { min: 3 * 60 + 1, mult: 1.5 },
  { min: 60 + 1, mult: 1.2 },
  { min: 30, mult: 1 },
];

const TIER_NAMES = [
  { min: 5_000_001, name: "Whale" },
  { min: 1_000_001, name: "Dolphin" },
  { min: 500_001, name: "Crab" },
  { min: 100_000, name: "Fish" },
  { min: 0, name: "Shrimp" },
];

function getTokenMultiplier(tokens: number) {
  for (const t of TOKEN_MULTIPLIERS) if (tokens >= t.min) return t.mult;
  return 0;
}
function getTimeMultiplier(minutes: number) {
  for (const t of TIME_MULTIPLIERS) if (minutes >= t.min) return t.mult;
  return 0;
}
function getTierName(tokens: number) {
  for (const t of TIER_NAMES) if (tokens >= t.min) return t.name;
  return "Unknown";
}

// Typdefinitionen für Token und RewardInfo
interface TokenData {
  amount: number;
  mint: string;
  name?: string;
}
interface RewardInfo {
  tokens: number;
  holdTimeMinutes: number;
  tier: string;
  reward: number;
}

// Floating formula type
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

// Hilfsfunktion für dynamische Schrittweite
function getStep(value: number) {
  if (value < 100_000) return 1_000;
  if (value < 1_000_000) return 10_000;
  if (value < 10_000_000) return 100_000;
  return 1_000_000;
}

// SVG-Icons für die Tiers
const TIER_ICONS: Record<string, string> = {
  Whale: '/whale.svg',
  Dolphin: '/dolphin.svg',
  Crab: '/crab.svg',
  Fish: '/fish.svg',
  Shrimp: '/shrimp.svg',
};

interface AnalysisData {
  heldForMinutes: number;
  volume24h: number;
  tier: string;
  reward: number;
}

function useSolPrice() {
  const [solPrice, setSolPrice] = useState(200);
  useEffect(() => {
    let isMounted = true;
    async function fetchPrice() {
      try {
        const res = await fetch('/api/sol-price');
        const data = await res.json();
        if (isMounted && data.price) setSolPrice(Number(data.price));
      } catch {}
    }
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);
  return solPrice;
}

export default function CalculatorPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenData, setTokenData] = useState<TokenData | null>(null); // API-Daten für aktuelle Wallet
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null); // Analyse-Daten von neuer API
  const [dailyVolumeUsd, setDailyVolumeUsd] = useState<number | null>(null); // Jetzt dynamisch!
  const [error, setError] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState("TIMER");
  const [simVolume, setSimVolume] = useState(0); // Default 0 USD
  const [simHoldings, setSimHoldings] = useState(0); // Default 0 TIMER
  // Floating formulas state
  const [floatingFormulas, setFloatingFormulas] = useState<FloatingFormula[]>([]);
  const solPrice = useSolPrice();

  // Fetch token holdings for the current wallet
  useEffect(() => {
    if (!walletAddress || error) return;
    // Hole Token-Metadaten wie bisher
    fetch(`/api/wallet-tokens?address=${walletAddress}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const timerToken = (data.tokens || []).find((t: TokenData) => t.mint === TIMER_MINT);
        setTokenData(timerToken || null);
        setTokenName(timerToken?.name || "TIMER");
      })
      .catch(() => setTokenData(null));
    // Hole Analyse-Daten (Tier, Reward, Haltezeit, Volumen)
    fetch(`/api/wallet-analysis?address=${walletAddress}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setAnalysis(data);
        if (typeof data.volume24h === 'number') setDailyVolumeUsd(data.volume24h);
      })
      .catch(() => {
        setAnalysis(null);
        setDailyVolumeUsd(null);
      });
  }, [walletAddress, error]);

  // Calculate reward and tier for the current wallet
  let rewardInfo: RewardInfo | null = null;
  let rewardPerCycle = 0;
  if (tokenData && tokenData.amount && dailyVolumeUsd !== null && analysis) {
    const holdTimeMinutes = analysis.heldForMinutes ?? 0; // ECHTE Haltezeit anzeigen
    const cyclesPerDay = (24 * 60) / REWARD_CYCLE_MINUTES;
    const totalFees = dailyVolumeUsd * FEE_PERCENT;
    const rewardPoolUsd = totalFees * REWARD_SHARE;
    const rewardPoolSol = rewardPoolUsd / solPrice / cyclesPerDay;
    const tokens = tokenData.amount;
    const tokenMult = getTokenMultiplier(tokens);
    // Reward per cycle immer so, als hätte man mindestens 30 Minuten gehalten (timeMult = 1)
    const timeMult = 1;
    rewardPerCycle = rewardPoolSol * tokenMult * timeMult;
    rewardInfo = {
      tokens,
      holdTimeMinutes,
      tier: getTierName(tokens),
      reward: Number(rewardPerCycle.toFixed(6)),
    };
  }

  // Reward-Simulation für die Slider
  const simHoldTimeMinutes = 24 * 60; // 24h als Beispiel
  const simTokenMult = getTokenMultiplier(simHoldings);
  const simTimeMult = getTimeMultiplier(simHoldTimeMinutes);
  const cyclesPerDay = (24 * 60) / REWARD_CYCLE_MINUTES;
  const simTotalFees = simVolume * FEE_PERCENT;
  const simRewardPoolUsd = simTotalFees * REWARD_SHARE;
  const simRewardPoolSol = simRewardPoolUsd / solPrice / cyclesPerDay;
  const simRewardPerCycle = simRewardPoolSol * simTokenMult * simTimeMult;
  const simRewardDaily = simRewardPerCycle * cyclesPerDay;
  const simRewardMonthly = simRewardDaily * 30;
  const simTier = getTierName(simHoldings);

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

  // Floating formulas Effekt: nur einmal beim Mount ausführen!
  useEffect(() => {
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
      }, 3000);
    };
    const interval = setInterval(generateFormula, 400);
    for (let i = 0; i < 30; i++) {
      generateFormula();
    }
    return () => {
      clearInterval(interval);
    };
  }, []); // <--- WICHTIG: leeres Dependency-Array!

  // Error handling for address
  const handleAnalyze = () => {
    if (!walletAddress || walletAddress.length < 32) {
      setError("Please enter a valid Solana address.");
      setTokenData(null);
      setAnalysis(null);
      return;
    }
    setError(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/20 via-purple-900/10 to-[#14F195]/20 animate-gradient-slow pointer-events-none" />
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
                <span className="relative solana-gradient-text">
                  Reward Calculator
                </span>
              </span>
            </h1>
            <p className="text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Calculate your potential SOL rewards based on your holding patterns and market impact.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="relative flex gap-2">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter your Solana wallet address"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#14F195]/50 font-mono text-sm"
              />
              <button
                className="bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-400 transition"
                onClick={handleAnalyze}
              >
                Start analysis
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Übergib rewardInfo an WalletAnalyzer */}
      {walletAddress && !error && (
        <WalletAnalyzer
          address={walletAddress}
          rewardInfo={rewardInfo}
          tokenName={tokenName}
        />
      )}

      {/* Rewards Calculator Section */}
      <div className="max-w-2xl mx-auto mt-16 mb-20 bg-white/5 border border-[#14F195]/20 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-[#14F195] mb-6">Rewards Calculator</h2>
        <div className="mb-8">
          <label className="block text-white/80 mb-2 font-semibold">24h Volume (USD)</label>
          <div className="flex gap-2 items-center">
            <input
              type="range"
              min={0}
              max={200000000}
              step={getStep(simVolume)}
              value={simVolume}
              onChange={e => setSimVolume(Number(e.target.value))}
              className="w-full accent-[#14F195] h-2 rounded-lg appearance-none bg-[#14F195]/20"
            />
            <input
              type="number"
              min={0}
              max={200000000}
              step={getStep(simVolume)}
              value={simVolume}
              onChange={e => setSimVolume(Number(e.target.value))}
              className="w-32 bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-white text-right font-mono text-sm"
            />
          </div>
          <div className="flex justify-between text-xs text-white/60 mt-1">
            <span>$0</span>
            <span>${simVolume.toLocaleString()}</span>
            <span>$200M</span>
          </div>
        </div>
        <div className="mb-8">
          <label className="block text-white/80 mb-2 font-semibold">Your TIMER Holdings</label>
          <div className="flex gap-2 items-center">
            <input
              type="range"
              min={0}
              max={1000000000}
              step={getStep(simHoldings)}
              value={simHoldings}
              onChange={e => setSimHoldings(Number(e.target.value))}
              className="w-full accent-[#9945FF] h-2 rounded-lg appearance-none bg-[#9945FF]/20"
            />
            <input
              type="number"
              min={0}
              max={1000000000}
              step={getStep(simHoldings)}
              value={simHoldings}
              onChange={e => setSimHoldings(Number(e.target.value))}
              className="w-32 bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-white text-right font-mono text-sm"
            />
          </div>
          <div className="flex justify-between text-xs text-white/60 mt-1">
            <span>0</span>
            <span>{simHoldings.toLocaleString()} TIMER</span>
            <span>1B</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-black/40 border border-white/10 rounded-lg p-5 flex flex-col gap-2">
            <div className="text-white/70 text-sm">Reward per cycle (30min)</div>
            <div className="text-2xl font-bold text-[#14F195]">{simRewardPerCycle > 0 ? simRewardPerCycle.toFixed(6) : '0.000000'} SOL</div>
            <div className="text-white/70 text-sm mt-2">Daily Rewards</div>
            <div className="text-lg font-semibold text-[#14F195]">{simRewardDaily > 0 ? simRewardDaily.toFixed(4) : '0.0000'} SOL</div>
            <div className="text-white/70 text-sm mt-2">Monthly Projection</div>
            <div className="text-lg font-semibold text-[#14F195]">{simRewardMonthly > 0 ? simRewardMonthly.toFixed(2) : '0.00'} SOL</div>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-lg p-5 flex flex-col gap-2">
            <div className="text-white/70 text-sm">Tier</div>
            <div className="flex items-center gap-2">
              {TIER_ICONS[simTier] && (
                <Image src={TIER_ICONS[simTier]} alt={simTier} width={28} height={28} />
              )}
              <span className="text-xl font-bold text-[#9945FF]">{simTier}</span>
            </div>
            <div className="text-white/70 text-sm mt-2">Token Multiplier</div>
            <div className="text-lg font-semibold text-[#14F195]">{simTokenMult}x</div>
            <div className="text-white/70 text-sm mt-2">Time Multiplier (24h)</div>
            <div className="text-lg font-semibold text-[#14F195]">{simTimeMult}x</div>
          </div>
        </div>
        <div className="text-xs text-white/40 mt-6">* Calculations based on current trading volume</div>
      </div>
    </div>
  );
} 