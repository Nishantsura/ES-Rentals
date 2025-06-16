import * as admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { Firestore, getFirestore as getFirestoreAdmin } from 'firebase-admin/firestore';

// Define variables to hold admin app and firestore instances
let adminApp: ReturnType<typeof initializeApp> | null = null;
let adminDb: Firestore;

try {
  // Check required environment variables
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  // Validate environment variables
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set in environment variables');
  }

  console.log('Initializing Firebase Admin SDK...');
  console.log('Project ID:', projectId);
  
  // Log whether we found the service account key
  if (!serviceAccountKey) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables');
    console.warn('Firebase Admin SDK will attempt to use default credentials');
    console.warn('This will likely fail in development environment');
  } else {
    console.log('FIREBASE_SERVICE_ACCOUNT_KEY found in environment variables');
  }

  // Initialize Firebase Admin if it's not already initialized
  const apps = getApps();
  adminApp = apps.length === 0 
    ? initializeApp({
        credential: serviceAccountKey 
          ? cert(JSON.parse(Buffer.from(serviceAccountKey, 'base64').toString('utf8')))
          // If no service account key is provided, use default application credentials
          // This works in Firebase hosting environment but not in local development
          : undefined,
        projectId: projectId,
        databaseURL: projectId ? `https://${projectId}.firebaseio.com` : undefined,
        storageBucket: storageBucket
      }) 
    : apps[0];

  // Initialize Firestore - ensure adminApp is not null before initializing
  if (adminApp) {
    adminDb = getFirestoreAdmin(adminApp);
    // Debug information
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    throw new Error('Firebase Admin app is null after initialization');
  }
  
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  // Create placeholders that will throw errors if used, to avoid undefined errors
  adminApp = null;
  adminDb = {
    collection: () => {
      throw new Error('Firebase Admin SDK failed to initialize. Check server logs.');
    }
  } as any;
}

// Export admin instances
export { adminApp, adminDb };
