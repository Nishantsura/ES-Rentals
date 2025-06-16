import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Query } from 'firebase-admin/firestore';

interface Category {
  id: string;
  name: string;
  featured?: boolean;
  description?: string;
  image?: string;
}

export async function GET(request: Request) {
  try {
    console.log('API Route: Handling GET request for categories');
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const type = searchParams.get('type');
    
    // Using server-side Firebase Admin SDK with service account credentials
    const categoriesRef = adminDb.collection('categories');
    let categoriesQuery: Query = categoriesRef;
    
    // Apply filters if provided
    if (featured === 'true') {
      console.log('API Route: Filtering categories by featured:true');
      categoriesQuery = categoriesQuery.where('featured', '==', true);
    }
    
    if (type) {
      console.log(`API Route: Filtering categories by type:${type}`);
      categoriesQuery = categoriesQuery.where('type', '==', type);
    }

    const categorySnapshot = await categoriesQuery.get();
    console.log(`API Route: Found ${categorySnapshot.docs.length} categories`);
    
    const categoriesList = categorySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Category, 'id'>
    }));
    
    return NextResponse.json(categoriesList);
  } catch (error) {
    console.error("Error fetching categories from Firestore:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch categories', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
