import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { app as firebaseApp } from './firebase';
import { FirebaseApp } from 'firebase/app';

export function connectToEmulators(): void {
  // Skip emulator connection if app is null or if USE_FIREBASE_EMULATOR is not set
  if (!firebaseApp || process.env.USE_FIREBASE_EMULATOR !== 'true') {
    console.log('Skipping emulator connection - using live Firebase');
    return;
  }

  // Get service instances
  const app = firebaseApp as FirebaseApp;
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);

  // Connect to Firebase emulators only if explicitly enabled
  try {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    console.log('Connected to Firebase emulators!');
  } catch (error) {
    console.error('Failed to connect to emulators:', error);
  }
}
