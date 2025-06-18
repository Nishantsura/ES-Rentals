/**
 * Firebase configuration and initialization
 * Handles both server-side and client-side initialization
 */
import { initializeApp, getApps, deleteApp, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { alternativeApiKeys } from './firebase-api-fix';
import { trackApiKeyUsage } from './firebase-auth-retry';

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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId
};

// Validate critical configuration values
if (!mergedConfig.apiKey) {
  console.error('Firebase API Key is missing! Authentication will fail.');
}

if (!mergedConfig.projectId) {
  console.error('Firebase Project ID is missing! Firestore operations will fail.');
}

// For debugging purposes
console.log('Environment variables loading check:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '(exists)' : '(undefined)',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '(exists)' : '(undefined)',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '(exists)' : '(undefined)',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '(exists)' : '(undefined)',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '(exists)' : '(undefined)',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '(exists)' : '(undefined)',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? '(exists)' : '(undefined)'
});

console.log('Firebase config (merged):', {
  apiKey: mergedConfig.apiKey ? '***********' + mergedConfig.apiKey.slice(-4) : undefined,
  projectId: mergedConfig.projectId,
  storageBucket: mergedConfig.storageBucket,
  isEnvVar: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  isFallback: !process.env.NEXT_PUBLIC_FIREBASE_API_KEY
});

// Enable more detailed debugging
const DEBUG = true;

// Track API key attempts
let currentApiKeyIndex = -1;
let apiKeyValidated = false;

// Initialize Firebase app and services
let app: FirebaseApp | null | undefined;
let db;
let auth: ReturnType<typeof getAuth> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;
let analytics: any = null;

// Function to try initializing Firebase with alternate API keys
const tryInitializeFirebase = (): FirebaseApp | null => {
  // Try the next API key in our list
  currentApiKeyIndex++;
  
  // Check if we've exhausted all options
  if (currentApiKeyIndex >= alternativeApiKeys.length || !alternativeApiKeys[currentApiKeyIndex]) {
    console.error('ERROR: All API keys have been tried and all failed.');
    // In development, show a more visible error
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.error('%c❌ FIREBASE API KEY ISSUE', 'background: #FFF0F0; color: #D00; font-size: 18px; font-weight: bold; padding: 4px 8px;');
      console.error('%cAll API keys have failed. Please check Firebase Console for valid API keys', 'color: #D00; font-size: 14px;');
    }
    return null;
  }
  
  // Get the current API key to try
  const currentApiKey = alternativeApiKeys[currentApiKeyIndex];
  
  if (!currentApiKey || currentApiKey.trim() === '') {
    console.error(`API key at index ${currentApiKeyIndex} is empty or invalid`);
    return tryInitializeFirebase(); // Recursively try the next key
  }
  
  // Track which API key we're using for diagnostics
  trackApiKeyUsage(currentApiKey);
  
  console.log(`Attempting to initialize Firebase with API key index: ${currentApiKeyIndex} (key ending with: ${currentApiKey ? '***' + currentApiKey.slice(-4) : 'undefined'})`);
  
  // Check for possible domain restriction issues
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  console.log(`Current hostname: ${currentHost} - Ensure this domain is allowed in Firebase Console`);
  
  // Create a new configuration with the current API key
  const currentConfig = {
    ...mergedConfig,
    apiKey: currentApiKey
  };
  
  // Clean up previous app instance if it exists
  if (app) {
    try {
      console.log('Cleaning up previous Firebase app instance');
      deleteApp(app).catch(err => console.error('Error deleting previous app:', err));
    } catch (err) {
      console.error('Error during app cleanup:', err);
    }
  }
  
  // Initialize new app with current API key
  return initializeApp(currentConfig);
};

try {
  // Try initializing Firebase with our retry mechanism
  app = getApps().length === 0 ? tryInitializeFirebase() : getApps()[0];
  
  if (!app) {
    console.error('Failed to initialize Firebase app with any API keys');
    throw new Error('Firebase initialization failed - all API keys invalid');
  }
  
  console.log('Firebase app initialized successfully');
  
  // Initialize Firestore
  try {
    db = getFirestore(app);
    if (DEBUG) console.log('Firestore initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
    throw error;
  }

  // Initialize client-side services only
  if (typeof window !== 'undefined') {
    try {
      // Initialize auth with enhanced error handling
      try {
        auth = getAuth(app);
        
        // Verify the auth instance is properly initialized
        if (!auth) throw new Error('Auth instance is null after initialization');
        if (!auth.app) throw new Error('Auth app reference is missing');
        
        if (DEBUG) {
          console.log('Auth initialized successfully with config:', {
            apiKey: auth.app.options.apiKey ? '***' + auth.app.options.apiKey.slice(-4) : '(missing)',
            authDomain: auth.app.options.authDomain || '(missing)',
            tenantId: auth.tenantId || '(default)'
          });
        }
      } catch (authError) {
        console.error('Auth initialization failed. Details:', authError);
        // Don't set auth to null here - let it remain uninitialized
        // This will make auth operations fail with clear errors rather than null reference errors
      }
      
      // Initialize storage with explicit error handling
      try {
        storage = getStorage(app);
        if (DEBUG) console.log('Storage initialized successfully');
      } catch (storageError) {
        console.error('Storage initialization failed:', storageError);
      }
      
      // Initialize analytics if available (non-critical)
      try {
        if ('measurementId' in mergedConfig && mergedConfig.measurementId) {
          const { getAnalytics } = require('firebase/analytics');
          analytics = getAnalytics(app);
          if (DEBUG) console.log('Analytics initialized successfully');
        }
      } catch (analyticsError) {
        if (DEBUG) console.log('Analytics initialization skipped:', analyticsError);
      }
    } catch (e) {
      console.error('Error initializing Firebase services:', e);
      if (e instanceof Error) {
        console.error('Error details:', {
          message: e.message,
          name: e.name,
          stack: e.stack
        });
      }
    }
  }
} catch (initError) {
  console.error('Failed to initialize Firebase app:', initError);
  if (initError instanceof Error) {
    console.error('Error details:', {
      message: initError.message,
      name: initError.name,
      stack: initError.stack
    });
  }
}

export { app, db, auth, storage, analytics };

