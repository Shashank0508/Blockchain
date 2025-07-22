// Test Script for BDAG Transaction Features
// Run this in browser console to test functionality

console.log('🧪 BDAG Transaction Testing Script');
console.log('=====================================');

// Test 1: Check if blockchain integration is loaded
function testBlockchainIntegration() {
    console.log('\n📋 Test 1: Blockchain Integration');
    if (window.blockchainBuddy) {
        console.log('✅ Blockchain integration loaded');
        console.log('Connected:', window.blockchainBuddy.isConnected);
        console.log('Account:', window.blockchainBuddy.currentAccount);
        console.log('Balance:', window.blockchainBuddy.balance);
    } else {
        console.log('❌ Blockchain integration not found');
    }
}

// Test 2: Test address validation
async function testAddressValidation() {
    console.log('\n📋 Test 2: Address Validation');
    
    const validAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
    const invalidAddress = "invalid";
    
    try {
        const validResult = await window.blockchainBuddy.validateBlockDAGAddress(validAddress);
        console.log('✅ Valid address test:', validResult);
        
        const invalidResult = await window.blockchainBuddy.validateBlockDAGAddress(invalidAddress);
        console.log('✅ Invalid address test:', !invalidResult);
    } catch (error) {
        console.log('❌ Address validation error:', error);
    }
}

// Test 3: Test gas estimation (works without tokens)
async function testGasEstimation() {
    console.log('\n📋 Test 3: Gas Estimation');
    
    const testAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
    const testAmount = "0.001";
    
    try {
        const gasEstimate = await window.blockchainBuddy.estimateGasCost(testAddress, testAmount);
        if (gasEstimate) {
            console.log('✅ Gas estimation successful');
            console.log('Gas Estimate:', gasEstimate.gasEstimate);
            console.log('Gas Price:', gasEstimate.gasPrice, 'BDAG');
            console.log('Total Gas Cost:', gasEstimate.totalGasCost, 'BDAG');
        } else {
            console.log('❌ Gas estimation failed');
        }
    } catch (error) {
        console.log('❌ Gas estimation error:', error.message);
    }
}

// Test 4: Test network validation
async function testNetworkValidation() {
    console.log('\n📋 Test 4: Network Validation');
    
    try {
        const isOnBlockDAG = await window.blockchainBuddy.validateBlockDAGNetwork();
        console.log('✅ On BlockDAG network:', isOnBlockDAG);
        
        if (!isOnBlockDAG) {
            console.log('⚠️ Not on BlockDAG network - switching...');
            await window.blockchainBuddy.switchToBlockDAGNetwork();
        }
    } catch (error) {
        console.log('❌ Network validation error:', error.message);
    }
}

// Test 5: Test UI functions
function testUIFunctions() {
    console.log('\n📋 Test 5: UI Functions');
    
    // Test opening transfer interface
    if (typeof openTransfer === 'function') {
        console.log('✅ openTransfer function available');
    } else {
        console.log('❌ openTransfer function not found');
    }
    
    // Test gas estimation function
    if (typeof estimateGas === 'function') {
        console.log('✅ estimateGas function available');
    } else {
        console.log('❌ estimateGas function not found');
    }
    
    // Test send transaction function
    if (typeof sendBDAGTransaction === 'function') {
        console.log('✅ sendBDAGTransaction function available');
    } else {
        console.log('❌ sendBDAGTransaction function not found');
    }
}

// Test 6: Test transaction history
async function testTransactionHistory() {
    console.log('\n📋 Test 6: Transaction History');
    
    try {
        const history = await window.blockchainBuddy.getTransactionHistory();
        console.log('✅ Transaction history retrieved');
        console.log('Number of transactions:', history.length);
        console.log('Recent transactions:', history.slice(-3));
    } catch (error) {
        console.log('❌ Transaction history error:', error.message);
    }
}

// Test 7: Test faucet and explorer functions
function testUtilityFunctions() {
    console.log('\n📋 Test 7: Utility Functions');
    
    try {
        // Test faucet function
        if (typeof window.blockchainBuddy.openBlockDAGFaucet === 'function') {
            console.log('✅ Faucet function available');
        } else {
            console.log('❌ Faucet function not found');
        }
        
        // Test explorer function
        if (typeof window.blockchainBuddy.openBlockDAGExplorer === 'function') {
            console.log('✅ Explorer function available');
        } else {
            console.log('❌ Explorer function not found');
        }
        
        // Test network info
        window.blockchainBuddy.getBlockDAGNetworkInfo().then(info => {
            console.log('✅ Network info:', info);
        });
        
    } catch (error) {
        console.log('❌ Utility functions error:', error.message);
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting BDAG Transaction Tests...\n');
    
    testBlockchainIntegration();
    await testAddressValidation();
    await testGasEstimation();
    await testNetworkValidation();
    testUIFunctions();
    await testTransactionHistory();
    testUtilityFunctions();
    
    console.log('\n✅ All tests completed!');
    console.log('\n📝 Next Steps:');
    console.log('1. Get test BDAG tokens from faucet');
    console.log('2. Test actual transaction sending');
    console.log('3. Monitor transaction confirmations');
}

// Manual test functions
window.testBDAGFeatures = {
    runAllTests,
    testBlockchainIntegration,
    testAddressValidation,
    testGasEstimation,
    testNetworkValidation,
    testUIFunctions,
    testTransactionHistory,
    testUtilityFunctions
};

console.log('💡 Run testBDAGFeatures.runAllTests() to test all features');
console.log('💡 Or run individual tests like testBDAGFeatures.testGasEstimation()');

// Auto-run basic tests
setTimeout(() => {
    testBlockchainIntegration();
    testUIFunctions();
}, 2000); 