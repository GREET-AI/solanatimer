import { NextRequest, NextResponse } from 'next/server';
import { walletService } from '@/lib/services/wallet.service';

export async function GET(req: NextRequest) {
  const { searchParams, pathname } = new URL(req.url);
  const address = searchParams.get('address');
  if (pathname.endsWith('/holders')) {
    const count = await walletService.getHolderCount();
    return NextResponse.json({ holderCount: count });
  }
  if (pathname.endsWith('/recent-trades')) {
    const trades = await walletService.getRecentTrades();
    return NextResponse.json({ trades });
  }
  if (!address) {
    return NextResponse.json({ error: 'No address provided' }, { status: 400 });
  }

  try {
    const analysis = await walletService.analyzeWallet(address);
    return NextResponse.json({
      ...analysis,
      heldForMinutes: Math.floor(analysis.heldForMinutes),
    });
  } catch (error) {
    console.error('Error in wallet analysis:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze wallet' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 