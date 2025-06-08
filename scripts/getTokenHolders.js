const fs = require('fs');

const API_KEY = process.env.HELIUS_PUBLIC_API_KEY;
const MINT = 'GNEFHjD8A5qxFrsS6hhMYhiMB6xXK4qydguNEPMLpump';
const url = `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`;

async function findHolders() {
  let page = 1;
  let allOwners = {};
  while (true) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'getTokenAccounts',
        id: 'helius-holders',
        params: {
          mint: MINT,
          page: page,
          limit: 1000,
        },
      }),
    });
    if (!response.ok) {
      console.log(`Error: ${response.status}, ${response.statusText}`);
      break;
    }
    const data = await response.json();
    if (!data.result || !data.result.token_accounts || data.result.token_accounts.length === 0) {
      console.log(`No more results. Total pages: ${page - 1}`);
      break;
    }
    console.log(`Processing results from page ${page}`);
    data.result.token_accounts.forEach((account) => {
      const owner = account.owner;
      const amount = Number(account.amount);
      if (!allOwners[owner]) allOwners[owner] = 0;
      allOwners[owner] += amount;
    });
    page++;
  }
  // Filter: nur Holder mit mindestens 100.000 Tokens
  const eligible = Object.entries(allOwners)
    .filter(([_, amount]) => amount >= 100_000)
    .map(([owner, amount]) => ({ owner, amount }));
  fs.writeFileSync('holders.json', JSON.stringify(eligible, null, 2));
  console.log(`Saved ${eligible.length} eligible holders to holders.json`);
}

findHolders(); 