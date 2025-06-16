import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Next.js 15 route handler
export async function GET(
  request: Request,
  context: { params: { type: string } }
) {
  const { type } = context.params;
  
  try {
    // Validate type parameter
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
    console.error(`Error fetching categories of type ${type}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch categories', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
