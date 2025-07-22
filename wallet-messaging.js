// Wallet Messaging System
// Supports encrypted messages, file sharing, transaction details, and real-time communication

class WalletMessaging {
    constructor() {
        this.currentUser = null;
        this.currentChat = null;
        this.messages = {};
        this.contacts = {};
        this.onlineUsers = new Set();
        this.encryptionKey = null;
        this.firebase = null;
        this.database = null;
        this.auth = null;
        
        this.initFirebase();
        this.initEncryption();
        this.setupEventListeners();
    }

    // Initialize Firebase
    initFirebase() {
        // Use external config if available
        const firebaseConfig = window.firebaseConfig || {
            apiKey: "YOUR_API_KEY_HERE",
            authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
            databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_PROJECT_ID.appspot.com",
            messagingSenderId: "YOUR_SENDER_ID",
            appId: "YOUR_APP_ID"
        };

        if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
            try {
                firebase.initializeApp(firebaseConfig);
                this.database = firebase.database();
                this.auth = firebase.auth();
                console.log('Firebase initialized successfully for messaging system');
            } catch (error) {
                console.error('Firebase initialization failed:', error);
                this.showFirebaseError();
            }
        } else {
            console.warn('Firebase not configured. Messaging will work in local mode only.');
            this.showFirebaseWarning();
        }
    }

    // Show Firebase configuration error
    showFirebaseError() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 1rem; 
            background: #ef4444; color: white; border-radius: 8px; 
            z-index: 10000; max-width: 300px; font-size: 0.875rem;
        `;
        notification.innerHTML = `
            <strong>Firebase Error</strong><br>
            Please check your Firebase configuration in firebase-config.js
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Show Firebase configuration warning
    showFirebaseWarning() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 1rem; 
            background: #f59e0b; color: white; border-radius: 8px; 
            z-index: 10000; max-width: 300px; font-size: 0.875rem;
        `;
        notification.innerHTML = `
            <strong>Firebase Not Configured</strong><br>
            Update firebase-config.js with your Firebase credentials for real-time messaging
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Initialize encryption
    async initEncryption() {
        // Generate or retrieve encryption key
        this.encryptionKey = await this.getOrGenerateKey();
    }

    // Get or generate encryption key
    async getOrGenerateKey() {
        let key = localStorage.getItem('wallet_messaging_key');
        if (!key) {
            // Generate new key
            const array = new Uint8Array(32);
            crypto.getRandomValues(array);
            key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
            localStorage.setItem('wallet_messaging_key', key);
        }
        return key;
    }

    // Encrypt message
    async encryptMessage(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(this.encryptionKey),
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            data
        );

        return {
            encrypted: Array.from(new Uint8Array(encrypted)),
            iv: Array.from(iv)
        };
    }

    // Decrypt message
    async decryptMessage(encryptedData) {
        try {
            const encoder = new TextEncoder();
            const key = await crypto.subtle.importKey(
                'raw',
                encoder.encode(this.encryptionKey),
                { name: 'AES-GCM' },
                false,
                ['decrypt']
            );

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
                key,
                new Uint8Array(encryptedData.encrypted)
            );

            return new TextDecoder().decode(decrypted);
        } catch (error) {
            console.error('Decryption failed:', error);
            return '[Encrypted Message]';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for new messages
        if (this.database) {
            this.database.ref('messages').on('child_added', (snapshot) => {
                this.handleNewMessage(snapshot.val());
            });

            // Listen for online status changes
            this.database.ref('online_users').on('value', (snapshot) => {
                this.updateOnlineStatus(snapshot.val());
            });
        } else {
            // Local mode - simulate real-time updates
            console.log('Running in local mode - messages stored locally only');
            this.setupLocalMode();
        }
    }

    // Setup local mode functionality
    setupLocalMode() {
        // Simulate online users for demo
        this.onlineUsers = new Set([
            '0x1234567890123456789012345678901234567890',
            '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
        ]);

        // Simulate incoming messages periodically
        setInterval(() => {
            if (this.currentChat && Math.random() < 0.05) { // 5% chance every interval
                this.simulateIncomingMessage();
            }
        }, 15000); // Check every 15 seconds
    }

    // Simulate incoming message for local mode
    simulateIncomingMessage() {
        const demoMessages = [
            "Hey! How's it going?",
            "Did you receive the BDAG I sent?",
            "Thanks for the transaction!",
            "Can you send me your wallet address?",
            "The network seems a bit slow today",
            "Have you tried the new features?",
            "Great to chat with you!",
            "Let me know when you're online"
        ];
        
        const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
        this.handleNewMessage({
            id: Date.now().toString(),
            sender: this.currentChat,
            content: { encrypted: btoa(randomMessage), iv: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
            timestamp: Date.now(),
            type: 'text'
        });
    }

    // Handle new message
    async handleNewMessage(messageData) {
        if (messageData.sender === this.currentUser?.address) return;

        const decryptedContent = await this.decryptMessage(messageData.content);
        const message = {
            id: messageData.id,
            sender: messageData.sender,
            content: decryptedContent,
            timestamp: messageData.timestamp,
            type: messageData.type || 'text',
            transactionDetails: messageData.transactionDetails
        };

        this.addMessageToChat(message);
        this.showNotification(message);
    }

    // Add message to chat
    addMessageToChat(message) {
        if (!this.messages[this.currentChat]) {
            this.messages[this.currentChat] = [];
        }
        this.messages[this.currentChat].push(message);
        this.renderMessages();
    }

    // Render messages
    renderMessages() {
        const chatContainer = document.getElementById('chatMessages');
        if (!chatContainer) return;

        chatContainer.innerHTML = '';
        
        const messages = this.messages[this.currentChat] || [];
        messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            chatContainer.appendChild(messageElement);
        });

        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Create message element
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender === this.currentUser?.address ? 'sent' : 'received'}`;
        
        const isOwnMessage = message.sender === this.currentUser?.address;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">${isOwnMessage ? 'You' : this.getContactName(message.sender)}</span>
                    <span class="message-time">${this.formatTime(message.timestamp)}</span>
                </div>
                <div class="message-body">
                    ${this.renderMessageContent(message)}
                </div>
                ${message.transactionDetails ? this.renderTransactionDetails(message.transactionDetails) : ''}
            </div>
        `;

        return messageDiv;
    }

    // Render message content based on type
    renderMessageContent(message) {
        switch (message.type) {
            case 'text':
                return `<div class="text-message">${this.escapeHtml(message.content)}</div>`;
            case 'image':
                return `<div class="image-message"><img src="${message.content}" alt="Image" onclick="openImageModal('${message.content}')"></div>`;
            case 'file':
                return `<div class="file-message">
                    <div class="file-info">
                        <span class="file-name">${message.fileName}</span>
                        <span class="file-size">${this.formatFileSize(message.fileSize)}</span>
                    </div>
                    <button onclick="downloadFile('${message.content}', '${message.fileName}')" class="btn btn-secondary">Download</button>
                </div>`;
            case 'transaction':
                return `<div class="transaction-message">
                    <div class="transaction-info">
                        <span class="transaction-amount">${message.transactionDetails.amount} BDAG</span>
                        <span class="transaction-status ${message.transactionDetails.status}">${message.transactionDetails.status}</span>
                    </div>
                    <div class="transaction-hash">${message.transactionDetails.hash}</div>
                </div>`;
            default:
                return `<div class="text-message">${this.escapeHtml(message.content)}</div>`;
        }
    }

    // Render transaction details
    renderTransactionDetails(details) {
        return `
            <div class="transaction-details">
                <div class="transaction-summary">
                    <span class="amount">${details.amount} BDAG</span>
                    <span class="status ${details.status}">${details.status}</span>
                </div>
                <div class="transaction-meta">
                    <span class="hash">${details.hash}</span>
                    <span class="time">${this.formatTime(details.timestamp)}</span>
                </div>
            </div>
        `;
    }

    // Send message
    async sendMessage(content, type = 'text', fileData = null) {
        if (!this.currentChat || !this.currentUser) return;

        const encryptedContent = await this.encryptMessage(content);
        
        const message = {
            id: this.generateMessageId(),
            sender: this.currentUser.address,
            content: encryptedContent,
            timestamp: Date.now(),
            type: type,
            chatId: this.currentChat
        };

        // Add file data if present
        if (fileData) {
            message.fileName = fileData.name;
            message.fileSize = fileData.size;
        }

        // Save to Firebase if available
        if (this.database) {
            try {
                await this.database.ref(`messages/${message.id}`).set(message);
            } catch (error) {
                console.error('Failed to save message to Firebase:', error);
            }
        }

        // Save to local storage
        this.saveMessageToLocal(message);

        // Add to local messages
        this.addMessageToChat({
            ...message,
            content: content // Store decrypted content locally
        });
    }

    // Save message to local storage
    saveMessageToLocal(message) {
        const chatKey = `chat_${this.currentChat}`;
        const messages = JSON.parse(localStorage.getItem(chatKey) || '[]');
        messages.push(message);
        localStorage.setItem(chatKey, JSON.stringify(messages));
    }

    // Send transaction message
    async sendTransactionMessage(transactionDetails) {
        const message = `Transaction: ${transactionDetails.amount} BDAG sent to ${transactionDetails.recipient}`;
        await this.sendMessage(message, 'transaction', null, transactionDetails);
    }

    // Send file
    async sendFile(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const fileData = {
                name: file.name,
                size: file.size,
                type: file.type,
                data: e.target.result
            };

            await this.sendMessage(JSON.stringify(fileData), 'file', fileData);
        };
        reader.readAsDataURL(file);
    }

    // Open chat with contact
    openChat(contactAddress) {
        this.currentChat = contactAddress;
        this.loadChatHistory();
        this.showChatInterface();
    }

    // Load chat history
    async loadChatHistory() {
        if (!this.currentChat) return;

        let messages = [];

        // Try to load from Firebase first
        if (this.database) {
            try {
                const snapshot = await this.database.ref('messages')
                    .orderByChild('chatId')
                    .equalTo(this.currentChat)
                    .once('value');

                snapshot.forEach(child => {
                    messages.push(child.val());
                });
            } catch (error) {
                console.error('Failed to load messages from Firebase:', error);
            }
        }

        // If no messages from Firebase, load from local storage
        if (messages.length === 0) {
            const chatKey = `chat_${this.currentChat}`;
            messages = JSON.parse(localStorage.getItem(chatKey) || '[]');
        }

        // Decrypt and sort messages
        this.messages[this.currentChat] = [];
        for (const message of messages.sort((a, b) => a.timestamp - b.timestamp)) {
            try {
                const decryptedContent = await this.decryptMessage(message.content);
                this.messages[this.currentChat].push({
                    ...message,
                    content: decryptedContent
                });
            } catch (error) {
                console.error('Failed to decrypt message:', error);
                // Add message with error content
                this.messages[this.currentChat].push({
                    ...message,
                    content: '[Encrypted Message]'
                });
            }
        }

        this.renderMessages();
    }

    // Show chat interface
    showChatInterface() {
        const chatContainer = document.getElementById('messagingInterface');
        if (!chatContainer) return;

        const contact = this.contacts[this.currentChat];
        const contactName = contact ? contact.nickname : this.currentChat.slice(0, 10) + '...';

        chatContainer.innerHTML = `
            <div class="chat-header">
                <div class="chat-contact-info">
                    <div class="contact-avatar">${contactName.charAt(0).toUpperCase()}</div>
                    <div class="contact-details">
                        <div class="contact-name">${contactName}</div>
                        <div class="contact-status ${this.onlineUsers.has(this.currentChat) ? 'online' : 'offline'}">
                            ${this.onlineUsers.has(this.currentChat) ? '🟢 Online' : '⚫ Offline'}
                        </div>
                    </div>
                </div>
                <div class="chat-actions">
                    <button class="btn btn-secondary" onclick="walletMessaging.closeChat()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-input">
                <div class="input-actions">
                    <button class="btn btn-secondary" onclick="document.getElementById('fileInput').click()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                        </svg>
                    </button>
                    <button class="btn btn-secondary" onclick="walletMessaging.sendTransactionMessage()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </button>
                </div>
                <input type="text" id="messageInput" placeholder="Type your message..." onkeypress="if(event.key==='Enter') walletMessaging.sendTextMessage()">
                <button class="btn btn-primary" onclick="walletMessaging.sendTextMessage()">Send</button>
                <input type="file" id="fileInput" style="display: none;" onchange="walletMessaging.handleFileSelect(event)">
            </div>
        `;

        this.renderMessages();
    }

    // Close chat
    closeChat() {
        this.currentChat = null;
        const chatContainer = document.getElementById('chatInterface');
        if (chatContainer) {
            chatContainer.innerHTML = '';
        }
    }

    // Send text message
    sendTextMessage() {
        const input = document.getElementById('messageInput');
        const content = input.value.trim();
        if (content) {
            this.sendMessage(content, 'text');
            input.value = '';
        }
    }

    // Handle file selection
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.sendFile(file);
        }
        event.target.value = '';
    }

    // Update online status
    updateOnlineStatus(onlineUsers) {
        this.onlineUsers = new Set(Object.keys(onlineUsers || {}));
        this.updateContactStatus();
    }

    // Update contact status display
    updateContactStatus() {
        const contactElements = document.querySelectorAll('.contact-status');
        contactElements.forEach(element => {
            const contactAddress = element.closest('.contact-item').dataset.address;
            if (this.onlineUsers.has(contactAddress)) {
                element.textContent = '🟢 Online';
                element.className = 'contact-status online';
            } else {
                element.textContent = '⚫ Offline';
                element.className = 'contact-status offline';
            }
        });
    }

    // Show notification
    showNotification(message) {
        if (Notification.permission === 'granted') {
            const contactName = this.getContactName(message.sender);
            new Notification(`New message from ${contactName}`, {
                body: message.content.substring(0, 100),
                icon: '/favicon.ico'
            });
        }
    }

    // Utility functions
    generateMessageId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString();
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getContactName(address) {
        const contact = this.contacts[address];
        return contact ? contact.nickname : address.slice(0, 10) + '...';
    }

    // Initialize messaging system
    async init(currentUser) {
        this.currentUser = currentUser;
        
        // Set online status
        if (this.database) {
            await this.database.ref(`online_users/${currentUser.address}`).set({
                lastSeen: Date.now(),
                status: 'online'
            });

            // Set offline when page unloads
            window.addEventListener('beforeunload', () => {
                this.database.ref(`online_users/${currentUser.address}`).remove();
            });
        }

        // Load contacts
        this.loadContacts();
    }

    // Load contacts
    loadContacts() {
        const contactsKey = this.getContactsKey();
        const contacts = JSON.parse(localStorage.getItem(contactsKey) || '[]');
        
        this.contacts = {};
        contacts.forEach(contact => {
            this.contacts[contact.address] = contact;
        });

        this.renderContacts();
    }

    // Render contacts
    renderContacts() {
        const contactsList = document.getElementById('contactsList');
        if (!contactsList) return;

        if (Object.keys(this.contacts).length === 0) {
            contactsList.innerHTML = `
                <div class="no-contacts">
                    <div class="no-contacts-icon">👥</div>
                    <div class="no-contacts-text">No contacts yet</div>
                    <div class="no-contacts-subtext">Add contacts to start messaging</div>
                </div>
            `;
            return;
        }

        contactsList.innerHTML = Object.values(this.contacts).map(contact => `
            <div class="contact-item" data-address="${contact.address}" onclick="walletMessaging.openChat('${contact.address}')">
                <div class="contact-avatar">${contact.nickname.charAt(0).toUpperCase()}</div>
                <div class="contact-info">
                    <div class="contact-name">${contact.nickname}</div>
                    <div class="contact-address">${contact.address.slice(0, 10)}...${contact.address.slice(-8)}</div>
                    <div class="contact-status ${this.onlineUsers.has(contact.address) ? 'online' : 'offline'}">
                        ${this.onlineUsers.has(contact.address) ? '🟢 Online' : '⚫ Offline'}
                    </div>
                </div>
                <div class="contact-actions">
                    <button class="btn btn-secondary" onclick="walletMessaging.removeContact('${contact.address}')" title="Remove contact">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Remove contact
    removeContact(address) {
        if (confirm('Are you sure you want to remove this contact?')) {
            delete this.contacts[address];
            this.saveContacts();
            this.renderContacts();
        }
    }

    // Save contacts
    saveContacts() {
        const contactsKey = this.getContactsKey();
        const contacts = Object.values(this.contacts);
        localStorage.setItem(contactsKey, JSON.stringify(contacts));
    }

    // Get contacts key
    getContactsKey() {
        return this.currentUser ? `contacts_${this.currentUser.address}` : 'contacts';
    }
}

// Global instance
window.walletMessaging = new WalletMessaging(); 