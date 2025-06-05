"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Wallet, Timer, ArrowRightCircle } from 'lucide-react';

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
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300">
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
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 text-[#14F195] mt-8">Set Up Your Wallet</h3>
                  <ul className="space-y-3 text-white/80 text-sm">
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
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300">
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
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 text-[#14F195] mt-8">Fund Your Wallet</h3>
                  <ul className="space-y-3 text-white/80 text-sm">
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
                      <span>Need ~1 SOL for 100k tokens</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300">
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
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 text-[#14F195] mt-8">Buy on Pump.fun</h3>
                  <ul className="space-y-3 text-white/80 text-sm">
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
            <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6 text-white">Reward System</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-[#14F195]">Base Rewards</h3>
                    <p className="text-white/80 mb-4">Hold at least 100,000 tokens for 30 minutes to start earning:</p>
                    <div className="bg-[#14F195]/10 rounded-lg p-4">
                      <p className="text-white font-bold">0.00005 SOL per 100,000 tokens</p>
                      <p className="text-white/60">Every 30 minutes (~0.01 USD)</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-[#14F195]">Time Multipliers</h3>
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-center bg-[#14F195]/5 rounded p-2">
                        <span className="w-24">4 hours:</span>
                        <span className="font-bold text-[#14F195]">1.2x</span>
                      </li>
                      <li className="flex items-center bg-[#14F195]/5 rounded p-2">
                        <span className="w-24">8 hours:</span>
                        <span className="font-bold text-[#14F195]">1.5x</span>
                      </li>
                      <li className="flex items-center bg-[#14F195]/5 rounded p-2">
                        <span className="w-24">16 hours:</span>
                        <span className="font-bold text-[#14F195]">1.8x</span>
                      </li>
                      <li className="flex items-center bg-[#14F195]/5 rounded p-2">
                        <span className="w-24">24 hours:</span>
                        <span className="font-bold text-[#14F195]">2.0x</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                  <span className="text-2xl mr-2">⚠️</span> Security Notice
                </h2>
                <div className="bg-[#14F195]/10 rounded-lg p-6">
                  <p className="text-white/90 font-medium">Only buy tokens using the official address announced on @solana-timer. Beware of fake tokens and always verify the contract address!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 