import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Query, CollectionReference } from 'firebase-admin/firestore';

interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  category: string;
  type: string;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  featured: boolean;
  tags: string[];
  image: string;
  images?: string[];
  description?: string;
  specs?: Record<string, string>;
}

/**
 * Handler for GET requests to /api/cars
 */
export async function GET(request: Request) {
  try {
    console.log('API Route: Handling GET request for cars');
    
    // Using server-side Firebase Admin SDK with service account credentials
    console.log('Using Firebase Admin SDK for Firestore access');
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const fuelType = searchParams.get('fuelType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    console.log('API Route: Query params:', { featured, brand, category, type, tag, fuelType, minPrice, maxPrice });

    // Build the query with the Admin SDK
    console.log('API Route: Accessing Firestore collection: cars');
    
    // Reference to cars collection
    const carsRef = adminDb.collection('cars');
    let carsQuery: Query = carsRef;
    
    // Apply filters if provided - Admin SDK uses different query syntax
    if (featured === 'true') {
      console.log('API Route: Filtering by featured:true');
      carsQuery = carsQuery.where('featured', '==', true);
    }
    
    if (brand && brand !== 'all') {
      console.log(`API Route: Filtering by brand:${brand}`);
      carsQuery = carsQuery.where('brand', '==', brand);
    }
    
    if (category && category !== 'all') {
      console.log(`API Route: Filtering by category:${category}`);
      carsQuery = carsQuery.where('category', '==', category);
    }
    
    if (minPrice) {
      console.log(`API Route: Filtering by price >= ${minPrice}`);
      carsQuery = carsQuery.where('price', '>=', Number(minPrice));
    }
    
    if (maxPrice) {
      console.log(`API Route: Filtering by price <= ${maxPrice}`);
      carsQuery = carsQuery.where('price', '<=', Number(maxPrice));
    }
    
    if (type) {
      console.log(`API Route: Filtering by type:${type}`);
      carsQuery = carsQuery.where('type', '==', type);
    }
    
    if (tag) {
      console.log(`API Route: Filtering by tag:${tag}`);
      carsQuery = carsQuery.where('tags', 'array-contains', tag);
    }
    
    if (fuelType) {
      console.log(`API Route: Filtering by fuel_type:${fuelType}`);
      carsQuery = carsQuery.where('fuel_type', '==', fuelType);
    }
    
    console.log('API Route: Executing Firestore query with Admin SDK');
    const snapshot = await carsQuery.get();
    console.log(`API Route: Found ${snapshot.docs.length} cars`);
    
    const carsList: Car[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Car, 'id'>
    }));
    
    console.log('API Route: Successfully fetched cars data');
    return NextResponse.json(carsList);
    
  } catch (error) {
    console.error("Error fetching cars from Firestore:", error);
    
    // Convert to Error object if not already
    const errorObject = error instanceof Error ? error : new Error(String(error));
    
    // Log detailed error information
    console.error('Error name:', errorObject.name);
    console.error('Error message:', errorObject.message);
    console.error('Error stack:', errorObject.stack);
    
    // Check for Firebase error code
    const firebaseError = error as { code?: string };
    if (firebaseError.code) {
      console.error('Firebase error code:', firebaseError.code);
    }
    
    return new NextResponse(
      JSON.stringify({ 
        message: 'Failed to fetch cars', 
        error: errorObject.message,
        timestamp: new Date().toISOString(),
        code: firebaseError.code || 'unknown_error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// This setting ensures the API route is not cached and is always dynamic
export const revalidate = 0;
