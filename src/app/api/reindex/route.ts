import { NextResponse } from 'next/server'
import { reindexAllCars } from '@/lib/algolia'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  // During build time, return a mock response to prevent build errors
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview') {
    if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
      return NextResponse.json({ 
        message: 'Skipping reindex due to missing Algolia environment variables',
        info: 'This is expected during build time'
      })
    }
  }

  try {
    console.log('Starting reindexing process...')

    const result = await reindexAllCars()
    console.log('Reindexing completed:', result)
    
    return NextResponse.json({ 
      message: 'Reindexing completed successfully',
      result 
    })
  } catch (error: unknown) {
    console.error('Detailed error during reindexing:', error)
    return NextResponse.json({ 
      error: 'Reindexing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
