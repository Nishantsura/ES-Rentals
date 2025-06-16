import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local')
console.log('Loading environment variables from:', envPath)
config({ path: envPath })

import { db } from './firebase-admin'
import algoliasearch from 'algoliasearch'
import { Car } from '../src/types/car'

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY
const ALGOLIA_INDEX_NAME = 'autoluxe-dxb'

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
  console.error('Missing Algolia credentials')
  process.exit(1)
}

// Initialize Algolia client
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)
const index = client.initIndex(ALGOLIA_INDEX_NAME)

// Configure Algolia index settings
async function configureIndex() {
  try {
    await index.setSettings({
      searchableAttributes: [
        'name',
        'brand',
        'model',
        'type',
        'fuelType',
        'description'
      ],
      attributesForFaceting: [
        'filterOnly(brand)',
        'filterOnly(type)',
        'filterOnly(fuelType)',
        'filterOnly(transmission)'
      ],
      attributesToRetrieve: [
        'name',
        'brand',
        'model',
        'type',
        'fuelType',
        'transmission',
        'seats',
        'year',
        'rating',
        'dailyPrice',
        'images',
        'location'
      ]
    })
    console.log('✅ Algolia index settings configured successfully')
  } catch (error) {
    console.error('❌ Error configuring Algolia index:', error)
    throw error
  }
}

// Format car data for Algolia
function formatCarForAlgolia(car: Car, objectID: string) {
  return {
    objectID,
    name: `${car.brand} ${car.name}`,
    brand: car.brand,
    model: car.name,
    type: car.type,
    fuelType: car.fuelType,
    transmission: car.transmission,
    seats: car.seats,
    year: car.year,
    rating: car.rating,
    dailyPrice: car.dailyPrice,
    images: car.images,
    location: car.location,
    description: car.description
  }
}

// Main sync function
async function syncCarsWithAlgolia() {
  try {
    console.log('🔄 Starting cars sync with Algolia...')
    
    // Configure index first
    await configureIndex()
    
    // Get all cars from Firestore
    console.log('📚 Fetching cars from Firestore...')
    const carsSnapshot = await db.collection('cars').get()
    
    if (carsSnapshot.empty) {
      console.log('ℹ️ No cars found in Firestore')
      return
    }
    
    // Format cars for Algolia
    const algoliaObjects = carsSnapshot.docs.map(doc => 
      formatCarForAlgolia(doc.data() as Car, doc.id)
    )
    
    // Save to Algolia
    console.log(`📤 Uploading ${algoliaObjects.length} cars to Algolia...`)
    await index.saveObjects(algoliaObjects)
    
    console.log('✨ Successfully synced all cars with Algolia!')
  } catch (error) {
    console.error('❌ Error syncing cars:', error)
    process.exit(1)
  }
}

// Run the sync
syncCarsWithAlgolia()
