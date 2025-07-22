// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBHsLRrQSkQCF10b7ipLd2Fa_vuwrbqNfM",
    authDomain: "blockchain-buddy-7c64c.firebaseapp.com",
    databaseURL: "https://blockchain-buddy-7c64c-default-rtdb.firebaseio.com/",
    projectId: "blockchain-buddy-7c64c",
    storageBucket: "blockchain-buddy-7c64c.firebasestorage.app",
    messagingSenderId: "270517045251",
    appId: "1:270517045251:web:036d50421a78306265a636",
    measurementId: "G-T63M1JXBX9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const database = firebase.database();
const analytics = firebase.analytics();

console.log('Firebase initialized successfully!');

// Firebase Auth State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User signed in:', user.uid);
        updateUIForAuthenticatedUser(user);
        // Load user's chat history and transaction history
        setTimeout(() => {
            loadChatHistory();
            initializeTransactionHistory();
        }, 1000);
    } else {
        console.log('User signed out');
        updateUIForUnauthenticatedUser();
    }
});

// Update UI for authenticated user
function updateUIForAuthenticatedUser(user) {
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userDisplayName = document.getElementById('userDisplayName');
    
    if (connectWalletBtn) connectWalletBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'none';
    if (userProfile) {
        userProfile.style.display = 'flex';
        userProfile.style.alignItems = 'center';
        userProfile.style.gap = '10px';
    }
    if (userDisplayName) {
        userDisplayName.textContent = user.displayName || user.email || 'User';
    }
    
    // Enable wallet connection automatically for authenticated users
    isWalletConnected = true;
    updateWalletStatus();
    
    // Check if this is a new user and create welcome transactions
    createWelcomeTransactionsIfNeeded(user);
}

// Create welcome transactions for new users
async function createWelcomeTransactionsIfNeeded(user) {
    try {
        const transactionsRef = database.ref(`users/${user.uid}/transactions`);
        const snapshot = await transactionsRef.once('value');
        
        // If user has no transactions, create welcome transactions
        if (!snapshot.exists()) {
            console.log('Creating welcome transactions for new user');
            
            const welcomeTransactions = [
                {
                    id: `welcome_${Date.now()}_001`,
                    type: 'received',
                    amount: 100.0,
                    address: 'bdag1qsystem000000000000000000000000000000000',
                    fee: 0.0,
                    message: 'Welcome bonus! Enjoy exploring BlockDAG',
                    status: 'completed'
                },
                {
                    id: `welcome_${Date.now()}_002`,
                    type: 'received',
                    amount: 50.0,
                    address: 'bdag1qbonus0000000000000000000000000000000000',
                    fee: 0.0,
                    message: 'Sign-up reward',
                    status: 'completed'
                }
            ];
            
            // Save welcome transactions with small delays
            for (let i = 0; i < welcomeTransactions.length; i++) {
                setTimeout(async () => {
                    await saveTransaction(welcomeTransactions[i]);
                }, i * 500);
            }
        }
    } catch (error) {
        console.error('Error creating welcome transactions:', error);
    }
}

// Update UI for unauthenticated user
function updateUIForUnauthenticatedUser() {
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    
    if (connectWalletBtn) connectWalletBtn.style.display = 'inline-block';
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (userProfile) userProfile.style.display = 'none';
    
    // Disable wallet connection for unauthenticated users
    isWalletConnected = false;
    updateWalletStatus();
}

// DOM Elements
const connectWalletBtn = document.getElementById('connectWalletBtn');
const ctaConnectBtn = document.getElementById('ctaConnectBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');
const chatSection = document.getElementById('chatSection');
const closeChatBtn = document.getElementById('closeChatBtn');
const minimizeChatBtn = document.getElementById('minimizeChatBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const themeToggle = document.getElementById('themeToggle');
const chatFeatureCard = document.getElementById('chatFeatureCard');
const walletFeatureCard = document.getElementById('walletFeatureCard');
const transactionsFeatureCard = document.getElementById('transactionsFeatureCard');
const chatSuggestions = document.getElementById('chatSuggestions');
const chatMenu = document.getElementById('chatMenu');
const languageSelect = document.getElementById('languageSelect');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const historyCloseBtn = document.getElementById('historyCloseBtn');
const historyTypeFilter = document.getElementById('historyTypeFilter');
const historySearchInput = document.getElementById('historySearchInput');
const historyContent = document.getElementById('historyContent');
const historyLoading = document.getElementById('historyLoading');
const historyList = document.getElementById('historyList');

// State
let isWalletConnected = false;
let isChatOpen = false;
let isChatMinimized = false;
let isDarkMode = false;
let currentLanguage = 'en';
let userBalance = 2500.75; // Mock user balance
let transactionHistory = []; // Will be populated with mock data

// Mock exchange rates for BDAG (in a real app, these would come from an API)
const exchangeRates = {
    USD: 0.45,   // 1 BDAG = 0.45 USD
    EUR: 0.42,   // 1 BDAG = 0.42 EUR
    INR: 38.50,  // 1 BDAG = 38.50 INR
    GBP: 0.36,   // 1 BDAG = 0.36 GBP
    JPY: 68.20,  // 1 BDAG = 68.20 JPY
    CNY: 3.25,   // 1 BDAG = 3.25 CNY
    KRW: 610.50, // 1 BDAG = 610.50 KRW
    CAD: 0.62,   // 1 BDAG = 0.62 CAD
    AUD: 0.68,   // 1 BDAG = 0.68 AUD
    CHF: 0.41,   // 1 BDAG = 0.41 CHF
    SGD: 0.61,   // 1 BDAG = 0.61 SGD
    HKD: 3.52,   // 1 BDAG = 3.52 HKD
    NZD: 0.73,   // 1 BDAG = 0.73 NZD
    SEK: 4.85,   // 1 BDAG = 4.85 SEK
    NOK: 4.92,   // 1 BDAG = 4.92 NOK
    DKK: 3.14,   // 1 BDAG = 3.14 DKK
    PLN: 1.82,   // 1 BDAG = 1.82 PLN
    CZK: 10.45,  // 1 BDAG = 10.45 CZK
    HUF: 161.30, // 1 BDAG = 161.30 HUF
    RUB: 42.80,  // 1 BDAG = 42.80 RUB
    BRL: 2.65,   // 1 BDAG = 2.65 BRL
    MXN: 9.15,   // 1 BDAG = 9.15 MXN
    ARS: 450.25, // 1 BDAG = 450.25 ARS
    CLP: 445.80, // 1 BDAG = 445.80 CLP
    COP: 1980.50, // 1 BDAG = 1980.50 COP
    PEN: 1.68,   // 1 BDAG = 1.68 PEN
    UYU: 19.45,  // 1 BDAG = 19.45 UYU
    THB: 15.85,  // 1 BDAG = 15.85 THB
    MYR: 2.02,   // 1 BDAG = 2.02 MYR
    IDR: 7245.50, // 1 BDAG = 7245.50 IDR
    PHP: 25.80,  // 1 BDAG = 25.80 PHP
    VND: 11450.25, // 1 BDAG = 11450.25 VND
    TRY: 15.35,  // 1 BDAG = 15.35 TRY
    ZAR: 8.25,   // 1 BDAG = 8.25 ZAR
    EGP: 22.45,  // 1 BDAG = 22.45 EGP
    NGN: 735.50, // 1 BDAG = 735.50 NGN
    KES: 58.25,  // 1 BDAG = 58.25 KES
    GHS: 7.85,   // 1 BDAG = 7.85 GHS
    MAD: 4.52,   // 1 BDAG = 4.52 MAD
    TND: 1.42,   // 1 BDAG = 1.42 TND
    DZD: 60.85,  // 1 BDAG = 60.85 DZD
    AED: 1.65,   // 1 BDAG = 1.65 AED
    SAR: 1.69,   // 1 BDAG = 1.69 SAR
    QAR: 1.64,   // 1 BDAG = 1.64 QAR
    KWD: 0.139,  // 1 BDAG = 0.139 KWD
    BHD: 0.170,  // 1 BDAG = 0.170 BHD
    OMR: 0.173,  // 1 BDAG = 0.173 OMR
    JOD: 0.319,  // 1 BDAG = 0.319 JOD
    LBP: 6785.50, // 1 BDAG = 6785.50 LBP
    ILS: 1.67,   // 1 BDAG = 1.67 ILS
    PKR: 125.80, // 1 BDAG = 125.80 PKR
    BDT: 54.25,  // 1 BDAG = 54.25 BDT
    LKR: 133.45, // 1 BDAG = 133.45 LKR
    NPR: 61.60,  // 1 BDAG = 61.60 NPR
    AFN: 31.85,  // 1 BDAG = 31.85 AFN
    MMK: 945.50, // 1 BDAG = 945.50 MMK
    KHR: 1845.25, // 1 BDAG = 1845.25 KHR
    LAK: 9685.50, // 1 BDAG = 9685.50 LAK
    MNT: 1285.50, // 1 BDAG = 1285.50 MNT
    KZT: 208.45, // 1 BDAG = 208.45 KZT
    UZS: 5785.50, // 1 BDAG = 5785.50 UZS
    KGS: 39.85,  // 1 BDAG = 39.85 KGS
    TJS: 4.95,   // 1 BDAG = 4.95 TJS
    AMD: 175.50, // 1 BDAG = 175.50 AMD
    GEL: 1.22,   // 1 BDAG = 1.22 GEL
    AZN: 0.765,  // 1 BDAG = 0.765 AZN
    BYN: 1.47,   // 1 BDAG = 1.47 BYN
    UAH: 18.65,  // 1 BDAG = 18.65 UAH
    MDL: 8.15,   // 1 BDAG = 8.15 MDL
    RON: 2.08,   // 1 BDAG = 2.08 RON
    BGN: 0.822,  // 1 BDAG = 0.822 BGN
    HRK: 3.17,   // 1 BDAG = 3.17 HRK
    RSD: 49.25,  // 1 BDAG = 49.25 RSD
    BAM: 0.822,  // 1 BDAG = 0.822 BAM
    MKD: 25.85,  // 1 BDAG = 25.85 MKD
    ALL: 41.50,  // 1 BDAG = 41.50 ALL
    EUR: 0.42    // 1 BDAG = 0.42 EUR
};

// Translation data
const translations = {
    en: {
        'network-status': 'Connected to BlockDAG Testnet',
        'connect-wallet': 'Connect Wallet',
        'hero-title': 'Welcome to Blockchain Buddy',
        'hero-description': 'Your AI-powered companion for seamless BlockDAG network interactions. Make crypto transactions as easy as having a conversation.',
        'chat-interface-title': 'Chat Interface',
        'chat-interface-desc': 'Natural language commands for blockchain operations',
        'try-chat': 'Try Chat Interface',
        'secure-wallet-title': 'Secure Wallet',
        'secure-wallet-desc': 'Safe and secure BlockDAG wallet integration',
        'fast-transactions-title': 'Fast Transactions',
        'fast-transactions-desc': 'Lightning-fast transactions with BlockDAG technology',
        'view-transactions': 'View Transactions',
        'cta-title': 'Ready to Get Started?',
        'cta-description': 'Connect your wallet to begin interacting with the BlockDAG network through our AI-powered interface.',
        'learn-more': 'Learn More',
        'chat-title': 'Chat with Blockchain Buddy',
        'online-status': 'Online',
        'welcome-message': 'Hi! I\'m your Blockchain Buddy. How can I help you today? You can ask me to connect your MetaMask wallet, check your balance, send tokens, or discover dApps.',
        'message-placeholder': 'Type your message here...',
        'available-services': 'Available Services:',
        'balance-inquiries': 'Balance Inquiries',
        'check-wallet': 'Check your wallet',
        'token-transfers': 'Token Transfers',
        'send-bdag': 'Send BDAG safely',
        'dapp-recommendations': 'dApp Recommendations',
        'find-best-apps': 'Find the best apps',
        'blockdag-education': 'BlockDAG Education',
        'learn-technology': 'Learn the technology',
        'quick-access': 'Quick Access:',
        'balance-inquiries-desc': 'Balance inquiries - Check your wallet',
        'token-transfers-desc': 'Token transfers - Send BDAG safely',
        'dapp-recommendations-desc': 'dApp recommendations - Find the best apps',
        'blockdag-education-desc': 'BlockDAG education - Learn the technology',
        'connect-chip': '🔗 Connect',
        'balance-chip': '💰 Balance',
        'transfer-chip': '💸 Transfer',
        'convert-chip': '💱 Convert',
        'dapps-chip': '🔍 dApps',
        'help-chip': '❓ Help',
        'footer-text': '© 2025 Blockchain Buddy. Built for BlockDAG Hackathon 2025.',
        'history-title': 'Transaction History',
        'transaction-history': 'Transaction History',
        'filter-type': 'Type:',
        'all-transactions': 'All Transactions',
        'sent-transactions': 'Sent',
        'received-transactions': 'Received',
        'converted-transactions': 'Converted',
        'search-transactions': 'Search:',
        'search-placeholder': 'Search transactions...',
        'loading-history': 'Loading transaction history...',
        // Bot responses
        'bot-greeting': [
            "Hello! I'm your Blockchain Buddy. How can I help you today?",
            "Hi there! Ready to explore the BlockDAG network?",
            "Welcome! I'm here to make blockchain interactions simple for you."
        ],
        'bot-balance': [
            "Your current balance is 150.25 BDAG tokens.",
            "You have 150.25 BDAG in your wallet.",
            "Balance: 150.25 BDAG tokens"
        ],
        'bot-send': [
            "To send tokens, please specify the amount and recipient address.",
            "I can help you send BDAG tokens. What amount would you like to send?",
            "Sure! Please provide the recipient address and amount."
        ],
        'bot-help': [
            "Available services:\n• Balance inquiries - Check your wallet\n• Token transfers - Send BDAG safely\n• dApp recommendations - Find the best apps\n• BlockDAG education - Learn the technology\n\nClick on any option below to get started!",
            "Here's what I can do for you:\n• Balance inquiries - Check your wallet\n• Token transfers - Send BDAG safely\n• dApp recommendations - Find the best apps\n• BlockDAG education - Learn the technology",
            "I'm here to help! Available services:\n• Balance inquiries - Check your wallet\n• Token transfers - Send BDAG safely\n• dApp recommendations - Find the best apps\n• BlockDAG education - Learn the technology"
        ],
        'bot-discover': [
            "Here are some popular dApps on BlockDAG:\n• DeFi Exchange\n• NFT Marketplace\n• Yield Farming\n• Gaming Platform",
            "Trending dApps:\n• BlockSwap (DEX)\n• DAG NFTs\n• Stake Pool\n• Gaming Hub",
            "Popular dApps you might like:\n• Trading Platform\n• NFT Gallery\n• Staking Rewards\n• Social Network"
        ],
        'bot-default': [
            "I'm not sure I understand. Try asking about balance, sending tokens, or discovering dApps.",
            "Could you rephrase that? I can help with balance checks, transfers, and dApp discovery.",
            "I didn't quite get that. Ask me about your balance, sending BDAG, or finding dApps."
        ],
        'bot-convert': [
            "I can help you convert BDAG to various currencies. What would you like to convert?",
            "Currency conversion available! Specify the amount and target currency (USD, EUR, INR, etc.)",
            "Ready to convert BDAG tokens. Please provide the amount and desired currency."
        ]
    },
    hi: {
        'network-status': 'BlockDAG टेस्टनेट से जुड़ा हुआ',
        'connect-wallet': 'वॉलेट कनेक्ट करें',
        'hero-title': 'ब्लॉकचेन बडी में आपका स्वागत है',
        'hero-description': 'निर्बाध BlockDAG नेटवर्क इंटरैक्शन के लिए आपका AI-संचालित साथी। क्रिप्टो लेनदेन को बातचीत जितना आसान बनाएं।',
        'chat-interface-title': 'चैट इंटरफेस',
        'chat-interface-desc': 'ब्लॉकचेन ऑपरेशन के लिए प्राकृतिक भाषा कमांड',
        'try-chat': 'चैट इंटरफेस आज़माएं',
        'secure-wallet-title': 'सुरक्षित वॉलेट',
        'secure-wallet-desc': 'सुरक्षित BlockDAG वॉलेट एकीकरण',
        'fast-transactions-title': 'तेज़ लेनदेन',
        'fast-transactions-desc': 'BlockDAG तकनीक के साथ बिजली की तेज़ी से लेनदेन',
        'view-transactions': 'लेनदेन देखें',
        'cta-title': 'शुरू करने के लिए तैयार हैं?',
        'cta-description': 'हमारे AI-संचालित इंटरफेस के माध्यम से BlockDAG नेटवर्क के साथ बातचीत शुरू करने के लिए अपना वॉलेट कनेक्ट करें।',
        'learn-more': 'और जानें',
        'chat-title': 'ब्लॉकचेन बडी के साथ चैट करें',
        'online-status': 'ऑनलाइन',
        'welcome-message': 'नमस्ते! मैं आपका ब्लॉकचेन बडी हूं। आज मैं आपकी कैसे मदद कर सकता हूं? आप मुझसे अपना बैलेंस चेक करने, टोकन भेजने या dApps खोजने के लिए कह सकते हैं।',
        'message-placeholder': 'यहाँ अपना संदेश टाइप करें...',
        'available-services': 'उपलब्ध सेवाएं:',
        'balance-inquiries': 'बैलेंस पूछताछ',
        'check-wallet': 'अपना वॉलेट चेक करें',
        'token-transfers': 'टोकन ट्रांसफर',
        'send-bdag': 'BDAG सुरक्षित रूप से भेजें',
        'dapp-recommendations': 'dApp सिफारिशें',
        'find-best-apps': 'सबसे अच्छे ऐप्स खोजें',
        'blockdag-education': 'BlockDAG शिक्षा',
        'learn-technology': 'तकनीक सीखें',
        'quick-access': 'त्वरित पहुंच:',
        'balance-inquiries-desc': 'बैलेंस पूछताछ - अपना वॉलेट चेक करें',
        'token-transfers-desc': 'टोकन ट्रांसफर - BDAG सुरक्षित रूप से भेजें',
        'dapp-recommendations-desc': 'dApp सिफारिशें - सबसे अच्छे ऐप्स खोजें',
        'blockdag-education-desc': 'BlockDAG शिक्षा - तकनीक सीखें',
        'balance-chip': '💰 बैलेंस',
        'transfer-chip': '💸 ट्रांसफर',
        'convert-chip': '💱 कन्वर्ट',
        'dapps-chip': '🔍 dApps',
        'help-chip': '❓ मदद',
        'footer-text': '© 2025 ब्लॉकचेन बडी। BlockDAG हैकथॉन 2025 के लिए बनाया गया।',
        'history-title': 'लेनदेन इतिहास',
        'transaction-history': 'लेनदेन इतिहास',
        'filter-type': 'प्रकार:',
        'all-transactions': 'सभी लेनदेन',
        'sent-transactions': 'भेजे गए',
        'received-transactions': 'प्राप्त',
        'converted-transactions': 'परिवर्तित',
        'search-transactions': 'खोजें:',
        'search-placeholder': 'लेनदेन खोजें...',
        'loading-history': 'लेनदेन इतिहास लोड हो रहा है...',
        // Bot responses
        'bot-greeting': [
            "नमस्ते! मैं आपका ब्लॉकचेन बडी हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
            "नमस्कार! BlockDAG नेटवर्क एक्सप्लोर करने के लिए तैयार हैं?",
            "स्वागत है! मैं यहां आपके लिए ब्लॉकचेन इंटरैक्शन को सरल बनाने के लिए हूं।"
        ],
        'bot-balance': [
            "आपका वर्तमान बैलेंस 150.25 BDAG टोकन है।",
            "आपके वॉलेट में 150.25 BDAG है।",
            "बैलेंस: 150.25 BDAG टोकन"
        ],
        'bot-send': [
            "टोकन भेजने के लिए, कृपया राशि और प्राप्तकर्ता का पता बताएं।",
            "मैं आपको BDAG टोकन भेजने में मदद कर सकता हूं। आप कितनी राशि भेजना चाहते हैं?",
            "जरूर! कृपया प्राप्तकर्ता का पता और राशि प्रदान करें।"
        ],
        'bot-help': [
            "उपलब्ध सेवाएं:\n• बैलेंस पूछताछ - अपना वॉलेट चेक करें\n• टोकन ट्रांसफर - BDAG सुरक्षित रूप से भेजें\n• dApp सिफारिशें - सबसे अच्छे ऐप्स खोजें\n• BlockDAG शिक्षा - तकनीक सीखें\n\nशुरू करने के लिए नीचे किसी भी विकल्प पर क्लिक करें!",
            "यहाँ है जो मैं आपके लिए कर सकता हूँ:\n• बैलेंस पूछताछ - अपना वॉलेट चेक करें\n• टोकन ट्रांसफर - BDAG सुरक्षित रूप से भेजें\n• dApp सिफारिशें - सबसे अच्छे ऐप्स खोजें\n• BlockDAG शिक्षा - तकनीक सीखें",
            "मैं मदद के लिए यहाँ हूँ! उपलब्ध सेवाएं:\n• बैलेंस पूछताछ - अपना वॉलेट चेक करें\n• टोकन ट्रांसफर - BDAG सुरक्षित रूप से भेजें\n• dApp सिफारिशें - सबसे अच्छे ऐप्स खोजें\n• BlockDAG शिक्षा - तकनीक सीखें"
        ],
        'bot-discover': [
            "यहाँ BlockDAG पर कुछ लोकप्रिय dApps हैं:\n• DeFi एक्सचेंज\n• NFT मार्केटप्लेस\n• यील्ड फार्मिंग\n• गेमिंग प्लेटफॉर्म",
            "ट्रेंडिंग dApps:\n• BlockSwap (DEX)\n• DAG NFTs\n• स्टेक पूल\n• गेमिंग हब",
            "लोकप्रिय dApps जो आपको पसंद आ सकते हैं:\n• ट्रेडिंग प्लेटफॉर्म\n• NFT गैलरी\n• स्टेकिंग रिवार्ड्स\n• सोशल नेटवर्क"
        ],
        'bot-default': [
            "मुझे यकीन नहीं है कि मैं समझ गया। बैलेंस, टोकन भेजने या dApps खोजने के बारे में पूछने की कोशिश करें।",
            "क्या आप इसे दोबारा कह सकते हैं? मैं बैलेंस चेक, ट्रांसफर और dApp खोजने में मदद कर सकता हूं।",
            "मुझे वह बिल्कुल समझ नहीं आया। मुझसे अपने बैलेंस, BDAG भेजने या dApps खोजने के बारे में पूछें।"
        ],
        'bot-convert': [
            "मैं आपको BDAG को विभिन्न मुद्राओं में परिवर्तित करने में मदद कर सकता हूं। आप क्या परिवर्तित करना चाहते हैं?",
            "मुद्रा परिवर्तन उपलब्ध है! राशि और लक्ष्य मुद्रा (USD, EUR, INR, आदि) निर्दिष्ट करें",
            "BDAG टोकन परिवर्तित करने के लिए तैयार। कृपया राशि और वांछित मुद्रा प्रदान करें।"
        ]
    },
    zh: {
        'network-status': '已连接到 BlockDAG 测试网',
        'connect-wallet': '连接钱包',
        'hero-title': '欢迎来到区块链伙伴',
        'hero-description': '您的 AI 驱动的伙伴，用于无缝的 BlockDAG 网络交互。让加密货币交易变得像对话一样简单。',
        'chat-interface-title': '聊天界面',
        'chat-interface-desc': '区块链操作的自然语言命令',
        'try-chat': '试试聊天界面',
        'secure-wallet-title': '安全钱包',
        'secure-wallet-desc': '安全的 BlockDAG 钱包集成',
        'fast-transactions-title': '快速交易',
        'fast-transactions-desc': '使用 BlockDAG 技术的闪电般快速交易',
        'view-transactions': '查看交易',
        'cta-title': '准备开始了吗？',
        'cta-description': '连接您的钱包，通过我们的 AI 驱动界面开始与 BlockDAG 网络交互。',
        'learn-more': '了解更多',
        'chat-title': '与区块链伙伴聊天',
        'online-status': '在线',
        'welcome-message': '你好！我是您的区块链伙伴。今天我可以为您做什么？您可以要求我检查您的余额、发送代币或发现 dApps。',
        'message-placeholder': '在此输入您的消息...',
        'available-services': '可用服务：',
        'balance-inquiries': '余额查询',
        'check-wallet': '检查您的钱包',
        'token-transfers': '代币转账',
        'send-bdag': '安全发送 BDAG',
        'dapp-recommendations': 'dApp 推荐',
        'find-best-apps': '找到最好的应用',
        'blockdag-education': 'BlockDAG 教育',
        'learn-technology': '学习技术',
        'quick-access': '快速访问：',
        'balance-inquiries-desc': '余额查询 - 检查您的钱包',
        'token-transfers-desc': '代币转账 - 安全发送 BDAG',
        'dapp-recommendations-desc': 'dApp 推荐 - 找到最好的应用',
        'blockdag-education-desc': 'BlockDAG 教育 - 学习技术',
        'balance-chip': '💰 余额',
        'transfer-chip': '💸 转账',
        'convert-chip': '💱 转换',
        'dapps-chip': '🔍 dApps',
        'help-chip': '❓ 帮助',
        'footer-text': '© 2025 区块链伙伴。为 BlockDAG 黑客马拉松 2025 打造。',
        'history-title': '交易历史',
        'transaction-history': '交易历史',
        'filter-type': '类型:',
        'all-transactions': '所有交易',
        'sent-transactions': '已发送',
        'received-transactions': '已接收',
        'converted-transactions': '已转换',
        'search-transactions': '搜索:',
        'search-placeholder': '搜索交易...',
        'loading-history': '正在加载交易历史...',
        // Bot responses
        'bot-greeting': [
            "你好！我是您的区块链伙伴。今天我可以为您做什么？",
            "您好！准备探索 BlockDAG 网络了吗？",
            "欢迎！我在这里为您简化区块链交互。"
        ],
        'bot-balance': [
            "您当前的余额是 150.25 BDAG 代币。",
            "您的钱包中有 150.25 BDAG。",
            "余额：150.25 BDAG 代币"
        ],
        'bot-send': [
            "要发送代币，请指定金额和收件人地址。",
            "我可以帮您发送 BDAG 代币。您想发送多少？",
            "当然！请提供收件人地址和金额。"
        ],
        'bot-help': [
            "可用服务：\n• 余额查询 - 检查您的钱包\n• 代币转账 - 安全发送 BDAG\n• dApp 推荐 - 找到最好的应用\n• BlockDAG 教育 - 学习技术\n\n点击下面的任何选项开始！",
            "这是我可以为您做的：\n• 余额查询 - 检查您的钱包\n• 代币转账 - 安全发送 BDAG\n• dApp 推荐 - 找到最好的应用\n• BlockDAG 教育 - 学习技术",
            "我在这里帮助您！可用服务：\n• 余额查询 - 检查您的钱包\n• 代币转账 - 安全发送 BDAG\n• dApp 推荐 - 找到最好的应用\n• BlockDAG 教育 - 学习技术"
        ],
        'bot-discover': [
            "这里是 BlockDAG 上一些受欢迎的 dApps：\n• DeFi 交易所\n• NFT 市场\n• 收益农场\n• 游戏平台",
            "热门 dApps：\n• BlockSwap (DEX)\n• DAG NFTs\n• 质押池\n• 游戏中心",
            "您可能喜欢的热门 dApps：\n• 交易平台\n• NFT 画廊\n• 质押奖励\n• 社交网络"
        ],
        'bot-default': [
            "我不确定我理解。请尝试询问余额、发送代币或发现 dApps。",
            "您能重新表述一下吗？我可以帮助进行余额检查、转账和 dApp 发现。",
            "我没有完全理解。请向我询问您的余额、发送 BDAG 或查找 dApps。"
        ],
        'bot-convert': [
            "我可以帮助您将 BDAG 转换为各种货币。您想转换什么？",
            "货币转换可用！请指定金额和目标货币（USD、EUR、INR 等）",
            "准备转换 BDAG 代币。请提供金额和所需货币。"
        ]
    },
    de: {
        'network-status': 'Mit BlockDAG Testnet verbunden',
        'connect-wallet': 'Wallet verbinden',
        'hero-title': 'Willkommen bei Blockchain Buddy',
        'hero-description': 'Ihr KI-gestützter Begleiter für nahtlose BlockDAG-Netzwerkinteraktionen. Machen Sie Krypto-Transaktionen so einfach wie ein Gespräch.',
        'chat-interface-title': 'Chat-Schnittstelle',
        'chat-interface-desc': 'Natürliche Sprachbefehle für Blockchain-Operationen',
        'try-chat': 'Chat-Schnittstelle ausprobieren',
        'secure-wallet-title': 'Sichere Wallet',
        'secure-wallet-desc': 'Sichere BlockDAG-Wallet-Integration',
        'fast-transactions-title': 'Schnelle Transaktionen',
        'fast-transactions-desc': 'Blitzschnelle Transaktionen mit BlockDAG-Technologie',
        'view-transactions': 'Transaktionen anzeigen',
        'cta-title': 'Bereit zum Starten?',
        'cta-description': 'Verbinden Sie Ihre Wallet, um über unsere KI-gestützte Schnittstelle mit dem BlockDAG-Netzwerk zu interagieren.',
        'learn-more': 'Mehr erfahren',
        'chat-title': 'Chat mit Blockchain Buddy',
        'online-status': 'Online',
        'welcome-message': 'Hallo! Ich bin Ihr Blockchain Buddy. Wie kann ich Ihnen heute helfen? Sie können mich bitten, Ihr Guthaben zu überprüfen, Token zu senden oder dApps zu entdecken.',
        'message-placeholder': 'Geben Sie hier Ihre Nachricht ein...',
        'available-services': 'Verfügbare Dienste:',
        'balance-inquiries': 'Guthaben-Anfragen',
        'check-wallet': 'Überprüfen Sie Ihre Wallet',
        'token-transfers': 'Token-Transfers',
        'send-bdag': 'BDAG sicher senden',
        'dapp-recommendations': 'dApp-Empfehlungen',
        'find-best-apps': 'Die besten Apps finden',
        'blockdag-education': 'BlockDAG-Bildung',
        'learn-technology': 'Technologie lernen',
        'quick-access': 'Schnellzugriff:',
        'balance-inquiries-desc': 'Guthaben-Anfragen - Überprüfen Sie Ihre Wallet',
        'token-transfers-desc': 'Token-Transfers - BDAG sicher senden',
        'dapp-recommendations-desc': 'dApp-Empfehlungen - Die besten Apps finden',
        'blockdag-education-desc': 'BlockDAG-Bildung - Technologie lernen',
        'balance-chip': '💰 Guthaben',
        'transfer-chip': '💸 Transfer',
        'convert-chip': '💱 Konvertieren',
        'dapps-chip': '🔍 dApps',
        'help-chip': '❓ Hilfe',
        'footer-text': '© 2025 Blockchain Buddy. Erstellt für BlockDAG Hackathon 2025.',
        'history-title': 'Transaktionshistorie',
        'transaction-history': 'Transaktionshistorie',
        'filter-type': 'Typ:',
        'all-transactions': 'Alle Transaktionen',
        'sent-transactions': 'Gesendet',
        'received-transactions': 'Empfangen',
        'converted-transactions': 'Konvertiert',
        'search-transactions': 'Suchen:',
        'search-placeholder': 'Transaktionen suchen...',
        'loading-history': 'Transaktionshistorie wird geladen...',
        // Bot responses
        'bot-greeting': [
            "Hallo! Ich bin Ihr Blockchain Buddy. Wie kann ich Ihnen heute helfen?",
            "Hallo! Bereit, das BlockDAG-Netzwerk zu erkunden?",
            "Willkommen! Ich bin hier, um Blockchain-Interaktionen für Sie zu vereinfachen."
        ],
        'bot-balance': [
            "Ihr aktuelles Guthaben beträgt 150.25 BDAG Token.",
            "Sie haben 150.25 BDAG in Ihrer Wallet.",
            "Guthaben: 150.25 BDAG Token"
        ],
        'bot-send': [
            "Um Token zu senden, geben Sie bitte den Betrag und die Empfängeradresse an.",
            "Ich kann Ihnen beim Senden von BDAG Token helfen. Welchen Betrag möchten Sie senden?",
            "Gerne! Bitte geben Sie die Empfängeradresse und den Betrag an."
        ],
        'bot-help': [
            "Verfügbare Dienste:\n• Guthaben-Anfragen - Überprüfen Sie Ihre Wallet\n• Token-Transfers - BDAG sicher senden\n• dApp-Empfehlungen - Die besten Apps finden\n• BlockDAG-Bildung - Technologie lernen\n\nKlicken Sie auf eine der Optionen unten, um zu beginnen!",
            "Das kann ich für Sie tun:\n• Guthaben-Anfragen - Überprüfen Sie Ihre Wallet\n• Token-Transfers - BDAG sicher senden\n• dApp-Empfehlungen - Die besten Apps finden\n• BlockDAG-Bildung - Technologie lernen",
            "Ich bin hier, um zu helfen! Verfügbare Dienste:\n• Guthaben-Anfragen - Überprüfen Sie Ihre Wallet\n• Token-Transfers - BDAG sicher senden\n• dApp-Empfehlungen - Die besten Apps finden\n• BlockDAG-Bildung - Technologie lernen"
        ],
        'bot-discover': [
            "Hier sind einige beliebte dApps auf BlockDAG:\n• DeFi Exchange\n• NFT Marktplatz\n• Yield Farming\n• Gaming Plattform",
            "Trending dApps:\n• BlockSwap (DEX)\n• DAG NFTs\n• Stake Pool\n• Gaming Hub",
            "Beliebte dApps, die Ihnen gefallen könnten:\n• Trading Plattform\n• NFT Galerie\n• Staking Belohnungen\n• Soziales Netzwerk"
        ],
        'bot-default': [
            "Ich bin mir nicht sicher, ob ich das verstehe. Versuchen Sie, nach Guthaben, Token-Versendung oder dApps zu fragen.",
            "Könnten Sie das umformulieren? Ich kann bei Guthaben-Checks, Transfers und dApp-Entdeckung helfen.",
            "Das habe ich nicht ganz verstanden. Fragen Sie mich nach Ihrem Guthaben, BDAG-Versendung oder dApps."
        ],
        'bot-convert': [
            "Ich kann Ihnen helfen, BDAG in verschiedene Währungen umzuwandeln. Was möchten Sie umwandeln?",
            "Währungsumrechnung verfügbar! Geben Sie den Betrag und die Zielwährung an (USD, EUR, INR, etc.)",
            "Bereit, BDAG Token umzuwandeln. Bitte geben Sie den Betrag und die gewünschte Währung an."
        ]
    },
    ja: {
        'network-status': 'BlockDAG テストネットに接続済み',
        'connect-wallet': 'ウォレットを接続',
        'hero-title': 'ブロックチェーンバディへようこそ',
        'hero-description': 'シームレスなBlockDAGネットワークインタラクションのためのAI駆動のコンパニオン。暗号通貨取引を会話のように簡単にします。',
        'chat-interface-title': 'チャットインターフェース',
        'chat-interface-desc': 'ブロックチェーン操作のための自然言語コマンド',
        'try-chat': 'チャットインターフェースを試す',
        'secure-wallet-title': 'セキュアウォレット',
        'secure-wallet-desc': '安全なBlockDAGウォレット統合',
        'fast-transactions-title': '高速取引',
        'fast-transactions-desc': 'BlockDAG技術による超高速取引',
        'view-transactions': '取引を表示',
        'cta-title': '始める準備はできましたか？',
        'cta-description': 'AI駆動のインターフェースを通じてBlockDAGネットワークとの対話を開始するために、ウォレットを接続してください。',
        'learn-more': '詳しく学ぶ',
        'chat-title': 'ブロックチェーンバディとチャット',
        'online-status': 'オンライン',
        'welcome-message': 'こんにちは！私はあなたのブロックチェーンバディです。今日はどのようにお手伝いできますか？残高の確認、トークンの送信、またはdAppsの発見をお願いできます。',
        'message-placeholder': 'ここにメッセージを入力してください...',
        'available-services': '利用可能なサービス：',
        'balance-inquiries': '残高照会',
        'check-wallet': 'ウォレットを確認',
        'token-transfers': 'トークン転送',
        'send-bdag': 'BDAGを安全に送信',
        'dapp-recommendations': 'dApp推奨',
        'find-best-apps': '最高のアプリを見つける',
        'blockdag-education': 'BlockDAG教育',
        'learn-technology': '技術を学ぶ',
        'quick-access': 'クイックアクセス：',
        'balance-inquiries-desc': '残高照会 - ウォレットを確認',
        'token-transfers-desc': 'トークン転送 - BDAGを安全に送信',
        'dapp-recommendations-desc': 'dApp推奨 - 最高のアプリを見つける',
        'blockdag-education-desc': 'BlockDAG教育 - 技術を学ぶ',
        'balance-chip': '💰 残高',
        'transfer-chip': '💸 転送',
        'convert-chip': '💱 変換',
        'dapps-chip': '🔍 dApps',
        'help-chip': '❓ ヘルプ',
        'footer-text': '© 2025 ブロックチェーンバディ。BlockDAG ハッカソン 2025 のために作成。',
        'history-title': '取引履歴',
        'transaction-history': '取引履歴',
        'filter-type': 'タイプ:',
        'all-transactions': 'すべての取引',
        'sent-transactions': '送信済み',
        'received-transactions': '受信済み',
        'converted-transactions': '変換済み',
        'search-transactions': '検索:',
        'search-placeholder': '取引を検索...',
        'loading-history': '取引履歴を読み込み中...',
        // Bot responses
        'bot-greeting': [
            "こんにちは！私はあなたのブロックチェーンバディです。今日はどのようにお手伝いできますか？",
            "こんにちは！BlockDAGネットワークを探索する準備はできていますか？",
            "ようこそ！私はあなたのためにブロックチェーンの相互作用を簡単にするためにここにいます。"
        ],
        'bot-balance': [
            "現在の残高は150.25 BDAGトークンです。",
            "ウォレットに150.25 BDAGがあります。",
            "残高：150.25 BDAGトークン"
        ],
        'bot-send': [
            "トークンを送信するには、金額と受信者のアドレスを指定してください。",
            "BDAGトークンの送信をお手伝いします。いくら送信したいですか？",
            "もちろん！受信者のアドレスと金額を提供してください。"
        ],
        'bot-help': [
            "利用可能なサービス：\n• 残高照会 - ウォレットを確認\n• トークン転送 - BDAGを安全に送信\n• dApp 推奨 - 最高のアプリを見つける\n• BlockDAG教育 - 技術を学ぶ\n\n開始するには下のオプションをクリックしてください！",
            "私があなたのためにできること：\n• 残高照会 - ウォレットを確認\n• トークン転送 - BDAGを安全に送信\n• dApp 推奨 - 最高のアプリを見つける\n• BlockDAG教育 - 技術を学ぶ",
            "お手伝いするためにここにいます！利用可能なサービス：\n• 残高照会 - ウォレットを確認\n• トークン転送 - BDAGを安全に送信\n• dApp 推奨 - 最高のアプリを見つける\n• BlockDAG教育 - 技術を学ぶ"
        ],
        'bot-discover': [
            "BlockDAGの人気のdAppsをご紹介します：\n• DeFi取引所\n• NFTマーケットプレイス\n• イールドファーミング\n• ゲーミングプラットフォーム",
            "トレンドのdApps：\n• BlockSwap (DEX)\n• DAG NFTs\n• ステークプール\n• ゲーミングハブ",
            "あなたが気に入るかもしれない人気のdApps：\n• トレーディングプラットフォーム\n• NFTギャラリー\n• ステーキング報酬\n• ソーシャルネットワーク"
        ],
        'bot-default': [
            "理解できているか確信がありません。残高、トークン送信、またはdAppsの発見について尋ねてみてください。",
            "言い換えていただけますか？残高チェック、転送、dApp発見をお手伝いできます。",
            "よく理解できませんでした。残高、BDAG送信、またはdAppsの検索について聞いてください。"
        ],
        'bot-convert': [
            "BDAGをさまざまな通貨に変換するお手伝いをします。何を変換したいですか？",
            "通貨変換が利用可能です！金額と目標通貨（USD、EUR、INR など）を指定してください",
            "BDAGトークンを変換する準備ができています。金額と希望通貨を提供してください。"
        ]
    },
    es: {
        'network-status': 'Conectado a BlockDAG Testnet',
        'connect-wallet': 'Conectar Billetera',
        'hero-title': 'Bienvenido a Blockchain Buddy',
        'hero-description': 'Tu compañero impulsado por IA para interacciones perfectas con la red BlockDAG. Haz que las transacciones de criptomonedas sean tan fáciles como una conversación.',
        'chat-interface-title': 'Interfaz de Chat',
        'chat-interface-desc': 'Comandos de lenguaje natural para operaciones blockchain',
        'try-chat': 'Probar Interfaz de Chat',
        'secure-wallet-title': 'Billetera Segura',
        'secure-wallet-desc': 'Integración segura de billetera BlockDAG',
        'fast-transactions-title': 'Transacciones Rápidas',
        'fast-transactions-desc': 'Transacciones ultrarrápidas con tecnología BlockDAG',
        'view-transactions': 'Ver Transacciones',
        'cta-title': '¿Listo para Comenzar?',
        'cta-description': 'Conecta tu billetera para comenzar a interactuar con la red BlockDAG a través de nuestra interfaz impulsada por IA.',
        'learn-more': 'Aprender Más',
        'chat-title': 'Chat con Blockchain Buddy',
        'online-status': 'En línea',
        'welcome-message': '¡Hola! Soy tu Blockchain Buddy. ¿Cómo puedo ayudarte hoy? Puedes pedirme que verifique tu saldo, envíe tokens o descubra dApps.',
        'message-placeholder': 'Escribe tu mensaje aquí...',
        'available-services': 'Servicios Disponibles:',
        'balance-inquiries': 'Consultas de Saldo',
        'check-wallet': 'Verificar tu billetera',
        'token-transfers': 'Transferencias de Tokens',
        'send-bdag': 'Enviar BDAG de forma segura',
        'dapp-recommendations': 'Recomendaciones de dApp',
        'find-best-apps': 'Encontrar las mejores aplicaciones',
        'blockdag-education': 'Educación BlockDAG',
        'learn-technology': 'Aprender la tecnología',
        'quick-access': 'Acceso Rápido:',
        'balance-inquiries-desc': 'Consultas de saldo - Verificar tu billetera',
        'token-transfers-desc': 'Transferencias de tokens - Enviar BDAG de forma segura',
        'dapp-recommendations-desc': 'Recomendaciones de dApp - Encontrar las mejores aplicaciones',
        'blockdag-education-desc': 'Educación BlockDAG - Aprender la tecnología',
        'balance-chip': '💰 Saldo',
        'transfer-chip': '💸 Transferir',
        'convert-chip': '💱 Convertir',
        'dapps-chip': '🔍 dApps',
        'help-chip': '❓ Ayuda',
        'footer-text': '© 2025 Blockchain Buddy. Construido para BlockDAG Hackathon 2025.',
        'history-title': 'Historial de Transacciones',
        'transaction-history': 'Historial de Transacciones',
        'filter-type': 'Tipo:',
        'all-transactions': 'Todas las Transacciones',
        'sent-transactions': 'Enviadas',
        'received-transactions': 'Recibidas',
        'converted-transactions': 'Convertidas',
        'search-transactions': 'Buscar:',
        'search-placeholder': 'Buscar transacciones...',
        'loading-history': 'Cargando historial de transacciones...',
        // Bot responses
        'bot-greeting': [
            "¡Hola! Soy tu Blockchain Buddy. ¿Cómo puedo ayudarte hoy?",
            "¡Hola! ¿Listo para explorar la red BlockDAG?",
            "¡Bienvenido! Estoy aquí para hacer que las interacciones blockchain sean simples para ti."
        ],
        'bot-balance': [
            "Tu saldo actual es de 150.25 tokens BDAG.",
            "Tienes 150.25 BDAG en tu billetera.",
            "Saldo: 150.25 tokens BDAG"
        ],
        'bot-send': [
            "Para enviar tokens, especifica la cantidad y la dirección del destinatario.",
            "Puedo ayudarte a enviar tokens BDAG. ¿Qué cantidad te gustaría enviar?",
            "¡Por supuesto! Proporciona la dirección del destinatario y la cantidad."
        ],
        'bot-help': [
            "Servicios disponibles:\n• Consultas de saldo - Verifica tu billetera\n• Transferencias de tokens - Envía BDAG de forma segura\n• Recomendaciones de dApp - Encuentra las mejores aplicaciones\n• Educación BlockDAG - Aprende la tecnología\n\n¡Haz clic en cualquier opción de abajo para comenzar!",
            "Esto es lo que puedo hacer por ti:\n• Consultas de saldo - Verifica tu billetera\n• Transferencias de tokens - Envía BDAG de forma segura\n• Recomendaciones de dApp - Encuentra las mejores aplicaciones\n• Educación BlockDAG - Aprende la tecnología",
            "¡Estoy aquí para ayudar! Servicios disponibles:\n• Consultas de saldo - Verifica tu billetera\n• Transferencias de tokens - Envía BDAG de forma segura\n• Recomendaciones de dApp - Encuentra las mejores aplicaciones\n• Educación BlockDAG - Aprende la tecnología"
        ],
        'bot-discover': [
            "Aquí tienes algunas dApps populares en BlockDAG:\n• Intercambio DeFi\n• Mercado NFT\n• Agricultura de Rendimiento\n• Plataforma de Juegos",
            "dApps en tendencia:\n• BlockSwap (DEX)\n• DAG NFTs\n• Pool de Staking\n• Centro de Juegos",
            "dApps populares que podrían gustarte:\n• Plataforma de Trading\n• Galería NFT\n• Recompensas de Staking\n• Red Social"
        ],
        'bot-default': [
            "No estoy seguro de entender. Intenta preguntar sobre saldo, envío de tokens o descubrimiento de dApps.",
            "¿Podrías reformular eso? Puedo ayudar con verificaciones de saldo, transferencias y descubrimiento de dApps.",
            "No entendí completamente. Pregúntame sobre tu saldo, envío de BDAG o búsqueda de dApps."
        ],
        'bot-convert': [
            "Puedo ayudarte a convertir BDAG a varias monedas. ¿Qué te gustaría convertir?",
            "¡Conversión de moneda disponible! Especifica la cantidad y la moneda objetivo (USD, EUR, INR, etc.)",
            "Listo para convertir tokens BDAG. Por favor proporciona la cantidad y la moneda deseada."
        ]
    },
    ko: {
        'network-status': 'BlockDAG 테스트넷에 연결됨',
        'connect-wallet': '지갑 연결',
        'hero-title': '블록체인 버디에 오신 것을 환영합니다',
        'hero-description': '원활한 BlockDAG 네트워크 상호작용을 위한 AI 기반 동반자입니다. 암호화폐 거래를 대화처럼 쉽게 만드세요.',
        'chat-interface-title': '채팅 인터페이스',
        'chat-interface-desc': '블록체인 작업을 위한 자연어 명령',
        'try-chat': '채팅 인터페이스 시도',
        'secure-wallet-title': '보안 지갑',
        'secure-wallet-desc': '안전한 BlockDAG 지갑 통합',
        'fast-transactions-title': '빠른 거래',
        'fast-transactions-desc': 'BlockDAG 기술로 초고속 거래',
        'view-transactions': '거래 보기',
        'cta-title': '시작할 준비가 되셨나요?',
        'cta-description': 'AI 기반 인터페이스를 통해 BlockDAG 네트워크와 상호작용을 시작하려면 지갑을 연결하세요.',
        'learn-more': '더 알아보기',
        'chat-title': '블록체인 버디와 채팅',
        'online-status': '온라인',
        'welcome-message': '안녕하세요! 저는 당신의 블록체인 버디입니다. 오늘 어떻게 도와드릴까요? 잔액 확인, 토큰 전송 또는 dApp 발견을 요청할 수 있습니다.',
        'message-placeholder': '여기에 메시지를 입력하세요...',
        'available-services': '사용 가능한 서비스:',
        'balance-inquiries': '잔액 조회',
        'check-wallet': '지갑 확인',
        'token-transfers': '토큰 전송',
        'send-bdag': 'BDAG 안전하게 전송',
        'dapp-recommendations': 'dApp 추천',
        'find-best-apps': '최고의 앱 찾기',
        'blockdag-education': 'BlockDAG 교육',
        'learn-technology': '기술 학습',
        'quick-access': '빠른 액세스:',
        'balance-inquiries-desc': '잔액 조회 - 지갑 확인',
        'token-transfers-desc': '토큰 전송 - BDAG 안전하게 전송',
        'dapp-recommendations-desc': 'dApp 추천 - 최고의 앱 찾기',
        'blockdag-education-desc': 'BlockDAG 교육 - 기술 학습',
        'balance-chip': '💰 잔액',
        'transfer-chip': '💸 전송',
        'convert-chip': '💱 변환',
        'dapps-chip': '🔍 dApps',
        'help-chip': '❓ 도움말',
        'footer-text': '© 2025 블록체인 버디. BlockDAG 해커톤 2025를 위해 제작됨.',
        'history-title': '거래 내역',
        'transaction-history': '거래 내역',
        'filter-type': '유형:',
        'all-transactions': '모든 거래',
        'sent-transactions': '전송됨',
        'received-transactions': '수신됨',
        'converted-transactions': '변환됨',
        'search-transactions': '검색:',
        'search-placeholder': '거래 검색...',
        'loading-history': '거래 내역을 불러오는 중...',
        // Bot responses
        'bot-greeting': [
            "안녕하세요! 저는 당신의 블록체인 버디입니다. 오늘 어떻게 도와드릴까요?",
            "안녕하세요! BlockDAG 네트워크를 탐험할 준비가 되셨나요?",
            "환영합니다! 저는 블록체인 상호작용을 간단하게 만들어드리기 위해 여기 있습니다."
        ],
        'bot-balance': [
            "현재 잔액은 150.25 BDAG 토큰입니다.",
            "지갑에 150.25 BDAG가 있습니다.",
            "잔액: 150.25 BDAG 토큰"
        ],
        'bot-send': [
            "토큰을 보내려면 금액과 수신자 주소를 지정해주세요.",
            "BDAG 토큰 전송을 도와드릴 수 있습니다. 얼마를 보내시겠습니까?",
            "물론입니다! 수신자 주소와 금액을 제공해주세요."
        ],
        'bot-help': [
            "사용 가능한 서비스:\n• 잔액 조회 - 지갑 확인\n• 토큰 전송 - BDAG 안전하게 전송\n• dApp 추천 - 최고의 앱 찾기\n• BlockDAG 교육 - 기술 학습\n\n시작하려면 아래 옵션 중 하나를 클릭하세요!",
            "제가 도와드릴 수 있는 것들:\n• 잔액 조회 - 지갑 확인\n• 토큰 전송 - BDAG 안전하게 전송\n• dApp 추천 - 최고의 앱 찾기\n• BlockDAG 교육 - 기술 학습",
            "도움을 드리기 위해 여기 있습니다! 사용 가능한 서비스:\n• 잔액 조회 - 지갑 확인\n• 토큰 전송 - BDAG 안전하게 전송\n• dApp 추천 - 최고의 앱 찾기\n• BlockDAG 교육 - 기술 학습"
        ],
        'bot-discover': [
            "BlockDAG의 인기 dApp들을 소개합니다:\n• DeFi 거래소\n• NFT 마켓플레이스\n• 수익 농장\n• 게임 플랫폼",
            "트렌딩 dApp들:\n• BlockSwap (DEX)\n• DAG NFTs\n• 스테이킹 풀\n• 게임 허브",
            "당신이 좋아할 만한 인기 dApp들:\n• 트레이딩 플랫폼\n• NFT 갤러리\n• 스테이킹 보상\n• 소셜 네트워크"
        ],
        'bot-default': [
            "이해하지 못한 것 같습니다. 잔액, 토큰 전송 또는 dApp 발견에 대해 물어보세요.",
            "다시 말씀해 주시겠습니까? 잔액 확인, 전송 및 dApp 발견을 도와드릴 수 있습니다.",
            "완전히 이해하지 못했습니다. 잔액, BDAG 전송 또는 dApp 찾기에 대해 물어보세요."
        ],
        'bot-convert': [
            "BDAG를 다양한 통화로 변환하는 데 도움을 드릴 수 있습니다. 무엇을 변환하고 싶으신가요?",
            "통화 변환이 가능합니다! 금액과 목표 통화(USD, EUR, INR 등)를 지정해주세요",
            "BDAG 토큰 변환 준비가 되었습니다. 금액과 원하는 통화를 제공해주세요."
        ]
    },
    fr: {
        'network-status': 'Connecté au réseau de test BlockDAG',
        'connect-wallet': 'Connecter le Portefeuille',
        'hero-title': 'Bienvenue dans Blockchain Buddy',
        'hero-description': 'Votre compagnon alimenté par IA pour des interactions transparentes avec le réseau BlockDAG. Rendez les transactions crypto aussi faciles qu\'une conversation.',
        'chat-interface-title': 'Interface de Chat',
        'chat-interface-desc': 'Commandes en langage naturel pour les opérations blockchain',
        'try-chat': 'Essayer l\'Interface de Chat',
        'secure-wallet-title': 'Portefeuille Sécurisé',
        'secure-wallet-desc': 'Intégration sécurisée du portefeuille BlockDAG',
        'fast-transactions-title': 'Transactions Rapides',
        'fast-transactions-desc': 'Transactions ultra-rapides avec la technologie BlockDAG',
        'view-transactions': 'Voir les Transactions',
        'cta-title': 'Prêt à Commencer?',
        'cta-description': 'Connectez votre portefeuille pour commencer à interagir avec le réseau BlockDAG via notre interface alimentée par IA.',
        'learn-more': 'En Savoir Plus',
        'chat-title': 'Chat avec Blockchain Buddy',
        'online-status': 'En ligne',
        'welcome-message': 'Salut! Je suis votre Blockchain Buddy. Comment puis-je vous aider aujourd\'hui? Vous pouvez me demander de vérifier votre solde, d\'envoyer des jetons ou de découvrir des dApps.',
        'message-placeholder': 'Tapez votre message ici...',
        'available-services': 'Services Disponibles:',
        'balance-inquiries': 'Demandes de Solde',
        'check-wallet': 'Vérifier votre portefeuille',
        'token-transfers': 'Transferts de Jetons',
        'send-bdag': 'Envoyer BDAG en toute sécurité',
        'dapp-recommendations': 'Recommandations dApp',
        'find-best-apps': 'Trouver les meilleures applications',
        'blockdag-education': 'Éducation BlockDAG',
        'learn-technology': 'Apprendre la technologie',
        'quick-access': 'Accès Rapide:',
        'balance-inquiries-desc': 'Demandes de solde - Vérifier votre portefeuille',
        'token-transfers-desc': 'Transferts de jetons - Envoyer BDAG en toute sécurité',
        'dapp-recommendations-desc': 'Recommandations dApp - Trouver les meilleures applications',
        'blockdag-education-desc': 'Éducation BlockDAG - Apprendre la technologie',
        'balance-chip': '💰 Solde',
        'transfer-chip': '💸 Transfert',
        'convert-chip': '💱 Convertir',
        'dapps-chip': '🔍 dApps',
        'help-chip': '❓ Aide',
        'footer-text': '© 2025 Blockchain Buddy. Construit pour BlockDAG Hackathon 2025.',
        'history-title': 'Historique des Transactions',
        'transaction-history': 'Historique des Transactions',
        'filter-type': 'Type:',
        'all-transactions': 'Toutes les Transactions',
        'sent-transactions': 'Envoyées',
        'received-transactions': 'Reçues',
        'converted-transactions': 'Converties',
        'search-transactions': 'Rechercher:',
        'search-placeholder': 'Rechercher des transactions...',
        'loading-history': 'Chargement de l\'historique des transactions...',
        // Bot responses
        'bot-greeting': [
            "Salut! Je suis votre Blockchain Buddy. Comment puis-je vous aider aujourd'hui?",
            "Bonjour! Prêt à explorer le réseau BlockDAG?",
            "Bienvenue! Je suis là pour rendre les interactions blockchain simples pour vous."
        ],
        'bot-balance': [
            "Votre solde actuel est de 150.25 jetons BDAG.",
            "Vous avez 150.25 BDAG dans votre portefeuille.",
            "Solde: 150.25 jetons BDAG"
        ],
        'bot-send': [
            "Pour envoyer des jetons, veuillez spécifier le montant et l'adresse du destinataire.",
            "Je peux vous aider à envoyer des jetons BDAG. Quel montant souhaitez-vous envoyer?",
            "Bien sûr! Veuillez fournir l'adresse du destinataire et le montant."
        ],
        'bot-help': [
            "Services disponibles:\n• Demandes de solde - Vérifiez votre portefeuille\n• Transferts de jetons - Envoyez BDAG en toute sécurité\n• Recommandations dApp - Trouvez les meilleures applications\n• Éducation BlockDAG - Apprenez la technologie\n\nCliquez sur l'une des options ci-dessous pour commencer!",
            "Voici ce que je peux faire pour vous:\n• Demandes de solde - Vérifiez votre portefeuille\n• Transferts de jetons - Envoyez BDAG en toute sécurité\n• Recommandations dApp - Trouvez les meilleures applications\n• Éducation BlockDAG - Apprenez la technologie",
            "Je suis là pour aider! Services disponibles:\n• Demandes de solde - Vérifiez votre portefeuille\n• Transferts de jetons - Envoyez BDAG en toute sécurité\n• Recommandations dApp - Trouvez les meilleures applications\n• Éducation BlockDAG - Apprenez la technologie"
        ],
        'bot-discover': [
            "Voici quelques dApps populaires sur BlockDAG:\n• Échange DeFi\n• Marché NFT\n• Agriculture de rendement\n• Plateforme de jeux",
            "dApps tendance:\n• BlockSwap (DEX)\n• DAG NFTs\n• Pool de mise\n• Hub de jeux",
            "dApps populaires que vous pourriez aimer:\n• Plateforme de trading\n• Galerie NFT\n• Récompenses de mise\n• Réseau social"
        ],
        'bot-default': [
            "Je ne suis pas sûr de comprendre. Essayez de demander à propos du solde, de l'envoi de jetons ou de la découverte de dApps.",
            "Pourriez-vous reformuler cela? Je peux aider avec les vérifications de solde, les transferts et la découverte de dApps.",
            "Je n'ai pas tout à fait compris. Demandez-moi à propos de votre solde, de l'envoi de BDAG ou de la recherche de dApps."
        ],
        'bot-convert': [
            "Je peux vous aider à convertir BDAG en diverses devises. Que souhaitez-vous convertir?",
            "Conversion de devises disponible! Spécifiez le montant et la devise cible (USD, EUR, INR, etc.)",
            "Prêt à convertir les jetons BDAG. Veuillez fournir le montant et la devise souhaitée."
        ]
    }
};

// Sample responses for demo
const botResponses = {
    greeting: [
        "Hello! I'm your Blockchain Buddy. How can I help you today?",
        "Hi there! Ready to explore the BlockDAG network?",
        "Welcome! I'm here to make blockchain interactions simple for you."
    ],
    balance: [
        "Your current balance is 150.25 BDAG tokens.",
        "You have 150.25 BDAG in your wallet.",
        "Balance: 150.25 BDAG tokens"
    ],
    send: [
        "To send tokens, please specify the amount and recipient address.",
        "I can help you send BDAG tokens. What amount would you like to send?",
        "Sure! Please provide the recipient address and amount."
    ],
    help: [
        "Available services:\n• Balance inquiries - Check your wallet\n• Token transfers - Send BDAG safely\n• dApp recommendations - Find the best apps\n• BlockDAG education - Learn the technology\n\nClick on any option below to get started!",
        "Here's what I can do for you:\n• Balance inquiries - Check your wallet\n• Token transfers - Send BDAG safely\n• dApp recommendations - Find the best apps\n• BlockDAG education - Learn the technology",
        "I'm here to help! Available services:\n• Balance inquiries - Check your wallet\n• Token transfers - Send BDAG safely\n• dApp recommendations - Find the best apps\n• BlockDAG education - Learn the technology"
    ],
    discover: [
        "Here are some popular dApps on BlockDAG:\n• DeFi Exchange\n• NFT Marketplace\n• Yield Farming\n• Gaming Platform",
        "Trending dApps:\n• BlockSwap (DEX)\n• DAG NFTs\n• Stake Pool\n• Gaming Hub",
        "Popular dApps you might like:\n• Trading Platform\n• NFT Gallery\n• Staking Rewards\n• Social Network"
    ],
    default: [
        "I'm not sure I understand. Try asking about balance, sending tokens, or discovering dApps.",
        "Could you rephrase that? I can help with balance checks, transfers, and dApp discovery.",
        "I didn't quite get that. Ask me about your balance, sending BDAG, or finding dApps."
    ]
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Blockchain Buddy app...');
    
    // Check if blockchain integration is available
    if (typeof BlockchainBuddy !== 'undefined') {
        console.log('✅ Blockchain integration loaded successfully');
    } else {
        console.error('❌ Blockchain integration not found');
    }
    
    // Check if MetaMask is available
    if (typeof window.ethereum !== 'undefined') {
        console.log('✅ MetaMask is available');
    } else {
        console.warn('⚠️ MetaMask is not installed');
    }
    
    initializeTheme();
    initializeLanguage();
    initializeTransactionHistory();
    initializeEventListeners();
    addWelcomeMessage();
    
    console.log('🎉 App initialization complete');
});

// Event Listeners
function initializeEventListeners() {
    // Connect wallet buttons
    connectWalletBtn.addEventListener('click', () => {
        // Redirect to main page if not authenticated
        if (!auth.currentUser) {
            window.location.href = 'index.html';
        } else {
            handleWalletConnection();
        }
    });
    ctaConnectBtn.addEventListener('click', () => {
        if (!auth.currentUser) {
            window.location.href = 'index.html';
        } else {
            handleWalletConnection();
        }
    });
    
    // Login/Logout buttons
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await auth.signOut();
                showNotification('Logged out successfully', 'info');
                window.location.reload();
            } catch (error) {
                console.error('Logout error:', error);
                showNotification('Error logging out', 'error');
            }
        });
    }
    
    // Learn more button
    learnMoreBtn.addEventListener('click', openChat);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Language selector
    languageSelect.addEventListener('change', handleLanguageChange);
    
    // Chat with Friends button
    const chatFriendsBtn = document.getElementById('chatFriendsBtn');
    if (chatFriendsBtn) {
        chatFriendsBtn.addEventListener('click', () => {
            window.open('friends-chat.html', '_blank');
        });
    }
    
    // Feature cards
    chatFeatureCard.addEventListener('click', openChat);
    walletFeatureCard.addEventListener('click', handleWalletConnection);
    transactionsFeatureCard.addEventListener('click', showTransactions);
    
    // Chat functionality
    closeChatBtn.addEventListener('click', closeChat);
    minimizeChatBtn.addEventListener('click', toggleChatMinimize);
    clearChatBtn.addEventListener('click', clearChat);
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Chat suggestions
    chatSuggestions.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-chip')) {
            const suggestion = e.target.getAttribute('data-suggestion');
            messageInput.value = suggestion;
            sendMessage();
        }
    });
    
    // Chat menu options
    chatMenu.addEventListener('click', function(e) {
        const menuOption = e.target.closest('.menu-option');
        const serviceItem = e.target.closest('.service-item');
        
        if (menuOption) {
            const suggestion = menuOption.getAttribute('data-suggestion');
            messageInput.value = suggestion;
            sendMessage();
        } else if (serviceItem) {
            const suggestion = serviceItem.getAttribute('data-suggestion');
            messageInput.value = suggestion;
            sendMessage();
        }
    });
    
    // Auto-focus on message input when chat opens
    messageInput.addEventListener('focus', function() {
        this.placeholder = 'Type your message...';
    });
    
    // Transaction history
    historyBtn.addEventListener('click', showTransactionHistory);
    historyCloseBtn.addEventListener('click', hideTransactionHistory);
    historyModal.addEventListener('click', function(e) {
        if (e.target === historyModal) {
            hideTransactionHistory();
        }
    });
    
    // History filters
    historyTypeFilter.addEventListener('change', filterTransactionHistory);
    historySearchInput.addEventListener('input', filterTransactionHistory);
    
    messageInput.addEventListener('blur', function() {
        this.placeholder = 'Type your message here...';
    });
}

// Wallet Connection with Firebase Auth
function handleWalletConnection() {
    if (!isWalletConnected) {
        // Show loading state
        showLoading(connectWalletBtn, 'Connecting...');
        showLoading(ctaConnectBtn, 'Connecting...');
        
        // Simulate wallet connection with Firebase Auth
        authenticateUser()
            .then((user) => {
                isWalletConnected = true;
                updateWalletStatus();
                hideLoading(connectWalletBtn, 'Connected');
                hideLoading(ctaConnectBtn, 'Connected');
                
                // Store user data in Firestore
                saveUserData(user);
                
                // Show success message
                showNotification('Wallet connected successfully!', 'success');
                
                // Open chat after connection
                setTimeout(() => {
                    openChat();
                }, 1000);
            })
            .catch((error) => {
                console.error('Authentication failed:', error);
                hideLoading(connectWalletBtn, 'Connect Wallet');
                hideLoading(ctaConnectBtn, 'Connect Wallet');
                showNotification('Connection failed. Please try again.', 'error');
            });
    } else {
        // Disconnect wallet and sign out
        auth.signOut().then(() => {
            isWalletConnected = false;
            updateWalletStatus();
            showNotification('Wallet disconnected', 'info');
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    }
}

// Firebase Authentication
async function authenticateUser() {
    try {
        // For demo purposes, we'll use anonymous auth
        // In production, you'd use proper wallet authentication
        const userCredential = await auth.signInAnonymously();
        const user = userCredential.user;
        
        console.log('User authenticated:', user.uid);
        
        // Generate a mock wallet address for the user
        const walletAddress = generateWalletAddress();
        
        return {
            uid: user.uid,
            walletAddress: walletAddress,
            balance: userBalance,
            connectedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('Authentication error:', error);
        throw error;
    }
}

// Generate mock wallet address
function generateWalletAddress() {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
}

// Save user data to Firestore
async function saveUserData(userData) {
    try {
        await database.ref(`users/${userData.uid}`).set({
            walletAddress: userData.walletAddress,
            balance: userData.balance,
            connectedAt: userData.connectedAt,
            lastActive: new Date().toISOString()
        });
        
        console.log('User data saved to Realtime Database');
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

// Save chat message to Realtime Database
async function saveChatMessage(type, content, originalLanguage = null) {
    try {
        const user = auth.currentUser;
        if (!user) return;
        
        await database.ref(`users/${user.uid}/chatMessages`).push({
            type: type,
            content: content,
            originalLanguage: originalLanguage,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            language: currentLanguage
        });
        
        console.log('Chat message saved to Realtime Database');
    } catch (error) {
        console.error('Error saving chat message:', error);
    }
}

// Save transaction to Realtime Database
async function saveTransaction(transactionData) {
    try {
        const user = auth.currentUser;
        if (!user) return;
        
        await database.ref(`users/${user.uid}/transactions`).push({
            ...transactionData,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        console.log('Transaction saved to Realtime Database');
    } catch (error) {
        console.error('Error saving transaction:', error);
    }
}

// Load user's chat history from Realtime Database
async function loadChatHistory() {
    try {
        const user = auth.currentUser;
        if (!user) return;
        
        const messages = await database.ref(`users/${user.uid}/chatMessages`).orderByChild('timestamp').limitToLast(50).once('value');
        
        // Clear current chat messages (except welcome message)
        const chatMessages = document.getElementById('chatMessages');
        const welcomeMessage = chatMessages.querySelector('.bot-message');
        chatMessages.innerHTML = '';
        if (welcomeMessage) {
            chatMessages.appendChild(welcomeMessage);
        }
        
        // Add loaded messages
        const messagesData = messages.val();
        if (messagesData) {
            Object.values(messagesData).forEach(data => {
                addMessageToDOM(data.type, data.content, data.originalLanguage);
            });
        }
        
        console.log('Chat history loaded from Realtime Database');
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

// Add message to DOM only (without saving to Realtime Database)
function addMessageToDOM(type, content, originalLanguage = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    // Add avatar for messages
    const messageAvatar = document.createElement('div');
    messageAvatar.className = 'message-avatar';
    
    if (type === 'bot') {
        messageAvatar.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        `;
    } else {
        messageAvatar.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        `;
    }
    
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageWrapper.appendChild(messageContent);
    messageDiv.appendChild(messageAvatar);
    messageDiv.appendChild(messageWrapper);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update wallet status
function updateWalletStatus() {
    const buttons = [connectWalletBtn, ctaConnectBtn];
    buttons.forEach(btn => {
        if (isWalletConnected) {
            btn.textContent = 'Connected';
            btn.classList.add('btn-success');
            btn.style.background = '#10b981';
        } else {
            btn.textContent = 'Connect Wallet';
            btn.classList.remove('btn-success');
            btn.style.background = '#0284c7';
        }
    });
}

// Chat Functions
function openChat() {
    console.log('🚀 Opening chat interface...');
    isChatOpen = true;
    isChatMinimized = false;
    chatSection.style.display = 'block';
    chatSection.classList.remove('chat-minimized');
    chatSection.scrollIntoView({ behavior: 'smooth' });
    
    // Add opening animation
    setTimeout(() => {
        messageInput.focus();
        console.log('✅ Chat interface opened and focused');
    }, 300);
    
    // Show notification
    showNotification('Chat interface opened! Ask me anything about BlockDAG.', 'info');
    
    // Add a test message to verify chat is working
    setTimeout(() => {
        console.log('🧪 Adding test message to verify chat is working...');
        addMessage('bot', '✅ Chat interface is working! Your MetaMask is connected with 101.992650 BDAG. Try asking "What\'s my balance?"');
    }, 1000);
}

function closeChat() {
    isChatOpen = false;
    isChatMinimized = false;
    chatSection.style.display = 'none';
    chatSection.classList.remove('chat-minimized');
}

function toggleChatMinimize() {
    isChatMinimized = !isChatMinimized;
    if (isChatMinimized) {
        chatSection.classList.add('chat-minimized');
        showNotification('Chat minimized', 'info');
    } else {
        chatSection.classList.remove('chat-minimized');
        messageInput.focus();
        showNotification('Chat restored', 'info');
    }
}

function showTransactions() {
    // Placeholder for transactions feature
    showNotification('Transactions feature coming soon!', 'info');
    
    // For now, open chat with a transaction-related message
    openChat();
    setTimeout(() => {
        addMessage('bot', 'I can help you with transactions! Try asking "What\'s my balance?" or "Send 10 BDAG to someone".');
    }, 500);
}

function clearChat() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to clear the chat history? This action cannot be undone.')) {
        // Clear all messages except the welcome message
        chatMessages.innerHTML = '';
        
        // Add back the welcome message
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'message bot-message';
        welcomeMessage.innerHTML = `
            <div class="message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            </div>
            <div class="message-content">
                Hi! I'm your Blockchain Buddy. How can I help you today? You can ask me to check your balance, send tokens, or discover dApps.
            </div>
        `;
        chatMessages.appendChild(welcomeMessage);
        
        // Add a system message about clearing
        setTimeout(() => {
            addMessage('bot', 'Chat history cleared! How can I help you today?');
        }, 500);
        
        // Show notification
        showNotification('Chat history cleared successfully!', 'success');
        
        // Focus on input
        messageInput.focus();
    }
}

function addWelcomeMessage() {
    const welcomeMessage = {
        type: 'bot',
        content: "Hi! I'm your Blockchain Buddy. How can I help you today? You can ask me to check your balance, send tokens, or discover dApps."
    };
    // Message already exists in HTML, so we don't need to add it again
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    
    console.log('📤 Sending message:', message);
    
    // Add user message
    addMessage('user', message);
    
    // Clear input
    messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate bot response
    setTimeout(async () => {
        console.log('🤖 Generating bot response...');
        hideTypingIndicator();
        const response = await generateBotResponse(message);
        console.log('🤖 Bot response:', response);
        addMessage('bot', response);
        console.log('✅ Message added to chat');
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

function addMessage(type, content, originalLanguage = null) {
    console.log(`📝 Adding ${type} message:`, content);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    // Save message to Realtime Database if user is authenticated
    if (auth.currentUser) {
        saveChatMessage(type, content, originalLanguage);
    }
    
    // Add avatar for messages
    const messageAvatar = document.createElement('div');
    messageAvatar.className = 'message-avatar';
    
    if (type === 'bot') {
        messageAvatar.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        `;
    } else {
        messageAvatar.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        `;
    }
    
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Check if this is a conversion response
    const isConversionResponse = content.includes('BDAG =') && content.includes('$') || content.includes('€') || content.includes('₹') || content.includes('£') || content.includes('¥') || content.includes('₩');
    
    // Check if this is a transfer interface response
    const isTransferResponse = content.startsWith('TRANSFER_INTERFACE:');
    
    if (type === 'bot' && isTransferResponse) {
        // Parse transfer data
        const transferData = content.split(':');
        const prefilledAmount = transferData[1] || '';
        const prefilledAddress = transferData[2] || '';
        
        // Create transfer interface display
        messageContent.innerHTML = `
            <div class="transfer-result">
                <div class="transfer-title">💸 Send BDAG Tokens</div>
                <div class="transfer-subtitle">Transfer tokens safely to your friend</div>
            </div>
        `;
        
        // Add transfer interface
        const transferInterface = document.createElement('div');
        transferInterface.className = 'transfer-interface';
        transferInterface.innerHTML = `
            <div class="transfer-form">
                <div class="transfer-field-group">
                    <label class="transfer-label">Recipient Address</label>
                    <input type="text" class="transfer-address" placeholder="Enter wallet address (e.g., bdag1abc...)" value="${prefilledAddress}">
                    <div class="transfer-hint">Enter your friend's BlockDAG wallet address</div>
                </div>
                
                <div class="transfer-field-group">
                    <label class="transfer-label">Amount</label>
                    <div class="transfer-amount-group">
                        <input type="number" class="transfer-amount" placeholder="0.00" value="${prefilledAmount}" min="0" step="0.01">
                        <span class="transfer-currency">BDAG</span>
                    </div>
                    <div class="transfer-balance" id="transferBalance">Available: Loading...</div>
                </div>
                
                <div class="transfer-field-group">
                    <label class="transfer-label">Message (Optional)</label>
                    <input type="text" class="transfer-message" placeholder="Add a note for your friend...">
                </div>
                
                <div class="transfer-summary">
                    <div class="summary-row">
                        <span>Amount:</span>
                        <span class="summary-amount">0 BDAG</span>
                    </div>
                    <div class="summary-row">
                        <span>Network Fee:</span>
                        <span class="summary-fee">0.001 BDAG</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span class="summary-total">0.001 BDAG</span>
                    </div>
                </div>
                
                <div class="transfer-actions">
                    <button class="transfer-btn transfer-btn-secondary" onclick="cancelTransfer(this)">Cancel</button>
                    <button class="transfer-btn transfer-btn-primary" onclick="confirmTransfer(this)">Send Tokens</button>
                </div>
            </div>
        `;
        
        // Add event listeners for real-time updates
        const amountInput = transferInterface.querySelector('.transfer-amount');
        const addressInput = transferInterface.querySelector('.transfer-address');
        const summaryAmount = transferInterface.querySelector('.summary-amount');
        const summaryTotal = transferInterface.querySelector('.summary-total');
        const sendButton = transferInterface.querySelector('.transfer-btn-primary');
        
        async function updateSummary() {
            const amount = parseFloat(amountInput.value) || 0;
            const fee = 0.001;
            const total = amount + fee;
            
            summaryAmount.textContent = `${amount} BDAG`;
            summaryTotal.textContent = `${total.toFixed(3)} BDAG`;
            
            // Enable/disable send button
            const hasAddress = addressInput.value.trim().length > 0;
            const hasAmount = amount > 0;
            
            // Get real balance for validation
            const realBalance = await getRealBalance();
            const availableBalance = realBalance ? parseFloat(realBalance) : 0;
            const hasBalance = amount <= availableBalance;
            
            sendButton.disabled = !(hasAddress && hasAmount && hasBalance);
            
            if (!hasBalance && amount > 0) {
                summaryAmount.style.color = '#ef4444';
                summaryTotal.style.color = '#ef4444';
            } else {
                summaryAmount.style.color = '';
                summaryTotal.style.color = '';
            }
        }
        
        amountInput.addEventListener('input', () => updateSummary());
        addressInput.addEventListener('input', () => updateSummary());
        
        // Update balance display
        async function updateTransferBalance() {
            const balanceElement = transferInterface.querySelector('.transfer-balance');
            const realBalance = await getRealBalance();
            if (realBalance) {
                balanceElement.textContent = `Available: ${realBalance} BDAG`;
            } else {
                balanceElement.textContent = 'Available: Connect wallet to see balance';
            }
        }
        
        // Set initial values
        updateSummary();
        updateTransferBalance();
        
        messageWrapper.appendChild(messageContent);
        messageWrapper.appendChild(transferInterface);
    } else if (type === 'bot' && isConversionResponse) {
        // Create conversion result display
        messageContent.innerHTML = `
            <div class="conversion-result">
                <div class="conversion-title">💱 Currency Conversion</div>
                <div class="conversion-amount">${content}</div>
            </div>
        `;
        
        // Add conversion interface
        const conversionInterface = document.createElement('div');
        conversionInterface.className = 'conversion-interface';
        conversionInterface.innerHTML = `
            <div class="conversion-controls">
                <div class="conversion-input-group">
                    <input type="number" class="conversion-input" placeholder="Amount" value="1" min="0" step="0.01">
                    <span class="conversion-currency">BDAG</span>
                </div>
                <div class="conversion-arrow">→</div>
                <div class="conversion-output-group">
                    <select class="conversion-select">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="CNY">CNY (¥)</option>
                        <option value="KRW">KRW (₩)</option>
                        <option value="CAD">CAD (C$)</option>
                        <option value="AUD">AUD (A$)</option>
                        <option value="CHF">CHF</option>
                        <option value="SGD">SGD (S$)</option>
                        <option value="HKD">HKD (HK$)</option>
                        <option value="NZD">NZD (NZ$)</option>
                        <option value="SEK">SEK (kr)</option>
                        <option value="NOK">NOK (kr)</option>
                        <option value="DKK">DKK (kr)</option>
                        <option value="PLN">PLN (zł)</option>
                        <option value="CZK">CZK (Kč)</option>
                        <option value="HUF">HUF (Ft)</option>
                        <option value="RUB">RUB (₽)</option>
                        <option value="BRL">BRL (R$)</option>
                        <option value="MXN">MXN ($)</option>
                        <option value="TRY">TRY (₺)</option>
                        <option value="ZAR">ZAR (R)</option>
                        <option value="THB">THB (฿)</option>
                        <option value="MYR">MYR (RM)</option>
                        <option value="IDR">IDR (Rp)</option>
                        <option value="PHP">PHP (₱)</option>
                        <option value="VND">VND (₫)</option>
                        <option value="PKR">PKR (₨)</option>
                        <option value="BDT">BDT (৳)</option>
                        <option value="LKR">LKR (Rs)</option>
                        <option value="NPR">NPR (Rs)</option>
                        <option value="AED">AED</option>
                        <option value="SAR">SAR</option>
                        <option value="QAR">QAR</option>
                        <option value="KWD">KWD</option>
                        <option value="BHD">BHD</option>
                        <option value="OMR">OMR</option>
                        <option value="JOD">JOD</option>
                        <option value="ILS">ILS (₪)</option>
                        <option value="EGP">EGP (£)</option>
                        <option value="NGN">NGN (₦)</option>
                        <option value="KES">KES (KSh)</option>
                        <option value="GHS">GHS (₵)</option>
                        <option value="MAD">MAD</option>
                        <option value="TND">TND</option>
                        <option value="DZD">DZD</option>
                    </select>
                </div>
            </div>
            <div class="conversion-result-live">
                <span class="conversion-output">$0.45</span>
            </div>
        `;
        
        // Add event listeners for real-time conversion
        const inputField = conversionInterface.querySelector('.conversion-input');
        const selectField = conversionInterface.querySelector('.conversion-select');
        const outputField = conversionInterface.querySelector('.conversion-output');
        
        function updateConversion() {
            const amount = parseFloat(inputField.value) || 0;
            const currency = selectField.value;
            const convertedAmount = convertBDAGToCurrency(amount, currency);
            
            if (convertedAmount !== null) {
                const symbol = getCurrencySymbol(currency);
                const formatted = formatCurrency(convertedAmount, currency);
                outputField.textContent = `${symbol}${formatted}`;
            }
        }
        
        inputField.addEventListener('input', updateConversion);
        selectField.addEventListener('change', updateConversion);
        
        // Set initial values
        updateConversion();
        
        messageWrapper.appendChild(messageContent);
        messageWrapper.appendChild(conversionInterface);
    } else {
        messageContent.textContent = content;
        messageWrapper.appendChild(messageContent);
    }
    
    // Add "See Translation" button if message is not in English
    if (currentLanguage !== 'en' && content.trim() !== '') {
        const translationButton = document.createElement('button');
        translationButton.className = 'translation-btn';
        translationButton.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 8l6 6"/>
                <path d="M4 14l6-6 2-3"/>
                <path d="M2 5h12"/>
                <path d="M7 2h1"/>
                <path d="M22 22l-5-10-5 10"/>
                <path d="M14 18h6"/>
            </svg>
            See Translation
        `;
        
        const translationDiv = document.createElement('div');
        translationDiv.className = 'translation-content';
        translationDiv.style.display = 'none';
        
        let isTranslated = false;
        
        translationButton.addEventListener('click', () => {
            if (!isTranslated) {
                const englishTranslation = translateToEnglish(content, type);
                translationDiv.innerHTML = `
                    <div class="translation-label">English Translation:</div>
                    <div class="translation-text">${englishTranslation}</div>
                `;
                translationDiv.style.display = 'block';
                translationButton.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18"/>
                        <path d="M6 6l12 12"/>
                    </svg>
                    Hide Translation
                `;
                isTranslated = true;
            } else {
                translationDiv.style.display = 'none';
                translationButton.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 8l6 6"/>
                        <path d="M4 14l6-6 2-3"/>
                        <path d="M2 5h12"/>
                        <path d="M7 2h1"/>
                        <path d="M22 22l-5-10-5 10"/>
                        <path d="M14 18h6"/>
                    </svg>
                    See Translation
                `;
                isTranslated = false;
            }
        });
        
        messageWrapper.appendChild(translationButton);
        messageWrapper.appendChild(translationDiv);
    }
    
    messageDiv.appendChild(messageAvatar);
    messageDiv.appendChild(messageWrapper);
    
    console.log('📝 Chat messages container:', chatMessages);
    console.log('📝 Adding message to DOM...');
    chatMessages.appendChild(messageDiv);
    console.log('✅ Message added to DOM');
    
    // Add animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    console.log('✅ Message animation and scroll complete');
}

// Translation function to convert text to English
function translateToEnglish(text, messageType) {
    // For bot messages, find the English equivalent from translations
    if (messageType === 'bot') {
        // Check all bot response categories for matches
        const botCategories = ['greeting', 'balance', 'send', 'help', 'discover', 'default'];
        
        for (const category of botCategories) {
            const currentLangResponses = translations[currentLanguage][`bot-${category}`];
            const englishResponses = translations.en[`bot-${category}`];
            
            if (currentLangResponses && englishResponses) {
                const index = currentLangResponses.indexOf(text);
                if (index !== -1 && index < englishResponses.length) {
                    return englishResponses[index];
                }
            }
        }
    }
    
    // For user messages or if no exact match found, use a simple translation mapping
    const translationMap = {
        // Hindi translations
        'हैलो': 'Hello',
        'नमस्ते': 'Hello',
        'बैलेंस': 'Balance',
        'शेष राशि': 'Balance',
        'भेजें': 'Send',
        'टोकन': 'Token',
        'टोकन भेजें': 'Send tokens',
        'कन्वर्ट': 'Convert',
        'परिवर्तन': 'Convert',
        'मुद्रा': 'Currency',
        'डॉलर': 'USD',
        'रुपया': 'INR',
        'यूरो': 'EUR',
        'मदद': 'Help',
        'सहायता': 'Help',
        'डीऐप': 'dApp',
        'डीऐप्स': 'dApps',
        'खोजें': 'Find',
        'खोज': 'Search',
        
        // Chinese translations
        '你好': 'Hello',
        '余额': 'Balance',
        '发送': 'Send',
        '代币': 'Token',
        '发送代币': 'Send tokens',
        '转换': 'Convert',
        '兑换': 'Convert',
        '货币': 'Currency',
        '美元': 'USD',
        '人民币': 'CNY',
        '欧元': 'EUR',
        '帮助': 'Help',
        '应用': 'dApp',
        '应用程序': 'dApps',
        '查找': 'Find',
        '搜索': 'Search',
        
        // German translations
        'hallo': 'Hello',
        'guthaben': 'Balance',
        'senden': 'Send',
        'token': 'Token',
        'token senden': 'Send tokens',
        'konvertieren': 'Convert',
        'umwandeln': 'Convert',
        'währung': 'Currency',
        'dollar': 'USD',
        'euro': 'EUR',
        'hilfe': 'Help',
        'app': 'dApp',
        'apps': 'dApps',
        'finden': 'Find',
        'suchen': 'Search',
        
        // Japanese translations
        'こんにちは': 'Hello',
        '残高': 'Balance',
        '送信': 'Send',
        'トークン': 'Token',
        'トークンを送信': 'Send tokens',
        '変換': 'Convert',
        '交換': 'Convert',
        '通貨': 'Currency',
        'ドル': 'USD',
        '円': 'JPY',
        'ユーロ': 'EUR',
        'ヘルプ': 'Help',
        'アプリ': 'dApp',
        'アプリケーション': 'dApps',
        '検索': 'Find',
        
        // Spanish translations
        'hola': 'Hello',
        'saldo': 'Balance',
        'enviar': 'Send',
        'token': 'Token',
        'enviar tokens': 'Send tokens',
        'convertir': 'Convert',
        'cambiar': 'Convert',
        'moneda': 'Currency',
        'dólar': 'USD',
        'euro': 'EUR',
        'ayuda': 'Help',
        'aplicación': 'dApp',
        'aplicaciones': 'dApps',
        'buscar': 'Find',
        
        // Korean translations
        '안녕하세요': 'Hello',
        '잔액': 'Balance',
        '보내기': 'Send',
        '토큰': 'Token',
        '토큰 보내기': 'Send tokens',
        '변환': 'Convert',
        '전환': 'Convert',
        '통화': 'Currency',
        '달러': 'USD',
        '원': 'KRW',
        '유로': 'EUR',
        '도움말': 'Help',
        '앱': 'dApp',
        '앱들': 'dApps',
        '찾기': 'Find',
        
        // French translations
        'bonjour': 'Hello',
        'solde': 'Balance',
        'envoyer': 'Send',
        'jeton': 'Token',
        'envoyer des jetons': 'Send tokens',
        'convertir': 'Convert',
        'changer': 'Convert',
        'devise': 'Currency',
        'dollar': 'USD',
        'euro': 'EUR',
        'aide': 'Help',
        'application': 'dApp',
        'applications': 'dApps',
        'chercher': 'Find'
    };
    
    // Try to find direct translation
    const lowerText = text.toLowerCase();
    if (translationMap[lowerText]) {
        return translationMap[lowerText];
    }
    
    // For longer texts, try to translate word by word
    let translatedText = text;
    for (const [foreign, english] of Object.entries(translationMap)) {
        const regex = new RegExp(foreign, 'gi');
        translatedText = translatedText.replace(regex, english);
    }
    
    // If no translation found, return original text with note
    if (translatedText === text) {
        return `[Translation not available] ${text}`;
    }
    
    return translatedText;
}

async function generateBotResponse(userMessage) {
    console.log('🤖 Generating bot response for:', userMessage);
    const message = userMessage.toLowerCase();
    console.log('🤖 Processed message (lowercase):', message);
    
    // Check for balance inquiries - connect to MetaMask
    console.log('🔍 Checking for balance inquiry patterns...');
    console.log('🔍 Message contains "balance":', message.includes('balance'));
    console.log('🔍 Message contains "how much":', message.includes('how much'));
    console.log('🔍 Message contains "check balance":', message.includes('check balance'));
    console.log('🔍 Message contains "what is my balance":', message.includes('what is my balance'));
    console.log('🔍 Message contains "what\'s my balance":', message.includes('what\'s my balance'));
    
    if (message.includes('balance') || message.includes('how much') || message.includes('check balance') || message.includes('what is my balance') || message.includes('what\'s my balance')) {
        console.log('💰 Balance inquiry detected, calling handleBalanceInquiry()');
        const balanceResponse = await handleBalanceInquiry();
        console.log('💰 Balance response:', balanceResponse);
        return balanceResponse;
    }
    
    // Check for currency conversion requests
    if (message.includes('convert') || message.includes('exchange') || message.includes('price')) {
        return handleCurrencyConversion(userMessage);
    }
    
    // Check for transfer requests
    if (message.includes('send') || message.includes('transfer')) {
        return handleTokenTransfer(userMessage);
    }
    
    // Check for receive simulation (demo feature)
    if (message.includes('receive') || message.includes('simulate receive') || message.includes('test receive')) {
        return handleReceiveSimulation();
    }
    
    // Check for wallet connection
    if (message.includes('connect wallet') || message.includes('connect metamask') || message.includes('connect')) {
        console.log('🔗 Wallet connection request detected');
        const connectionResponse = await handleWalletConnection();
        console.log('🔗 Connection response:', connectionResponse);
        return connectionResponse;
    }
    
    // Test message to verify chat is working
    if (message.includes('test') || message.includes('hello')) {
        console.log('🧪 Test message detected');
        return "✅ Chat interface is working! Your MetaMask is connected with balance: 101.992650 BDAG. Try asking 'What's my balance?' to see real-time balance.";
    }
    
    // Simple keyword matching
    if (message.includes('help') || message.includes('what can')) {
        return getRandomResponse('help');
    } else if (message.includes('discover') || message.includes('dapp') || message.includes('app')) {
        return getRandomResponse('discover');
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return getRandomResponse('greeting');
    } else if (message.includes('balance')) {
        // Fallback for any balance-related query that wasn't caught above
        console.log('💰 Fallback balance inquiry detected');
        const balanceResponse = await handleBalanceInquiry();
        console.log('💰 Fallback balance response:', balanceResponse);
        return balanceResponse;
    } else {
        return getRandomResponse('default');
    }
}

// Get real balance from MetaMask
async function getRealBalance() {
    try {
        if (!window.blockchainBuddy || !window.blockchainBuddy.isConnected) {
            return null;
        }
        
        const balance = await window.blockchainBuddy.getBalance();
        return balance;
    } catch (error) {
        console.error('Error getting real balance:', error);
        return null;
    }
}

// Handle balance inquiry with MetaMask integration
async function handleBalanceInquiry() {
    console.log('🔍 Starting balance inquiry...');
    try {
        // Check if MetaMask is available
        if (typeof window.ethereum === 'undefined') {
            console.log('❌ MetaMask not found');
            return "❌ MetaMask is not installed. Please install MetaMask extension to check your balance.\n\nTo install MetaMask:\n1. Go to https://metamask.io\n2. Download and install the extension\n3. Create or import a wallet\n4. Come back and ask me to connect your wallet!";
        }
        
        console.log('✅ MetaMask is available');
        
        // Check if wallet is connected
        console.log('🔍 Checking wallet connection...');
        console.log('blockchainBuddy:', window.blockchainBuddy);
        console.log('isConnected:', window.blockchainBuddy?.isConnected);
        
        if (!window.blockchainBuddy || !window.blockchainBuddy.isConnected) {
            console.log('❌ Wallet not connected');
            return "🔗 Please connect your MetaMask wallet first. You can:\n\n1. Click the 'Connect Wallet' button above\n2. Or ask me to 'connect wallet'\n3. Or click the '🔗 Connect' suggestion below\n\nOnce connected, I'll be able to show your real BDAG balance!";
        }
        
        console.log('✅ Wallet is connected');
        
        // Check if we're on the correct network
        const isOnBlockDAG = await window.blockchainBuddy.validateBlockDAGNetwork();
        if (!isOnBlockDAG) {
            return "⚠️ You're not on the BlockDAG network. Please switch to BlockDAG Testnet in MetaMask to see your BDAG balance.\n\nI can help you switch networks - just ask me to 'connect wallet' again!";
        }
        
        // Get real balance from MetaMask
        console.log('💰 Fetching balance from MetaMask...');
        const balance = await window.blockchainBuddy.getBalance();
        const account = window.blockchainBuddy.currentAccount;
        
        console.log('Balance:', balance);
        console.log('Account:', account);
        
        if (balance && balance !== '0') {
            const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'your wallet';
            console.log('✅ Balance found:', balance, 'BDAG');
            return `💰 Your current balance is ${balance} BDAG tokens in ${shortAddress}.\n\n💡 You can ask me to:\n• Send tokens to someone\n• Convert BDAG to other currencies\n• Check transaction history`;
        } else {
            console.log('💰 Balance is 0 or null');
            return "💰 Your current balance is 0 BDAG tokens.\n\n💡 To get test BDAG tokens:\n1. Visit the BlockDAG faucet: https://primordial.bdagscan.com/faucet\n2. Paste your wallet address\n3. Request test tokens\n4. Come back and check your balance again!";
        }
        
    } catch (error) {
        console.error('Error getting balance:', error);
        return "❌ Error checking balance. Please make sure:\n\n1. MetaMask is installed and unlocked\n2. You're connected to the BlockDAG Testnet\n3. Your wallet is connected to this app\n\nTry asking me to 'connect wallet' first!";
    }
}

// Handle wallet connection through chat
async function handleWalletConnection() {
    console.log('🔗 Starting wallet connection...');
    try {
        if (!window.blockchainBuddy) {
            console.log('❌ Blockchain integration not available');
            return "❌ Blockchain integration not available. Please refresh the page.";
        }
        
        console.log('✅ Blockchain integration available');
        
        // Check if MetaMask is available
        if (typeof window.ethereum === 'undefined') {
            return "❌ MetaMask is not installed. Please install MetaMask extension first.\n\nTo install MetaMask:\n1. Go to https://metamask.io\n2. Download and install the extension\n3. Create or import a wallet\n4. Come back and try connecting again!";
        }
        
        const success = await window.blockchainBuddy.connectWallet();
        
        if (success) {
            const account = window.blockchainBuddy.currentAccount;
            const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'your wallet';
            
            // Check if we're on the correct network
            const isOnBlockDAG = await window.blockchainBuddy.validateBlockDAGNetwork();
            
            if (isOnBlockDAG) {
                return `✅ Wallet connected successfully!\n\n📱 Address: ${shortAddress}\n🌐 Network: BlockDAG Testnet\n\n💡 You can now:\n• Check your balance\n• Send BDAG tokens\n• Convert currencies\n• View transaction history`;
            } else {
                return `✅ Wallet connected!\n\n📱 Address: ${shortAddress}\n⚠️ Network: Wrong network (not BlockDAG)\n\nI'll help you switch to BlockDAG Testnet automatically. Please approve the network switch in MetaMask!`;
            }
        } else {
            return "❌ Failed to connect wallet. Please make sure:\n\n1. MetaMask is installed and unlocked\n2. You approve the connection request\n3. You approve the network switch (if prompted)\n\nTry again or refresh the page!";
        }
        
    } catch (error) {
        console.error('Error connecting wallet:', error);
        
        if (error.code === 4001) {
            return "❌ Connection rejected. You declined the MetaMask connection request.\n\nTo connect:\n1. Make sure MetaMask is unlocked\n2. Try again and click 'Connect' when prompted\n3. Approve any network switch requests";
        } else if (error.code === -32002) {
            return "⏳ MetaMask request already pending. Please check your MetaMask extension and approve the connection request.";
        } else {
            return "❌ Error connecting wallet. Please try again or make sure MetaMask is installed and unlocked.";
        }
    }
}

// Currency conversion function
function handleCurrencyConversion(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Extract amount and currency from message
    const amountMatch = message.match(/(\d+(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 1;
    
    // Look for currency codes in the message
    const currencyMatch = message.match(/\b(usd|eur|inr|gbp|jpy|cny|krw|cad|aud|chf|sgd|hkd|nzd|sek|nok|dkk|pln|czk|huf|rub|brl|mxn|ars|clp|cop|pen|uyu|thb|myr|idr|php|vnd|try|zar|egp|ngn|kes|ghs|mad|tnd|dzd|aed|sar|qar|kwd|bhd|omr|jod|lbp|ils|pkr|bdt|lkr|npr|afn|mmk|khr|lak|mnt|kzt|uzs|kgs|tjs|amd|gel|azn|byn|uah|mdl|ron|bgn|hrk|rsd|bam|mkd|all)\b/i);
    
    if (currencyMatch) {
        const targetCurrency = currencyMatch[1].toUpperCase();
        const convertedAmount = convertBDAGToCurrency(amount, targetCurrency);
        
        if (convertedAmount !== null) {
            return createConversionResponse(amount, targetCurrency, convertedAmount);
        } else {
            return getRandomResponse('convert');
        }
    } else {
        // No specific currency mentioned, show conversion interface
        return getRandomResponse('convert');
    }
}

// Convert BDAG to target currency
function convertBDAGToCurrency(bdagAmount, targetCurrency) {
    if (exchangeRates[targetCurrency]) {
        const rate = exchangeRates[targetCurrency];
        const convertedAmount = bdagAmount * rate;
        return convertedAmount;
    }
    return null;
}

// Create conversion response with interactive interface
function createConversionResponse(bdagAmount, targetCurrency, convertedAmount) {
    const formattedAmount = formatCurrency(convertedAmount, targetCurrency);
    
    // Get currency symbol
    const currencySymbol = getCurrencySymbol(targetCurrency);
    
    // Create response based on current language
    let response = '';
    
    switch (currentLanguage) {
        case 'hi':
            response = `${bdagAmount} BDAG = ${currencySymbol}${formattedAmount} ${targetCurrency}`;
            break;
        case 'zh':
            response = `${bdagAmount} BDAG = ${currencySymbol}${formattedAmount} ${targetCurrency}`;
            break;
        case 'de':
            response = `${bdagAmount} BDAG = ${currencySymbol}${formattedAmount} ${targetCurrency}`;
            break;
        case 'ja':
            response = `${bdagAmount} BDAG = ${currencySymbol}${formattedAmount} ${targetCurrency}`;
            break;
        case 'es':
            response = `${bdagAmount} BDAG = ${currencySymbol}${formattedAmount} ${targetCurrency}`;
            break;
        case 'ko':
            response = `${bdagAmount} BDAG = ${currencySymbol}${formattedAmount} ${targetCurrency}`;
            break;
        case 'fr':
            response = `${bdagAmount} BDAG = ${currencySymbol}${formattedAmount} ${targetCurrency}`;
            break;
        default:
            response = `${bdagAmount} BDAG = ${currencySymbol}${formattedAmount} ${targetCurrency}`;
    }
    
    return response;
}

// Format currency based on locale
function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    }).format(amount);
}

// Get currency symbol
function getCurrencySymbol(currency) {
    const symbols = {
        USD: '$', EUR: '€', INR: '₹', GBP: '£', JPY: '¥', CNY: '¥', KRW: '₩',
        CAD: 'C$', AUD: 'A$', CHF: 'CHF', SGD: 'S$', HKD: 'HK$', NZD: 'NZ$',
        SEK: 'kr', NOK: 'kr', DKK: 'kr', PLN: 'zł', CZK: 'Kč', HUF: 'Ft',
        RUB: '₽', BRL: 'R$', MXN: '$', ARS: '$', CLP: '$', COP: '$',
        PEN: 'S/', UYU: '$', THB: '฿', MYR: 'RM', IDR: 'Rp', PHP: '₱',
        VND: '₫', TRY: '₺', ZAR: 'R', EGP: '£', NGN: '₦', KES: 'KSh',
        GHS: '₵', MAD: 'MAD', TND: 'TND', DZD: 'DZD', AED: 'AED', SAR: 'SAR',
        QAR: 'QAR', KWD: 'KWD', BHD: 'BHD', OMR: 'OMR', JOD: 'JOD', LBP: 'LBP',
        ILS: '₪', PKR: '₨', BDT: '৳', LKR: 'Rs', NPR: 'Rs', AFN: '؋',
        MMK: 'K', KHR: '៛', LAK: '₭', MNT: '₮', KZT: '₸', UZS: 'UZS',
        KGS: 'с', TJS: 'TJS', AMD: '֏', GEL: '₾', AZN: '₼', BYN: 'Br',
        UAH: '₴', MDL: 'L', RON: 'lei', BGN: 'лв', HRK: 'kn', RSD: 'дин',
        BAM: 'KM', MKD: 'ден', ALL: 'L'
    };
    return symbols[currency] || currency;
}

// Token transfer function
function handleTokenTransfer(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Extract amount from message if specified
    const amountMatch = message.match(/(\d+(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : '';
    
    // Extract potential address from message
    const addressMatch = message.match(/to\s+([a-zA-Z0-9]+)/);
    const address = addressMatch ? addressMatch[1] : '';
    
    // Return special marker for transfer interface
    return `TRANSFER_INTERFACE:${amount}:${address}`;
}

// Handle receive simulation
function handleReceiveSimulation() {
    // Trigger the simulation
    setTimeout(async () => {
        await simulateReceiveTransaction();
    }, 1000);
    
    return "🎯 Simulating incoming transaction... Check your transaction history in a moment!";
}

function getRandomResponse(category) {
    // Check if we have translations for the current language
    if (translations[currentLanguage] && translations[currentLanguage][`bot-${category}`]) {
        const responses = translations[currentLanguage][`bot-${category}`];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Fallback to English if translation not available
    const responses = botResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <span class="loading"></span>
            <span style="margin-left: 10px;">Blockchain Buddy is typing...</span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Utility Functions
function showLoading(button, text) {
    const originalText = button.textContent;
    button.innerHTML = `<span class="loading"></span> ${text}`;
    button.disabled = true;
    button.dataset.originalText = originalText;
}

function hideLoading(button, text) {
    button.innerHTML = text || button.dataset.originalText || 'Connect Wallet';
    button.disabled = false;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some fun easter eggs
const easterEggs = {
    'blockchain buddy rocks': 'Thanks! I try my best to make blockchain easy for everyone! 🚀',
    'you are awesome': 'Aww, thank you! You\'re pretty awesome too! 😊',
    'tell me a joke': 'Why did the blockchain go to therapy? Because it had too many blocks! 😄',
    'what is blockdag': 'BlockDAG is a revolutionary blockchain architecture that uses Directed Acyclic Graphs for faster, more scalable transactions!'
};

// Check for easter eggs in bot response generation
const originalGenerateBotResponse = generateBotResponse;
generateBotResponse = function(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for easter eggs first
    for (const [trigger, response] of Object.entries(easterEggs)) {
        if (message.includes(trigger)) {
            return response;
        }
    }
    
    // Fall back to original logic
    return originalGenerateBotResponse(userMessage);
};

// Theme Functions
function initializeTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
    } else {
        // Check system preference
        isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    applyTheme();
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                isDarkMode = e.matches;
                applyTheme();
            }
        });
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme();
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Show theme change notification
    showNotification(`Switched to ${isDarkMode ? 'dark' : 'light'} mode`, 'info');
}

function applyTheme() {
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

// Enhanced bot responses with theme commands
const originalBotResponses = { ...botResponses };
botResponses.theme = [
    `Theme switched! I can help you toggle between light and dark modes anytime.`,
    `Looking good in ${isDarkMode ? 'dark' : 'light'} mode! You can change themes using the toggle button.`,
    `Theme changed successfully! The interface now matches your preference.`
];

botResponses.clear = [
    `Chat cleared! I'm here to help with your BlockDAG needs. What would you like to do?`,
    `Fresh start! How can I assist you with balance inquiries, token transfers, dApp recommendations, or BlockDAG education?`,
    `All clear! Ready to help you with any BlockDAG-related questions or tasks.`
];

// Update bot response generation to handle theme and clear commands
const originalGenerateBotResponseTheme = generateBotResponse;
generateBotResponse = function(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for clear chat commands
    if (message.includes('clear chat') || message.includes('clear history') || message.includes('reset chat') || message.includes('clear conversation')) {
        clearChat();
        return getRandomResponse('clear');
    }
    
    // Check for theme-related commands
    if (message.includes('dark mode') || message.includes('light mode') || message.includes('theme') || message.includes('switch theme')) {
        toggleTheme();
        return getRandomResponse('theme');
    }
    
    // Check for easter eggs first
    for (const [trigger, response] of Object.entries(easterEggs)) {
        if (message.includes(trigger)) {
            return response;
        }
    }
    
    // Fall back to original logic
    return originalGenerateBotResponseTheme(userMessage);
}; 

// Language Functions
function handleLanguageChange() {
    const selectedLanguage = languageSelect.value;
    setLanguage(selectedLanguage);
}

function setLanguage(language) {
    if (translations[language]) {
        currentLanguage = language;
        localStorage.setItem('selectedLanguage', language);
        updatePageLanguage();
        
        // Update chat welcome message if chat is open
        if (isChatOpen) {
            updateChatWelcomeMessage();
        }
        
        showNotification(`Language changed to ${getLanguageName(language)}`, 'info');
    }
}

function getLanguageName(code) {
    const names = {
        'en': 'English',
        'hi': 'हिंदी',
        'zh': '中文',
        'de': 'Deutsch',
        'ja': '日本語',
        'es': 'Español',
        'ko': '한국어',
        'fr': 'Français'
    };
    return names[code] || 'English';
}

function updatePageLanguage() {
    // Update all elements with data-translate attributes
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Update placeholder text
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });
}

function updateChatWelcomeMessage() {
    // Find the welcome message in chat and update it
    const welcomeMessage = document.querySelector('.message.bot-message .message-content[data-translate="welcome-message"]');
    if (welcomeMessage && translations[currentLanguage] && translations[currentLanguage]['welcome-message']) {
        welcomeMessage.textContent = translations[currentLanguage]['welcome-message'];
    }
}

function initializeLanguage() {
    // Load saved language or default to English
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    currentLanguage = savedLanguage;
    languageSelect.value = savedLanguage;
    updatePageLanguage();
}

// Transfer action functions
function cancelTransfer(button) {
    const transferInterface = button.closest('.transfer-interface');
    transferInterface.style.opacity = '0.5';
    transferInterface.style.pointerEvents = 'none';
    
    // Add cancelled message
    setTimeout(() => {
        addMessage('bot', 'Transfer cancelled. Is there anything else I can help you with?');
    }, 500);
}

async function confirmTransfer(button) {
    const transferInterface = button.closest('.transfer-interface');
    const addressInput = transferInterface.querySelector('.transfer-address');
    const amountInput = transferInterface.querySelector('.transfer-amount');
    const messageInput = transferInterface.querySelector('.transfer-message');
    
    const address = addressInput.value.trim();
    const amount = parseFloat(amountInput.value) || 0;
    const message = messageInput.value.trim();
    
    // Validate inputs
    if (!address) {
        showNotification('Please enter a recipient address', 'error');
        addressInput.focus();
        return;
    }
    
    if (amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        amountInput.focus();
        return;
    }
    
    // Check real balance
    const realBalance = await getRealBalance();
    const availableBalance = realBalance ? parseFloat(realBalance) : 0;
    
    if (amount > availableBalance) {
        showNotification(`Insufficient balance. Available: ${availableBalance} BDAG`, 'error');
        amountInput.focus();
        return;
    }
    
    // Disable the interface
    transferInterface.style.opacity = '0.5';
    transferInterface.style.pointerEvents = 'none';
    
    // Show loading state
    button.innerHTML = '<div class="loading-spinner"></div> Processing...';
    button.disabled = true;
    
    // Simulate transfer process
    setTimeout(async () => {
        // Create transaction data
        const fee = 0.001;
        const total = amount + fee;
        const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const transactionData = {
            id: transactionId,
            type: 'sent',
            amount: amount,
            address: address,
            fee: fee,
            total: total,
            message: message || '',
            status: 'completed'
        };
        
        // Save transaction to database
        await saveTransaction(transactionData);
        
        // Create success message
        let successMessage = `✅ Transfer Successful!\n\n`;
        successMessage += `💰 Amount: ${amount} BDAG\n`;
        successMessage += `📍 To: ${address.substring(0, 10)}...${address.substring(address.length - 6)}\n`;
        successMessage += `💸 Network Fee: ${fee} BDAG\n`;
        successMessage += `🔗 Total: ${total.toFixed(3)} BDAG\n`;
        if (message) {
            successMessage += `💬 Message: "${message}"\n`;
        }
        successMessage += `\n🆔 Transaction ID: ${transactionId}`;
        
        addMessage('bot', successMessage);
        
        // Update balance (simulate)
        const realBalance = await getRealBalance();
        const currentBalance = realBalance ? parseFloat(realBalance) : 0;
        const newBalance = (currentBalance - total).toFixed(3);
        setTimeout(() => {
            addMessage('bot', `💰 Your new balance: ${newBalance} BDAG`);
        }, 1000);
        
        // Refresh transaction history
        await initializeTransactionHistory();
        
    }, 2000);
}

// Simulate receiving a transaction (for demo purposes)
async function simulateReceiveTransaction() {
    const randomAmounts = [25.5, 50.0, 75.25, 100.0, 150.75];
    const randomAddresses = [
        'bdag1qfriend1234567890abcdef1234567890abcdef12',
        'bdag1qminer098765432109876543210987654321098765',
        'bdag1qstaking1111222233334444555566667777888899',
        'bdag1qreward9999888877776666555544443333222211'
    ];
    const randomMessages = [
        'Payment for services',
        'Staking rewards',
        'Mining rewards',
        'Gift from friend',
        'Refund',
        ''
    ];
    
    const amount = randomAmounts[Math.floor(Math.random() * randomAmounts.length)];
    const address = randomAddresses[Math.floor(Math.random() * randomAddresses.length)];
    const message = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    
    const transactionData = {
        id: `received_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'received',
        amount: amount,
        address: address,
        fee: 0.0,
        message: message,
        status: 'completed'
    };
    
    // Save transaction to database
    await saveTransaction(transactionData);
    
    // Show notification
    showNotification(`💰 Received ${amount} BDAG from ${address.substring(0, 12)}...`, 'success');
    
    // Refresh transaction history
    await initializeTransactionHistory();
    
    return transactionData;
}

// Load transaction history from Realtime Database or use mock data
async function initializeTransactionHistory() {
    try {
        const user = auth.currentUser;
        if (user) {
            // Load from Realtime Database
            const transactions = await database.ref(`users/${user.uid}/transactions`).orderByChild('timestamp').limitToLast(50).once('value');
            
            const transactionsData = transactions.val();
            if (transactionsData) {
                transactionHistory = Object.entries(transactionsData).map(([id, tx]) => ({
                    id: id,
                    ...tx,
                    timestamp: new Date(tx.timestamp)
                }));
            } else {
                transactionHistory = [];
            }
            
            console.log('Transaction history loaded from Realtime Database');
        } else {
            // Use mock data if not authenticated
            loadMockTransactionHistory();
        }
    } catch (error) {
        console.error('Error loading transaction history:', error);
        // Fallback to mock data
        loadMockTransactionHistory();
    }
}

// Mock transaction history data
function loadMockTransactionHistory() {
    const now = new Date();
    transactionHistory = [
        {
            id: 'tx_1704067200_abc123',
            type: 'received',
            amount: 500.0,
            address: 'bdag1qxy4h8k9w2r5t6y7u8i9o0p1q2w3e4r5t6y7u8i9o0',
            timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
            status: 'completed',
            fee: 0.001,
            message: 'Payment for services'
        },
        {
            id: 'tx_1704053800_def456',
            type: 'sent',
            amount: 75.5,
            address: 'bdag1qab2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
            timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            status: 'completed',
            fee: 0.001,
            message: 'Transfer to friend'
        },
        {
            id: 'tx_1704040200_ghi789',
            type: 'converted',
            amount: 100.0,
            currency: 'USD',
            convertedAmount: 45.0,
            timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            status: 'completed'
        },
        {
            id: 'tx_1704026600_jkl012',
            type: 'received',
            amount: 250.25,
            address: 'bdag1qcd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3',
            timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            status: 'completed',
            fee: 0.001,
            message: 'Staking rewards'
        },
        {
            id: 'tx_1704013000_mno345',
            type: 'sent',
            amount: 200.0,
            address: 'bdag1qef6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5',
            timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            status: 'completed',
            fee: 0.001,
            message: 'Payment for purchase'
        },
        {
            id: 'tx_1703999400_pqr678',
            type: 'converted',
            amount: 50.0,
            currency: 'EUR',
            convertedAmount: 21.0,
            timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
            status: 'completed'
        },
        {
            id: 'tx_1703985800_stu901',
            type: 'received',
            amount: 1000.0,
            address: 'bdag1qgh8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7',
            timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            status: 'completed',
            fee: 0.001,
            message: 'Initial deposit'
        }
    ];
}

// Show transaction history modal
function showTransactionHistory() {
    historyModal.style.display = 'flex';
    historyLoading.style.display = 'flex';
    historyList.style.display = 'none';
    
    // Simulate loading
    setTimeout(() => {
        historyLoading.style.display = 'none';
        historyList.style.display = 'block';
        displayTransactionHistory();
    }, 1000);
}

// Hide transaction history modal
function hideTransactionHistory() {
    historyModal.style.display = 'none';
}

// Display transaction history
function displayTransactionHistory(filteredHistory = null) {
    const history = filteredHistory || transactionHistory;
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="history-empty">
                <div class="empty-icon">📄</div>
                <h4>No transactions found</h4>
                <p>Your transaction history will appear here</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = history.map(tx => {
        const typeIcon = getTransactionIcon(tx.type);
        const typeClass = `transaction-${tx.type}`;
        const formattedDate = formatDate(tx.timestamp);
        const formattedTime = formatTime(tx.timestamp);
        
        let amountDisplay = '';
        let addressDisplay = '';
        
        if (tx.type === 'converted') {
            amountDisplay = `${tx.amount} BDAG → ${formatCurrency(tx.convertedAmount, tx.currency)}`;
            addressDisplay = `Converted to ${tx.currency}`;
        } else {
            const sign = tx.type === 'received' ? '+' : '-';
            amountDisplay = `${sign}${tx.amount} BDAG`;
            addressDisplay = `${tx.address.substring(0, 12)}...${tx.address.substring(tx.address.length - 8)}`;
        }
        
        return `
            <div class="history-item ${typeClass}">
                <div class="transaction-icon">${typeIcon}</div>
                <div class="transaction-details">
                    <div class="transaction-header">
                        <span class="transaction-type">${capitalizeFirst(tx.type)}</span>
                        <span class="transaction-amount">${amountDisplay}</span>
                    </div>
                    <div class="transaction-info">
                        <span class="transaction-address">${addressDisplay}</span>
                        <span class="transaction-date">${formattedDate} ${formattedTime}</span>
                    </div>
                    ${tx.message ? `<div class="transaction-message">${tx.message}</div>` : ''}
                    <div class="transaction-meta">
                        <span class="transaction-id">ID: ${tx.id}</span>
                        <span class="transaction-status status-${tx.status}">${capitalizeFirst(tx.status)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Filter transaction history
function filterTransactionHistory() {
    const typeFilter = historyTypeFilter.value;
    const searchTerm = historySearchInput.value.toLowerCase();
    
    let filtered = transactionHistory;
    
    // Filter by type
    if (typeFilter !== 'all') {
        filtered = filtered.filter(tx => tx.type === typeFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(tx => 
            tx.id.toLowerCase().includes(searchTerm) ||
            tx.address?.toLowerCase().includes(searchTerm) ||
            tx.message?.toLowerCase().includes(searchTerm) ||
            tx.currency?.toLowerCase().includes(searchTerm)
        );
    }
    
    displayTransactionHistory(filtered);
}

// Helper functions
function getTransactionIcon(type) {
    switch (type) {
        case 'sent': return '📤';
        case 'received': return '📥';
        case 'converted': return '💱';
        default: return '📄';
    }
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

 