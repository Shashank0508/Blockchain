// BlockDAG Testnet Configuration
const BLOCKDAG_CONFIG = {
    chainId: '0x413', // 1043 in hex
    chainName: 'Primordial BlockDAG Testnet',
    nativeCurrency: {
        name: 'BDAG',
        symbol: 'BDAG',
        decimals: 18
    },
    rpcUrls: ['https://rpc.primordial.bdagscan.com'],
    blockExplorerUrls: ['https://primordial.bdagscan.com']
};

// BlockDAG Network Information
const BLOCKDAG_NETWORK_INFO = {
    name: 'BlockDAG Testnet',
    symbol: 'BDAG',
    decimals: 18,
    faucetUrl: 'https://primordial.bdagscan.com/faucet',
    explorerUrl: 'https://primordial.bdagscan.com',
    rpcUrl: 'https://rpc.primordial.bdagscan.com',
    chainId: 1043,
    chainIdHex: '0x413'
};

// MetaMask Integration Class
class BlockchainBuddy {
    constructor() {
        this.isConnected = false;
        this.currentAccount = null;
        this.chainId = null;
        this.provider = null;
        this.balance = '0';
        this.initialize();
    }

    async initialize() {
        // Check if running locally (file:// protocol)
        if (window.location.protocol === 'file:') {
            this.showLocalDevelopmentMessage();
            return;
        }

        if (typeof window.ethereum !== 'undefined' && window.ethereum) {
            this.provider = window.ethereum;
            this.setupEventListeners();
            await this.checkConnection();
        } else {
            this.showMetaMaskInstallPrompt();
        }
    }

    setupEventListeners() {
        if (!this.provider) return;
        
        this.provider.on('accountsChanged', (accounts) => {
            this.handleAccountsChanged(accounts);
        });

        this.provider.on('chainChanged', (chainId) => {
            this.handleChainChanged(chainId);
        });

        this.provider.on('disconnect', () => {
            this.handleDisconnect();
        });
    }

    async checkConnection() {
        try {
            if (!this.provider) return;
            
            const accounts = await this.provider.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await this.handleAccountsChanged(accounts);
            }
        } catch (error) {
            console.error('Error checking MetaMask connection:', error);
        }
    }

    async connectWallet() {
        try {
            // Check if provider is available
            if (!this.provider) {
                this.showError('MetaMask is not installed. Please install MetaMask extension.');
                return false;
            }

            // Request account access
            const accounts = await this.provider.request({ 
                method: 'eth_requestAccounts' 
            });
            
            await this.handleAccountsChanged(accounts);
            
            // Check if we're on the correct network
            await this.checkAndSwitchNetwork();
            
            return true;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            this.showError('Failed to connect wallet: ' + error.message);
            return false;
        }
    }

    async handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            // User disconnected wallet
            this.isConnected = false;
            this.currentAccount = null;
            this.updateUI();
        } else {
            // User switched accounts
            this.isConnected = true;
            this.currentAccount = accounts[0];
            await this.updateUI();
            await this.getBalance();
        }
    }

    async handleChainChanged(chainId) {
        this.chainId = chainId;
        await this.updateUI();
        
        if (chainId !== BLOCKDAG_CONFIG.chainId) {
            this.showWarning('Please switch to BlockDAG Testnet');
        }
    }

    handleDisconnect() {
        this.isConnected = false;
        this.currentAccount = null;
        this.updateUI();
        this.showInfo('Wallet disconnected');
    }

    async checkAndSwitchNetwork() {
        try {
            const chainId = await this.provider.request({ method: 'eth_chainId' });
            
            if (chainId !== BLOCKDAG_CONFIG.chainId) {
                await this.switchToBlockDAGNetwork();
            }
        } catch (error) {
            console.error('Error checking network:', error);
        }
    }

    async switchToBlockDAGNetwork() {
        try {
            await this.provider.request({
                method: 'wallet_addEthereumChain',
                params: [BLOCKDAG_CONFIG]
            });
            this.showSuccess('BlockDAG Testnet added successfully!');
        } catch (error) {
            console.error('Error switching network:', error);
            if (error.code === 4902) {
                // Network already exists, try to switch to it
                await this.switchToExistingBlockDAGNetwork();
            } else {
                this.showError('Please manually add BlockDAG Testnet to MetaMask');
            }
        }
    }

    async switchToExistingBlockDAGNetwork() {
        try {
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BLOCKDAG_CONFIG.chainId }]
            });
            this.showSuccess('Switched to BlockDAG Testnet!');
        } catch (error) {
            console.error('Error switching to existing network:', error);
            this.showError('Failed to switch to BlockDAG Testnet');
        }
    }

    async validateBlockDAGNetwork() {
        try {
            const chainId = await this.provider.request({ method: 'eth_chainId' });
            return chainId === BLOCKDAG_CONFIG.chainId;
        } catch (error) {
            console.error('Error validating network:', error);
            return false;
        }
    }

    async getBalance() {
        if (!this.isConnected || !this.currentAccount) return '0';

        try {
            const balance = await this.provider.request({
                method: 'eth_getBalance',
                params: [this.currentAccount, 'latest']
            });
            
            // Convert from wei to BDAG
            const balanceInBDAG = this.weiToBDAG(balance);
            this.balance = balanceInBDAG;
            this.updateBalanceUI(balanceInBDAG);
            return balanceInBDAG;
        } catch (error) {
            console.error('Error getting balance:', error);
            return '0';
        }
    }

    weiToBDAG(wei) {
        return (parseInt(wei, 16) / Math.pow(10, 18)).toFixed(6);
    }

    BDAGToWei(bdag) {
        return (parseFloat(bdag) * Math.pow(10, 18)).toString(16);
    }

    async sendTransaction(toAddress, amount, message = '') {
        if (!this.isConnected || !this.currentAccount) {
            this.showError('Please connect your wallet first');
            return false;
        }

        // Validate we're on BlockDAG network
        const isOnBlockDAG = await this.validateBlockDAGNetwork();
        if (!isOnBlockDAG) {
            this.showError('Please switch to BlockDAG Testnet first');
            await this.switchToBlockDAGNetwork();
            return false;
        }

        // Validate address
        if (!await this.validateBlockDAGAddress(toAddress)) {
            this.showError('Invalid BDAG address format');
            return false;
        }

        // Check balance
        const balance = await this.getBlockDAGBalance();
        if (parseFloat(balance) < parseFloat(amount)) {
            this.showError(`Insufficient BDAG balance. You have ${balance} BDAG`);
            return false;
        }

        try {
            // Get current gas price
            const gasPrice = await this.provider.request({
                method: 'eth_gasPrice'
            });

            // Use a fixed gas limit for BlockDAG testnet to avoid estimation issues
            const gasLimit = '0x5208'; // 21000 gas (standard transfer)

            // Calculate total cost (amount + gas)
            const gasCostWei = (parseInt(gasLimit, 16) * parseInt(gasPrice, 16));
            const gasCost = this.weiToBDAG(gasCostWei.toString(16));
            const totalCost = parseFloat(amount) + parseFloat(gasCost);

            if (parseFloat(balance) < totalCost) {
                this.showError(`Insufficient balance for transaction. Need ${totalCost} BDAG (${amount} + ${gasCost} gas)`);
                return false;
            }

            // Send transaction with fixed gas limit
            const transactionParameters = {
                to: toAddress,
                from: this.currentAccount,
                value: this.BDAGToWei(amount),
                gas: gasLimit,
                gasPrice: gasPrice
            };

            this.showInfo('Sending BDAG transaction... Please confirm in MetaMask');

            const txHash = await this.provider.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters]
            });

            this.showSuccess(`BDAG transaction sent! Hash: ${txHash}`);
            this.logBlockDAGTransaction(txHash, toAddress, amount, message);
            
            // Wait for transaction confirmation
            await this.waitForTransactionConfirmation(txHash);
            
            return txHash;
        } catch (error) {
            console.error('Error sending transaction:', error);
            
            // Provide more specific error messages
            if (error.message.includes('insufficient funds')) {
                this.showError('Insufficient balance for transaction');
            } else if (error.message.includes('nonce')) {
                this.showError('Transaction nonce error. Please try again');
            } else if (error.message.includes('gas')) {
                this.showError('Gas estimation failed. Please try with a smaller amount');
            } else {
                this.showError('Failed to send BDAG transaction: ' + error.message);
            }
            return false;
        }
    }

    async sendBDAGToAddress(toAddress, amount, message = '') {
        return await this.sendTransaction(toAddress, amount, message);
    }

    async sendBDAGWithMessage(toAddress, amount, message = '') {
        // For BlockDAG, we'll encode the message in the transaction data
        // This is a simplified version - in real implementation you'd use proper encoding
        const encodedMessage = this.encodeMessage(message);
        
        try {
            const gasPrice = await this.provider.request({
                method: 'eth_gasPrice'
            });

            const gasEstimate = await this.provider.request({
                method: 'eth_estimateGas',
                params: [{
                    from: this.currentAccount,
                    to: toAddress,
                    value: this.BDAGToWei(amount),
                    data: encodedMessage
                }]
            });

            const transactionParameters = {
                to: toAddress,
                from: this.currentAccount,
                value: this.BDAGToWei(amount),
                gas: gasEstimate,
                gasPrice: gasPrice,
                data: encodedMessage
            };

            this.showInfo('Sending BDAG with message... Please confirm in MetaMask');

            const txHash = await this.provider.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters]
            });

            this.showSuccess(`BDAG transaction with message sent! Hash: ${txHash}`);
            this.logBlockDAGTransaction(txHash, toAddress, amount, message);
            
            await this.waitForTransactionConfirmation(txHash);
            return txHash;
        } catch (error) {
            console.error('Error sending BDAG with message:', error);
            this.showError('Failed to send BDAG with message: ' + error.message);
            return false;
        }
    }

    encodeMessage(message) {
        if (!message) return '0x';
        
        // Simple hex encoding for demo purposes
        // In production, you'd use proper ABI encoding
        const messageHex = '0x' + Array.from(message).map(char => 
            char.charCodeAt(0).toString(16).padStart(2, '0')
        ).join('');
        
        return messageHex;
    }

    async getTransactionHistory() {
        const transactions = JSON.parse(localStorage.getItem('blockdag_transactions') || '[]');
        
        // Update status of pending transactions
        for (let tx of transactions) {
            if (tx.status === 'pending') {
                tx.status = await this.getTransactionStatus(tx.hash);
            }
        }
        
        localStorage.setItem('blockdag_transactions', JSON.stringify(transactions));
        return transactions;
    }

    async estimateGasCost(toAddress, amount) {
        try {
            const gasPrice = await this.provider.request({
                method: 'eth_gasPrice'
            });

            const gasEstimate = await this.provider.request({
                method: 'eth_estimateGas',
                params: [{
                    from: this.currentAccount,
                    to: toAddress,
                    value: this.BDAGToWei(amount)
                }]
            });

            const gasCost = this.weiToBDAG((parseInt(gasEstimate, 16) * parseInt(gasPrice, 16)).toString(16));
            return {
                gasEstimate: parseInt(gasEstimate, 16),
                gasPrice: this.weiToBDAG(gasPrice),
                totalGasCost: gasCost
            };
        } catch (error) {
            console.error('Error estimating gas cost:', error);
            return null;
        }
    }

    async getBlockDAGBalance() {
        if (!this.isConnected || !this.currentAccount) return '0';

        const isOnBlockDAG = await this.validateBlockDAGNetwork();
        if (!isOnBlockDAG) {
            this.showWarning('Not on BlockDAG network. Switch to see BDAG balance.');
            return '0';
        }

        return await this.getBalance();
    }

    logBlockDAGTransaction(txHash, toAddress, amount, message) {
        const transaction = {
            hash: txHash,
            from: this.currentAccount,
            to: toAddress,
            amount: amount,
            message: message,
            network: 'BlockDAG Testnet',
            timestamp: Date.now(),
            status: 'pending'
        };

        console.log('BlockDAG Transaction:', transaction);
        
        // Store in localStorage for demo purposes
        const transactions = JSON.parse(localStorage.getItem('blockdag_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('blockdag_transactions', JSON.stringify(transactions));
    }

    async openBlockDAGFaucet() {
        if (!this.currentAccount) {
            this.showError('Please connect your wallet first');
            return;
        }

        const faucetUrl = `${BLOCKDAG_NETWORK_INFO.faucetUrl}?address=${this.currentAccount}`;
        window.open(faucetUrl, '_blank');
        this.showInfo('Opening BlockDAG faucet. Paste your address to get test BDAG tokens.');
    }

    async openBlockDAGExplorer() {
        const explorerUrl = BLOCKDAG_NETWORK_INFO.explorerUrl;
        window.open(explorerUrl, '_blank');
        this.showInfo('Opening BlockDAG explorer to view transactions.');
    }

    async getBlockDAGNetworkInfo() {
        return {
            name: BLOCKDAG_NETWORK_INFO.name,
            symbol: BLOCKDAG_NETWORK_INFO.symbol,
            chainId: BLOCKDAG_NETWORK_INFO.chainId,
            rpcUrl: BLOCKDAG_NETWORK_INFO.rpcUrl,
            explorerUrl: BLOCKDAG_NETWORK_INFO.explorerUrl,
            faucetUrl: BLOCKDAG_NETWORK_INFO.faucetUrl
        };
    }

    async validateBlockDAGAddress(address) {
        // Basic Ethereum address validation - more lenient for testnet
        if (!address || typeof address !== 'string') {
            return false;
        }
        
        // Check if it's a valid hex address
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            return false;
        }
        
        // Additional checks for BlockDAG testnet
        // Allow any valid hex address for now
        return true;
    }

    async waitForTransactionConfirmation(txHash, maxAttempts = 30) {
        this.showInfo('Waiting for transaction confirmation...');
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const receipt = await this.provider.request({
                    method: 'eth_getTransactionReceipt',
                    params: [txHash]
                });

                if (receipt && receipt.status === '0x1') {
                    this.showSuccess('Transaction confirmed on BlockDAG network!');
                    this.updateTransactionStatus(txHash, 'confirmed');
                    return true;
                } else if (receipt && receipt.status === '0x0') {
                    this.showError('Transaction failed on BlockDAG network');
                    this.updateTransactionStatus(txHash, 'failed');
                    return false;
                }

                // Wait 2 seconds before next check
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error('Error checking transaction status:', error);
            }
        }

        this.showWarning('Transaction pending. Check explorer for status.');
        return false;
    }

    updateTransactionStatus(txHash, status) {
        const transactions = JSON.parse(localStorage.getItem('blockdag_transactions') || '[]');
        const transaction = transactions.find(tx => tx.hash === txHash);
        if (transaction) {
            transaction.status = status;
            transaction.confirmedAt = Date.now();
            localStorage.setItem('blockdag_transactions', JSON.stringify(transactions));
        }
    }

    async getTransactionStatus(txHash) {
        try {
            const receipt = await this.provider.request({
                method: 'eth_getTransactionReceipt',
                params: [txHash]
            });

            if (!receipt) return 'pending';
            return receipt.status === '0x1' ? 'confirmed' : 'failed';
        } catch (error) {
            console.error('Error getting transaction status:', error);
            return 'unknown';
        }
    }

    async updateUI() {
        const connectWalletBtn = document.getElementById('connectWalletBtn');
        const openWalletBtn = document.getElementById('openWalletBtn');
        const walletInfo = document.getElementById('walletInfo');
        const networkStatus = document.querySelector('.network-status');

        if (this.isConnected && this.currentAccount) {
            // Update connect wallet button
            if (connectWalletBtn) {
                connectWalletBtn.textContent = 'Wallet Connected';
                connectWalletBtn.classList.add('connected');
            }

            // Show open wallet button
            if (openWalletBtn) {
                openWalletBtn.style.display = 'inline-block';
            }

            // Show wallet info (if it exists - for backward compatibility)
            if (walletInfo) {
                walletInfo.style.display = 'block';
                
                // Update full address
                const fullAddressElement = document.getElementById('fullWalletAddress');
                if (fullAddressElement) {
                    fullAddressElement.textContent = this.currentAccount;
                }
                
                // Update balance
                const balanceElement = document.getElementById('detailedBalance');
                if (balanceElement) {
                    const blockDAGBalance = await this.getBlockDAGBalance();
                    balanceElement.textContent = `${blockDAGBalance} BDAG`;
                }
                
                // Update network status
                const networkElement = document.getElementById('networkStatus');
                if (networkElement) {
                    const isOnBlockDAG = await this.validateBlockDAGNetwork();
                    if (isOnBlockDAG) {
                        networkElement.textContent = 'BlockDAG Testnet';
                        networkElement.style.color = '#10b981';
                    } else {
                        networkElement.textContent = 'Wrong Network';
                        networkElement.style.color = '#f59e0b';
                    }
                }
                
                // Update wallet status
                const statusElement = walletInfo.querySelector('.wallet-status');
                if (statusElement) {
                    statusElement.textContent = 'Connected';
                    statusElement.className = 'wallet-status connected';
                }
            }

            // Update network status in header
            if (networkStatus) {
                const statusText = networkStatus.querySelector('.status-text');
                if (statusText) {
                    const isOnBlockDAG = await this.validateBlockDAGNetwork();
                    if (isOnBlockDAG) {
                        statusText.textContent = 'Connected to BlockDAG Testnet';
                        statusText.style.color = '#10b981';
                    } else {
                        statusText.textContent = 'Connected (Wrong Network)';
                        statusText.style.color = '#f59e0b';
                    }
                }
            }
        } else {
            // Reset UI
            if (connectWalletBtn) {
                connectWalletBtn.textContent = 'Connect Wallet';
                connectWalletBtn.classList.remove('connected');
            }

            // Hide open wallet button
            if (openWalletBtn) {
                openWalletBtn.style.display = 'none';
            }

            if (walletInfo) {
                walletInfo.style.display = 'none';
            }

            if (networkStatus) {
                const statusText = networkStatus.querySelector('.status-text');
                if (statusText) {
                    statusText.textContent = 'Not Connected';
                    statusText.style.color = '#6b7280';
                }
            }
        }
    }

    updateBalanceUI(balance) {
        const balanceElement = document.querySelector('.wallet-balance');
        if (balanceElement) {
            balanceElement.textContent = `${balance} BDAG`;
        }
    }

    shortenAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    showMetaMaskInstallPrompt() {
        this.showError('MetaMask is not installed. Please install MetaMask extension.');
    }

    showLocalDevelopmentMessage() {
        this.showInfo('Running in local development mode. MetaMask requires HTTPS or localhost. Please use a local server like Live Server extension.');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showWarning(message) {
        this.showNotification(message, 'warning');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 0.5rem;
            color: white;
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = '#10b981';
                break;
            case 'error':
                notification.style.background = '#ef4444';
                break;
            case 'warning':
                notification.style.background = '#f59e0b';
                break;
            default:
                notification.style.background = '#3b82f6';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize Blockchain Buddy when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.blockchainBuddy = new BlockchainBuddy();
    
    // Add event listener to connect wallet button
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', async () => {
            await window.blockchainBuddy.connectWallet();
            if (typeof updateWalletInfo === 'function') {
                updateWalletInfo();
            }
        });
    }
});

// Global functions for transfer interface
window.openTransfer = function() {
    document.getElementById('transferSection').style.display = 'block';
    document.getElementById('chatSection').style.display = 'none';
};

window.closeTransfer = function() {
    document.getElementById('transferSection').style.display = 'none';
};

window.estimateGas = async function() {
    const recipient = document.getElementById('recipientAddress').value;
    const amount = document.getElementById('bdagAmount').value;
    
    if (!recipient || !amount) {
        window.blockchainBuddy.showError('Please enter recipient address and amount');
        return;
    }
    
    if (!window.blockchainBuddy.isConnected) {
        window.blockchainBuddy.showError('Please connect your wallet first');
        return;
    }
    
    const gasEstimate = await window.blockchainBuddy.estimateGasCost(recipient, amount);
    if (gasEstimate) {
        document.getElementById('summaryRecipient').textContent = recipient.slice(0, 10) + '...' + recipient.slice(-8);
        document.getElementById('summaryAmount').textContent = amount + ' BDAG';
        document.getElementById('summaryGas').textContent = gasEstimate.totalGasCost + ' BDAG';
        document.getElementById('summaryTotal').textContent = (parseFloat(amount) + parseFloat(gasEstimate.totalGasCost)).toFixed(6) + ' BDAG';
        document.getElementById('transferSummary').style.display = 'block';
    }
};

window.sendBDAGTransaction = async function() {
    const recipient = document.getElementById('recipientAddress').value;
    const amount = document.getElementById('bdagAmount').value;
    const message = document.getElementById('transactionMessage').value;
    
    if (!recipient || !amount) {
        window.blockchainBuddy.showError('Please enter recipient address and amount');
        return;
    }
    
    if (!window.blockchainBuddy.isConnected) {
        window.blockchainBuddy.showError('Please connect your wallet first');
        return;
    }
    
    if (message) {
        await window.blockchainBuddy.sendBDAGWithMessage(recipient, amount, message);
    } else {
        await window.blockchainBuddy.sendBDAGToAddress(recipient, amount);
    }
    
    // Clear form after successful transaction
    document.getElementById('recipientAddress').value = '';
    document.getElementById('bdagAmount').value = '';
    document.getElementById('transactionMessage').value = '';
    document.getElementById('transferSummary').style.display = 'none';
};

// Open wallet page in new tab
window.openWalletPage = function() {
    window.open('wallet.html', '_blank');
};

// Copy wallet address to clipboard
window.copyAddress = function() {
    const address = window.blockchainBuddy.currentAccount;
    if (address) {
        navigator.clipboard.writeText(address).then(() => {
            window.blockchainBuddy.showSuccess('Address copied to clipboard!');
        }).catch(() => {
            window.blockchainBuddy.showError('Failed to copy address');
        });
    }
};

// Refresh wallet balance
window.refreshBalance = async function() {
    if (window.blockchainBuddy.isConnected) {
        const balance = await window.blockchainBuddy.getBlockDAGBalance();
        const balanceElement = document.getElementById('detailedBalance');
        if (balanceElement) {
            balanceElement.textContent = `${balance} BDAG`;
        }
        window.blockchainBuddy.showSuccess('Balance refreshed!');
    }
};

// Show transaction history
window.showTransactionHistory = async function() {
    if (window.blockchainBuddy.isConnected) {
        const history = await window.blockchainBuddy.getTransactionHistory();
        console.log('Transaction History:', history);
        
        if (history.length > 0) {
            let historyText = 'Recent Transactions:\n';
            history.slice(-5).forEach(tx => {
                historyText += `\n${tx.type}: ${tx.amount} BDAG\nHash: ${tx.hash}\nStatus: ${tx.status}\n`;
            });
            alert(historyText);
        } else {
            window.blockchainBuddy.showInfo('No transactions found');
        }
    } else {
        window.blockchainBuddy.showError('Please connect your wallet first');
    }
};

// Add slide-in animation
const blockchainStyle = document.createElement('style');
blockchainStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .btn.connected {
        background: #10b981 !important;
        color: white !important;
    }
    
    .wallet-info {
        display: none;
        background: var(--bg-secondary);
        border: 2px solid #3b82f6;
        border-radius: 1rem;
        padding: 1.5rem;
        margin: 1rem auto;
        box-shadow: 0 8px 25px -5px rgba(59, 130, 246, 0.2);
        position: relative;
        min-width: 450px;
        max-width: 600px;
        z-index: 100;
    }
    
    .wallet-info::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #3b82f6, #10b981);
        border-radius: 1rem 1rem 0 0;
    }
    
    .wallet-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .wallet-header h4 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.125rem;
        font-weight: 600;
    }
    
    .wallet-status {
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 500;
    }
    
    .wallet-status.connected {
        background: #10b981;
        color: white;
    }
    
    .wallet-status.disconnected {
        background: #ef4444;
        color: white;
    }
    
    .wallet-details {
        margin-bottom: 1rem;
    }
    
    .wallet-item {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: var(--bg-tertiary);
        border-radius: 0.75rem;
        border: 1px solid var(--border-color);
    }
    
    .wallet-item .label {
        font-weight: 600;
        color: var(--text-primary);
        min-width: 100px;
        margin-right: 1rem;
        font-size: 0.9rem;
    }
    
    .address-container, .balance-container {
        display: flex;
        align-items: center;
        flex: 1;
        gap: 0.5rem;
    }
    
    .wallet-address {
        font-family: monospace;
        font-size: 0.875rem;
        color: var(--text-primary);
        flex: 1;
        word-break: break-all;
        background: var(--bg-primary);
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
    }
    
    .wallet-balance {
        font-weight: 700;
        color: #10b981;
        font-size: 1.1rem;
        flex: 1;
        background: var(--bg-primary);
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        text-align: center;
    }
    
    .wallet-network {
        color: #10b981;
        font-weight: 600;
        flex: 1;
        background: var(--bg-primary);
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        text-align: center;
    }
    
    .copy-btn, .refresh-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        margin-left: 0.5rem;
        transition: background-color 0.2s ease;
    }
    
    .copy-btn:hover, .refresh-btn:hover {
        background: var(--bg-tertiary);
    }
    
    .wallet-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin-top: 1rem;
    }
    
    .wallet-actions .btn-small {
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        border-radius: 0.5rem;
        font-weight: 500;
        transition: all 0.2s ease;
    }
    
    .wallet-actions .btn-small:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .btn-small {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        border-radius: 0.375rem;
        border: 1px solid var(--border-color);
        background: var(--bg-secondary);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .btn-small:hover {
        background: var(--bg-tertiary);
        transform: translateY(-1px);
    }
    
    .transfer-section {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .transfer-container {
        background: var(--bg-secondary);
        border-radius: 1rem;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .transfer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .transfer-header h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.5rem;
        font-weight: 600;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .form-input, .form-textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        background: var(--input-bg);
        color: var(--text-primary);
        font-size: 0.875rem;
        transition: border-color 0.2s ease;
    }
    
    .form-input:focus, .form-textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-textarea {
        resize: vertical;
        min-height: 80px;
    }
    
    .transfer-summary {
        background: var(--bg-tertiary);
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .transfer-summary h4 {
        margin: 0 0 1rem 0;
        color: var(--text-primary);
        font-size: 1rem;
        font-weight: 600;
    }
    
    .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
    }
    
    .summary-item.total {
        border-top: 1px solid var(--border-color);
        padding-top: 0.5rem;
        margin-top: 0.5rem;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .transfer-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    @media (max-width: 768px) {
        .transfer-container {
            width: 95%;
            padding: 1.5rem;
        }
        
        .transfer-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(blockchainStyle); 