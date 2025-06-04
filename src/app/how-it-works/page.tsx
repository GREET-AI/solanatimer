"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HowItWorks() {
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; color: string; size: string }>>([]);
  const [shootingStars, setShootingStars] = useState<Array<{ left: string; delay: string }>>([]);

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
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Solana gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/20 via-purple-900/10 to-[#14F195]/20 animate-gradient-slow" />
      
      {/* Content wrapper with particles */}
      <div className="relative z-10">
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
            <div className="relative w-40 h-40 mx-auto mb-8 group">
              <div className="absolute inset-[-50%] bg-gradient-to-r from-[#9945FF]/60 to-[#14F195]/60 rounded-full blur-[60px] group-hover:blur-[80px] transition-all duration-500 animate-pulse opacity-75" />
              <Image
                src="/clock.gif"
                alt="Timer Logo"
                width={160}
                height={160}
                priority
                className="relative rounded-full hover:scale-105 transition-transform duration-500 group-hover:rotate-12"
              />
            </div>

            <div className="space-y-6 relative z-10">
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
          <div className="max-w-5xl mx-auto space-y-8">
            <section className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Time-Based Rewards</h2>
              <p className="text-white/80">
                Our unique reward system is based on the duration you hold your tokens. The longer you hold, the more rewards you earn.
                Starting from 7 days up to 730 days, your rewards increase progressively.
              </p>
            </section>

            <section className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Automatic Distribution</h2>
              <p className="text-white/80">
                Rewards are distributed automatically every hour. No need to claim - they go directly to your wallet.
                This ensures a smooth, hassle-free experience for all holders.
              </p>
            </section>

            <section className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Progressive Tiers</h2>
              <p className="text-white/80">
                As you hold longer, you progress through different tiers. Each tier comes with increased rewards and special benefits.
                Monitor your progress in real-time through our intuitive dashboard.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 