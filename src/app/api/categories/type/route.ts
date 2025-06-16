import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Non-dynamic route handler to avoid Next.js 15.1.0 typing issues
export async function GET(request: Request) {
  try {
    // Get the type parameter from the query string instead of route param
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // Validate type parameter
    if (!type) {
      return NextResponse.json(
        { message: 'Missing required query parameter: type' },
        { status: 400 }
      );
    }
    
    const validTypes = ['carType', 'fuelType', 'tag'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { message: `Invalid category type: ${type}. Valid types are: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Using server-side Firebase Admin SDK with service account credentials
    const categoriesRef = adminDb.collection('categories');
    const categoriesQuery = categoriesRef.where('type', '==', type);
    const categorySnapshot = await categoriesQuery.get();
    
    const categoriesList = categorySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(categoriesList);
  } catch (error) {
    console.error('Error fetching categories from Firestore:', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
