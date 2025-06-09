import type { NextApiRequest, NextApiResponse } from 'next';

let cachedPrice = 0;
let lastFetch = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const now = Date.now();
  if (cachedPrice && now - lastFetch < 60_000) {
    return res.status(200).json({ price: cachedPrice });
  }
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    if (!response.ok) throw new Error('Coingecko API error');
    const data = await response.json();
    const price = data.solana?.usd;
    if (price) {
      cachedPrice = Number(price);
      lastFetch = now;
      return res.status(200).json({ price: cachedPrice });
    }
    return res.status(500).json({ error: 'No price found' });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch price' });
  }
} 