"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface FloatingNumber {
  id: number;
  value: string;
  left: string;
  top: string;
  delay: string;
  color: string;
}

export default function HowItWorks() {
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; color: string; size: string }>>([]);
  const [shootingStars, setShootingStars] = useState<Array<{ left: string; delay: string }>>([]);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);

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

      // Remove the number after animation
      setTimeout(() => {
        setFloatingNumbers(prev => prev.filter(num => num.id !== newNumber.id));
      }, 3000); // Match this with the CSS animation duration
    };

    // Generate new numbers periodically
    const interval = setInterval(generateNumber, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
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

        {/* Hero Section with transparent background */}
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

        {/* Content Sections */}
        <div className="px-6 py-20">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Getting Started Section */}
            <section className="bg-black/20 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-4xl font-bold mb-8 text-white">Getting Started</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#14F195]">Step 1: Set Up Your Solana Wallet</h3>
                  <p className="text-white/80">Create a Phantom or Solflare wallet from phantom.app or solflare.com. Save your seed phrase securely and never share it! Your wallet address will receive SOL rewards automatically.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#14F195]">Step 2: Fund Your Wallet</h3>
                  <p className="text-white/80">Buy SOL on major exchanges or swap via Jupiter (jup.ag). Ensure you have enough SOL to buy at least 100,000 Solana Timer tokens (~1 SOL at launch) plus fees.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#14F195]">Step 3: Buy on Pump.fun</h3>
                  <p className="text-white/80">Visit pump.fun and connect your wallet. Search for &quot;Solana Timer&quot; using our official token address (announced on @solana-timer). Buy at least 100,000 tokens to qualify for rewards.</p>
                </div>
              </div>
            </section>

            {/* Reward System Section */}
            <section className="bg-black/20 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-4xl font-bold mb-8 text-white">Reward System</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#9945FF]">Base Rewards</h3>
                  <p className="text-white/80">Hold at least 100,000 tokens for 30 minutes to start earning. Base reward: 0.00005 SOL per 100,000 tokens every 30 minutes (~0.01 USD).</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#9945FF]">Time Multipliers</h3>
                  <ul className="space-y-2 text-white/80">
                    <li>• After 4 hours: 1.2x multiplier (0.00006 SOL per 100,000 tokens)</li>
                    <li>• After 8 hours: 1.5x multiplier (0.000075 SOL per 100,000 tokens)</li>
                    <li>• After 16 hours: 1.8x multiplier (0.00009 SOL per 100,000 tokens)</li>
                    <li>• After 24 hours: 2x multiplier (0.0001 SOL per 100,000 tokens)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Example Calculation Section */}
            <section className="bg-black/20 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-4xl font-bold mb-8 text-white">24-Hour Reward Example</h2>
              <div className="space-y-4 text-white/80">
                <p>Hold 100,000 tokens for 24 hours (48 distributions):</p>
                <ul className="space-y-2">
                  <li>• First 4 hours (8 distributions): 8 × 0.00005 SOL = 0.0004 SOL</li>
                  <li>• Next 4 hours (8 distributions): 8 × 0.00006 SOL = 0.00048 SOL</li>
                  <li>• Next 8 hours (16 distributions): 16 × 0.000075 SOL = 0.0012 SOL</li>
                  <li>• Final 8 hours (16 distributions): 16 × 0.00009 SOL = 0.00144 SOL</li>
                </ul>
                <p className="font-bold mt-4">Total for 24 hours: 0.00352 SOL (~0.62 USD at 175 USD/SOL)</p>
              </div>
            </section>

            {/* Security & Trust Section */}
            <section className="bg-black/20 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-4xl font-bold mb-8 text-white">Security & Trust</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#14F195]">Fair Launch</h3>
                  <p className="text-white/80">No presale, no smart contracts—just a transparent launch on Pump.fun. The dev team locks 5% of the supply for price stability (anti-sniper protection).</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#14F195]">⚠️ Stay Safe</h3>
                  <p className="text-white/80">Only buy tokens using the official address announced on @solana-timer. Beware of fake tokens and always verify the contract address!</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-black/20 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-4xl font-bold mb-8 text-white">FAQ</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#9945FF]">What if I sell my tokens?</h3>
                  <p className="text-white/80">Rewards stop until you hold at least 100,000 tokens again. Your multiplier timer resets.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#9945FF]">How do I track my rewards?</h3>
                  <p className="text-white/80">Rewards are sent directly to your wallet every 30 minutes. A dashboard is coming soon to track your progress!</p>
                </div>
              </div>
            </section>

            {/* Join Community Section */}
            <section className="bg-black/20 backdrop-blur-sm rounded-lg p-8 text-center">
              <h2 className="text-4xl font-bold mb-6 text-white">Join the Timer Community!</h2>
              <p className="text-2xl text-white/70">Follow @solana-timer for launch updates and join our growing community.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 