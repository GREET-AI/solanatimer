"use client";

import { TimerCircle } from "@/components/TimerCircle";
import { Card } from "@/components/ui/card";

export default function TimerPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center space-y-8">
        {/* Timer Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/10 to-solana-green/10 blur-3xl" />
          <TimerCircle />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Card className="p-6 backdrop-blur-lg bg-background/50 border-solana-purple/20">
            <h3 className="text-lg font-normal mb-2 solana-gradient-text" style={{ fontFamily: 'var(--font-sophie)' }}>Current Hold Time</h3>
            <div className="text-3xl font-normal" style={{ fontFamily: 'var(--font-sophie)' }}>14d 6h 32m</div>
            <p className="text-sm text-muted-foreground mt-2">Your tokens have been held since March 1, 2024</p>
          </Card>

          <Card className="p-6 backdrop-blur-lg bg-background/50 border-solana-purple/20">
            <h3 className="text-lg font-normal mb-2 solana-gradient-text" style={{ fontFamily: 'var(--font-sophie)' }}>Rewards Earned</h3>
            <div className="text-3xl font-normal" style={{ fontFamily: 'var(--font-sophie)' }}>1,234.56 TIMER</div>
            <p className="text-sm text-muted-foreground mt-2">+2.5 TIMER per hour of holding</p>
          </Card>

          <Card className="p-6 backdrop-blur-lg bg-background/50 border-solana-purple/20">
            <h3 className="text-lg font-normal mb-2 solana-gradient-text" style={{ fontFamily: 'var(--font-sophie)' }}>Next Milestone</h3>
            <div className="text-3xl font-normal" style={{ fontFamily: 'var(--font-sophie)' }}>30 Days</div>
            <p className="text-sm text-muted-foreground mt-2">Reward rate increases by 25%</p>
          </Card>
        </div>

        {/* Holding Tiers */}
        <Card className="w-full max-w-4xl p-6 backdrop-blur-lg bg-background/50 border-solana-purple/20">
          <h3 className="text-xl font-normal mb-4 solana-gradient-text" style={{ fontFamily: 'var(--font-sophie)' }}>Holding Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center" style={{ fontFamily: 'var(--font-sophie)' }}>
                <span>7 Days</span>
                <span className="text-solana-green">2.5 TIMER/hour</span>
              </div>
              <div className="flex justify-between items-center" style={{ fontFamily: 'var(--font-sophie)' }}>
                <span>30 Days</span>
                <span className="text-solana-green">3.75 TIMER/hour</span>
              </div>
              <div className="flex justify-between items-center" style={{ fontFamily: 'var(--font-sophie)' }}>
                <span>90 Days</span>
                <span className="text-solana-green">5.0 TIMER/hour</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center" style={{ fontFamily: 'var(--font-sophie)' }}>
                <span>180 Days</span>
                <span className="text-solana-green">7.5 TIMER/hour</span>
              </div>
              <div className="flex justify-between items-center" style={{ fontFamily: 'var(--font-sophie)' }}>
                <span>365 Days</span>
                <span className="text-solana-green">12.5 TIMER/hour</span>
              </div>
              <div className="flex justify-between items-center" style={{ fontFamily: 'var(--font-sophie)' }}>
                <span>730 Days</span>
                <span className="text-solana-green">25.0 TIMER/hour</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 