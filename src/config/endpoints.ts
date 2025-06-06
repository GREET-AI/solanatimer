// Öffentliche RPC Endpoints für Solana
export const SOLANA_RPC_ENDPOINTS = [
    'https://mainnet.helius-rpc.com/?api-key=b7669fa4-c5ab-4b1f-93a7-3afb07f91a6b'
];

// Wähle einen zufälligen Endpoint
export function getRandomRPCEndpoint(): string {
    return SOLANA_RPC_ENDPOINTS[Math.floor(Math.random() * SOLANA_RPC_ENDPOINTS.length)];
} 