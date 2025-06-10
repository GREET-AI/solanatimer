import fetch from 'node-fetch';
import fs from 'fs';

// === CONFIG ===
const HELIUS_API_KEY = '572a2e50-90ac-4766-b78e-b76f2b258d6c';
const TOKEN_MINT = '5RFt7XFqESd8LoNEryYt3XtawZkt8uG7ohPL8J6upump';
const MIN_HOLD = 100_000; // Minimum TIMER to qualify
const FEE_PERCENT = 0.0005; // 0.05%
const SOL_DECIMALS = 9; // For SOL conversion

// === 1. Get all token holders ===
async function getTokenHolders() {
  const url = `https://api.helius.xyz/v0/tokens/holders?api-key=${HELIUS_API_KEY}&mint=${TOKEN_MINT}`;
  const res = await fetch(url);
  const holders = await res.json();
  console.log('HELIUS holders response:', holders);
  // return holders.filter(h => Number(h.amount) >= MIN_HOLD);
  return [];
}

// === 2. Get trading volume for last 30 minutes ===
async function getTokenVolume() {
  // Helius doesn't provide direct volume endpoint, so use Birdeye or Bitquery if needed.
  // For demo, let's mock this value:
  // TODO: Replace with real API call to Birdeye/Bitquery for 30min volume in SOL
  const volumeSOL = 1000; // <-- Replace with real value!
  return volumeSOL;
}

// === 3. Calculate rewards and output CSV ===
async function main() {
  const holders = await getTokenHolders();
  const volumeSOL = await getTokenVolume();
  const feePool = volumeSOL * FEE_PERCENT;

  // Calculate total eligible TIMER
  const totalEligible = holders.reduce((sum, h) => sum + Number(h.amount), 0);

  // Calculate rewards
  const rewards = holders.map(h => {
    const share = Number(h.amount) / totalEligible;
    const reward = share * feePool;
    return { address: h.owner, reward: reward.toFixed(8) };
  });

  // Output as CSV
  const csv = ['Wallet Address,Reward (SOL)']
    .concat(rewards.map(r => `${r.address},${r.reward}`))
    .join('\n');
  fs.writeFileSync('rewards.csv', csv);
  console.log('Rewards written to rewards.csv');
}

main(); 