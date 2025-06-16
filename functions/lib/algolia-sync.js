"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reindexAllCars = exports.onCarDeleted = exports.onCarUpdated = exports.onCarCreated = exports.setupAlgoliaIndex = void 0;
const functions = __importStar(require("firebase-functions"));
const algoliasearch_1 = __importDefault(require("algoliasearch"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const client = (0, algoliasearch_1.default)(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const index = client.initIndex('autoluxe-dxb');
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
        });
        console.log('Algolia index settings updated successfully');
    }
    catch (error) {
        console.error('Error configuring Algolia index:', error);
        throw error;
    }
};
// Run this once when the function is deployed
exports.setupAlgoliaIndex = functions.https.onRequest(async (req, res) => {
    try {
        await configureAlgoliaIndex();
        res.status(200).send('Algolia index configured successfully');
    }
    catch (error) {
        res.status(500).send('Error configuring Algolia index');
    }
});
// Sync car to Algolia on create/update
exports.onCarCreated = functions.firestore
    .document('cars/{carId}')
    .onCreate(async (snap, context) => {
    const car = snap.data();
    const objectID = snap.id;
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
    };
    // Add the car to Algolia
    return index.saveObject(algoliaObject);
});
exports.onCarUpdated = functions.firestore
    .document('cars/{carId}')
    .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const objectID = change.after.id;
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
    };
    // Update the car in Algolia
    return index.saveObject(algoliaObject);
});
// Delete car from Algolia when deleted from Firestore
exports.onCarDeleted = functions.firestore
    .document('cars/{carId}')
    .onDelete((snap, context) => {
    const objectID = snap.id;
    return index.deleteObject(objectID);
});
// Function to reindex all cars
exports.reindexAllCars = functions.https.onRequest(async (req, res) => {
    try {
        // First, configure the index
        await configureAlgoliaIndex();
        // Get all cars from Firestore
        const carsSnapshot = await admin.firestore().collection('cars').get();
        // Format cars for Algolia
        const algoliaObjects = carsSnapshot.docs.map(doc => {
            const car = doc.data();
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
            };
        });
        // Save all objects to Algolia
        await index.saveObjects(algoliaObjects);
        res.status(200).send(`Successfully reindexed ${algoliaObjects.length} cars`);
    }
    catch (error) {
        console.error('Error reindexing cars:', error);
        res.status(500).send('Error reindexing cars');
    }
});
//# sourceMappingURL=algolia-sync.js.map