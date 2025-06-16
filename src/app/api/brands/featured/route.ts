import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Brand } from '@/types/brand';

export async function GET() {
  try {
    console.log('API Route: Handling GET request for featured brands');
    
    // Using server-side Firebase Admin SDK with service account credentials
    const brandsRef = adminDb.collection('brands');
    const featuredBrandsQuery = brandsRef.where('featured', '==', true);
    const brandsSnapshot = await featuredBrandsQuery.get();
    
    console.log(`API Route: Found ${brandsSnapshot.docs.length} featured brands`);
    
    const brandsList = brandsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Brand, 'id'>
    }));
    
    return NextResponse.json(brandsList);
  } catch (error) {
    console.error('Error fetching featured brands from Firestore:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch featured brands', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
