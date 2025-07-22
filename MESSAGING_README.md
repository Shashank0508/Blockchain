# 💬 Wallet Messaging System

## Overview
The Blockchain Buddy wallet now includes a comprehensive messaging system that allows users to send encrypted messages, files, and transaction details to their contacts. The system supports real-time communication, file sharing, and transaction notifications.

## 🚀 Features

### Core Messaging Features
- **Encrypted Messages**: All messages are encrypted using AES-GCM encryption
- **Real-time Communication**: Instant message delivery with online/offline status
- **File Sharing**: Support for images, documents, and any file type
- **Transaction Integration**: Automatic transaction notifications and details
- **Contact Management**: Add, remove, and manage contacts by wallet address or nickname

### Message Types Supported
1. **Text Messages**: Standard text communication
2. **Image Messages**: Share and view images in chat
3. **File Messages**: Upload and download any file type
4. **Transaction Messages**: Automatic notifications for BDAG transfers
5. **System Messages**: Status updates and notifications

### Security Features
- **End-to-End Encryption**: Messages encrypted with AES-GCM
- **Secure Key Generation**: Cryptographic random key generation
- **Local Storage**: Encrypted messages stored locally
- **Privacy Protection**: No message content stored on servers

### User Interface
- **Modern Chat Interface**: WhatsApp/Telegram-style messaging
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Consistent with wallet theme
- **Online Status**: Real-time online/offline indicators
- **Message History**: Persistent chat history

## 🛠️ Technical Implementation

### Files Structure
```
wallet-messaging-demo.js    # Demo messaging system (no Firebase required)
wallet-messaging.js         # Full Firebase messaging system
wallet-messaging.css        # Messaging interface styles
firebase-config.js          # Firebase configuration
```

### Key Components

#### 1. WalletMessaging Class
- Handles all messaging functionality
- Manages encryption/decryption
- Manages contact list
- Handles real-time updates

#### 2. Encryption System
```javascript
// Generate encryption key
async getOrGenerateKey() {
    let key = localStorage.getItem('wallet_messaging_key');
    if (!key) {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        localStorage.setItem('wallet_messaging_key', key);
    }
    return key;
}
```

#### 3. Message Types
```javascript
// Text message
await sendMessage("Hello!", 'text');

// File message
await sendFile(fileObject);

// Transaction message
await sendTransactionMessage({
    amount: '5.0',
    recipient: '0x...',
    status: 'completed',
    hash: '0x...'
});
```

## 📱 Usage Guide

### Adding Contacts
1. Click "Add New Contact" in the wallet
2. Enter nickname and wallet address
3. Contact is now available for messaging

### Starting a Chat
1. Click "💬 Chat" button next to any contact
2. Or click "💬 Open Messages" to see all contacts
3. Select a contact to start chatting

### Sending Messages
1. **Text Messages**: Type in the input field and press Enter
2. **Files**: Click the file icon to upload any file
3. **Transaction Details**: Click the transaction icon to send transaction info

### Message Features
- **Encryption**: All messages are automatically encrypted
- **File Sharing**: Drag and drop or click to upload files
- **Transaction Integration**: Automatic transaction notifications
- **Message History**: All conversations are saved locally

## 🔧 Setup Instructions

### Demo Mode (No Firebase Required)
1. The demo system works immediately without setup
2. Messages are stored locally in browser
3. Includes simulated online users for testing

### Full Firebase Mode
1. Create a Firebase project
2. Update `firebase-config.js` with your credentials
3. Replace `wallet-messaging-demo.js` with `wallet-messaging.js`
4. Enable Firebase Realtime Database

### Firebase Configuration
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
```

## 🎯 Key Features Explained

### 1. Contact Identification
- Contacts are identified by their wallet address
- Users can add nicknames for easier recognition
- Online status is tracked for each contact

### 2. Message Encryption
- Each message is encrypted with AES-GCM
- Encryption key is generated per user
- Messages are decrypted only for the intended recipient

### 3. File Sharing
- Supports any file type (images, documents, etc.)
- Files are converted to base64 for transmission
- File metadata (name, size) is preserved

### 4. Transaction Integration
- Automatic transaction notifications
- Transaction details include amount, status, and hash
- Links to blockchain explorer for verification

### 5. Real-time Features
- Online/offline status indicators
- Instant message delivery
- Typing indicators (planned)
- Message read receipts (planned)

## 🔒 Security Considerations

### Encryption
- Messages encrypted with AES-GCM
- Unique encryption key per user
- Keys stored securely in localStorage
- No plaintext messages stored

### Privacy
- No message content stored on servers (demo mode)
- Local storage for message history
- User controls their own data
- No tracking or analytics

### Network Security
- HTTPS required for production
- Secure WebSocket connections (Firebase mode)
- Encrypted data transmission

## 🚀 Future Enhancements

### Planned Features
1. **Group Chats**: Multi-user conversations
2. **Voice Messages**: Audio recording and playback
3. **Video Calls**: Real-time video communication
4. **Message Reactions**: Emoji reactions to messages
5. **Message Search**: Search through chat history
6. **Message Pinning**: Pin important messages
7. **Custom Themes**: Personalized chat themes
8. **Message Scheduling**: Send messages at specific times

### Technical Improvements
1. **WebRTC Integration**: Direct peer-to-peer communication
2. **IPFS Storage**: Decentralized file storage
3. **Blockchain Integration**: Message verification on-chain
4. **Multi-language Support**: Internationalization
5. **Advanced Encryption**: Quantum-resistant algorithms

## 🐛 Troubleshooting

### Common Issues

#### Messages Not Sending
- Check if wallet is connected
- Verify contact address is correct
- Ensure browser supports required APIs

#### Files Not Uploading
- Check file size (max 10MB recommended)
- Verify file type is supported
- Ensure browser allows file access

#### Encryption Errors
- Clear browser cache and localStorage
- Regenerate encryption key
- Check browser crypto API support

#### Online Status Issues
- Refresh the page
- Check network connection
- Verify Firebase configuration (if using)

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Responsive design supported

## 📊 Performance

### Optimization
- Messages loaded on-demand
- File compression for large files
- Efficient encryption/decryption
- Minimal memory usage

### Scalability
- Local storage for demo mode
- Firebase Realtime Database for production
- Support for thousands of messages
- Efficient contact management

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Install dependencies (if any)
3. Set up Firebase project (for full mode)
4. Test with demo mode first

### Testing
- Test with different file types
- Verify encryption/decryption
- Check mobile responsiveness
- Test offline functionality

### Code Style
- Use ES6+ features
- Follow existing code patterns
- Add comments for complex logic
- Maintain security best practices

## 📄 License

This messaging system is part of the Blockchain Buddy project and follows the same license terms.

---

**Note**: The demo version works completely offline and is perfect for testing and development. For production use, implement the full Firebase version with proper security measures. 