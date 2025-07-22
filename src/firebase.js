// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqJhiMGQ0MzctMWFiNC00YmFIWJhNDYtMTkzJYxOW4",
  authDomain: "blockchain-buddy-7c64c.firebaseapp.com",
  projectId: "blockchain-buddy-7c64c",
  storageBucket: "blockchain-buddy-7c64c.firebasestorage.app",
  messagingSenderId: "270517045251",
  appId: "1:270517045251:web:036d50421a78306265a636"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app; 