import { useEffect, useState } from 'react';
import { app, db, auth, storage, analytics } from '../lib/firebase';

export default function DebugFirebase() {
  const [debugInfo, setDebugInfo] = useState<any>({
    initialized: false,
    error: null,
    envVars: {},
    configDetails: {}
  });

  useEffect(() => {
    try {
      // Check what environment variables are available
      const envVars = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'exists' : 'missing',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'exists' : 'missing',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'exists' : 'missing',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'exists' : 'missing',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'exists' : 'missing',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'exists' : 'missing',
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? 'exists' : 'missing'
      };

      // Check firebase instances
      const configDetails = {
        appInitialized: !!app,
        dbInitialized: !!db,
        authInitialized: !!auth,
        storageInitialized: !!storage,
        analyticsInitialized: !!analytics
      };
      
      setDebugInfo({
        initialized: true,
        envVars,
        configDetails,
        error: null
      });
    } catch (err) {
      console.error('Debug component error:', err);
      setDebugInfo((prev: any) => ({
        ...prev, 
        error: err instanceof Error ? err.message : String(err)
      }));
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Firebase Debug Page</h1>
      
      <h2>Environment Variables Status</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px' }}>
        {JSON.stringify(debugInfo.envVars, null, 2)}
      </pre>
      
      <h2>Firebase Services Status</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px' }}>
        {JSON.stringify(debugInfo.configDetails, null, 2)}
      </pre>
      
      {debugInfo.error && (
        <div style={{ color: 'red' }}>
          <h2>Error</h2>
          <pre>{debugInfo.error}</pre>
        </div>
      )}
    </div>
  );
}
