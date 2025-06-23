import algoliasearch from 'algoliasearch'
import { adminDb } from './firebase-admin'

// Check for Algolia environment variables but don't throw during build time
const hasAlgoliaConfig = !!(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID && process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY)

// Log warning instead of throwing error to allow builds to complete
if (!hasAlgoliaConfig) {
  console.warn('Warning: Algolia environment variables are not set. Search functionality will be limited.')
}

// Create Algolia client instance with optimized settings
// Use default placeholder values if environment variables are missing
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? 'PLACEHOLDER_APP_ID',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? 'PLACEHOLDER_SEARCH_KEY'
)

// Initialize index with optimized settings
export const carsIndex = searchClient.initIndex('autoluxe-dxb')

// Configure index settings for better performance
export const configureAlgoliaIndex = async () => {
  console.log('Starting Algolia index configuration...')
  
  try {
    console.log('Setting index settings...')
    await carsIndex.setSettings({
      // Optimized searchable attributes order
      searchableAttributes: [
        'unordered(name)',
        'unordered(brand)',
        'unordered(model)',
        'unordered(type)',
        'unordered(fuelType)',
        'unordered(description)'
      ],
      // Optimized faceting
      attributesForFaceting: [
        'searchable(brand)',
        'searchable(type)',
        'searchable(fuelType)',
        'searchable(transmission)',
        'filterOnly(price)',
        'filterOnly(year)'
      ],
      // Distinct results to avoid duplicates
      distinct: true,
      // Optimize relevance
      ranking: [
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom'
      ]
    })
    console.log('Index settings updated successfully')
  } catch (error) {
    console.error('Error configuring Algolia index:', error)
    throw error
  }
}

// Function to reindex all cars from Firestore (use only in development)
export const reindexAllCars = async () => {
  console.log('Starting reindexing process...')
  
  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
    console.warn('Missing Algolia credentials - reindexing skipped')
    return 'Reindexing skipped due to missing Algolia credentials'
  }

  const adminClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? 'PLACEHOLDER_APP_ID',
    process.env.ALGOLIA_ADMIN_KEY ?? 'PLACEHOLDER_ADMIN_KEY'
  )
  const adminIndex = adminClient.initIndex('autoluxe-dxb')

  try {
    // First configure the index
    console.log('Configuring index...')
    await configureAlgoliaIndex()

    // Get all cars from Firestore using the Admin SDK
    console.log('Fetching cars from Firestore...')
    const carsCollection = adminDb.collection('cars');
    const carsSnapshot = await carsCollection.get();
    console.log(`Found ${carsSnapshot.docs.length} cars in Firestore`)
    
    if (carsSnapshot.empty) {
      console.log('No cars found in Firestore')
      return 'No cars found to index'
    }

    // Format cars for Algolia
    console.log('Formatting cars for Algolia...')
    const algoliaObjects = carsSnapshot.docs.map(doc => {
      const car = doc.data()
      return {
        objectID: doc.id,
        name: car.name,
        brand: car.brand,
        model: car.name,
        type: car.type || 'Unknown',
        fuelType: car.fuelType || 'Not specified',
        transmission: car.transmission || 'Not specified',
        seats: car.seats || 0,
        year: car.year || new Date().getFullYear(),
        rating: car.rating || 0,
        dailyPrice: car.dailyPrice || 0,
        images: Array.isArray(car.images) ? car.images : [],
        location: car.location || { name: 'Dubai', coordinates: { lat: 25.2048, lng: 55.2708 } },
        description: car.description || ''
      }
    })

    console.log(`Formatted ${algoliaObjects.length} objects for Algolia`)
    console.log('Sample object:', JSON.stringify(algoliaObjects[0], null, 2))

    // Save all objects to Algolia
    console.log('Uploading objects to Algolia...')
    const result = await adminIndex.saveObjects(algoliaObjects)
    console.log('Algolia upload result:', result)
    
    return `Successfully reindexed ${algoliaObjects.length} cars`
  } catch (error) {
    console.error('Detailed error during reindexing:', error)
    throw error
  }
}

interface AlgoliaCar {
  id: string;
  name: string;
  brand: string;
  model?: string;
  type: string;
  fuelType: string;
  transmission: string;
  seats: number;
  year: number;
  rating: number;
  dailyPrice: number;
  description: string;
  images: string[];
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  [key: string]: unknown;
}

// Function to index a car in Algolia (should only be used in secure environments)
export const indexCar = async (car: AlgoliaCar) => {
  if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
    console.warn('Missing Algolia credentials - indexing skipped');
    return { success: false, reason: 'Missing Algolia credentials' }
  }

  const adminClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? 'PLACEHOLDER_APP_ID',
    process.env.ALGOLIA_ADMIN_KEY ?? 'PLACEHOLDER_ADMIN_KEY'
  )
  const adminIndex = adminClient.initIndex('autoluxe-dxb')

  const algoliaObject = {
    objectID: car.id,
    name: car.name,
    brand: car.brand,
    model: car.model || car.name,
    type: car.type || 'Unknown',
    fuelType: car.fuelType || 'Not specified',
    transmission: car.transmission || 'Not specified',
    seats: car.seats || 0,
    year: car.year || new Date().getFullYear(),
    rating: car.rating || 0,
    dailyPrice: car.dailyPrice || 0,
    images: Array.isArray(car.images) ? car.images : [],
    location: car.location || { name: 'Dubai', coordinates: { lat: 25.2048, lng: 55.2708 } },
    description: car.description || ''
  }

  try {
    console.log('Indexing car:', JSON.stringify(algoliaObject, null, 2))
    await adminIndex.saveObject(algoliaObject)
  } catch (error) {
    console.error('Error indexing car:', error)
    throw error
  }
}

// Function to remove a car from Algolia index (should only be used in secure environments)
export const removeCar = async (carId: string) => {
  if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
    console.warn('Missing Algolia credentials - removal skipped');
    return { success: false, reason: 'Missing Algolia credentials' }
  }

  const adminClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? 'PLACEHOLDER_APP_ID',
    process.env.ALGOLIA_ADMIN_KEY ?? 'PLACEHOLDER_ADMIN_KEY'
  )
  const adminIndex = adminClient.initIndex('autoluxe-dxb')

  try {
    await adminIndex.deleteObject(carId)
  } catch (error) {
    console.error('Error removing car:', error)
    throw error
  }
}
