"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

function getNextHalfHourCountdown() {
  const now = new Date();
  const next = new Date(now);
  if (now.getMinutes() < 30) {
    next.setMinutes(30, 0, 0);
  } else {
    next.setHours(now.getHours() + 1, 0, 0, 0);
  }
  const diff = next.getTime() - now.getTime();
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default function Timer() {
  const [countdown, setCountdown] = useState(getNextHalfHourCountdown());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getNextHalfHourCountdown());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animierte Partikel für Casino/Degen-Feeling
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; color: string; size: string }>>([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 40 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      color: Math.random() > 0.5 ? '#9945FF' : '#14F195',
      size: `${Math.random() * 3 + 2}px`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/20 via-purple-900/10 to-[#14F195]/20 animate-gradient-slow" />
      {/* Particles */}
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
              opacity: 0.5
            }}
          />
        ))}
      </div>
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full pt-24 pb-16">
        {/* SVG Clock Icon */}
        <div className="w-40 h-40 mb-8 flex items-center justify-center">
          <Image
            src="/clock.gif"
            alt="Timer"
            width={180}
            height={180}
            className="drop-shadow-[0_0_40px_#9945FF99]"
            priority
          />
        </div>
        {/* Digital Countdown */}
        <div className="flex items-center gap-4 mb-2">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="16" stroke="#14F195" strokeWidth="3" opacity="0.7" />
            <path d="M18 8V18L25 22" stroke="#14F195" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="text-5xl md:text-6xl font-extrabold text-[#14F195] font-mono drop-shadow-[0_0_16px_#14F19599] tracking-widest animate-pulse-glow">{countdown}</span>
        </div>
        <div className="text-lg md:text-xl text-white/70 font-semibold tracking-wide mt-2 mb-8">Next Distribution In</div>
        <div className="mt-8 text-center max-w-xl mx-auto">
          <p className="text-white/80 text-lg md:text-xl font-sans font-semibold mb-2">Every 30 minutes, all eligible holders receive SOL rewards automatically.</p>
          <p className="text-[#9945FF] text-base md:text-lg font-sans font-medium">Stay degen. Stay on time. Don&apos;t miss the next payout!</p>
        </div>
      </div>
    </div>
  );
}
// Füge in deine CSS ein:
// @keyframes pulseGlow { 0% { text-shadow: 0 0 8px #14F195, 0 0 16px #14F195; } 100% { text-shadow: 0 0 24px #14F195, 0 0 48px #14F195; } }
// .animate-pulse-glow { animation: pulseGlow 2s infinite alternate; } 