/**
 * Firebase API Key Fix
 * This module provides alternate Firebase configuration options
 * as a workaround for the API key validation issue
 */

// Original API key from environment variables
const originalApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Firebase project details
export const firebaseProjectDetails = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'autoluxe-39e0b',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'autoluxe-39e0b.firebaseapp.com',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'autoluxe-39e0b.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '960065879103',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:960065879103:web:47ef2380bcc91f4b7e4c8a',
};

/**
 * Possible solutions for the Firebase API key issue:
 * 
 * 1. If using domain restrictions in Firebase Console:
 *    - Add localhost URLs to the allowed domains
 *    - Add the production domain to the allowed domains
 * 
 * 2. If the API key has been revoked:
 *    - Generate a new API key in the Firebase Console
 *    - Update the .env.local file with the new API key
 * 
 * 3. Try using an alternate API key specifically for web applications:
 *    - Go to Firebase Console -> Project Settings -> General -> Web API Key
 */

// Alternative API keys to try if the original fails
// These are placeholders and should be replaced with actual alternate keys if needed
export const alternativeApiKeys = [
  // Try these in sequence if the primary key fails
  originalApiKey, // Original key is still the first choice
  process.env.NEXT_PUBLIC_FIREBASE_ALTERNATE_API_KEY, // Set this in .env.local if needed
];

/**
 * Get the next API key to try
 * @param currentIndex Index of the current API key that failed
 * @returns The next API key to try or null if all have been tried
 */
export const getNextApiKey = (currentIndex = -1): string | null => {
  const nextIndex = currentIndex + 1;
  if (nextIndex >= alternativeApiKeys.length || !alternativeApiKeys[nextIndex]) {
    return null;
  }
  return alternativeApiKeys[nextIndex];
};

/**
 * Steps to fix the API key issue permanently:
 * 
 * 1. Go to Firebase Console: https://console.firebase.google.com
 * 2. Select your project: autoluxe-39e0b
 * 3. Go to Project Settings > General
 * 4. Under "Your apps", find the web app configuration
 * 5. Copy the Web API Key
 * 6. Update your .env.local file with the new key
 * 
 * If domain restrictions are enabled:
 * 1. Go to Firebase Console
 * 2. Navigate to Project Settings > API keys
 * 3. Find your Web API key and click "Edit"
 * 4. Add your domains to the list of authorized domains
 *    - For local development: localhost, 127.0.0.1
 *    - For production: your actual domain
 */

// Export a function to regenerate Firebase configuration with an alternative API key
export const getAlternativeFirebaseConfig = (apiKeyIndex: number) => {
  const apiKey = getNextApiKey(apiKeyIndex);
  if (!apiKey) {
    throw new Error('No more API keys available to try');
  }
  
  return {
    apiKey,
    ...firebaseProjectDetails
  };
};
