import { PublicKey } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";

export interface TokenHolding {
  mint: string;
  amount: number;
  decimals: number;
}

export interface TradeHistory {
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: Date;
  txId: string;
}

export interface WalletAnalysis {
  address: string;
  timerBalance: number;
  firstSeen: Date;
  lastActive: Date;
  trades: TradeHistory[];
  totalVolume: number;
  averageHoldingTime: number;
  holdingScore: number;
  nextReward: {
    amount: number;
    timestamp: Date;
    multiplier: number;
  };
}

interface AnalysisData {
  heldForMinutes: number;
  volume24h: number;
  tier: string;
  reward: number;
}

interface HeliusHolder {
  owner: string;
  amount: number;
}

interface HeliusTokenTransfer {
  fromUserAccount: string;
  owner: string;
  tokenAmount: string;
  timestamp: number;
  signature: string;
}

// Caching für SOL-Preis (USD)
let cachedSolPrice = 0;
let lastSolPriceFetch = 0;
async function getSolPrice(): Promise<number> {
  const now = Date.now();
  if (cachedSolPrice && now - lastSolPriceFetch < 60_000) {
    return cachedSolPrice;
  }
  try {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Coingecko API error');
    const data = await res.json();
    const price = data.solana?.usd;
    if (price) {
      cachedSolPrice = Number(price);
      lastSolPriceFetch = now;
      return cachedSolPrice;
    }
  } catch (e) {
    console.error('Error fetching SOL price from Coingecko:', e);
  }
  // Fallback auf alten Wert oder 200
  return cachedSolPrice || 200;
}

// Caching für 24h-Volumen
let cachedVolume = 0;
let lastVolumeFetch = 0;

// Globales Caching für Helius-Requests
const balanceCache: Record<string, { value: number, ts: number }> = {};
const tradeCache: Record<string, { value: TradeHistory[], ts: number }> = {};

// Caching für totalEligibleTokens (alle qualifizierten Holder)
let cachedEligibleTokens = 0;
let lastEligibleFetch = 0;
async function getTotalEligibleTokens(mint: string, heliusKey: string): Promise<number> {
  const now = Date.now();
  if (cachedEligibleTokens && now - lastEligibleFetch < 60_000) {
    return cachedEligibleTokens;
  }
  try {
    const url = `https://api.helius.xyz/v0/tokens/holders?api-key=${heliusKey}&mint=${mint}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Helius API error');
    const holders = await res.json() as HeliusHolder[];
    const eligible = holders.filter(h => h.amount >= 100_000);
    const total = eligible.reduce((sum, h) => sum + h.amount, 0);
    cachedEligibleTokens = total;
    lastEligibleFetch = now;
    return total;
  } catch (e) {
    console.error('Error fetching eligible tokens:', e);
    return cachedEligibleTokens || 0;
  }
}

function getTierAndMult(tokens: number) {
  if (tokens >= 10_000_000) return { tier: "Whale", mult: 1.5, icon: "/whale.svg" };
  if (tokens >= 5_000_000)  return { tier: "Dolphin", mult: 1.3, icon: "/dolphin.svg" };
  if (tokens >= 1_000_000)  return { tier: "Crab", mult: 1.2, icon: "/crab.svg" };
  if (tokens >= 500_000)    return { tier: "Fish", mult: 1.1, icon: "/fish.svg" };
  if (tokens >= 100_000)    return { tier: "Shrimp", mult: 1.0, icon: "/shrimp.svg" };
  return { tier: "None", mult: 0, icon: "" };
}

function getTimeMult(minutesHeld: number) {
  if (minutesHeld >= 24 * 60) return 1.5;
  if (minutesHeld >= 12 * 60) return 1.4;
  if (minutesHeld >= 4 * 60)  return 1.3;
  if (minutesHeld >= 2 * 60)  return 1.2;
  if (minutesHeld >= 60)      return 1.1;
  if (minutesHeld >= 30)      return 1.0;
  return 0;
}

class WalletService {
  private connection: Connection;
  private TIMER_TOKEN_MINT = process.env.NEXT_PUBLIC_TIMER_MINT || "3T721bpRc5FNY84W36vWffxoKs4FLXhBpSaqwUCRpump";
  private HELIUS_API_KEY = process.env.HELIUS_PUBLIC_API_KEY || "";
  private HELIUS_ENDPOINT = `https://api.helius.xyz/v0`;
  
  // Reward constants
  private readonly BASE_REWARD = 0.00005; // SOL per 100,000 tokens
  private readonly MIN_TOKENS = 100000;
  private readonly MIN_HOLD_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds
  private readonly REWARD_INTERVALS = [
    { hours: 24, multiplier: 2.0 },
    { hours: 16, multiplier: 1.8 },
    { hours: 8, multiplier: 1.5 },
    { hours: 4, multiplier: 1.2 },
    { hours: 0.5, multiplier: 1.0 }
  ];
  
  constructor() {
    this.connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"
    );
  }

  /**
   * Validates a Solana wallet address
   */
  public isValidAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  async get24hVolume(): Promise<number> {
    const now = Date.now();
    if (cachedVolume && now - lastVolumeFetch < 60_000) {
      return cachedVolume;
    }
    try {
      const url = `https://api.dexscreener.com/latest/dex/tokens/${this.TIMER_TOKEN_MINT}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Dexscreener API error');
      const data = await res.json();
      // Dexscreener liefert das Volumen in data.pairs[0].volume.h24
      const volume = data.pairs?.[0]?.volume?.h24;
      if (volume) {
        cachedVolume = Number(volume);
        lastVolumeFetch = now;
        return cachedVolume;
      }
      return 0;
    } catch (e) {
      console.error('Error fetching 24h volume:', e);
      return cachedVolume || 0;
    }
  }

  /**
   * Fetches complete wallet analysis including trading history and metrics
   */
  public async analyzeWallet(address: string): Promise<AnalysisData> {
    if (!this.isValidAddress(address)) {
      throw new Error("Invalid wallet address");
    }

    try {
      const [timerBalance, trades, volume24h, solPrice, totalEligibleTokens] = await Promise.all([
        this.getTimerBalance(address),
        this.getTradeHistory(address),
        this.get24hVolume(),
        getSolPrice(),
        getTotalEligibleTokens(this.TIMER_TOKEN_MINT, this.HELIUS_API_KEY)
      ]);

      const holdingMetrics = this.calculateHoldingMetrics(trades);

      // Neue Tier-Logik
      const { tier, mult: tierMult } = getTierAndMult(timerBalance);
      const holdTimeMinutes = holdingMetrics.holdingTime / 60000;
      const timeMult = getTimeMult(holdTimeMinutes);

      // Pool pro Zyklus (USD)
      const poolPerCycleUSD = (volume24h * 0.0005) / 48;
      // Token-Anteil
      const tokenShare = totalEligibleTokens > 0 ? timerBalance / totalEligibleTokens : 0;
      // Reward pro Holder (USD)
      const rewardUSD = poolPerCycleUSD * tokenShare * timeMult * tierMult;
      // In SOL umrechnen
      const reward = solPrice > 0 ? rewardUSD / solPrice : 0;

      return {
        heldForMinutes: holdingMetrics.holdingTime / 60000,
        volume24h,
        tier,
        reward: Number(reward.toFixed(6))
      };
    } catch (error) {
      console.error("Error analyzing wallet:", error);
      throw new Error("Failed to analyze wallet");
    }
  }

  /**
   * Fetches Timer token balance for a wallet using Helius (mit Caching und 429-Handling)
   */
  private async getTimerBalance(address: string): Promise<number> {
    const now = Date.now();
    if (balanceCache[address] && now - balanceCache[address].ts < 60_000) {
      return balanceCache[address].value;
    }
    try {
      const url = `${this.HELIUS_ENDPOINT}/addresses/${address}/balances?api-key=${this.HELIUS_API_KEY}`;
      const res = await fetch(url);
      if (res.status === 429) {
        console.error('Helius rate limit (balance)');
        throw new Error('Rate limit exceeded, try again later');
      }
      if (!res.ok) throw new Error('Helius API error');
      const data = await res.json();
      const token = (data.tokens || []).find((t: { mint: string }) => t.mint === this.TIMER_TOKEN_MINT);
      const value = token ? Number(token.amount) : 0;
      balanceCache[address] = { value, ts: now };
      return value;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Rate limit')) throw error;
      console.error("Error fetching Timer balance (Helius):", error);
      return balanceCache[address]?.value || 0;
    }
  }

  /**
   * Fetches trading history for a wallet using Helius (mit Caching und 429-Handling)
   */
  private async getTradeHistory(address: string): Promise<TradeHistory[]> {
    const now = Date.now();
    if (tradeCache[address] && now - tradeCache[address].ts < 60_000) {
      return tradeCache[address].value;
    }
    try {
      const url = `${this.HELIUS_ENDPOINT}/addresses/${address}/transactions?api-key=${this.HELIUS_API_KEY}`;
      const res = await fetch(url);
      if (res.status === 429) {
        console.error('Helius rate limit (trades)');
        throw new Error('Rate limit exceeded, try again later');
      }
      if (!res.ok) throw new Error('Helius API error');
      const data = await res.json();
      // Filter for Timer token transfers
      const trades: TradeHistory[] = [];
      for (const tx of data) {
        if (!tx.tokenTransfers) continue;
        for (const transfer of tx.tokenTransfers) {
          if (transfer.mint === this.TIMER_TOKEN_MINT) {
            trades.push({
              type: transfer.fromUserAccount === address ? 'sell' : 'buy',
              amount: Number(transfer.tokenAmount),
              price: 0, // Preis ggf. später ergänzen
              timestamp: new Date(tx.timestamp * 1000),
              txId: tx.signature
            });
          }
        }
      }
      tradeCache[address] = { value: trades, ts: now };
      return trades;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Rate limit')) throw error;
      console.error("Error fetching trade history (Helius):", error);
      return tradeCache[address]?.value || [];
    }
  }

  /**
   * Calculates the first time this wallet interacted with Timer token
   */
  private calculateFirstSeen(trades: TradeHistory[]): Date {
    if (trades.length === 0) {
      return new Date();
    }
    return new Date(Math.min(...trades.map(t => t.timestamp.getTime())));
  }

  /**
   * Calculates total trading volume
   */
  private calculateTotalVolume(trades: TradeHistory[]): number {
    return trades.reduce((sum, trade) => sum + (trade.amount * trade.price), 0);
  }

  /**
   * Calculates holding metrics including average holding time and holding score
   */
  private calculateHoldingMetrics(trades: TradeHistory[]): {
    averageHoldingTime: number;
    holdingScore: number;
    holdingTime: number;
  } {
    if (trades.length === 0) {
      return { averageHoldingTime: 0, holdingScore: 0, holdingTime: 0 };
    }

    // Sort trades by timestamp
    const sortedTrades = [...trades].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );

    // Calculate holding periods
    let totalHoldingTime = 0;
    let holdingPeriods = 0;
    let currentHoldingTime = 0;

    for (let i = 0; i < sortedTrades.length - 1; i++) {
      if (sortedTrades[i].type === 'buy') {
        const holdingTime = sortedTrades[i + 1].timestamp.getTime() - 
                          sortedTrades[i].timestamp.getTime();
        totalHoldingTime += holdingTime;
        holdingPeriods++;
      }
    }

    // If still holding from last buy
    if (sortedTrades[sortedTrades.length - 1].type === 'buy') {
      currentHoldingTime = new Date().getTime() - 
                        sortedTrades[sortedTrades.length - 1].timestamp.getTime();
      totalHoldingTime += currentHoldingTime;
      holdingPeriods++;
    }

    const averageHoldingTime = holdingPeriods > 0 ? 
      totalHoldingTime / holdingPeriods : 0;

    // Calculate holding score (0-100)
    const buyCount = trades.filter(t => t.type === 'buy').length;
    const sellCount = trades.filter(t => t.type === 'sell').length;
    const tradeRatio = buyCount > 0 ? sellCount / buyCount : 1;
    
    const holdingScore = Math.min(100, Math.max(0,
      (averageHoldingTime / (7 * 24 * 60 * 60 * 1000)) * 50 + // Up to 50 points for holding 1 week
      (1 - tradeRatio) * 50 // Up to 50 points for buy/sell ratio
    ));

    return {
      averageHoldingTime,
      holdingScore: Math.round(holdingScore),
      holdingTime: currentHoldingTime
    };
  }

  private calculateNextReward(balance: number, holdingTime: number): {
    amount: number;
    timestamp: Date;
    multiplier: number;
  } {
    // If balance is less than minimum or holding time is less than minimum
    if (balance < this.MIN_TOKENS || holdingTime < this.MIN_HOLD_TIME) {
      return {
        amount: 0,
        timestamp: new Date(0),
        multiplier: 0
      };
    }

    // Calculate holding time in hours
    const holdingHours = holdingTime / (60 * 60 * 1000);

    // Find applicable multiplier
    let multiplier = 1.0;
    for (const interval of this.REWARD_INTERVALS) {
      if (holdingHours >= interval.hours) {
        multiplier = interval.multiplier;
        break;
      }
    }

    // Calculate base reward
    const baseReward = (balance / this.MIN_TOKENS) * this.BASE_REWARD;
    
    // Calculate total reward with multiplier
    const totalReward = baseReward * multiplier;

    // Calculate next reward timestamp (next 30-minute interval)
    const now = new Date();
    const minutes = now.getMinutes();
    const nextRewardMinutes = minutes < 30 ? 30 : 60;
    const nextRewardTimestamp = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      nextRewardMinutes,
      0,
      0
    );

    return {
      amount: totalReward,
      timestamp: nextRewardTimestamp,
      multiplier
    };
  }

  // Neue Methode: Holder-Count über Helius
  async getHolderCount(): Promise<number> {
    try {
      const url = `https://api.helius.xyz/v0/tokens/holders?api-key=${this.HELIUS_API_KEY}&mint=${this.TIMER_TOKEN_MINT}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Helius API error');
      const holders = await res.json();
      return Array.isArray(holders) ? holders.length : (holders?.result?.length || 0);
    } catch (e) {
      console.error('Error fetching holder count (Helius):', e);
      return 0;
    }
  }

  // Neue Methode: Letzte 5 Trades (Buy/Sell) für den Timer-Token
  async getRecentTrades(): Promise<TradeHistory[]> {
    try {
      const url = `https://api.helius.xyz/v0/token-transfers?api-key=${this.HELIUS_API_KEY}&mint=${this.TIMER_TOKEN_MINT}&limit=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Helius API error');
      const data = await res.json() as HeliusTokenTransfer[];
      if (!Array.isArray(data)) return [];
      return data.map(tx => ({
        type: tx.fromUserAccount === tx.owner ? 'sell' : 'buy',
        amount: Number(tx.tokenAmount),
        price: 0,
        timestamp: new Date(tx.timestamp * 1000),
        txId: tx.signature
      }));
    } catch (e) {
      console.error('Error fetching recent trades (Helius):', e);
      return [];
    }
  }
}

export const walletService = new WalletService(); 