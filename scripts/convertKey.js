import bs58 from 'bs58';

// HIER DEIN PHANTOM PRIVATE KEY ALS BASE58-STRING EINFÜGEN:
const base58Key = 'pCKh2PRJAUTMQ6U6dpMkqP61rYd181xFqAyZ3riL72P6D1aNEd8DxFhe83jyux4G35suqj7DNTAGPmoMgih4Kuw';

const arr = bs58.decode(base58Key);
console.log(JSON.stringify(Array.from(arr)));