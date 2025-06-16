'use client';

import { useState, useEffect } from 'react';
import { testFirebaseConnection } from '@/lib/firebase-test';
import { db } from '@/lib/firebase';

export default function FirebaseTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing connection...');
  const [configStatus, setConfigStatus] = useState<string>('Checking configuration...');
  
  useEffect(() => {
    // Check if Firebase config is properly loaded from environment variables
    const checkConfig = () => {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      
      if (apiKey && projectId) {
        setConfigStatus(`Configuration loaded successfully. Project ID: ${projectId}`);
      } else {
        setConfigStatus('Configuration error: Environment variables not loaded properly');
      }
    };
    
    // Test Firebase connection
    const testConnection = async () => {
      try {
        const result = await testFirebaseConnection();
        if (result) {
          setConnectionStatus('✅ Firebase connection successful!');
        } else {
          setConnectionStatus('❌ Firebase connection failed');
        }
      } catch (error) {
        setConnectionStatus(`❌ Error testing connection: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    checkConfig();
    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Firebase Connection Test</h1>
      
      <div className="mb-6 p-4 border rounded-md">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <p className="mb-2">{configStatus}</p>
      </div>
      
      <div className="mb-6 p-4 border rounded-md">
        <h2 className="text-xl font-semibold mb-2">Firestore Connection</h2>
        <p className="mb-2">{connectionStatus}</p>
      </div>
    </div>
  );
}
