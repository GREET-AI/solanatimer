import axios from 'axios';
import { config } from 'dotenv';
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import fs from 'fs';

// Load env
config({ path: '.env' });
config({ path: '.env.local' });

const TOKEN_MINT = process.env.TOKEN_MINT || process.env.NEXT_PUBLIC_TIMER_MINT;
const HELIUS_API_KEY = process.env.HELIUS_PUBLIC_API_KEY || process.env.HELIUS_PUBLIC_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const AIRDROP_AMOUNT = 0.001; // SOL
const MIN_TOKENS = 100_000;
const MIN_HOLDING_TIME = 30 * 60 * 1000; // 30 Minuten in ms
const INTERVAL = 5 * 60 * 1000; // 5 Minuten

if (!TOKEN_MINT || !HELIUS_API_KEY || !PRIVATE_KEY) {
  throw new Error('Bitte .env(.local) mit TOKEN_MINT, HELIUS_PUBLIC_API_KEY und PRIVATE_KEY ausstatten!');
}

const connection = new Connection('https://api.mainnet-beta.solana.com');
const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(PRIVATE_KEY)));

// Haltezeiten-Map und Log für gesendete Wallets
const holdingMap = new Map(); // {wallet: {balance, timestamp}}
const sentLogFile = 'airdrop-sent-log.json';
let sentLog = fs.existsSync(sentLogFile) ? JSON.parse(fs.readFileSync(sentLogFile)) : {};

async function fetchTokenHolders() {
  const url = `https://api.helius.xyz/v0/tokens/holders?api-key=${HELIUS_PUBLIC_API_KEY}&mint=${TOKEN_MINT}`;
  const response = await axios.get(url);
  // API gibt manchmal .result, manchmal Array
  return Array.isArray(response.data) ? response.data : response.data.result || [];
}

function checkEligibility(holders) {
  const now = Date.now();
  const eligible = [];
  for (const holder of holders) {
    const { owner, amount } = holder;
    if (Number(amount) >= MIN_TOKENS) {
      if (!holdingMap.has(owner)) {
        holdingMap.set(owner, { balance: amount, timestamp: now });
      } else {
        const heldTime = now - holdingMap.get(owner).timestamp;
        if (heldTime >= MIN_HOLDING_TIME && !sentLog[owner]) {
          eligible.push(owner);
        }
      }
    } else {
      holdingMap.delete(owner);
    }
  }
  return eligible;
}

async function sendSol(toAddress, amount = AIRDROP_AMOUNT) {
  try {
    const recipient = new PublicKey(toAddress);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );
    const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
    console.log(`✅ Sent ${amount} SOL to ${toAddress}. Tx: ${signature}`);
    return signature;
  } catch (e) {
    console.error(`❌ Error sending SOL to ${toAddress}:`, e.message);
    return null;
  }
}

async function main() {
  try {
    const holders = await fetchTokenHolders();
    const eligibleWallets = checkEligibility(holders);
    for (const wallet of eligibleWallets) {
      const sig = await sendSol(wallet, AIRDROP_AMOUNT);
      if (sig) {
        sentLog[wallet] = { timestamp: Date.now(), tx: sig };
        fs.writeFileSync(sentLogFile, JSON.stringify(sentLog, null, 2));
        holdingMap.delete(wallet);
      }
    }
    console.log(`Cycle complete. Next run in ${INTERVAL / 60000} mins.`);
  } catch (e) {
    console.error('Main loop error:', e.message);
  }
}

setInterval(main, INTERVAL);
main(); 