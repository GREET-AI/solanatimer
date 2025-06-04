"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Wallet, ChartBar, LineChart } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl tracking-wide solana-gradient-text">Dashboard</h2>
        <Button className="gap-2 solana-gradient-bg hover:opacity-90 transition-opacity tracking-wide text-lg py-6 px-8">
          Connect Wallet
          <Wallet className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden backdrop-blur-sm border-solana-purple/20 group hover:border-solana-purple/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg tracking-wide">Token Price</CardTitle>
            <ChartBar className="h-5 w-5 text-solana-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl tracking-wide solana-gradient-text">$0.14</div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              +2.5%
              <ArrowUpRight className="h-4 w-4 text-solana-green" />
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden backdrop-blur-sm border-solana-purple/20 group hover:border-solana-purple/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg tracking-wide">Market Cap</CardTitle>
            <LineChart className="h-5 w-5 text-solana-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl tracking-wide solana-gradient-text">$1.4M</div>
            <p className="text-sm text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden backdrop-blur-sm border-solana-purple/20 group hover:border-solana-purple/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg tracking-wide">24h Volume</CardTitle>
            <ChartBar className="h-5 w-5 text-solana-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl tracking-wide solana-gradient-text">$234.1K</div>
            <p className="text-sm text-muted-foreground">+18.7% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 relative overflow-hidden backdrop-blur-sm border-solana-purple/20 group hover:border-solana-purple/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader>
            <CardTitle className="text-xl tracking-wide solana-gradient-text">Price History</CardTitle>
            <CardDescription className="text-base">24h price movement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-lg">
              Chart placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 relative overflow-hidden backdrop-blur-sm border-solana-purple/20 group hover:border-solana-purple/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader>
            <CardTitle className="text-xl tracking-wide solana-gradient-text">Recent Transactions</CardTitle>
            <CardDescription className="text-base">Latest token transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 text-lg">
                  <div className="h-3 w-3 rounded-full bg-solana-green" />
                  <div className="flex-1">0x1234...5678</div>
                  <div className="text-muted-foreground">+1,234 tokens</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
