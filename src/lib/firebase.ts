/**
 * Firebase configuration and initialization
 * Handles both server-side and client-side initialization
 */
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Get Firebase config directly from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Fallback configuration if environment variables are not available
const fallbackConfig = {
  apiKey: "AIzaSyAPcBozYWPFPudmsKLdKj5KsewYTUkyNWZI",
  authDomain: "autoluxe-39e0b.firebaseapp.com",
  projectId: "autoluxe-39e0b",
  storageBucket: "autoluxe-39e0b.appspot.com",
  messagingSenderId: "960065879103",
  appId: "1:960065879103:web:47ef2380bcc91f4b7e4c8a",
  measurementId: "G-BSBNL6KH25"
};

// Merge configurations, preferring environment variables when available
const mergedConfig = {
  apiKey: firebaseConfig.apiKey || fallbackConfig.apiKey,
  authDomain: firebaseConfig.authDomain || fallbackConfig.authDomain,
  projectId: firebaseConfig.projectId || fallbackConfig.projectId,
  storageBucket: firebaseConfig.storageBucket || fallbackConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId || fallbackConfig.messagingSenderId,
  appId: firebaseConfig.appId || fallbackConfig.appId,
  measurementId: firebaseConfig.measurementId || fallbackConfig.measurementId
};

// For debugging purposes
console.log('Firebase config (merged):', {
  apiKey: mergedConfig.apiKey ? '***********' + mergedConfig.apiKey.slice(-4) : undefined,
  projectId: mergedConfig.projectId,
  isEnvVar: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  isFallback: !process.env.NEXT_PUBLIC_FIREBASE_API_KEY
});

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(mergedConfig) : getApps()[0];

// Initialize Firebase services
const db = getFirestore(app);

// Initialize auth and other services only in browser environment
let auth: ReturnType<typeof getAuth> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;
let analytics: any = null;

if (typeof window !== 'undefined') {
  try {
    // Initialize auth
    auth = getAuth(app);
    console.log('Auth initialized successfully');
    
    // Initialize storage
    storage = getStorage(app);
    
    // Initialize analytics
    analytics = getAnalytics(app);
  } catch (e) {
    console.error('Error initializing Firebase services:', e);
  }
}

export { app, db, auth, storage, analytics };

