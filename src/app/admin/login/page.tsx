'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, Auth, User } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Simplified login - skip token verification for now to isolate the issue
  const directAdminLogin = async (email: string, password: string) => {
    if (!email.endsWith('@autoluxe.com')) {
      setError('Only @autoluxe.com email addresses allowed');
      return false;
    }
    
    try {
      console.log('Signing in directly with Firebase client SDK...');
      if (!auth) {
        throw new Error('Firebase auth is not initialized');
      }
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful, redirecting to admin panel...');
      router.push('/admin');
      return true;
    } catch (error: any) {
      console.error('Direct login error:', error);
      setError(error.message || 'Authentication failed');
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use the direct login approach to troubleshoot the Firebase initialization issue
      await directAdminLogin(email, password);
    } catch (error: any) {
      console.error('Login handler error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-medium mb-8 text-center text-gray-800">Admin Login</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            {error}
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
      </div>
    </div>
  );
}
