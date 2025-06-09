"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRightCircle } from 'lucide-react';

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

const XIcon = () => (
  <svg width="36" height="36" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
    <rect width="1200" height="1227" rx="300" fill="#000"/>
    <path d="M860 320H740L600 520L460 320H340L540 600L340 880H460L600 680L740 880H860L660 600L860 320Z" fill="#14F195"/>
  </svg>
);

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
      {/* Social & Share Cards */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 px-4">
        {/* X Account Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300 flex flex-col min-h-[320px]">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#14F195]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#14F195] transform -rotate-12">
            <XIcon />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold mb-6 text-[#14F195] mt-8">Follow us on X</h3>
            <p className="text-white/80 mb-auto text-sm">Get the latest updates, rewards, and community vibes. Join the Solana Timer movement on X!</p>
            <div className="flex justify-end mt-4">
              <a 
                href="https://x.com/Solana_Timer"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#14F195] hover:bg-[#14F195]/80 text-black font-bold px-6 py-2 rounded-lg text-base transition-all flex items-center group border-2 border-black/20 hover:border-[#9945FF] shadow-lg relative overflow-hidden font-sophie"
                style={{ minWidth: '160px' }}
              >
                <span className="relative z-10">@Solana_Timer</span>
                <ArrowRightCircle className="w-5 h-5 ml-2 text-black group-hover:text-[#9945FF] transition-colors" />
                <span className="absolute inset-0 rounded-lg pointer-events-none group-hover:animate-gloss" style={{background: 'linear-gradient(120deg,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.35) 50%,rgba(255,255,255,0.15) 100%)', opacity: 0.7}}></span>
              </a>
            </div>
          </div>
        </div>
        {/* X Community Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#9945FF]/20 relative overflow-hidden group hover:border-[#9945FF]/40 transition-all duration-300 flex flex-col min-h-[320px]">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#9945FF]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#9945FF] transform -rotate-12">
            <XIcon />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold mb-6 text-[#9945FF] mt-8">Join our X Community</h3>
            <p className="text-white/80 mb-auto text-sm">Connect with other degens, share your rewards, and never miss a Timer event. Be part of the fastest-growing Solana community!</p>
            <div className="flex justify-end mt-4">
              <a 
                href="https://x.com/i/communities/1930325941349175532"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#9945FF] hover:bg-[#9945FF]/80 text-white font-bold px-6 py-2 rounded-lg text-base transition-all flex items-center group border-2 border-black/20 hover:border-[#14F195] shadow-lg relative overflow-hidden font-sophie"
                style={{ minWidth: '160px' }}
              >
                <span className="relative z-10">Join Community</span>
                <ArrowRightCircle className="w-5 h-5 ml-2 text-white group-hover:text-[#14F195] transition-colors" />
                <span className="absolute inset-0 rounded-lg pointer-events-none group-hover:animate-gloss" style={{background: 'linear-gradient(120deg,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.35) 50%,rgba(255,255,255,0.15) 100%)', opacity: 0.7}}></span>
              </a>
            </div>
          </div>
        </div>
        {/* Share on X Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-[#14F195]/20 relative overflow-hidden group hover:border-[#14F195]/40 transition-all duration-300 flex flex-col min-h-[320px]">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#14F195]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#14F195] transform -rotate-12">
            <XIcon />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/30 via-purple-900/20 to-[#14F195]/30 animate-gradient-slow group-hover:from-[#9945FF]/40 group-hover:to-[#14F195]/40" />
          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold mb-6 text-[#14F195] mt-8">Share & Win Rewards!</h3>
            <p className="text-white/80 mb-auto text-sm">Share your excitement about Solana Timer on X. Every hour, you have a chance to win exclusive rewards for spreading the word!</p>
            <div className="flex justify-end mt-4">
              <a 
                href={`https://x.com/intent/tweet?text=${encodeURIComponent('⏰ Check out Solana Timer – earn SOL every 30 minutes just for holding! Powered by @pumpdotfun & @Solana_Timer. Join the degen revolution: https://solanatimer.io #Solana #Crypto #Airdrop')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#14F195] hover:bg-[#14F195]/80 text-black font-bold px-6 py-2 rounded-lg text-base transition-all flex items-center group border-2 border-black/20 hover:border-[#9945FF] shadow-lg relative overflow-hidden font-sophie"
                style={{ minWidth: '160px' }}
              >
                <span className="relative z-10">Share on X</span>
                <ArrowRightCircle className="w-5 h-5 ml-2 text-black group-hover:text-[#9945FF] transition-colors" />
                <span className="absolute inset-0 rounded-lg pointer-events-none group-hover:animate-gloss" style={{background: 'linear-gradient(120deg,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.35) 50%,rgba(255,255,255,0.15) 100%)', opacity: 0.7}}></span>
              </a>
            </div>
            <div className="text-xs text-white/60 mt-2 text-center">Every hour, we pick random sharers for exclusive rewards. Don&apos;t miss out!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
// Füge in deine CSS ein:
// @keyframes pulseGlow { 0% { text-shadow: 0 0 8px #14F195, 0 0 16px #14F195; } 100% { text-shadow: 0 0 24px #14F195, 0 0 48px #14F195; } }
// .animate-pulse-glow { animation: pulseGlow 2s infinite alternate; } 