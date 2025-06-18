'use client';

import { useEffect, useState } from 'react';
import { getApp, getApps } from 'firebase/app';
import { Button } from '@/components/ui/button';

/**
 * This component logs the Firebase configuration and environment variables
 * to help debug API key issues
 */
export function FirebaseConfigCheck() {
  const [configStatus, setConfigStatus] = useState<{
    checked: boolean;
    hasError: boolean;
    message: string;
    details: any;
  }>({
    checked: false,
    hasError: false,
    message: 'Not checked yet',
    details: {}
  });

  const checkConfiguration = () => {
    try {
      const details: any = {
        timestamp: new Date().toISOString(),
        environmentVariables: {},
        firebaseApps: [],
        computedConfig: {},
      };
      
      // Check environment variables directly
      details.environmentVariables = {
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set (masked)' : 'Not set',
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set',
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Not set',
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Not set',
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Not set',
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Set' : 'Not set',
      };

      // Check firebase apps
      const apps = getApps();
      details.appsCount = apps.length;
      
      if (apps.length > 0) {
        apps.forEach((app, index) => {
          try {
            details.firebaseApps.push({
              appName: app.name,
              options: {
                apiKey: app.options.apiKey ? `***${app.options.apiKey.slice(-6)}` : 'Missing',
                authDomain: app.options.authDomain || 'Missing',
                projectId: app.options.projectId || 'Missing',
                // Include other properties...
              }
            });
          } catch (error) {
            details.firebaseApps.push({
              appName: app.name,
              error: error instanceof Error ? error.message : String(error)
            });
          }
        });
      }
      
      // Look at the firebase.ts file's approach to configuration
      try {
        details.computedConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'Using fallback',
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Using fallback',
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Using fallback',
        };
      } catch (error) {
        details.computedConfigError = error instanceof Error ? error.message : String(error);
      }
      
      const hasApiKeyIssue = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
                             (apps.length > 0 && !apps[0].options.apiKey);
      
      setConfigStatus({
        checked: true,
        hasError: hasApiKeyIssue,
        message: hasApiKeyIssue 
          ? 'Potential API key issue detected'
          : 'Configuration looks valid',
        details
      });
      
    } catch (error) {
      setConfigStatus({
        checked: true,
        hasError: true,
        message: 'Error checking configuration',
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  };

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Firebase Config Check</h3>
        
        <Button 
          onClick={checkConfiguration} 
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Check Configuration
        </Button>
        
        {configStatus.checked && (
          <div className={`mt-2 p-2 text-xs rounded ${
            configStatus.hasError ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'
          }`}>
            <p className="font-medium">{configStatus.message}</p>
          </div>
        )}
        
        {configStatus.checked && (
          <details className="mt-1 text-xs">
            <summary className="cursor-pointer font-medium">Configuration Details</summary>
            <pre className="mt-2 p-2 bg-slate-100 rounded overflow-auto max-h-60">
              {JSON.stringify(configStatus.details, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
