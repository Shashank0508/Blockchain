# Getting Test BDAG Tokens - Complete Guide

## Method 1: Official BlockDAG Faucet

### Step-by-Step Process:
1. **Go to Faucet**: https://primordial.bdagscan.com/faucet
2. **Copy Your Address**: From MetaMask (0xFB225...5EAC4)
3. **Enter Address**: Paste in "Enter Wallet Address" field
4. **Enter Amount**: Try 50 BDAG first
5. **Click "Send me BDAG"**
6. **Wait 2-5 minutes** for tokens to arrive

### Troubleshooting:
- **Check Network**: Ensure MetaMask shows "Primordial BlockDAG Testnet"
- **Check Balance**: Refresh MetaMask after 5 minutes
- **Try Smaller Amount**: Request 10 BDAG instead of 50

## Method 2: Alternative Faucets

### Option A: Discord Faucet
1. Join BlockDAG Discord: https://discord.gg/blockdag
2. Find #faucet channel
3. Request tokens with your address

### Option B: Telegram Faucet
1. Join BlockDAG Telegram: https://t.me/blockdag
2. Find faucet bot
3. Request tokens

## Method 3: Manual Network Addition

If faucet doesn't work, manually add the network:

### MetaMask Network Settings:
- **Network Name**: Primordial BlockDAG Testnet
- **RPC URL**: https://rpc.primordial.bdagscan.com
- **Chain ID**: 1043
- **Currency Symbol**: BDAG
- **Block Explorer**: https://primordial.bdagscan.com

## Method 4: Check Transaction Status

### In BlockDAG Explorer:
1. Go to: https://primordial.bdagscan.com
2. Search your wallet address
3. Check if faucet transaction appears

### In MetaMask:
1. Open MetaMask
2. Check "Activity" tab
3. Look for incoming transactions

## Common Issues & Solutions:

### Issue: "No tokens received"
**Solutions:**
- Wait longer (sometimes takes 5-10 minutes)
- Try smaller amount (10 BDAG)
- Check if faucet is working (try different time)
- Verify network connection

### Issue: "Wrong network"
**Solutions:**
- Switch to BlockDAG testnet in MetaMask
- Add network manually if not available
- Refresh page and try again

### Issue: "Invalid address"
**Solutions:**
- Copy full address from MetaMask
- Ensure address starts with "0x"
- Check for extra spaces

## Testing Without Tokens:

If you can't get tokens immediately, you can still test the interface:

### Test UI Features:
```javascript
// In browser console
console.log(window.blockchainBuddy.isConnected);
console.log(window.blockchainBuddy.currentAccount);
```

### Test Gas Estimation:
```javascript
// Test with any address
const testAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
const testAmount = "0.001";
await window.blockchainBuddy.estimateGasCost(testAddress, testAmount);
```

### Test Address Validation:
```javascript
// Test valid address
await window.blockchainBuddy.validateBlockDAGAddress("0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6");

// Test invalid address
await window.blockchainBuddy.validateBlockDAGAddress("invalid");
```

## Next Steps:

1. **Try faucet again** with smaller amount
2. **Check explorer** for transaction status
3. **Test UI features** while waiting
4. **Contact support** if still no tokens after 10 minutes

## Support Resources:

- **BlockDAG Discord**: https://discord.gg/blockdag
- **BlockDAG Telegram**: https://t.me/blockdag
- **BlockDAG Explorer**: https://primordial.bdagscan.com
- **BlockDAG Documentation**: https://docs.blockdag.network 