"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRightCircle, Shield } from 'lucide-react';

interface FloatingNumber {
  id: number;
  value: string;
  left: string;
  top: string;
  delay: string;
  color: string;
}

interface FloatingLogo {
  id: number;
  left: string;
  top: string;
  delay: string;
  scale: string;
  opacity: string;
}

// 1. SVG-Icons für Tiers jetzt als Image-Komponenten
const ShrimpIcon = () => (
  <Image src="/shrimp.svg" alt="Shrimp" width={24} height={24} className="inline-block align-middle" />
);
const FishIcon = () => (
  <Image src="/fish.svg" alt="Fish" width={24} height={24} className="inline-block align-middle" />
);
const CrabIcon = () => (
  <Image src="/crab.svg" alt="Crab" width={24} height={24} className="inline-block align-middle" />
);
const DolphinIcon = () => (
  <Image src="/dolphin.svg" alt="Dolphin" width={24} height={24} className="inline-block align-middle" />
);
const WhaleIcon = () => (
  <Image src="/whale.svg" alt="Whale" width={24} height={24} className="inline-block align-middle" />
);
const TimeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#14F195" strokeWidth="2" /><path d="M12 7v5l3 2" stroke="#14F195" strokeWidth="2" strokeLinecap="round" /></svg>
);

export default function HowItWorks() {
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; color: string; size: string }>>([]);
  const [shootingStars, setShootingStars] = useState<Array<{ left: string; delay: string }>>([]);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [floatingLogos, setFloatingLogos] = useState<FloatingLogo[]>([]);

  // Generate random timer value
  const generateRandomTime = () => {
    const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    const seconds = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Get random Solana color
  const getRandomSolanaColor = () => {
    return Math.random() > 0.5 ? '#9945FF' : '#14F195';
  };

  useEffect(() => {
    // Generate particles (sparkles)
    const newParticles = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      color: Math.random() > 0.5 ? '#9945FF' : '#14F195',
      size: `${Math.random() * 3 + 2}px`
    }));
    setParticles(newParticles);

    // Generate shooting stars
    const newShootingStars = Array.from({ length: 8 }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`
    }));
    setShootingStars(newShootingStars);

    // Floating numbers logic
    const generateNumber = () => {
      const newNumber = {
        id: Date.now(),
        value: generateRandomTime(),
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 90 + 5}%`,
        delay: `${Math.random() * 2}s`,
        color: getRandomSolanaColor()
      };

      setFloatingNumbers(prev => [...prev, newNumber]);

      setTimeout(() => {
        setFloatingNumbers(prev => prev.filter(num => num.id !== newNumber.id));
      }, 3000);
    };

    // Floating Solana logos logic
    const generateLogo = () => {
      const newLogo = {
        id: Date.now(),
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 90 + 5}%`,
        delay: `${Math.random() * 2}s`,
        scale: `${Math.random() * 0.5 + 0.5}`,
        opacity: `${Math.random() * 0.3 + 0.1}`
      };

      setFloatingLogos(prev => [...prev, newLogo]);

      setTimeout(() => {
        setFloatingLogos(prev => prev.filter(logo => logo.id !== newLogo.id));
      }, 4000);
    };

    // Generate new numbers and logos periodically
    const numberInterval = setInterval(generateNumber, 2000);
    const logoInterval = setInterval(generateLogo, 3000);

    return () => {
      clearInterval(numberInterval);
      clearInterval(logoInterval);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated Solana gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/20 via-purple-900/10 to-[#14F195]/20 animate-gradient-slow" />
      
      {/* Content wrapper with particles */}
      <div className="relative z-10">
        {/* Floating Numbers */}
        {floatingNumbers.map((number) => (
          <div
            key={number.id}
            className="absolute animate-float-number font-sophie text-lg"
            style={{
              left: number.left,
              top: number.top,
              animationDelay: number.delay,
              color: number.color,
              opacity: 0.4
            }}
          >
            {number.value}
          </div>
        ))}

        {/* Floating Solana Logos */}
        {floatingLogos.map((logo) => (
          <div
            key={logo.id}
            className="absolute animate-float-logo"
            style={{
              left: logo.left,
              top: logo.top,
              animationDelay: logo.delay,
              opacity: logo.opacity,
              transform: `scale(${logo.scale})`
            }}
          >
            <Image
              src="/solana.png"
              alt="Solana"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>
        ))}

        {/* Animated particles (sparkles) and shooting stars container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
                    Welcome to the Solana Timer!
                  </span>
                </span>
              </h1>
              
              <p className="text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-medium">
                In the Timer Community, every second counts—because time is the currency of connection.
              </p>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3 relative">
              {/* Connection Lines */}
              <div className="absolute top-1/2 left-0 w-full hidden md:block">
                <div className="h-0.5 bg-gradient-to-r from-[#14F195]/20 to-[#14F195]/20 w-full"></div>
              </div>

              {/* Step 1 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300 flex flex-col min-h-[320px]">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#14F195]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#14F195] transform -rotate-12">
                  1
                </div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#9945FF]/5 rounded-full flex items-center justify-center transform rotate-12 group-hover:rotate-6 transition-transform">
                  <Image
                    src="/phantom.png"
                    alt="Phantom"
                    width={48}
                    height={48}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-6 text-[#14F195] mt-8">Set Up Your Wallet</h3>
                  <ul className="space-y-3 text-white/80 text-sm mb-auto">
                    <li className="flex items-start">
                      <ArrowRightCircle className="w-4 h-4 mr-2 mt-0.5 text-[#14F195]" />
                      <span>Create Phantom or Solflare wallet</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRightCircle className="w-4 h-4 mr-2 mt-0.5 text-[#14F195]" />
                      <span>Save seed phrase securely</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRightCircle className="w-4 h-4 mr-2 mt-0.5 text-[#14F195]" />
                      <span>Receive SOL rewards automatically</span>
                    </li>
                  </ul>
                  <div className="flex justify-end mt-4">
                    <a 
                      href="https://phantom.com"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="bg-purple-900/40 hover:bg-purple-900/60 text-white/70 hover:text-white/90 px-4 py-2 rounded-lg text-sm transition-all flex items-center group font-sophie border-2 border-white/10 hover:border-white/20"
                    >
                      Download
                      <ArrowRightCircle className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300 flex flex-col min-h-[320px]">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#14F195]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#14F195] transform -rotate-12">
                  2
                </div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#9945FF]/5 rounded-full flex items-center justify-center transform rotate-12 group-hover:rotate-6 transition-transform">
                  <Image
                    src="/jupiter.png"
                    alt="Jupiter"
                    width={48}
                    height={48}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-6 text-[#14F195] mt-8">Fund Your Wallet</h3>
                  <ul className="space-y-3 text-white/80 text-sm mb-auto">
                    <li className="flex items-start">
                      <ArrowRightCircle className="w-4 h-4 mr-2 mt-0.5 text-[#14F195]" />
                      <span>Buy SOL on major exchanges</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRightCircle className="w-4 h-4 mr-2 mt-0.5 text-[#14F195]" />
                      <span>Or swap via Jupiter (jup.ag)</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRightCircle className="w-4 h-4 mr-2 mt-0.5 text-[#14F195]" />
                      <span>We recommend buying 1–5 SOL to get started and cover fees.</span>
                    </li>
                  </ul>
                  <div className="flex justify-end mt-4">
                    <a 
                      href="https://jup.ag"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="bg-purple-900/40 hover:bg-purple-900/60 text-white/70 hover:text-white/90 px-4 py-2 rounded-lg text-sm transition-all flex items-center group font-sophie border-2 border-white/10 hover:border-white/20"
                    >
                      Trade
                      <ArrowRightCircle className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300 flex flex-col min-h-[320px]">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#14F195]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#14F195] transform -rotate-12">
                  3
                </div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#9945FF]/5 rounded-full flex items-center justify-center transform rotate-12 group-hover:rotate-6 transition-transform">
                  <Image
                    src="/pumpfun.png"
                    alt="Pump.fun"
                    width={48}
                    height={48}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-6 text-[#14F195] mt-8">Buy on Pump.fun</h3>
                  <ul className="space-y-3 text-white/80 text-sm mb-auto">
                    <li className="flex items-start">
                      <ArrowRightCircle className="w-4 h-4 mr-2 mt-0.5 text-[#14F195]" />
                      <span>Visit pump.fun</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRightCircle className="w-4 h-4 mr-2 mt-0.5 text-[#14F195]" />
                      <span>Connect your wallet</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRightCircle className="w-4 h-4 mr-2 mt-0.5 text-[#14F195]" />
                      <span>Buy min. 100k tokens</span>
                    </li>
                  </ul>
                  <div className="flex justify-end mt-4">
                    <a 
                      href="https://pump.fun/board"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="bg-purple-900/40 hover:bg-purple-900/60 text-white/70 hover:text-white/90 px-4 py-2 rounded-lg text-sm transition-all flex items-center group font-sophie border-2 border-white/10 hover:border-white/20"
                    >
                      Visit
                      <ArrowRightCircle className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Then you start earning... text */}
            <div className="text-center mt-12 mb-8">
              <div className="inline-block bg-[#14F195]/10 rounded-lg px-6 py-3">
                <p className="text-xl text-white/90">Then you start earning...</p>
              </div>
            </div>

            {/* Reward System Card */}
            <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300 flex flex-col min-h-[320px]">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#14F195]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#14F195] transform -rotate-12">
                $
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
              <div className="relative z-10 flex-1 flex flex-col gap-8">
                <h2 className="text-2xl font-bold mb-2 text-[#14F195] mt-8">Reward System</h2>
                <div className="grid md:grid-cols-2 gap-8 mb-auto">
                  <div className="flex flex-col gap-6">
                    {/* How Rewards Work */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                      <h3 className="text-xl font-bold mb-2 text-[#14F195]">How Rewards Work</h3>
                      <ul className="list-disc list-inside text-white/80 space-y-2 text-sm mb-0">
                        <li>Every 30 minutes, <span className="font-bold">0.05% of all trading volume</span> is collected as fees.</li>
                        <li><span className="font-bold">100% of these fees</span> are distributed to all eligible TIMER holders as SOL rewards.</li>
                        <li>To qualify, you must hold at least <span className="font-bold text-[#14F195]">100,000 TIMER</span> for at least 30 minutes.</li>
                        <li>Your reward per cycle is calculated as:<br/>
                          <span className="font-mono text-xs text-white/70">(Your TIMER / All eligible TIMER) × Fee Pool × Tier Multiplier × Time Multiplier ÷ SOL Price</span>
                        </li>
                        <li>Both multipliers increase your rewards based on your holding size and holding duration.</li>
                        <li>Rewards are paid out automatically every 30 minutes.</li>
                      </ul>
                    </div>
                    {/* Example */}
                    <div className="bg-[#14F195]/10 border border-white/10 rounded-lg p-5">
                      <div className="font-bold text-white mb-1">Example</div>
                      <div className="text-white/80 text-sm">
                        If you hold 200,000 TIMER for 4 hours and the daily trading volume is $50,000,000:<br/>
                        <span className="font-mono text-xs text-white/70">
                          - Your share: 200,000 / 100,000,000 = 0.2%<br/>
                          - Fee pool per cycle: ($50,000,000 × 0.0005) / 48 ≈ $520.83<br/>
                          - Tier Multiplier: 1.1x (Fish)<br/>
                          - Time Multiplier: 1.3x (4h holding)<br/>
                          - SOL price: $150<br/>
                          → Reward: 520.83 × 0.002 × 1.1 × 1.3 / 150 ≈ <b>0.00993 SOL</b> per cycle<br/>
                          → Daily: 0.00993 SOL × 48 cycles = <b>0.47664 SOL</b> ($71.50)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    {/* Multipliers als Chips/Bar-Chart */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                      <h3 className="text-lg font-bold mb-2 text-[#14F195]">Multipliers</h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-white font-medium"><FishIcon />1.1x</span>
                          <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-white font-medium"><CrabIcon />1.2x</span>
                          <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-white font-medium"><DolphinIcon />1.3x</span>
                          <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-white font-medium"><WhaleIcon />1.5x</span>
                        </div>
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-white font-medium"><TimeIcon />1x</span>
                          <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-white font-medium"><TimeIcon />1.1x</span>
                          <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-white font-medium"><TimeIcon />1.2x</span>
                          <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-white font-medium"><TimeIcon />1.3x</span>
                          <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-white font-medium"><TimeIcon />1.4x</span>
                        </div>
                        <div className="flex gap-2 items-center flex-wrap mt-1">
                          <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-white font-medium"><TimeIcon />1.5x</span>
                        </div>
                      </div>
                    </div>
                    {/* Tiers als Chips */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                      <div className="font-bold text-white mb-2">Tiers</div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="flex items-center gap-1 bg-[#9945FF]/10 border border-[#9945FF]/30 rounded-full px-3 py-1 text-xs text-[#9945FF] font-medium"><ShrimpIcon />Shrimp</span>
                        <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-[#14F195] font-medium"><FishIcon />Fish</span>
                        <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-[#14F195] font-medium"><CrabIcon />Crab</span>
                        <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-[#14F195] font-medium"><DolphinIcon />Dolphin</span>
                        <span className="flex items-center gap-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full px-3 py-1 text-xs text-[#14F195] font-medium"><WhaleIcon />Whale</span>
                      </div>
                    </div>
                    {/* Live Rewards */}
                    <div className="bg-[#9945FF]/10 border border-white/10 rounded-lg p-5">
                      <div className="font-bold text-white mb-1">Live Rewards</div>
                      <div className="text-white/80 text-sm">See your SOL rewards grow live in the app, with animated +SOL popups every few seconds. The more you hold and the longer you hold, the faster it grows!</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <a 
                    href="/calculator"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-6 py-2 rounded-lg text-base transition-all flex items-center group border-2 border-black hover:border-[#9945FF] shadow-lg relative overflow-hidden"
                    style={{ minWidth: '160px' }}
                  >
                    <span className="relative z-10">Do the math</span>
                    <ArrowRightCircle className="w-5 h-5 ml-2 text-black group-hover:text-[#9945FF] transition-colors" />
                    <span className="absolute inset-0 rounded-lg pointer-events-none group-hover:animate-gloss" style={{background: 'linear-gradient(120deg,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.35) 50%,rgba(255,255,255,0.15) 100%)', opacity: 0.7}}></span>
                  </a>
                </div>
              </div>
            </div>

            {/* Security Notice Card */}
            <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300 flex flex-col min-h-[320px]">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#14F195]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#14F195] transform -rotate-12">
                <Shield className="w-8 h-8 text-[#14F195]" />
              </div>
              <div className="absolute -top-20 -right-8 w-80 h-80 bg-[#9945FF]/5 rounded-full flex items-center justify-center transform rotate-12 group-hover:rotate-6 transition-transform">
                <Image
                  src="/proof.png"
                  alt="Proof"
                  width={280}
                  height={280}
                  className="w-72 h-72 object-contain scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
              <div className="relative z-10 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-[#14F195] mt-8">Security Notice</h2>
                <div className="max-w-[400px]">
                  <div className="bg-[#14F195]/10 rounded-lg p-4 border border-white/10 mb-4">
                    <p className="text-white/80">Only buy tokens using the official address announced on <a href="https://x.com/Solana_Timer" target="_blank" rel="noopener noreferrer" className="text-[#14F195] hover:text-[#14F195]/80">@Solana_Timer</a>. Beware of fake tokens and always verify the contract address!</p>
                  </div>
                </div>
                <div className="flex justify-end mt-auto">
                  <a 
                    href="#"
                    className="bg-purple-900/40 hover:bg-purple-900/60 text-white/70 hover:text-white/90 px-4 py-2 rounded-lg text-sm transition-all flex items-center group font-sophie border-2 border-white/10 hover:border-white/20"
                  >
                    Visit Gitbook
                    <ArrowRightCircle className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 