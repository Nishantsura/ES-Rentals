const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const carsRef = db.collection('cars');

// Cache-Control middleware
const setCacheControl = (duration) => (req, res, next) => {
  res.set('Cache-Control', `public, max-age=${duration}`);
  next();
};

// Admin middleware
const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader); // Debug log

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No bearer token'); // Debug log
      return res.status(401).json({ error: 'No bearer token' });
    }

    const token = authHeader.split('Bearer ')[1];
    console.log('Verifying token...'); // Debug log
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Decoded token:', decodedToken); // Debug log
    
    if (!decodedToken.email?.endsWith('@autoluxe.com')) {
      console.log('Not an autoluxe email:', decodedToken.email); // Debug log
      return res.status(403).json({ error: 'Not an authorized email domain' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
};

// Get featured cars - MOVED UP
router.get('/featured', setCacheControl(600), async (req, res) => {
  try {
    const snapshot = await carsRef.where('featured', '==', true).get();
    const cars = [];
    snapshot.forEach(doc => {
      cars.push({ id: doc.id, ...doc.data() });
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured cars' });
  }
});

// Get cars by type - MOVED UP
router.get('/type/:type', setCacheControl(300), async (req, res) => {
  try {
    const { type } = req.params;
    const snapshot = await carsRef.where('type', '==', type).get();
    const cars = [];
    snapshot.forEach(doc => {
      cars.push({ id: doc.id, ...doc.data() });
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars by type' });
  }
});

// Get cars by fuel type - MOVED UP
router.get('/fuel-type/:fuelType', setCacheControl(300), async (req, res) => {
  try {
    const { fuelType } = req.params;
    const snapshot = await carsRef.where('fuelType', '==', fuelType).get();
    const cars = [];
    snapshot.forEach(doc => {
      cars.push({ id: doc.id, ...doc.data() });
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars by fuel type' });
  }
});

// Get cars by tag - MOVED UP
router.get('/tag/:tag', setCacheControl(300), async (req, res) => {
  try {
    const { tag } = req.params;
    const snapshot = await carsRef.where('tags', 'array-contains', tag).get();
    const cars = [];
    snapshot.forEach(doc => {
      cars.push({ id: doc.id, ...doc.data() });
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars by tag' });
  }
});

// Get cars by brand - MOVED UP
router.get('/brand/:brand', setCacheControl(300), async (req, res) => {
  try {
    const { brand } = req.params;
    const snapshot = await carsRef.where('brand', '==', brand).get();
    const cars = [];
    snapshot.forEach(doc => {
      cars.push({ id: doc.id, ...doc.data() });
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars by brand' });
  }
});

// Get all cars with optional filters
router.get('/', setCacheControl(300), async (req, res) => {
  try {
    let query = carsRef;
    const {
      brand,
      transmission,
      type,
      fuelType,
      available,
      minPrice,
      maxPrice
    } = req.query;

    if (brand) query = query.where('brand', '==', brand);
    if (transmission) query = query.where('transmission', '==', transmission);
    if (type) query = query.where('type', '==', type);
    if (fuelType) query = query.where('fuelType', '==', fuelType);
    if (available !== undefined) query = query.where('available', '==', available === 'true');
    
    const snapshot = await query.get();
    let cars = [];
    
    snapshot.forEach(doc => {
      const car = { id: doc.id, ...doc.data() };
      if (minPrice && car.dailyPrice < Number(minPrice)) return;
      if (maxPrice && car.dailyPrice > Number(maxPrice)) return;
      cars.push(car);
    });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// Get car by ID - MOVED DOWN
router.get('/:id', setCacheControl(300), async (req, res) => {
  try {
    const doc = await carsRef.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

// Create new car
router.post('/', setCacheControl(0), async (req, res) => {
  try {
    const {
      name,
      brand,
      transmission,
      seats,
      year,
      rating,
      advancePayment,
      rareCar,
      fuelType,
      engineCapacity,
      power,
      dailyPrice,
      type,
      tags,
      description,
      images,
      location
    } = req.body;

    // Validate required fields
    if (!name || !brand || !transmission || !fuelType || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const carData = {
      name,
      brand,
      transmission,
      seats,
      year,
      rating: rating || 0,
      advancePayment: advancePayment || false,
      rareCar: rareCar || false,
      fuelType,
      engineCapacity,
      power,
      dailyPrice,
      type,
      tags: tags || [],
      description,
      images: images || [],
      available: true,
      location
    };

    const docRef = await carsRef.add(carData);
    res.status(201).json({ id: docRef.id, ...carData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create car' });
  }
});

// Update car
router.put('/:id', setCacheControl(0), async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.id; // Remove id from updates if present

    await carsRef.doc(req.params.id).update(updates);
    res.json({ id: req.params.id, ...updates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update car' });
  }
});

// Delete car
router.delete('/:id', setCacheControl(0), async (req, res) => {
  try {
    await carsRef.doc(req.params.id).delete();
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

// Admin: Get analytics
router.get('/admin/analytics', requireAdmin, async (req, res) => {
  console.log('Fetching analytics...'); // Debug log
  try {
    // Check if collections exist first
    const collections = {
      cars: carsRef,
      brands: db.collection('brands'),
      categories: db.collection('categories')
    };

    const counts = {};
    
    // Get counts one by one to handle missing collections
    for (const [name, collection] of Object.entries(collections)) {
      try {
        const snapshot = await collection.count().get();
        counts[`total${name.charAt(0).toUpperCase() + name.slice(1)}`] = snapshot.data().count;
      } catch (error) {
        console.error(`Error counting ${name}:`, error);
        counts[`total${name.charAt(0).toUpperCase() + name.slice(1)}`] = 0;
      }
    }

    console.log('Analytics result:', counts); // Debug log
    res.json(counts);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: error.message
    });
  }
});

module.exports = router;
