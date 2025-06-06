'use client';

import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import Image from 'next/image';
import { getRandomRPCEndpoint } from '@/config/endpoints';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

interface TokenInfo {
    mint: string;
    amount: number;
    symbol?: string;
    name?: string;
    logo?: string;
}

export default function WalletAnalyzer({ address }: { address: string }) {
    const [tokens, setTokens] = useState<TokenInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!address) return;
        setLoading(true);
        setError(null);
        fetch(`/api/wallet-tokens?address=${address}`)
            .then(async (res) => {
                if (!res.ok) throw new Error('API error');
                const data = await res.json();
                setTokens(data.tokens || []);
            })
            .catch((err) => {
                setError('Failed to fetch wallet data.');
            })
            .finally(() => setLoading(false));
    }, [address]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14F195]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mt-10" />
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8">
                <h2 className="text-xl font-bold text-[#14F195] mb-4">Portfolio Overview</h2>
                <div className="text-2xl font-bold mb-2">
                    {tokens.length === 0 ? '$0.00' : `${tokens.length} Token(s)`}
                </div>
            </div>

            <div className="mt-8" />

            <div className="grid gap-6 px-4">
                {tokens.filter(token => token.name || token.symbol).map((token) => (
                    <div key={token.mint} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {token.logo ? (
                                <img
                                    src={token.logo}
                                    alt={token.symbol || 'token'}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                    <span className="text-xs">{token.symbol?.slice(0, 3) || '?'}</span>
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold">{token.name || token.symbol || 'Unknown Token'}</h3>
                                <p className="text-sm text-white/70">{token.symbol}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="font-mono text-lg text-white/90">{token.amount}</span>
                            <span className="block text-xs text-white/50 mt-1">Holdings</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 