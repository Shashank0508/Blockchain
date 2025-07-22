// MetaMask Connection Test Script
// Run this in browser console to verify connection

console.log('🔗 Testing MetaMask Connection to Blockchain Buddy');
console.log('================================================');

// Test connection status
function testConnection() {
    console.log('\n📋 Connection Status:');
    
    if (window.blockchainBuddy) {
        console.log('✅ Blockchain integration loaded');
        console.log('Connected:', window.blockchainBuddy.isConnected);
        console.log('Account:', window.blockchainBuddy.currentAccount);
        console.log('Balance:', window.blockchainBuddy.balance);
        
        if (window.blockchainBuddy.isConnected) {
            console.log('🎉 SUCCESS: MetaMask is connected!');
        } else {
            console.log('⚠️ MetaMask not connected yet');
        }
    } else {
        console.log('❌ Blockchain integration not found');
    }
}

// Test network connection
async function testNetwork() {
    console.log('\n📋 Network Status:');
    
    try {
        const isOnBlockDAG = await window.blockchainBuddy.validateBlockDAGNetwork();
        console.log('On BlockDAG Testnet:', isOnBlockDAG);
        
        if (isOnBlockDAG) {
            console.log('✅ SUCCESS: Connected to BlockDAG Testnet!');
        } else {
            console.log('⚠️ Not on BlockDAG Testnet - switching...');
            await window.blockchainBuddy.switchToBlockDAGNetwork();
        }
    } catch (error) {
        console.log('❌ Network test error:', error.message);
    }
}

// Test wallet info display
function testWalletDisplay() {
    console.log('\n📋 Wallet Display:');
    
    const walletInfo = document.getElementById('walletInfo');
    const connectBtn = document.getElementById('connectWalletBtn');
    
    if (walletInfo) {
        console.log('Wallet info element found:', walletInfo.style.display !== 'none');
    }
    
    if (connectBtn) {
        console.log('Connect button text:', connectBtn.textContent);
        console.log('Connect button has "connected" class:', connectBtn.classList.contains('connected'));
    }
}

// Test balance display
async function testBalance() {
    console.log('\n📋 Balance Display:');
    
    try {
        const balance = await window.blockchainBuddy.getBlockDAGBalance();
        console.log('Current BDAG Balance:', balance);
        
        const balanceElement = document.querySelector('.wallet-balance');
        if (balanceElement) {
            console.log('Balance element text:', balanceElement.textContent);
        }
    } catch (error) {
        console.log('❌ Balance test error:', error.message);
    }
}

// Test UI elements
function testUIElements() {
    console.log('\n📋 UI Elements:');
    
    const elements = {
        'Connect Wallet Button': document.getElementById('connectWalletBtn'),
        'Wallet Info Section': document.getElementById('walletInfo'),
        'Faucet Button': document.getElementById('faucetBtn'),
        'Send BDAG Button': document.getElementById('sendBDAGBtn'),
        'Explorer Button': document.getElementById('explorerBtn'),
        'Network Status': document.querySelector('.network-status')
    };
    
    for (const [name, element] of Object.entries(elements)) {
        if (element) {
            console.log(`✅ ${name}: Found`);
        } else {
            console.log(`❌ ${name}: Not found`);
        }
    }
}

// Run all connection tests
async function runConnectionTests() {
    console.log('🚀 Starting MetaMask Connection Tests...\n');
    
    testConnection();
    await testNetwork();
    testWalletDisplay();
    await testBalance();
    testUIElements();
    
    console.log('\n✅ Connection tests completed!');
    console.log('\n📝 If all tests pass, your MetaMask is properly connected!');
}

// Manual test functions
window.testMetaMaskConnection = {
    runConnectionTests,
    testConnection,
    testNetwork,
    testWalletDisplay,
    testBalance,
    testUIElements
};

console.log('💡 Run testMetaMaskConnection.runConnectionTests() to test connection');
console.log('💡 Or run individual tests like testMetaMaskConnection.testConnection()');

// Auto-run basic connection test
setTimeout(() => {
    testConnection();
    testUIElements();
}, 1000); 