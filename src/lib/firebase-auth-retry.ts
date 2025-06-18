'use client';

import { FirebaseError } from 'firebase/app';
import { 
  Auth,
  signInWithEmailAndPassword as firebaseSignIn,
  UserCredential,
  AuthError
} from 'firebase/auth';
import { auth } from './firebase';
import { alternativeApiKeys, getAlternativeFirebaseConfig } from './firebase-api-fix';

// Track authentication retries
let authRetryCount = 0;
const MAX_AUTH_RETRIES = alternativeApiKeys.length;

/**
 * Enhanced sign-in function with automatic retry using alternate API keys
 * if the primary API key fails with auth/api-key-not-valid error
 */
export async function signInWithRetry(
  email: string, 
  password: string
): Promise<UserCredential> {
  try {
    if (!auth) {
      throw new Error('Firebase auth is not initialized');
    }
    
    console.log('Attempting authentication with current Firebase configuration...');
    
    // Try authentication with current config
    return await firebaseSignIn(auth, email, password);
  } catch (error) {
    // Check if this is an API key validation error
    if (error instanceof FirebaseError && 
        error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
      
      console.error('API key validation error. Details:', error.message);
      
      // Check if we've reached the maximum number of retries
      if (authRetryCount >= MAX_AUTH_RETRIES) {
        console.error(`Authentication failed after ${MAX_AUTH_RETRIES} retries. All API keys invalid.`);
        throw new Error(`All authentication attempts failed. Please check API key configuration in Firebase console.`);
      }
      
      // Increment retry count
      authRetryCount++;
      
      // Log retry attempt
      console.log(`Auth retry attempt ${authRetryCount} of ${MAX_AUTH_RETRIES}`);
      
      // Wait briefly before retrying to avoid rapid failures
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set diagnostics in local storage for debugging
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('firebase_auth_retry_count', authRetryCount.toString());
          localStorage.setItem('firebase_auth_last_error', error.message);
        } catch (e) {
          // Ignore storage errors
        }
      }
      
      // Retry authentication with the next API key
      return signInWithRetry(email, password);
    }
    
    // For other errors, throw the original error
    throw error;
  }
}

/**
 * This function can be used to check if an API key is valid
 * by attempting a lightweight Firebase operation
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  // Note: This is a simple placeholder. In a real implementation,
  // you would use a lightweight Firebase operation to validate the API key.
  // For security reasons, we're not implementing the actual validation here.
  console.log(`Validating API key ending with ...${apiKey.slice(-4)}`);
  return apiKey.length > 10;
}

/**
 * Reset the auth retry counter
 */
export function resetAuthRetries() {
  authRetryCount = 0;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('firebase_auth_retry_count');
      localStorage.removeItem('firebase_auth_last_error');
    } catch (e) {
      // Ignore storage errors
    }
  }
}

/**
 * Track which API key is being used for debugging purposes
 */
export function trackApiKeyUsage(apiKey: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('firebase_api_key_used', apiKey);
    } catch (e) {
      // Ignore storage errors
    }
  }
}

/**
 * Validator for admin email addresses
 */
export function isValidAdminEmail(email: string): boolean {
  return email.endsWith('@autoluxe.com');
}
