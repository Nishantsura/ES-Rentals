import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Query } from 'firebase-admin/firestore';

interface Brand {
  id: string;
  name: string;
  logo: string;
  featured?: boolean;
  description?: string;
}

export async function GET(request: Request) {
  try {
    console.log('API Route: Handling GET request for brands');
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    
    // Using server-side Firebase Admin SDK with service account credentials
    const brandsRef = adminDb.collection('brands');
    let brandsQuery: Query = brandsRef;
    
    // Apply featured filter if provided
    if (featured === 'true') {
      console.log('API Route: Filtering brands by featured:true');
      brandsQuery = brandsQuery.where('featured', '==', true);
    }

    const brandSnapshot = await brandsQuery.get();
    console.log(`API Route: Found ${brandSnapshot.docs.length} brands`);
    
    const brandsList = brandSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Brand, 'id'>
    }));
    
    return NextResponse.json(brandsList);
  } catch (error) {
    console.error("Error fetching brands from Firestore:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch brands', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
