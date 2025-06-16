import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Using @ts-ignore comment to bypass the type checking issue temporarily
// @ts-ignore - Next.js App Router typings
export async function GET(request, { params }) {
  try {
    const id = params.id;
    console.log(`API Route: Fetching car details for ID: ${id}`);
    
    // Use the server-side Firebase Admin SDK with service account credentials
    const carRef = adminDb.collection('cars').doc(id);
    const carDoc = await carRef.get();
    
    if (!carDoc.exists) {
      console.log(`API Route: Car with ID ${id} not found`);
      return NextResponse.json(
        { message: 'Car not found' },
        { status: 404 }
      );
    }
    
    console.log(`API Route: Successfully fetched car details for ID: ${id}`);
    
    // Return the car data with its ID
    const carData = {
      id: carDoc.id,
      ...carDoc.data()
    };
    
    return NextResponse.json(carData);
    
  } catch (error) {
    console.error(`Error fetching car:`, error);
    
    // Convert to Error object if not already
    const errorObject = error instanceof Error ? error : new Error(String(error));
    
    // Check for Firebase error code
    const firebaseError = error as { code?: string };
    
    return NextResponse.json({ 
      message: 'Failed to fetch car details',
      error: errorObject.message,
      code: firebaseError.code || 'unknown_error'
    }, { status: 500 });
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
