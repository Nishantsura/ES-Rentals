import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Car } from '@/types/car';

export async function GET() {
  try {
    console.log('API Route: Handling GET request for featured cars');
    
    // Using server-side Firebase Admin SDK with service account credentials
    const carsRef = adminDb.collection('cars');
    const featuredCarsQuery = carsRef.where('featured', '==', true);
    const carsSnapshot = await featuredCarsQuery.get();
    
    const carsList = carsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Car, 'id'>
    }));
    
    return NextResponse.json(carsList);
  } catch (error) {
    console.error('Error fetching featured cars from Firestore:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch featured cars', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
