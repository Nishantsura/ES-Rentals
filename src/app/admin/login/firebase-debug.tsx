'use client';

import { useState, useEffect } from 'react';
import { getApps } from 'firebase/app';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

/**
 * Firebase Diagnostics Component
 * This component helps diagnose Firebase initialization issues
 */
export function FirebaseDebugPanel() {
  const [diagnostics, setDiagnostics] = useState<any>({
    checking: true,
    status: 'Checking...',
    details: {}
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    try {
      const diagnosticInfo: any = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        firebaseInitialized: false,
        authInitialized: false,
        configStatus: {},
        envVars: {}
      };

      // Check Firebase app initialization
      const apps = getApps();
      diagnosticInfo.firebaseInitialized = apps.length > 0;
      diagnosticInfo.appsCount = apps.length;

      if (apps.length > 0) {
        try {
          const app = apps[0];
          diagnosticInfo.appName = app.name;
          diagnosticInfo.options = {
            apiKey: app.options.apiKey ? '***' + app.options.apiKey.slice(-4) : '(missing)',
            authDomain: app.options.authDomain || '(missing)',
            projectId: app.options.projectId || '(missing)',
            storageBucket: app.options.storageBucket || '(missing)',
            messagingSenderId: app.options.messagingSenderId || '(missing)',
          };
        } catch (error) {
          diagnosticInfo.appExtractError = error instanceof Error ? error.message : String(error);
        }
      }

      // Check auth initialization
      diagnosticInfo.authInitialized = !!auth;
      
      if (auth) {
        try {
          diagnosticInfo.authDetails = {
            hasApp: !!auth.app,
            tenantId: auth.tenantId || '(default)',
            config: auth.app ? {
              apiKey: auth.app.options.apiKey ? '***' + auth.app.options.apiKey.slice(-4) : '(missing)',
              authDomain: auth.app.options.authDomain || '(missing)',
            } : null
          };
        } catch (error) {
          diagnosticInfo.authExtractError = error instanceof Error ? error.message : String(error);
        }
      }

      // Check environment variables (frontend only)
      diagnosticInfo.envVars = {
        apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      setDiagnostics({
        checking: false,
        status: diagnosticInfo.firebaseInitialized ? 'Firebase initialized' : 'Firebase not initialized',
        details: diagnosticInfo
      });
    } catch (error) {
      setDiagnostics({
        checking: false,
        status: 'Error running diagnostics',
        error: error instanceof Error ? error.message : String(error),
        details: {}
      });
    }
  };

  return (
    <div className="p-4 mt-4 bg-slate-50 border rounded-lg">
      <h3 className="font-medium text-sm mb-2">Firebase Configuration Diagnostics</h3>
      
      <div className="mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          diagnostics.checking ? 'bg-blue-100 text-blue-800' : 
          diagnostics.status.includes('initialized') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {diagnostics.status}
        </span>
      </div>
      
      <div className="mt-2">
        <Button 
          onClick={runDiagnostics}
          variant="outline" 
          size="sm" 
          className="text-xs"
        >
          Run Diagnostics
        </Button>
        
        <div className="mt-4">
          <details className="text-xs">
            <summary className="cursor-pointer font-medium">View Diagnostic Details</summary>
            <pre className="mt-2 p-2 bg-slate-100 rounded overflow-auto max-h-80">
              {JSON.stringify(diagnostics.details, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
