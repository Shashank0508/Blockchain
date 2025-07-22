// Firebase Configuration for Wallet Messaging System
// Note: Replace with your actual Firebase project credentials

const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "blockchain-buddy-7c64c.firebaseapp.com",
    databaseURL: "https://blockchain-buddy-7c64c-default-rtdb.firebaseio.com",
    projectId: "blockchain-buddy-7c64c",
    storageBucket: "blockchain-buddy-7c64c.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized for messaging system');
} else {
    console.warn('Firebase not loaded. Messaging will work in demo mode only.');
}

// Export for use in other files
window.firebaseConfig = firebaseConfig; 