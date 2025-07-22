// Firebase Configuration for Wallet Messaging System
// IMPORTANT: Replace with your actual Firebase project credentials
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing project
// 3. Go to Project Settings > General > Your apps
// 4. Add a web app and copy the config below
// 5. Enable Realtime Database in Firebase Console

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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