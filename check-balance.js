const { Connection, PublicKey } = require('@solana/web3.js');

async function checkBalance(address) {
    // Verbindung zum Solana Mainnet
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    
    try {
        // Erstelle PublicKey aus der Adresse
        const publicKey = new PublicKey(address);
        
        // Hole SOL Balance
        const balance = await connection.getBalance(publicKey);
        console.log(`\nSOL Balance: ${balance / 1000000000} SOL`); // Convert lamports to SOL
        
        // Hole alle Token Accounts
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        });
        
        console.log('\nToken Balances:');
        tokenAccounts.value.forEach((tokenAccount) => {
            const accountData = tokenAccount.account.data.parsed.info;
            console.log(`${accountData.mint}: ${accountData.tokenAmount.uiAmount} ${accountData.tokenAmount.symbol || 'tokens'}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Die Wallet-Adresse, die wir überprüfen wollen
checkBalance('4FFpps8MLKGhqVhpX8AVYLnUGmXVNWPpjbMv8RFBSsrY'); 