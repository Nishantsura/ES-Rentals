'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export function FirebaseConnectionTest() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dbData, setDbData] = useState<any[] | null>(null)
  const [collectionsInfo, setCollectionsInfo] = useState<Record<string, number>>({})

  const testConnection = async () => {
    setStatus('loading')
    setErrorMessage(null)
    setDbData(null)

    try {
      console.log('Testing Firebase connection...')
      
      // Check for common collections in the app
      const collections = ['cars', 'brands', 'categories']
      const collectionCounts: Record<string, number> = {}
      
      for (const collectionName of collections) {
        try {
          console.log(`Checking collection: ${collectionName}`)
          const collectionRef = collection(db, collectionName)
          const q = query(collectionRef, limit(5))
          const snapshot = await getDocs(q)
          collectionCounts[collectionName] = snapshot.size
          
          // For the first successful collection, save some data as sample
          if (snapshot.size > 0 && !dbData) {
            setDbData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
          }
        } catch (err) {
          console.error(`Error accessing collection ${collectionName}:`, err)
          collectionCounts[collectionName] = -1 // Error
        }
      }
      
      setCollectionsInfo(collectionCounts)
      setStatus('success')
    } catch (err: any) {
      console.error('Firebase connection test failed:', err)
      setErrorMessage(err?.message || 'Unknown error connecting to Firebase')
      setStatus('error')
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Firebase Connection Diagnostics</h2>
      
      <div className="flex items-center gap-2">
        <Button 
          onClick={testConnection} 
          disabled={status === 'loading'}
          variant="outline"
        >
          {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Test Firebase Connection
        </Button>
        
        {status === 'idle' && (
          <span className="text-muted-foreground">Click to test connection</span>
        )}
      </div>

      {status === 'success' && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Connection Successful!</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              <h3 className="font-medium">Collection Status:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(collectionsInfo).map(([collection, count]) => (
                  <li key={collection}>
                    {collection}: {count === -1 ? 'Error accessing' : `${count} documents found`}
                  </li>
                ))}
              </ul>
              
              {dbData && dbData.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium">Sample Document:</h3>
                  <pre className="bg-slate-50 p-2 rounded-md text-xs mt-1 max-h-60 overflow-auto">
                    {JSON.stringify(dbData[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            <p className="mt-1">{errorMessage}</p>
            <div className="mt-2">
              <h3 className="font-medium">Troubleshooting:</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                <li>Verify that your Firebase credentials in .env.local are correct</li>
                <li>Check if the Firebase project ID is correct</li>
                <li>Ensure Firestore is enabled in your Firebase project</li>
                <li>Verify that your Firestore rules allow read access</li>
                <li>Check your browser console for more detailed error messages</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
