import * as admin from 'firebase-admin';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountKey) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
}

// Replace literal \n with escaped \\n for proper JSON parsing
const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
const parsedKey = decodedKey.replace(/\\n/g, '\\\\n');

const serviceAccount = JSON.parse(parsedKey);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

export { adminDb, adminAuth, adminStorage };
