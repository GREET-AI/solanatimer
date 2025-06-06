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

interface Transfer {
  amount: string;
  block: { timestamp: string };
  transaction: { hash: string };
}

class WalletService {
  private connection: Connection;
  private TIMER_TOKEN_MINT = "3T721bpRc5FNY84W36vWffxoKs4FLXhBpSaqwUCRpump";
  private PUMPSWAP_PROGRAM = "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA";
  private BITQUERY_API_KEY = process.env.NEXT_PUBLIC_BITQUERY_API_KEY || "";
  private BITQUERY_ENDPOINT = "https://graphql.bitquery.io";
  
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

    if (!this.BITQUERY_API_KEY) {
      console.warn("NEXT_PUBLIC_BITQUERY_API_KEY is not set in environment variables");
    }
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

  /**
   * Fetches complete wallet analysis including trading history and metrics
   */
  public async analyzeWallet(address: string): Promise<WalletAnalysis> {
    if (!this.isValidAddress(address)) {
      throw new Error("Invalid wallet address");
    }

    try {
      const [timerBalance, trades] = await Promise.all([
        this.getTimerBalance(address),
        this.getTradeHistory(address)
      ]);

      const firstSeen = this.calculateFirstSeen(trades);
      const totalVolume = this.calculateTotalVolume(trades);
      const holdingMetrics = this.calculateHoldingMetrics(trades);
      const nextReward = this.calculateNextReward(timerBalance, holdingMetrics.holdingTime);

      return {
        address,
        timerBalance,
        firstSeen,
        lastActive: trades.length > 0 
          ? new Date(Math.max(...trades.map(t => t.timestamp.getTime())))
          : new Date(),
        trades,
        totalVolume,
        averageHoldingTime: holdingMetrics.averageHoldingTime,
        holdingScore: holdingMetrics.holdingScore,
        nextReward
      };
    } catch (error) {
      console.error("Error analyzing wallet:", error);
      throw new Error("Failed to analyze wallet");
    }
  }

  private async executeBitqueryQuery(query: string, variables: unknown) {
    try {
      if (!this.BITQUERY_API_KEY) {
        throw new Error("BITQUERY_API_KEY is not configured in environment variables");
      }

      const response = await fetch(this.BITQUERY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.BITQUERY_API_KEY}`,
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Bitquery API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`API request failed: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        throw new Error(data.errors[0].message);
      }

      return data;
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }

  /**
   * Fetches Timer token balance for a wallet
   */
  private async getTimerBalance(address: string): Promise<number> {
    try {
      const query = `
        query ($address: String!) {
          solana {
            transfers(
              receiver: {is: $address}
              currency: {is: "${this.TIMER_TOKEN_MINT}"}
            ) {
              amount
            }
          }
        }
      `;

      const variables = {
        address
      };

      const data = await this.executeBitqueryQuery(query, variables);
      const transfer = data?.data?.solana?.transfers?.[0];
      return transfer ? Number(transfer.amount) : 0;
    } catch (error) {
      console.error("Error fetching Timer balance:", error);
      return 0;
    }
  }

  /**
   * Fetches trading history for a wallet
   */
  private async getTradeHistory(address: string): Promise<TradeHistory[]> {
    try {
      const query = `
        query ($address: String!) {
          solana {
            transfers(
              currency: {is: "${this.TIMER_TOKEN_MINT}"}
              sender: {is: $address}
            ) {
              amount
              block {
                timestamp
              }
              transaction {
                hash
              }
            }
          }
        }
      `;

      const variables = {
        address
      };

      const data = await this.executeBitqueryQuery(query, variables);
      const transfers = data?.data?.solana?.transfers || [];

      return transfers.map((transfer: Transfer) => ({
        type: 'sell',
        amount: Number(transfer.amount),
        price: 0,
        timestamp: new Date(transfer.block.timestamp),
        txId: transfer.transaction.hash
      }));
    } catch (error) {
      console.error("Error fetching trade history:", error);
      throw error;
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
}

export const walletService = new WalletService(); 