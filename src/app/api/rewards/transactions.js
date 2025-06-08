import { NextResponse } from 'next/server';

export async function GET() {
  // 10 Dummy-Transaktionen für Proof-of-Concept
  const transactions = Array.from({ length: 10 }).map((_, i) => ({
    hash: `TX${i + 1}-ABC123...${i + 1}`,
    recipient: `Wallet${i + 1}-XYZ...${i + 1}`,
    amount: (Math.random() * 0.1 + 0.01).toFixed(3),
    timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
  }));
  return NextResponse.json({ transactions });
} 