'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Auth, User } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { FirebaseDebugPanel } from './firebase-debug';
import { FirebaseConfigCheck } from './firebase-config-check';
import { ApiKeyDiagnostics } from './api-key-diagnostics';
import { signInWithRetry, isValidAdminEmail, resetAuthRetries } from '@/lib/firebase-auth-retry';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Enhanced login with automatic API key retry mechanism
  const directAdminLogin = async (email: string, password: string) => {
    // Clear previous state
    setError('');
    setDebugInfo(null);
    
    // Reset any previous authentication retry attempts
    resetAuthRetries();
    
    // Validate admin email
    if (!isValidAdminEmail(email)) {
      setError('Only @autoluxe.com email addresses allowed');
      return false;
    }
    
    try {
      console.log('Checking Firebase initialization status...');
      
      // Collect diagnostic information
      const diagnosticInfo: any = {};
      
      if (!auth) {
        console.error('Firebase auth is not initialized');
        diagnosticInfo.authStatus = 'Not initialized';
        throw new Error('Firebase auth is not initialized - check browser console for details');
      }
      
      // Check if auth object looks valid
      diagnosticInfo.authStatus = 'Initialized';
      diagnosticInfo.hasApp = !!auth.app;
      
      if (auth.app) {
        // Safely extract config info for debugging
        try {
          diagnosticInfo.config = {
            apiKey: auth.app.options.apiKey ? '***' + auth.app.options.apiKey.slice(-4) : '(missing)',
            authDomain: auth.app.options.authDomain || '(missing)',
            projectId: auth.app.options.projectId || '(missing)',
          };
        } catch (e) {
          diagnosticInfo.configError = e instanceof Error ? e.message : 'Unknown error';
        }
      }
      
      console.log('Signing in with enhanced Firebase auth retry mechanism...', diagnosticInfo);
      setDebugInfo(diagnosticInfo);
      
      // Attempt authentication with our retry mechanism
      await signInWithRetry(email, password);
      
      console.log('Login successful, redirecting to admin panel...');
      router.push('/admin');
      return true;
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Enhance error reporting
      const errorDetails: any = {
        code: error.code || 'unknown',
        message: error.message || 'Authentication failed',
        name: error.name,
      };
      
      // Include retry information if available
      if (typeof window !== 'undefined') {
        try {
          errorDetails.retryCount = localStorage.getItem('firebase_auth_retry_count') || '0';
          errorDetails.lastError = localStorage.getItem('firebase_auth_last_error') || 'None';
        } catch (e) {}
      }
      
      setDebugInfo((prev: any) => ({ ...prev, error: errorDetails }));
      setError(errorDetails.message);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDebugInfo(null);
    setLoading(true);

    try {
      // Use the enhanced login approach with better diagnostics
      await directAdminLogin(email, password);
    } catch (error: any) {
      console.error('Login handler error:', error);
      setError(error.message || 'An unexpected error occurred');
      
      setDebugInfo((prev: any) => ({
        ...prev, 
        handlerError: {
          message: error.message,
          stack: error.stack,
          name: error.name
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-medium mb-8 text-center text-gray-800">Admin Login</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              {error}
            </div>
            
            {debugInfo && process.env.NODE_ENV !== 'production' && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer text-red-700 font-medium">Debug Information</summary>
                <pre className="mt-2 p-2 bg-red-100 rounded text-red-800 overflow-auto max-h-60">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@autoluxe.com"
              required
              disabled={loading}
              className="rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl h-11 font-medium transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </Button>
        </form>
        
        {process.env.NODE_ENV !== 'production' && (
          <>
            <h3 className="text-xl font-semibold mt-8 mb-2">Debug Tools</h3>
            <ApiKeyDiagnostics />
            <FirebaseConfigCheck />
            <FirebaseDebugPanel />
          </>
        )}
      </div>
    </div>
  );
}
