import { NextResponse } from 'next/server';

export async function GET() {
  // Dummy-Transaktionen für Proof-of-Concept
  const transactions = [
    {
      hash: '5G7...abc',
      recipient: '7s8...xyz',
      amount: 0.035,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      hash: '9J2...def',
      recipient: '3kL...pqr',
      amount: 0.012,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      hash: '1A2...ghi',
      recipient: '8mN...stu',
      amount: 0.021,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ];
  return NextResponse.json({ transactions });
} 