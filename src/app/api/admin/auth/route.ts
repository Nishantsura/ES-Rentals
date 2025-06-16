import { NextRequest, NextResponse } from 'next/server';
import { adminApp } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

/**
 * Admin authentication API endpoint
 * Verifies Firebase ID tokens and ensures they belong to admin users
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body to get the ID token
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'No ID token provided' },
        { status: 400 }
      );
    }

    // Check if Firebase Admin SDK is initialized
    if (!adminApp) {
      console.error('Firebase Admin SDK not properly initialized');
      return NextResponse.json(
        { error: 'Authentication service unavailable', details: 'Admin SDK initialization failed' },
        { status: 500 }
      );
    }

    try {
      // Verify the token with Firebase Admin SDK
      const auth = getAuth(adminApp);
      const decodedToken = await auth.verifyIdToken(idToken);
      
      // Ensure user has admin email domain
      if (!decodedToken.email?.endsWith('@autoluxe.com')) {
        console.warn(`Unauthorized access attempt from email: ${decodedToken.email}`);
        return NextResponse.json(
          { error: 'Unauthorized access', details: 'Email domain not authorized for admin access' },
          { status: 403 }
        );
      }

      // Return success with minimal user info
      return NextResponse.json({
        authenticated: true,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          isAdmin: true,
        }
      });
      
    } catch (firebaseError: any) {
      console.error('Firebase token verification error:', firebaseError);
      
      // Handle specific Firebase Auth errors
      const errorCode = firebaseError.code || 'unknown_error';
      const status = errorCode === 'auth/id-token-expired' ? 401 : 400;
      
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          code: errorCode,
          details: firebaseError.message
        },
        { status }
      );
    }
  } catch (error: any) {
    console.error('Admin authentication error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}
