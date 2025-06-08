require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

// === CONFIG ===
const TOKEN_MINT = process.env.NEXT_PUBLIC_TIMER_MINT;
if (!TOKEN_MINT) throw new Error('NEXT_PUBLIC_TIMER_MINT is not set in .env.local');
const MIN_HOLD = 100_000;
const REWARD_SHARE = 1.0;
const FEE_PERCENT = 0.0005;
const SOL_PRICE = 200; // USD
const REWARD_CYCLE_MINUTES = 30;
const HELIUS_KEY = process.env.HELIUS_PUBLIC_API_KEY;

// === 1. Alle Tokenholder holen (Helius API) ===
async function getTokenHolders() {
  const url = `https://api.helius.xyz/v0/tokens/holders?api-key=${HELIUS_KEY}&mint=${TOKEN_MINT}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Helius API error');
  const holders = await res.json();
  return holders.filter(h => h.amount >= MIN_HOLD);
}

// === 2. Volumen holen (optional, Birdeye) ===
async function get24hVolume() {
  // Dummy-Volumen für Test
  return 1000000; // 1 Mio USD
}

// === Helper: Prüfe Haltezeit ===
async function heldForAtLeast(wallet, minAmount, minMinutes) {
  // Hole die letzten 50 Transfers für diese Wallet und den Token
  const url = `https://api.helius.xyz/v0/addresses/${wallet}/transactions?api-key=${HELIUS_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return false;
  const txs = await res.json();
  // Finde die letzte Sell/Transfer, nach der der Kontostand >= minAmount war
  let balance = 0;
  let lastBelow = null;
  for (let i = txs.length - 1; i >= 0; i--) {
    const tx = txs[i];
    if (!tx.tokenTransfers) continue;
    for (const t of tx.tokenTransfers) {
      if (t.mint === TOKEN_MINT && t.userAccount === wallet) {
        balance += Number(t.tokenAmount) * (t.type === 'transfer' && t.fromUserAccount === wallet ? -1 : 1);
        if (balance < minAmount) lastBelow = new Date(tx.timestamp * 1000);
      }
    }
  }
  // Wenn nie unter minAmount, dann seit Anfang eligible
  const now = new Date();
  const since = lastBelow ? lastBelow : new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const heldMinutes = (now - since) / 60000;
  return heldMinutes >= minMinutes;
}

// === 3. Rewards berechnen ===
async function calcRewards() {
  const holders = await getTokenHolders();
  const dailyVolumeUsd = await get24hVolume();
  const cyclesPerDay = (24 * 60) / REWARD_CYCLE_MINUTES;
  const totalFees = dailyVolumeUsd * FEE_PERCENT;
  const rewardPoolUsd = totalFees * REWARD_SHARE;
  const rewardPoolSol = rewardPoolUsd / SOL_PRICE / cyclesPerDay;

  function getTokenMultiplier(tokens) {
    if (tokens >= 5_000_001) return 3;
    if (tokens >= 1_000_001) return 2;
    if (tokens >= 500_001) return 1.5;
    if (tokens >= 100_000) return 1;
    return 0;
  }

  const rewards = [];
  for (const h of holders) {
    const eligible = await heldForAtLeast(h.owner, MIN_HOLD, 30);
    if (!eligible) continue;
    rewards.push({
      wallet: h.owner,
      amount: Number((rewardPoolSol * getTokenMultiplier(h.amount)).toFixed(6)),
      tokens: h.amount
    });
  }

  fs.writeFileSync('public/rewards-latest.json', JSON.stringify({ rewards }, null, 2));
  console.log('Rewards-Liste gespeichert:', rewards);
}

calcRewards().catch(e => console.error(e)); 