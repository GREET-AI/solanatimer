import fetch from 'node-fetch';
import fs from 'fs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables from .env or .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env') });
config({ path: resolve(__dirname, '../.env.local') });

// Configuration
const TOKEN_MINT = process.env.NEXT_PUBLIC_TIMER_MINT;
const HELIUS_API_KEY = process.env.HELIUS_PUBLIC_API_KEY;
const MIN_TOKENS = 100_000;
const MIN_HOLDING_TIME = 30; // minutes

if (!TOKEN_MINT) throw new Error('NEXT_PUBLIC_TIMER_MINT is not set in .env or .env.local');
if (!HELIUS_API_KEY) throw new Error('HELIUS_PUBLIC_API_KEY is not set in .env or .env.local');

async function getEligibleHolders() {
    console.log('Fetching token holders...');
    
    // KORREKTE REST-API URL!
    const url = `https://api.helius.xyz/v0/tokens/holders?api-key=${HELIUS_API_KEY}&mint=${TOKEN_MINT}`;
    const res = await fetch(url);
    if (!res.ok) {
        const errorText = await res.text();
        console.error('Helius API error:', errorText);
        throw new Error('Helius API error');
    }
    const holders = await res.json();
    
    // Falls die API ein Objekt mit .result zurückgibt:
    const holderList = Array.isArray(holders) ? holders : holders.result || [];
    
    console.log(`Found ${holderList.length} total holders`);
    
    // Filter holders with minimum balance
    const eligibleByBalance = holderList.filter(h => Number(h.amount) >= MIN_TOKENS);
    console.log(`${eligibleByBalance.length} holders have at least ${MIN_TOKENS} tokens`);
    
    // Check holding time for each eligible holder
    const eligibleHolders = [];
    for (const holder of eligibleByBalance) {
        const holdingTime = await checkHoldingTime(holder.owner);
        if (holdingTime >= MIN_HOLDING_TIME) {
            eligibleHolders.push({
                address: holder.owner,
                balance: Number(holder.amount),
                holdingTimeMinutes: holdingTime
            });
        }
    }
    
    console.log(`Found ${eligibleHolders.length} eligible holders with minimum balance and holding time`);
    
    // Save results to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `eligible-holders-${timestamp}.json`;
    fs.writeFileSync(filename, JSON.stringify(eligibleHolders, null, 2));
    console.log(`Results saved to ${filename}`);
    
    return eligibleHolders;
}

async function checkHoldingTime(wallet) {
    try {
        // Get recent transactions for the wallet
        const url = `https://api.helius.xyz/v0/addresses/${wallet}/transactions?api-key=${HELIUS_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) return 0;
        const txs = await res.json();
        
        // Find the last transaction that affected the token balance
        let lastTx = null;
        for (const tx of txs) {
            if (tx.tokenTransfers) {
                for (const transfer of tx.tokenTransfers) {
                    if (transfer.mint === TOKEN_MINT && transfer.userAccount === wallet) {
                        lastTx = tx;
                        break;
                    }
                }
            }
            if (lastTx) break;
        }
        
        if (!lastTx) return 0;
        
        // Calculate holding time in minutes
        const now = Math.floor(Date.now() / 1000);
        const txTime = lastTx.timestamp;
        const holdingTimeMinutes = (now - txTime) / 60;
        
        return Math.floor(holdingTimeMinutes);
    } catch (error) {
        console.error(`Error checking holding time for ${wallet}:`, error);
        return 0;
    }
}

// Run the script
getEligibleHolders().catch(console.error); 