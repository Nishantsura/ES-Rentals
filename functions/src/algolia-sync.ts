import * as functions from 'firebase-functions'
import algoliasearch from 'algoliasearch'
import * as admin from 'firebase-admin'

admin.initializeApp()

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
)

const index = client.initIndex('autoluxe-dxb')

// Configure index settings
const configureAlgoliaIndex = async () => {
  try {
    await index.setSettings({
      // Attributes to search in
      searchableAttributes: [
        'name',
        'brand',
        'model',
        'type',
        'fuelType',
        'description'
      ],
      // Attributes for filtering
      attributesForFaceting: [
        'filterOnly(brand)',
        'filterOnly(type)',
        'filterOnly(fuelType)',
        'filterOnly(transmission)'
      ],
      // Display attributes in results
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
    console.log('Algolia index settings updated successfully')
  } catch (error) {
    console.error('Error configuring Algolia index:', error)
    throw error
  }
}

// Run this once when the function is deployed
export const setupAlgoliaIndex = functions.https.onRequest(async (req, res) => {
  try {
    await configureAlgoliaIndex()
    res.status(200).send('Algolia index configured successfully')
  } catch (error) {
    res.status(500).send('Error configuring Algolia index')
  }
})

interface CarData {
  brand: string
  model: string
  type: string
  fuelType: string
  transmission: string
  seats: number
  year: number
  rating: number
  dailyPrice: number
  images: string[]
  location: {
    name: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  description: string
}

// Sync car to Algolia on create/update
export const onCarCreated = functions.firestore
  .document('cars/{carId}')
  .onCreate(async (snap, context) => {
    const car = snap.data() as CarData
    const objectID = snap.id

    // Format the car data for Algolia
    const algoliaObject = {
      objectID,
      name: `${car.brand} ${car.model}`, // Combine brand and model for the name
      brand: car.brand,
      model: car.model,
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

    // Add the car to Algolia
    return index.saveObject(algoliaObject)
  })

export const onCarUpdated = functions.firestore
  .document('cars/{carId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data() as CarData
    const objectID = change.after.id

    // Format the car data for Algolia
    const algoliaObject = {
      objectID,
      name: `${newData.brand} ${newData.model}`, // Combine brand and model for the name
      brand: newData.brand,
      model: newData.model,
      type: newData.type,
      fuelType: newData.fuelType,
      transmission: newData.transmission,
      seats: newData.seats,
      year: newData.year,
      rating: newData.rating,
      dailyPrice: newData.dailyPrice,
      images: newData.images,
      location: newData.location,
      description: newData.description
    }

    // Update the car in Algolia
    return index.saveObject(algoliaObject)
  })

// Delete car from Algolia when deleted from Firestore
export const onCarDeleted = functions.firestore
  .document('cars/{carId}')
  .onDelete((snap, context) => {
    const objectID = snap.id
    return index.deleteObject(objectID)
  })

// Function to reindex all cars
export const reindexAllCars = functions.https.onRequest(async (req, res) => {
  try {
    // First, configure the index
    await configureAlgoliaIndex()

    // Get all cars from Firestore
    const carsSnapshot = await admin.firestore().collection('cars').get()
    
    // Format cars for Algolia
    const algoliaObjects = carsSnapshot.docs.map(doc => {
      const car = doc.data() as CarData
      return {
        objectID: doc.id,
        name: `${car.brand} ${car.model}`,
        brand: car.brand,
        model: car.model,
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
    })

    // Save all objects to Algolia
    await index.saveObjects(algoliaObjects)

    res.status(200).send(`Successfully reindexed ${algoliaObjects.length} cars`)
  } catch (error) {
    console.error('Error reindexing cars:', error)
    res.status(500).send('Error reindexing cars')
  }
})
