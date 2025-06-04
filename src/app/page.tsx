"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Coins, TrendingUp, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-solana-purple to-solana-green animate-gradient">
          Welcome to Solana Timer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Earn more by holding longer. A revolutionary token reward system that incentivizes long-term holding through time-based rewards.
        </p>
      </div>

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
