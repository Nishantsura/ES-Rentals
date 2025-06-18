'use client';

import { useState, useEffect } from 'react';

/**
 * API Key Diagnostic Component
 * This component inspects and validates the Firebase API key at runtime
 */
export function ApiKeyDiagnostics() {
  const [apiKeyInfo, setApiKeyInfo] = useState<Record<string, any>>({});
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Get API key from environment variable
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      
      // Create diagnostic info
      const diagnostics: Record<string, any> = {
        timestamp: new Date().toISOString(),
        apiKeyStatus: 'unknown',
      };
      
      // Check if API key exists
      if (!apiKey) {
        diagnostics.apiKeyStatus = 'missing';
        diagnostics.error = 'API key is not defined in environment variables';
      } else {
        // Check API key format and mask it for security
        diagnostics.apiKeyStatus = 'present';
        diagnostics.apiKeyLength = apiKey.length;
        diagnostics.apiKeyPrefix = apiKey.substring(0, 8).replace(/./g, '*');
        diagnostics.apiKeySuffix = apiKey.substring(apiKey.length - 4);
        diagnostics.hasSpecialCharacters = /[^a-zA-Z0-9_-]/.test(apiKey);
        diagnostics.hasWhitespace = /\s/.test(apiKey);
        
        // Validate expected format (typically AIza... for Firebase)
        diagnostics.startsWithAIza = apiKey.startsWith('AIza');
        
        // API key format validation
        if (apiKey.startsWith('AIza') && apiKey.length >= 39) {
          diagnostics.formatValid = true;
        } else {
          diagnostics.formatValid = false;
          diagnostics.formatIssue = 'API key does not match expected Firebase format';
        }
      }
      
      // Check if API key matches the one in firebase.ts
      try {
        // This will help identify if there's any discrepancy between env vars and loaded config
        if (typeof window !== 'undefined') {
          const localStorageKey = localStorage.getItem('firebase_api_key_used');
          if (localStorageKey) {
            diagnostics.usedKeyLastFourChars = localStorageKey.substring(localStorageKey.length - 4);
            diagnostics.keyMatchesUsed = apiKey && localStorageKey.substring(localStorageKey.length - 4) === apiKey.substring(apiKey.length - 4);
          }
        }
      } catch (e) {
        diagnostics.localStorageError = e instanceof Error ? e.message : 'Unknown error';
      }
      
      setApiKeyInfo(diagnostics);
    } catch (error) {
      setApiKeyInfo({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }, []);

  return (
    <div className="bg-gray-900 text-white rounded-lg p-3 mb-4">
      <h3 className="text-lg font-medium mb-2 flex justify-between items-center">
        <span>🔑 API Key Diagnostics</span>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded"
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
      </h3>
      
      {expanded ? (
        <div className="text-xs overflow-x-auto">
          <pre className="bg-gray-800 p-2 rounded">
            {JSON.stringify(apiKeyInfo, null, 2)}
          </pre>
          
          {apiKeyInfo.formatValid === false && (
            <div className="mt-2 p-2 bg-red-900 rounded">
              <p className="font-bold">❌ API Key Format Issue Detected</p>
              <p>{apiKeyInfo.formatIssue}</p>
              <p className="mt-2">
                Firebase API keys should start with 'AIza' and be approximately 39 characters long.
              </p>
            </div>
          )}
          
          {apiKeyInfo.hasSpecialCharacters && (
            <div className="mt-2 p-2 bg-yellow-900 rounded">
              <p className="font-bold">⚠️ Warning: API key contains special characters</p>
              <p>Firebase API keys should only contain alphanumeric characters, hyphens, and underscores.</p>
            </div>
          )}
          
          {apiKeyInfo.hasWhitespace && (
            <div className="mt-2 p-2 bg-red-900 rounded">
              <p className="font-bold">❌ Critical Issue: API key contains whitespace</p>
              <p>Whitespace in API keys will cause authentication failures.</p>
            </div>
          )}
          
          {apiKeyInfo.keyMatchesUsed === false && (
            <div className="mt-2 p-2 bg-yellow-900 rounded">
              <p className="font-bold">⚠️ Warning: Environment API key doesn't match the one being used</p>
              <p>This could indicate the API key is being overridden somewhere in the code.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm">
          <p>Status: {apiKeyInfo.apiKeyStatus === 'present' ? 
            <span className="text-green-400">✓ Present</span> : 
            <span className="text-red-400">✗ Missing</span>}
          </p>
          {apiKeyInfo.formatValid === false && (
            <p className="text-red-400 mt-1">⚠️ Format issues detected - click 'Show Details'</p>
          )}
          {apiKeyInfo.hasWhitespace && (
            <p className="text-red-400 mt-1">❌ Contains whitespace - authentication will fail</p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Add this component to your firebase-auth-retry.ts file to track which API key is being used:
 * 
 * // In firebase-auth-retry.ts, add this function
 * export function trackApiKeyUsage(apiKey: string) {
 *   if (typeof window !== 'undefined') {
 *     try {
 *       localStorage.setItem('firebase_api_key_used', apiKey);
 *     } catch (e) {
 *       // Ignore storage errors
 *     }
 *   }
 * }
 */
