'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TIMER_MINT } from '@/constants/timer';

export interface Holder {
  address: string;
  tokens: number;
  holdTimeMinutes: number;
}

interface WalletAnalyzerProps {
  address: string;
  rewardInfo?: {
    tokens: number;
    holdTimeMinutes: number;
    tier: string;
    reward: number;
  } | null;
  tokenName?: string;
}

interface TokenInfo {
    mint: string;
    amount: number;
    symbol?: string;
    name?: string;
    logo?: string;
}

const TIER_ICONS: Record<string, string> = {
  Whale: '/whale.svg',
  Dolphin: '/dolphin.svg',
  Crab: '/crab.svg',
  Fish: '/fish.svg',
  Shrimp: '/shrimp.svg',
};

export default function WalletAnalyzer({ address, rewardInfo, tokenName = "TIMER" }: WalletAnalyzerProps) {
    const [tokens, setTokens] = useState<TokenInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastValue, setToastValue] = useState(0);
    const popupInterval = 2; // seconds
    // Current Live Rewards Counter: steigt nur noch bei jedem Popup-Inkrement (alle 2 Sekunden)
    const rewardPerCycle = rewardInfo && Number(rewardInfo.reward) > 0 ? Number(rewardInfo.reward) : 0;
    const rewardPerSecond = rewardPerCycle / 1800;
    const [simLiveReward, setSimLiveReward] = useState(0);

    useEffect(() => {
        if (!address) return;
        setLoading(true);
        fetch(`/api/wallet-tokens?address=${address}`)
            .then(async (res) => {
                if (!res.ok) throw new Error('API error');
                const data = await res.json();
                setTokens(data.tokens || []);
            })
            .catch(() => {
                // No error handling needed as per the new code
            })
            .finally(() => setLoading(false));
    }, [address, rewardPerCycle]);

    // Popup/Toast für Reward-Increment (realistisch) + Counter-Sync
    useEffect(() => {
        if (!rewardInfo || rewardPerSecond <= 0) {
            setSimLiveReward(0);
            return;
        }
        setSimLiveReward(0);
        const interval = setInterval(() => {
            setToastValue(rewardPerSecond * popupInterval);
            setShowToast(true);
            setSimLiveReward(prev => Number((prev + rewardPerSecond * popupInterval).toFixed(6)));
            setTimeout(() => setShowToast(false), 1200);
        }, popupInterval * 1000);
        return () => clearInterval(interval);
    }, [rewardPerSecond, rewardPerCycle, rewardInfo]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14F195]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 md:px-12">
            <div className="mt-10" />
            <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/40 mb-8 relative overflow-visible">
                {/* Neon Glow Effekt */}
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-2xl blur-2xl opacity-40 animate-pulse z-0" />
                {/* Popup/Toast */}
                {showToast && (
                  <div className="absolute left-1/2 -top-8 -translate-x-1/2 bg-black/90 border border-yellow-400 text-yellow-300 px-4 py-2 rounded-xl shadow-lg text-lg font-bold animate-bounce z-20 pointer-events-none select-none">
                    +{toastValue.toFixed(6)} SOL
                  </div>
                )}
                {/* Card Content */}
                <div className="relative z-10 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30">
                    {/* TIMER Balance ganz oben, groß, Glow */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="text-4xl md:text-5xl font-extrabold text-yellow-300 drop-shadow-[0_0_16px_rgba(255,255,0,0.7)] animate-pulse-glow">
                            {tokens.find(t => t.mint === TIMER_MINT)?.amount?.toLocaleString() || '0'}
                        </div>
                        <div className="uppercase text-yellow-400 font-bold tracking-widest text-sm mt-1 mb-2">{tokenName}</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full blur-md opacity-50 animate-pulse" />
                                <Image
                                    src="/clock.gif"
                                    alt="Timer"
                                    width={48}
                                    height={48}
                                    className="relative rounded-full"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-yellow-400">Solana {tokenName}</h3>
                                <p className="text-sm text-yellow-300/70">{tokenName}</p>
                            </div>
                        </div>
                        {/* Current Live Rewards Counter */}
                        {rewardPerCycle > 0 && (
                            <div className="text-right">
                                <span className="font-mono text-2xl text-yellow-400 block animate-glow">
                                    +{simLiveReward.toFixed(6)} SOL
                                </span>
                                <span className="block text-xs text-yellow-300/50 mt-1">Current Live Rewards</span>
                            </div>
                        )}
                    </div>
                    {/* Reward Info */}
                    <div className="mt-4 pt-4 border-t border-yellow-400/20 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                        <div className="flex items-center gap-2">
                            {rewardInfo?.tier && TIER_ICONS[rewardInfo.tier] && (
                              <Image src={TIER_ICONS[rewardInfo.tier]} alt={rewardInfo.tier} width={32} height={32} />
                            )}
                            <div>
                                <p className="text-sm text-yellow-300/70">Current Tier</p>
                                <p className="font-bold text-yellow-400 flex items-center gap-2">{rewardInfo?.tier || '-'}</p>
                                <p className="text-sm text-yellow-300/70 mt-2">Held for</p>
                                <p className="font-mono text-yellow-400">{rewardInfo?.holdTimeMinutes || '-'} min</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-yellow-300/70">Reward per cycle</p>
                            <p className="font-bold text-yellow-400">{rewardInfo?.reward ? rewardInfo.reward + ' SOL' : '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Animationen für Glow
// In deiner CSS (z.B. globals.css oder als Tailwind plugin):
// .animate-pulse-glow { animation: pulseGlow 2s infinite alternate; }
// .animate-glow { animation: glow 1.5s infinite alternate; }
// @keyframes pulseGlow { 0% { text-shadow: 0 0 8px #ffe066, 0 0 16px #ffe066; } 100% { text-shadow: 0 0 24px #ffe066, 0 0 48px #ffe066; } }
// @keyframes glow { 0% { text-shadow: 0 0 8px #ffe066; } 100% { text-shadow: 0 0 24px #ffe066; } } 