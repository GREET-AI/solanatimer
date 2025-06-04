"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Coins, TrendingUp, Clock } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-16 p-6">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 px-6 py-20 overflow-hidden bg-white/50">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/20 via-transparent to-solana-green/20 animate-gradient" />
        
        {/* Animated border */}
        <div className="absolute inset-0">
          <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-solana-purple to-transparent animate-pulse" />
          <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-solana-green to-transparent animate-pulse" />
          <div className="absolute left-0 h-full w-[2px] bg-gradient-to-b from-transparent via-solana-purple to-transparent animate-pulse" />
          <div className="absolute right-0 h-full w-[2px] bg-gradient-to-b from-transparent via-solana-green to-transparent animate-pulse" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Animated logo */}
          <div className="relative w-40 h-40 mx-auto mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-solana-purple via-purple-500 to-solana-green rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse opacity-75" />
            <Image
              src="/clock.gif"
              alt="Timer Logo"
              width={160}
              height={160}
              priority
              className="relative rounded-full hover:scale-105 transition-transform duration-500 group-hover:rotate-12"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl font-bold tracking-tight relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-solana-purple to-solana-green animate-gradient">
                Welcome to the Solana Timer!
              </span>
            </h1>
            
            <p className="text-2xl text-black/80 max-w-3xl mx-auto leading-relaxed font-medium">
              In the Timer Community, every second counts—because time is the currency of connection.
            </p>
          </div>

          {/* Animated particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  width: '4px',
                  height: '4px',
                  background: Math.random() > 0.5 ? '#9945FF' : '#14F195',
                  borderRadius: '50%',
                  opacity: 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Existing content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
        <Card className="relative overflow-hidden group hover:border-solana-purple/40 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/10 via-purple-500/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient" />
          <CardHeader>
            <Timer className="h-12 w-12 text-solana-purple mb-4 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="text-2xl group-hover:text-solana-purple transition-colors">Time-Based Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg">
              The longer you hold, the more you earn. Rewards increase with holding duration, from 7 days up to 730 days.
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:border-solana-purple/40 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/10 via-purple-500/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient" />
          <CardHeader>
            <Coins className="h-12 w-12 text-solana-purple mb-4 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="text-2xl group-hover:text-solana-purple transition-colors">Hourly Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg">
              Receive rewards every hour automatically. No need to claim - rewards are distributed directly to your wallet.
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:border-solana-purple/40 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/10 via-purple-500/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient" />
          <CardHeader>
            <TrendingUp className="h-12 w-12 text-solana-purple mb-4 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="text-2xl group-hover:text-solana-purple transition-colors">Tier System</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg">
              Progress through holding tiers to unlock higher rewards. Each tier offers increased benefits and earning potential.
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:border-solana-purple/40 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/10 via-purple-500/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient" />
          <CardHeader>
            <Clock className="h-12 w-12 text-solana-purple mb-4 group-hover:scale-110 transition-transform duration-300" />
            <CardTitle className="text-2xl group-hover:text-solana-purple transition-colors">Real-Time Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg">
              Monitor your rewards and holding time in real-time through our intuitive dashboard and timer interface.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-12">
        <div className="inline-block p-px bg-gradient-to-r from-solana-purple to-solana-green rounded-full animate-gradient">
          <p className="bg-background rounded-full px-8 py-4 text-lg text-muted-foreground">
            Start earning rewards today by connecting your wallet and holding tokens
          </p>
        </div>
      </div>
    </div>
  );
}
