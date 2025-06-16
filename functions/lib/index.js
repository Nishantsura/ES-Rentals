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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const express = __importStar(require("express"));
const corsLib = __importStar(require("cors"));
const admin = __importStar(require("firebase-admin"));
// Re-export the Algolia sync functions
__exportStar(require("./algolia-sync"), exports);
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Create Express app
const app = express();
// Middleware
const cors = corsLib();
app.use(cors);
app.use(express.json());
// API Routes for Cars
app.get('/cars', async (req, res) => {
    try {
        const carsSnapshot = await db.collection('cars').get();
        const cars = carsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(cars);
    }
    catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/cars/featured', async (req, res) => {
    try {
        const carsSnapshot = await db.collection('cars')
            .where('featured', '==', true)
            .limit(6)
            .get();
        const cars = carsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(cars);
    }
    catch (error) {
        console.error('Error fetching featured cars:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/cars/:id', async (req, res) => {
    try {
        const carDoc = await db.collection('cars').doc(req.params.id).get();
        if (!carDoc.exists) {
            return res.status(404).send('Car not found');
        }
        res.status(200).json(Object.assign({ id: carDoc.id }, carDoc.data()));
    }
    catch (error) {
        console.error(`Error fetching car ${req.params.id}:`, error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/cars/type/:type', async (req, res) => {
    try {
        const carsSnapshot = await db.collection('cars')
            .where('type', '==', req.params.type)
            .get();
        const cars = carsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(cars);
    }
    catch (error) {
        console.error(`Error fetching cars by type ${req.params.type}:`, error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/cars/fuel-type/:fuelType', async (req, res) => {
    try {
        const carsSnapshot = await db.collection('cars')
            .where('fuelType', '==', req.params.fuelType)
            .get();
        const cars = carsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(cars);
    }
    catch (error) {
        console.error(`Error fetching cars by fuel type ${req.params.fuelType}:`, error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/cars/tag/:tag', async (req, res) => {
    try {
        const carsSnapshot = await db.collection('cars')
            .where('tags', 'array-contains', req.params.tag)
            .get();
        const cars = carsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(cars);
    }
    catch (error) {
        console.error(`Error fetching cars by tag ${req.params.tag}:`, error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/cars/brand/:brand', async (req, res) => {
    try {
        const carsSnapshot = await db.collection('cars')
            .where('brand', '==', req.params.brand)
            .get();
        const cars = carsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(cars);
    }
    catch (error) {
        console.error(`Error fetching cars by brand ${req.params.brand}:`, error);
        res.status(500).send('Internal Server Error');
    }
});
// API Routes for Brands
app.get('/brands', async (req, res) => {
    try {
        const brandsSnapshot = await db.collection('brands').get();
        const brands = brandsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(brands);
    }
    catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/brands/featured', async (req, res) => {
    try {
        const brandsSnapshot = await db.collection('brands')
            .where('featured', '==', true)
            .get();
        const brands = brandsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(brands);
    }
    catch (error) {
        console.error('Error fetching featured brands:', error);
        res.status(500).send('Internal Server Error');
    }
});
// API Routes for Categories
app.get('/categories/type/:type', async (req, res) => {
    try {
        const categoriesSnapshot = await db.collection('categories')
            .where('type', '==', req.params.type)
            .get();
        const categories = categoriesSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(categories);
    }
    catch (error) {
        console.error(`Error fetching categories by type ${req.params.type}:`, error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/categories/featured', async (req, res) => {
    try {
        const categoriesSnapshot = await db.collection('categories')
            .where('featured', '==', true)
            .get();
        const categories = categoriesSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(categories);
    }
    catch (error) {
        console.error('Error fetching featured categories:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/categories/slug/:slug', async (req, res) => {
    try {
        const categoriesSnapshot = await db.collection('categories')
            .where('slug', '==', req.params.slug)
            .limit(1)
            .get();
        if (categoriesSnapshot.empty) {
            return res.status(404).send('Category not found');
        }
        const categoryDoc = categoriesSnapshot.docs[0];
        res.status(200).json(Object.assign({ id: categoryDoc.id }, categoryDoc.data()));
    }
    catch (error) {
        console.error(`Error fetching category by slug ${req.params.slug}:`, error);
        res.status(500).send('Internal Server Error');
    }
});
// Export the Express app as a Firebase Function API
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map