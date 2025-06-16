import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Category } from '@/types/category';

export async function GET() {
  try {
    console.log('API Route: Handling GET request for featured categories');
    
    // Using server-side Firebase Admin SDK with service account credentials
    const categoriesRef = adminDb.collection('categories');
    const featuredCategoriesQuery = categoriesRef.where('featured', '==', true);
    const categoriesSnapshot = await featuredCategoriesQuery.get();
    
    console.log(`API Route: Found ${categoriesSnapshot.docs.length} featured categories`);
    
    const categoriesList = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Category, 'id'>
    }));
    
    return NextResponse.json(categoriesList);
  } catch (error) {
    console.error('Error fetching featured categories from Firestore:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch featured categories', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
