import { WalletAnalysis } from './wallet.service';

export interface RewardCalculation {
  baseReward: number;
  timeMultiplier: number;
  marketMultiplier: number;
  holdingBonus: number;
  totalReward: number;
  projectedDaily: number;
  projectedWeekly: number;
  projectedMonthly: number;
  tier: RewardTier;
}

export interface RewardTier {
  name: string;
  color: string;
  minScore: number;
  multiplier: number;
}

class RewardService {
  // Constants for reward calculation
  private readonly BASE_REWARD_RATE = 0.00001; // Base reward per token
  private readonly MAX_TIME_MULTIPLIER = 2.5;
  private readonly MAX_MARKET_MULTIPLIER = 3.0;
  private readonly MAX_HOLDING_BONUS = 1.5;
  
  // Reward tiers based on holding score
  private readonly REWARD_TIERS: RewardTier[] = [
    {
      name: "Diamond",
      color: "#1E90FF",
      minScore: 90,
      multiplier: 2.0
    },
    {
      name: "Platinum",
      color: "#E5E4E2",
      minScore: 75,
      multiplier: 1.5
    },
    {
      name: "Gold",
      color: "#FFD700",
      minScore: 60,
      multiplier: 1.25
    },
    {
      name: "Silver",
      color: "#C0C0C0",
      minScore: 40,
      multiplier: 1.1
    },
    {
      name: "Bronze",
      color: "#CD7F32",
      minScore: 20,
      multiplier: 1.0
    },
    {
      name: "Wood",
      color: "#966F33",
      minScore: 0,
      multiplier: 0.9
    }
  ];

  /**
   * Calculates rewards based on wallet analysis
   */
  public calculateRewards(analysis: WalletAnalysis): RewardCalculation {
    // Calculate base reward
    const baseReward = analysis.timerBalance * this.BASE_REWARD_RATE;

    // Calculate time multiplier (based on average holding time)
    const timeMultiplier = this.calculateTimeMultiplier(analysis.averageHoldingTime);

    // Calculate market multiplier (based on total volume and balance)
    const marketMultiplier = this.calculateMarketMultiplier(
      analysis.timerBalance,
      analysis.totalVolume
    );

    // Calculate holding bonus (based on holding score)
    const holdingBonus = this.calculateHoldingBonus(analysis.holdingScore);

    // Get reward tier
    const tier = this.getRewardTier(analysis.holdingScore);

    // Calculate total reward
    const totalReward = baseReward * 
      timeMultiplier * 
      marketMultiplier * 
      holdingBonus *
      tier.multiplier;

    return {
      baseReward,
      timeMultiplier,
      marketMultiplier,
      holdingBonus,
      totalReward,
      projectedDaily: totalReward * 48, // 48 distributions per day
      projectedWeekly: totalReward * 48 * 7,
      projectedMonthly: totalReward * 48 * 30,
      tier
    };
  }

  /**
   * Calculates time multiplier based on average holding time
   */
  private calculateTimeMultiplier(averageHoldingTime: number): number {
    // Convert holding time to days
    const holdingDays = averageHoldingTime / (24 * 60 * 60 * 1000);
    
    // Base multiplier starts at 1.0
    const BASE_MULTIPLIER = 1.0;
    const DAILY_BONUS = 0.014285714; // 0.1 per week
    
    // Calculate bonus based on holding time
    const timeBonus = Math.min(
      holdingDays * DAILY_BONUS,
      this.MAX_TIME_MULTIPLIER - BASE_MULTIPLIER
    );
    
    return BASE_MULTIPLIER + timeBonus;
  }

  /**
   * Calculates market multiplier based on balance and volume
   */
  private calculateMarketMultiplier(balance: number, volume: number): number {
    const BASE_MULTIPLIER = 1.0;
    const VOLUME_WEIGHT = 0.4;
    const BALANCE_WEIGHT = 0.6;
    
    // Volume score (0-1)
    const volumeScore = Math.min(volume / 1000000, 1);
    
    // Balance score (0-1)
    const balanceScore = Math.min(balance / 1000000, 1);
    
    // Weighted average of scores
    const weightedScore = (volumeScore * VOLUME_WEIGHT) + 
                         (balanceScore * BALANCE_WEIGHT);
    
    // Calculate final multiplier
    return BASE_MULTIPLIER + (weightedScore * (this.MAX_MARKET_MULTIPLIER - BASE_MULTIPLIER));
  }

  /**
   * Calculates holding bonus based on holding score
   */
  private calculateHoldingBonus(holdingScore: number): number {
    const BASE_BONUS = 1.0;
    return BASE_BONUS + ((holdingScore / 100) * (this.MAX_HOLDING_BONUS - BASE_BONUS));
  }

  /**
   * Gets the reward tier based on holding score
   */
  private getRewardTier(holdingScore: number): RewardTier {
    return this.REWARD_TIERS.find(tier => holdingScore >= tier.minScore) || 
           this.REWARD_TIERS[this.REWARD_TIERS.length - 1];
  }
}

export const rewardService = new RewardService(); 