"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

export function TimerCircle() {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isHourComplete, setIsHourComplete] = useState(false);

  useEffect(() => {
    // Synchronize with real time
    const now = new Date();
    setMinutes(now.getMinutes());
    setSeconds(now.getSeconds());

    const timer = setInterval(() => {
      const currentTime = new Date();
      const currentSeconds = currentTime.getSeconds();
      const currentMinutes = currentTime.getMinutes();
      
      setSeconds(currentSeconds);
      setMinutes(currentMinutes);

      // Check for hour completion
      if (currentMinutes === 0 && currentSeconds === 0) {
        setIsHourComplete(true);
        setTimeout(() => setIsHourComplete(false), 3000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate progress percentages
  const secondsProgress = (seconds / 60) * 100;
  const minutesProgress = (minutes / 60) * 100;

  return (
    <div className="relative w-[400px] h-[400px] flex flex-col items-center justify-center">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-solana-purple/30 to-solana-green/30 blur-2xl animate-pulse" />
      
      {/* Hour completion flash effect */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-solana-purple/50 blur-3xl transition-opacity duration-1000",
        isHourComplete ? "opacity-100" : "opacity-0"
      )} />

      {/* Timer circles */}
      <div className="relative w-full h-full">
        {/* Minutes circle */}
        <svg className="absolute inset-0 rotate-[-90deg]" viewBox="0 0 100 100">
          <circle
            className="stroke-solana-purple/20"
            cx="50"
            cy="50"
            r="45"
            strokeWidth="2"
            fill="none"
          />
          <circle
            className="stroke-solana-purple transition-all duration-200"
            cx="50"
            cy="50"
            r="45"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${minutesProgress * 2.827} 282.7`}
          />
        </svg>

        {/* Seconds circle */}
        <svg className="absolute inset-0 rotate-[-90deg]" viewBox="0 0 100 100">
          <circle
            className="stroke-solana-green/20"
            cx="50"
            cy="50"
            r="40"
            strokeWidth="2"
            fill="none"
          />
          <circle
            className="stroke-solana-green transition-all duration-200"
            cx="50"
            cy="50"
            r="40"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${secondsProgress * 2.513} 251.3`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
          {/* Center GIF */}
          <div className="relative w-32 h-32">
            <Image
              src="/clock.gif"
              alt="Timer Animation"
              fill
              className="rounded-full object-cover"
            />
          </div>

          {/* Timer display */}
          <div className="flex flex-col items-center">
            <div className="text-6xl font-normal solana-gradient-text tracking-wider" style={{ fontFamily: 'var(--font-sophie)' }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="mt-2 text-lg text-muted-foreground tracking-wide" style={{ fontFamily: 'var(--font-sophie)' }}>
              Next reward in: {59 - minutes}m {60 - seconds}s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 