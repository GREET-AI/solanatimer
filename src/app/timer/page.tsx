"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";

interface FloatingNumber {
  id: number;
  value: string;
  left: string;
  top: string;
  delay: string;
  color: string;
}

export default function Timer() {
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
    <div className="min-h-screen p-8 relative overflow-hidden">
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
      
        {/* Main content */}
        <div className="max-w-5xl mx-auto space-y-8 relative">
          {/* Timer display */}
          <div className="text-center space-y-4 mb-16 pt-16">
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
            <div className="space-y-2">
              <h1 className="text-6xl font-sophie bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent animate-gradient">
                19:07
              </h1>
              <p className="text-white/60 font-sophie">Next reward in: 40m 53s</p>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(153,69,255,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/10 to-transparent" />
              <div className="relative p-6">
                <h3 className="font-sophie text-[#9945FF] mb-4">Current Hold Time</h3>
                <p className="text-2xl font-sophie text-white mb-2">14d 6h 32m</p>
                <p className="text-sm text-white/60">Your tokens have been held since March 1, 2024</p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(20,241,149,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#14F195]/10 to-transparent" />
              <div className="relative p-6">
                <h3 className="font-sophie text-[#14F195] mb-4">Rewards Earned</h3>
                <p className="text-2xl font-sophie text-white mb-2">1,234.56 TIMER</p>
                <p className="text-sm text-white/60">~2.5 TIMER per hour of holding</p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(153,69,255,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/10 to-transparent" />
              <div className="relative p-6">
                <h3 className="font-sophie text-[#9945FF] mb-4">Next Tier In</h3>
                <p className="text-2xl font-sophie text-white mb-2">30 Days</p>
                <p className="text-sm text-white/60">Reward rate increases by 25%</p>
              </div>
            </Card>
          </div>

          {/* Tiers table */}
          <Card className="relative overflow-hidden mt-8 transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(20,241,149,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#14F195]/10 to-transparent" />
            <div className="relative p-6">
              <h3 className="font-sophie text-[#14F195] mb-6">Reward Tiers</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-4">
                  <p className="font-sophie text-white/80">7 Days</p>
                  <p className="font-sophie text-white/80">30 Days</p>
                  <p className="font-sophie text-white/80">90 Days</p>
                </div>
                <div className="space-y-4">
                  <p className="font-sophie text-white/80">2.5 TIMER/hour</p>
                  <p className="font-sophie text-white/80">3.75 TIMER/hour</p>
                  <p className="font-sophie text-white/80">5.0 TIMER/hour</p>
                </div>
                <div className="space-y-4">
                  <p className="font-sophie text-white/80">180 Days</p>
                  <p className="font-sophie text-white/80">365 Days</p>
                  <p className="font-sophie text-white/80">730 Days</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 