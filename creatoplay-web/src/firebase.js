// Firebase Configuration
// Replace these with your actual Firebase project credentials
// Go to: https://console.firebase.google.com
// 1. Create a new project (or use existing)
// 2. Go to Project Settings > General > Your apps > Web app
// 3. Copy the config values here

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDoZC1x-hp_KGS9ozgo7HzTFXvB7t1jIV8",
  authDomain: "creatoplay-c8470.firebaseapp.com",
  projectId: "creatoplay-c8470",
  storageBucket: "creatoplay-c8470.firebasestorage.app",
  messagingSenderId: "427663718090",
  appId: "1:427663718090:web:701e935ee3caeb0a4fa633",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
