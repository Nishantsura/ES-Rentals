'use client'

import { useState, useEffect } from 'react'
import { FirebaseConnectionTest } from '@/components/debug/FirebaseConnectionTest'
import { db, auth } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function DebugPage() {
  const [envInfo, setEnvInfo] = useState<Record<string, string | undefined>>({})

  useEffect(() => {
    // Get environment variables (only public ones will be accessible)
    setEnvInfo({
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      API_BASE_URL: typeof window !== 'undefined' ? window.location.origin : '',
      FIREBASE_INITIALIZED: !!db ? 'Yes' : 'No',
      AUTH_INITIALIZED: !!auth ? 'Yes' : 'No'
    })
  }, [])

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Debug Panel</h1>
      
      <div className="grid gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
          <div className="bg-slate-50 p-4 rounded-lg overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left font-medium text-slate-500 p-2">Variable</th>
                  <th className="text-left font-medium text-slate-500 p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(envInfo).map(([key, value]) => (
                  <tr key={key} className="border-t border-slate-200">
                    <td className="p-2 font-mono text-sm">{key}</td>
                    <td className="p-2 font-mono text-sm">
                      {key.includes('KEY') || key.includes('SECRET') || key.includes('TOKEN')
                        ? (value ? '✓ Set' : '❌ Not Set') 
                        : (value || '❌ Not Set')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Firebase Connection Test</h2>
          <FirebaseConnectionTest />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <div className="prose">
            <ul>
              <li>
                <strong>Check .env.local file</strong> - Ensure it contains all the necessary Firebase configuration.
              </li>
              <li>
                <strong>Verify Firebase project settings</strong> - Make sure Firestore is enabled and rules are properly set.
              </li>
              <li>
                <strong>Check browser console</strong> - Look for any errors related to Firebase initialization.
              </li>
              <li>
                <strong>Review Firebase security rules</strong> - Ensure they allow the operations you're performing.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
