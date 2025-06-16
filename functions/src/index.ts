import * as functions from 'firebase-functions';
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import { DocumentData } from 'firebase-admin/firestore';

// Re-export the Algolia sync functions
export * from './algolia-sync';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// API Routes for Cars
app.get('/cars', async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const carsSnapshot = await db.collection('cars').get();
    const cars = carsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/cars/featured', async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const carsSnapshot = await db.collection('cars')
      .where('featured', '==', true)
      .limit(6)
      .get();
    
    const cars = carsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/cars/:id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const carDoc = await db.collection('cars').doc(req.params.id).get();
    if (!carDoc.exists) {
      return res.status(404).send('Car not found');
    }
    return res.status(200).json({
      id: carDoc.id,
      ...carDoc.data()
    });
  } catch (error) {
    console.error(`Error fetching car ${req.params.id}:`, error);
    return res.status(500).send('Internal Server Error');
  }
});

app.get('/cars/type/:type', async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const carsSnapshot = await db.collection('cars')
      .where('type', '==', req.params.type)
      .get();
    
    const cars = carsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(cars);
  } catch (error) {
    console.error(`Error fetching cars by type ${req.params.type}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/cars/fuel-type/:fuelType', async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const carsSnapshot = await db.collection('cars')
      .where('fuelType', '==', req.params.fuelType)
      .get();
    
    const cars = carsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(cars);
  } catch (error) {
    console.error(`Error fetching cars by fuel type ${req.params.fuelType}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/cars/tag/:tag', async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const carsSnapshot = await db.collection('cars')
      .where('tags', 'array-contains', req.params.tag)
      .get();
    
    const cars = carsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(cars);
  } catch (error) {
    console.error(`Error fetching cars by tag ${req.params.tag}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/cars/brand/:brand', async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const carsSnapshot = await db.collection('cars')
      .where('brand', '==', req.params.brand)
      .get();
    
    const cars = carsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(cars);
  } catch (error) {
    console.error(`Error fetching cars by brand ${req.params.brand}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

// API Routes for Brands
app.get('/brands', async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const brandsSnapshot = await db.collection('brands').get();
    const brands = brandsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/brands/featured', async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const brandsSnapshot = await db.collection('brands')
      .where('featured', '==', true)
      .get();
    
    const brands = brandsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(brands);
  } catch (error) {
    console.error('Error fetching featured brands:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API Routes for Categories
app.get('/categories/type/:type', async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const categoriesSnapshot = await db.collection('categories')
      .where('type', '==', req.params.type)
      .get();
    
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(categories);
  } catch (error) {
    console.error(`Error fetching categories by type ${req.params.type}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/categories/featured', async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const categoriesSnapshot = await db.collection('categories')
      .where('featured', '==', true)
      .get();
    
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/categories/slug/:slug', async (req: Request, res: Response): Promise<Response> => {
  try {
    const categoriesSnapshot = await db.collection('categories')
      .where('slug', '==', req.params.slug)
      .limit(1)
      .get();
    
    if (categoriesSnapshot.empty) {
      return res.status(404).send('Category not found');
    }
    
    const categoryDoc = categoriesSnapshot.docs[0];
    return res.status(200).json({
      id: categoryDoc.id,
      ...categoryDoc.data()
    });
  } catch (error) {
    console.error(`Error fetching category by slug ${req.params.slug}:`, error);
    return res.status(500).send('Internal Server Error');
  }
});

// Export the Express app as a Firebase Function API
export const api = functions.https.onRequest(app);
