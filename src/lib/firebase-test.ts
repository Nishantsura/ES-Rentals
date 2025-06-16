import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

// This function tests the Firebase connection by attempting to fetch a collection
export async function testFirebaseConnection() {
  try {
    // Try to get a list of collections (this will succeed even if there are no collections)
    const snapshot = await getDocs(collection(db, 'test-collection'));
    console.log('Firebase connection successful!');
    console.log(`Retrieved ${snapshot.size} documents from test collection`);
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    return false;
  }
}
