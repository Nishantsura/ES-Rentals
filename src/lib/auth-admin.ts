import { NextRequest, NextResponse } from 'next/server';
import { adminApp } from './firebase-admin';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';

/**
 * Verifies a Firebase ID token and ensures it belongs to an admin user
 */
export async function verifyAdminToken(
  request: NextRequest | Request
): Promise<{ isValid: boolean; token?: DecodedIdToken; error?: string }> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No bearer token provided');
      return { isValid: false, error: 'Missing authentication token' };
    }

    // Extract the token
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return { isValid: false, error: 'Invalid token format' };
    }

    // Verify token using Firebase Admin SDK
    if (!adminApp) {
      console.error('Firebase Admin SDK not initialized');
      return { isValid: false, error: 'Authentication service unavailable' };
    }

    console.log('Verifying Firebase ID token');
    const auth = getAuth(adminApp);
    const decodedToken = await auth.verifyIdToken(token);

    // Ensure token belongs to an admin user (email must end with @autoluxe.com)
    if (!decodedToken.email?.endsWith('@autoluxe.com')) {
      console.log(`Unauthorized email domain: ${decodedToken.email}`);
      return { isValid: false, error: 'Unauthorized access' };
    }

    // Token is valid and belongs to an admin user
    return { isValid: true, token: decodedToken };
  } catch (error: any) {
    console.error('Token verification error:', error);
    return { 
      isValid: false, 
      error: error.code === 'auth/id-token-expired' 
        ? 'Authentication token expired' 
        : 'Invalid authentication token'
    };
  }
}

/**
 * Middleware wrapper for API routes requiring admin authentication
 */
export function withAdminAuth(handler: Function) {
  return async (request: NextRequest | Request, ...args: any[]) => {
    const { isValid, error } = await verifyAdminToken(request);
    
    if (!isValid) {
      return NextResponse.json(
        { error, timestamp: new Date().toISOString() },
        { status: 401 }
      );
    }
    
    return handler(request, ...args);
  };
}
