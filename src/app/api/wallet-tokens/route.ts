import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

interface DexscreenerToken {
  baseToken?: {
    address: string;
    name?: string;
    symbol?: string;
  };
  info?: {
    imageUrl?: string;
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');
  if (!address) {
    return NextResponse.json({ error: 'No address provided' }, { status: 400 });
  }

  try {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const publicKey = new PublicKey(address);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    });

    const tokenList = tokenAccounts.value
      .map(account => {
        const accountData = account.account.data.parsed.info;
        return {
          mint: accountData.mint,
          amount: accountData.tokenAmount.uiAmount
        };
      })
      .filter(token => token.amount > 0);

    const mints = tokenList.map(t => t.mint);
    console.log('[API] Token-Mints gefunden:', mints);

    if (mints.length === 0) {
      return NextResponse.json({ tokens: [] });
    }

    // Hole alle Token-Infos in einem Request
    const url = `https://api.dexscreener.com/tokens/v1/solana/${mints.join(',')}`;
    console.log('[API] Dexscreener Token-Request:', url);
    const response = await fetch(url);
    if (!response.ok) {
      console.log('[API] Dexscreener Antwort nicht ok:', response.status);
      return NextResponse.json({ tokens: tokenList });
    }
    const data = await response.json();
    console.log('[API] Dexscreener Token-Daten:', JSON.stringify(data));

    // Mappe die Dexscreener-Daten auf die Token-Liste
    const enrichedTokens = tokenList.map(token => {
      const info = Array.isArray(data) ? (data.find((d: DexscreenerToken) => d.baseToken?.address === token.mint)) : undefined;
      return {
        ...token,
        name: info?.baseToken?.name || '',
        symbol: info?.baseToken?.symbol || '',
        logo: info?.info?.imageUrl || ''
      };
    });

    return NextResponse.json({ tokens: enrichedTokens });
  } catch (err) {
    console.log('[API] Fehler:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 