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

interface TokenData {
  amount: number;
  mint: string;
  name?: string;
}

interface DexscreenerResponse {
  tokens: DexscreenerToken[];
}

// Globales Caching für Wallet-Tokens (pro Adresse, 60 Sekunden)
const walletTokenCache: Record<string, { value: { tokens: TokenData[] }, ts: number }> = {};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');
  if (!address) {
    return NextResponse.json({ error: 'No address provided' }, { status: 400 });
  }

  // Caching-Check
  const now = Date.now();
  if (walletTokenCache[address] && now - walletTokenCache[address].ts < 60_000) {
    return NextResponse.json(walletTokenCache[address].value);
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
      walletTokenCache[address] = { value: { tokens: [] }, ts: now };
      return NextResponse.json({ tokens: [] });
    }

    // Hole alle Token-Infos in einem Request
    const url = `https://api.dexscreener.com/tokens/v1/solana/${mints.join(',')}`;
    console.log('[API] Dexscreener Token-Request:', url);
    const response = await fetch(url);
    if (!response.ok) {
      console.log('[API] Dexscreener Antwort nicht ok:', response.status);
      walletTokenCache[address] = { value: { tokens: tokenList }, ts: now };
      return NextResponse.json({ tokens: tokenList });
    }
    const data = await response.json() as DexscreenerResponse;
    console.log('[API] Dexscreener Token-Daten:', JSON.stringify(data));

    // Mappe die Dexscreener-Daten auf die Token-Liste
    const enrichedTokens = tokenList.map(token => {
      const info = Array.isArray(data.tokens) ? (data.tokens.find((d: DexscreenerToken) => d.baseToken?.address === token.mint)) : undefined;
      return {
        ...token,
        name: info?.baseToken?.name || '',
        symbol: info?.baseToken?.symbol || '',
        logo: info?.info?.imageUrl || ''
      };
    });

    const result = { tokens: enrichedTokens };
    walletTokenCache[address] = { value: result, ts: now };
    return NextResponse.json(result);
  } catch (err) {
    console.log('[API] Fehler:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}