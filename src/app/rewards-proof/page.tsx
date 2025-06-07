'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Shield } from 'lucide-react';
import Link from "next/link";
import { X } from "lucide-react";

interface RewardTx {
  hash: string;
  recipient: string;
  amount: number;
  timestamp: string;
}

const partners = [
  { name: 'Solana', url: 'https://x.com/solana', logo: '/solana.png' },
  { name: 'Jupiter', url: 'https://x.com/JupiterExchange', logo: '/jupiter.png' },
  { name: 'Pump.fun', url: 'https://x.com/pumpdotfun', logo: '/pumpfun.png' },
  { name: 'Raydium', url: 'https://x.com/RaydiumProtocol', logo: '/raydium.svg' },
  { name: 'Meteora', url: 'https://x.com/MeteoraAG', logo: '/meteora.svg' },
  { name: 'Solscan', url: 'https://x.com/solscanofficial', logo: '/solscan.svg' },
];

export default function RewardsProofPage() {
  const [transactions, setTransactions] = useState<RewardTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; color: string; size: string }>>([]);
  const [shootingStars, setShootingStars] = useState<Array<{ left: string; delay: string }>>([]);

  useEffect(() => {
    fetch('/api/rewards/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data.transactions || []))
      .finally(() => setLoading(false));
    // Partikel und Shooting Stars wie auf how-it-works
    const newParticles = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      color: Math.random() > 0.5 ? '#9945FF' : '#14F195',
      size: `${Math.random() * 3 + 2}px`
    }));
    setParticles(newParticles);
    const newShootingStars = Array.from({ length: 8 }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`
    }));
    setShootingStars(newShootingStars);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Solana gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/20 via-purple-900/10 to-[#14F195]/20 animate-gradient-slow" />
      {/* Particles & Shooting Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((particle, i) => (
          <div
            key={`particle-${i}`}
            className="absolute animate-sparkle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              width: particle.size,
              height: particle.size,
              background: particle.color,
              borderRadius: '50%',
              opacity: 0.6
            }}
          />
        ))}
        {shootingStars.map((star, i) => (
          <div
            key={`star-${i}`}
            className="absolute animate-shooting-star"
            style={{
              left: star.left,
              top: '-2px',
              animationDelay: star.delay,
              width: '2px',
              height: '2px',
              background: 'linear-gradient(90deg, #9945FF, transparent)',
              borderRadius: '50%',
              boxShadow: '0 0 0 1px #9945FF44'
            }}
          />
        ))}
      </div>
      <div className="relative z-10 max-w-3xl mx-auto pt-16 pb-8 px-4">
        {/* Logo und Headline */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/clock.gif" alt="Solana Timer" width={80} height={80} className="mb-4 rounded-full shadow-lg" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#14F195] mb-2 flex items-center gap-2"><Shield className="w-7 h-7 text-[#14F195]" />Reward Distribution Proof</h1>
          <p className="text-white/80 text-base md:text-lg text-center max-w-xl mb-2">All reward payouts are transparent, verifiable and secured on-chain. Trust is our foundation: every distribution is logged and auditable for your peace of mind.</p>
        </div>
        {/* Partner Card */}
        <div className="bg-white/10 border border-[#9945FF]/20 rounded-lg p-5 mb-10 flex flex-col items-center">
          <h2 className="text-lg font-bold text-[#9945FF] mb-3">Official Partners</h2>
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {partners.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group hover:scale-105 transition-transform">
                <Image src={p.logo} alt={p.name} width={40} height={40} className="rounded-full mb-1 shadow-md group-hover:shadow-[#9945FF]" />
                <span className="text-xs text-white/80 group-hover:text-[#14F195] font-semibold">{p.name}</span>
              </a>
            ))}
          </div>
        </div>
        {/* Tabelle */}
        <div className="bg-white/10 rounded-lg p-6 border border-[#14F195]/30 shadow-lg">
          <h2 className="text-lg font-bold mb-6 text-[#14F195]">Latest Reward Transactions</h2>
          {loading ? (
            <div className="text-white/70">Loading...</div>
          ) : (
            <table className="w-full text-sm text-white/80">
              <thead>
                <tr className="border-b border-[#14F195]/20">
                  <th className="py-2 text-left">Tx Hash</th>
                  <th className="py-2 text-left">Recipient</th>
                  <th className="py-2 text-right">Amount (SOL)</th>
                  <th className="py-2 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.hash} className="border-b border-white/10 hover:bg-[#14F195]/5 transition">
                    <td className="py-2 font-mono text-xs">{tx.hash}</td>
                    <td className="py-2 font-mono text-xs">{tx.recipient}</td>
                    <td className="py-2 text-right font-bold text-[#14F195]">{tx.amount.toFixed(3)}</td>
                    <td className="py-2 text-right font-mono text-xs">{new Date(tx.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Floating Back Button unten rechts */}
      <Link href="/" prefetch={false}>
        <button
          className="fixed z-50 bottom-6 right-6 bg-gradient-to-br from-[#9945FF] to-[#14F195] shadow-xl rounded-full w-16 h-16 flex items-center justify-center animate-bounce hover:scale-110 transition-transform duration-200 border-4 border-black/40 hover:border-[#9945FF]"
          aria-label="Back to Main"
          style={{ boxShadow: "0 4px 32px 0 #9945FF55" }}
        >
          <X className="w-8 h-8 text-white drop-shadow-lg" />
        </button>
      </Link>
    </div>
  );
} 