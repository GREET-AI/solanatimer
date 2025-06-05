"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calculator, Timer, FunctionSquare, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "How it works?", href: "/", icon: Info },
  { name: "Do the math", href: "/do-the-math", icon: FunctionSquare },
  { name: "Calculator", href: "/calculator", icon: Calculator },
  { name: "Timer", href: "/timer", icon: Timer },
];

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(nextHour.getHours() + 1);
      nextHour.setMinutes(0);
      nextHour.setSeconds(0);
      nextHour.setMilliseconds(0);

      const difference = nextHour.getTime() - now.getTime();
      
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-3 -mt-2 relative overflow-hidden text-center">
      <div className="flex items-center justify-center mb-1">
        <Timer className="w-5 h-5 text-[#14F195] mr-2" />
        <span className="font-sophie text-2xl bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent animate-gradient">
          {timeLeft}
        </span>
      </div>
      <p className="text-sm text-white/70 font-sophie">Next Distribution In</p>
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 border-r relative overflow-hidden backdrop-blur-sm border-opacity-20", className)}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/40 via-purple-500/20 to-solana-green/40 animate-gradient" />
      
      {/* Animated LED border */}
      <div className="absolute right-0 top-0 w-[2px] h-full">
        <div className="absolute inset-0 animate-led-flow">
          <div className="absolute inset-0 bg-gradient-to-b from-solana-purple via-purple-500 to-solana-green opacity-70 blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-solana-purple via-purple-500 to-solana-green" />
        </div>
        <div className="absolute inset-0 animate-led-pulse">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-50 blur-sm" />
        </div>
      </div>

      <div className="space-y-4 py-4 relative">
        <div className="px-3 py-2">
          <Link href="/" className="block">
            <div className="flex items-center justify-center mb-4 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/50 via-purple-500/30 to-solana-green/50 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse opacity-75" />
              <Image
                src="/clock.gif"
                alt="Timer Logo"
                width={100}
                height={100}
                priority
                className="rounded-full relative hover:scale-105 transition-transform duration-500 group-hover:rotate-12"
              />
            </div>
            <h2 className="mb-2 px-4 text-2xl font-bold text-center tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-solana-purple to-solana-green animate-gradient">
              Solana Timer
            </h2>
          </Link>

          {/* Add CountdownTimer here */}
          <CountdownTimer />

          <nav className="space-y-2 mt-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start gap-3 transition-all duration-300 relative overflow-hidden group tracking-wide text-lg py-6",
                      isActive 
                        ? "bg-gradient-to-r from-transparent to-[#7a37cc]/40 text-white font-medium" 
                        : "hover:bg-gradient-to-r hover:from-transparent hover:to-[#9945FF]/30 text-white/80 hover:text-white"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-solana-purple/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient" />
                    <Icon className={cn(
                      "h-6 w-6 transition-all duration-300 transform group-hover:scale-110",
                      isActive ? "text-white" : "text-white/70 group-hover:text-white"
                    )} />
                    <span className="relative z-10">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
} 