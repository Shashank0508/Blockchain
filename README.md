# Blockchain Buddy Wallet

A modern blockchain wallet application with AI chatbot and voice command capabilities.

## 🌟 Features

- **💰 Wallet Management**: Connect MetaMask and manage BDAG tokens
- **🤖 AI Chatbot**: Intelligent assistant with voice commands
- **🎤 Voice Recognition**: Speak commands to control your wallet
- **👥 Contact Management**: Save and manage wallet contacts
- **📊 Transaction History**: View and track all transactions
- **🌙 Theme Toggle**: Light and dark mode support
- **🔍 Contact Search**: Search contacts by nickname
- **💬 Chat with Contacts**: Built-in messaging system

## 🚀 Deployment on Render

### Prerequisites
- A Render account (free tier available)
- Your application code in a Git repository (GitHub, GitLab, etc.)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub/GitLab**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

### Step 2: Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" and select "Static Site"** (not Web Service)
3. **Connect your repository**:
   - Choose your Git provider (GitHub/GitLab)
   - Select your repository
   - Click "Connect"

4. **Configure your static site**:
   - **Name**: `blockchain-buddy-wallet` (or your preferred name)
   - **Build Command**: Leave empty (no build needed for static HTML)
   - **Publish Directory**: `.` (root directory)
   - **Plan**: Choose "Free" for testing

5. **Click "Create Static Site"**

### Step 3: Access Your Application

- Render will provide you with a URL like: `https://your-app-name.onrender.com`
- Your application will be accessible at this URL
- All your HTML files will be served automatically

## 🛠️ Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd blockchain-buddy-wallet
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Open `http://localhost:8000` in your browser

### Production Build

1. **Start the production server**:
   ```bash
   npm start
   ```

2. **Access the application**:
   - Open `http://localhost:8000` in your browser

## 📁 Project Structure

```
blockchain-buddy-wallet/
├── index.html              # Main application page
├── wallet.html             # Wallet interface with chatbot
├── friends-chat.html       # Chat functionality
├── metamask-test.html      # MetaMask integration
├── package.json            # Dependencies and scripts
├── README.md              # This file
├── blockchain-integration.js # Blockchain functionality
├── script.js              # Main application logic
├── friends-chat.js        # Chat functionality
└── styles.css             # Application styles
```

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 8000)
- No additional configuration required for basic deployment

### Browser Requirements
- **Chrome/Edge**: Full support for voice commands
- **Firefox**: May require HTTPS for microphone access
- **Safari**: Limited voice support
- **Mobile**: May have additional restrictions

## 🎯 Features Overview

### AI Chatbot Commands
- `"send 5 BDAG to John"` - Send tokens to contacts
- `"check balance"` - Check wallet balance
- `"get test tokens"` - Access faucet
- `"search for Alice"` - Search contacts
- `"switch to light mode"` - Change theme

### Voice Commands
- Click the 🎤 button in the chatbot
- Speak commands clearly
- Commands are automatically transcribed and executed

### Wallet Features
- MetaMask integration
- BDAG token management
- Transaction history
- Contact management
- Real-time balance updates

## 🚨 Important Notes

1. **HTTPS Required**: Voice commands require HTTPS in production
2. **Browser Permissions**: Users must allow microphone access
3. **MetaMask**: Users need MetaMask installed for wallet features
4. **BlockDAG Network**: Configure MetaMask for BlockDAG testnet

## 🎤 Voice Commands

### Requirements
- **HTTPS**: Voice commands only work on HTTPS or localhost
- **Browser**: Chrome, Edge, or Safari (Firefox has limited support)
- **Microphone**: Must allow microphone access when prompted

### Troubleshooting Voice Commands
1. **Network Error**: Use the deployed HTTPS version instead of local development
2. **Microphone Denied**: Allow microphone access in browser settings
3. **Not Working**: Try the voice test page (`voice-test.html`) to diagnose issues
4. **Browser Issues**: Switch to Chrome or Edge for best compatibility

## 🐛 Troubleshooting

### Common Issues

1. **Voice commands not working**:
   - Ensure HTTPS is enabled
   - Check microphone permissions
   - Try a different browser

2. **Wallet not connecting**:
   - Install MetaMask extension
   - Configure BlockDAG testnet
   - Check network settings

3. **Deployment issues**:
   - Check Render logs for errors
   - Verify package.json configuration
   - Ensure all files are committed

## 📞 Support

For deployment issues:
1. Check Render documentation
2. Review application logs
3. Verify environment configuration

## 📄 License

MIT License - feel free to use and modify as needed. 