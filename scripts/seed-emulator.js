// Seed script for Firebase emulators
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, connectFirestoreEmulator } from 'firebase/firestore';

// Initialize Firebase with your project config
const firebaseConfig = {
  apiKey: "AIzaSyAPcBozYWPUudmsKLdKjFXesvRTUkyNWZI",
  authDomain: "autoluxe-39e0b.firebaseapp.com",
  projectId: "autoluxe-39e0b",
  storageBucket: "autoluxe-39e0b.firebasestorage.app",
  messagingSenderId: "960065879103",
  appId: "1:960065879103:web:47ef2380bcc91f4b7e4c8a",
  measurementId: "G-BSBNL6KH25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Connect to local emulator
const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);
console.log("Connected to Firestore emulator");

// Sample data
const cars = [
  {
    id: "car1",
    name: "Mercedes-Benz S-Class",
    brand: "Mercedes-Benz",
    category: "Luxury",
    pricePerDay: 850,
    image: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741",
    featured: true,
    specifications: {
      seats: 5,
      doors: 4,
      transmission: "Automatic",
      fuel: "Petrol",
      year: 2023
    }
  },
  {
    id: "car2",
    name: "BMW 7 Series",
    brand: "BMW",
    category: "Luxury",
    pricePerDay: 800,
    image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b",
    featured: true,
    specifications: {
      seats: 5,
      doors: 4,
      transmission: "Automatic",
      fuel: "Petrol",
      year: 2023
    }
  },
  {
    id: "car3",
    name: "Lamborghini Huracan",
    brand: "Lamborghini",
    category: "Sports",
    pricePerDay: 1500,
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
    featured: true,
    specifications: {
      seats: 2,
      doors: 2,
      transmission: "Automatic",
      fuel: "Petrol",
      year: 2023
    }
  },
];

const brands = [
  { 
    id: "brand1", 
    name: "Mercedes-Benz", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/800px-Mercedes-Logo.svg.png",
    featured: true
  },
  { 
    id: "brand2", 
    name: "BMW", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/800px-BMW.svg.png",
    featured: true
  },
  { 
    id: "brand3", 
    name: "Lamborghini", 
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Lamborghini_Logo.svg/800px-Lamborghini_Logo.svg.png",
    featured: true
  },
];

const categories = [
  { id: "cat1", name: "Luxury", featured: true },
  { id: "cat2", name: "Sports", featured: true },
  { id: "cat3", name: "SUV", featured: true },
];

// Add data to Firestore
async function seedDatabase() {
  try {
    // Clear existing data
    const collections = ['cars', 'brands', 'categories'];
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      // Delete each document individually
      const deletePromises = [];
      snapshot.forEach((document) => {
        deletePromises.push(deleteDoc(document.ref));
      });
      
      await Promise.all(deletePromises);
      console.log(`Cleared ${collectionName} collection`);
    }
    
    // Add cars
    for (const car of cars) {
      await setDoc(doc(db, 'cars', car.id), car);
    }
    console.log(`Added ${cars.length} cars`);
    
    // Add brands
    for (const brand of brands) {
      await setDoc(doc(db, 'brands', brand.id), brand);
    }
    console.log(`Added ${brands.length} brands`);
    
    // Add categories
    for (const category of categories) {
      await setDoc(doc(db, 'categories', category.id), category);
    }
    console.log(`Added ${categories.length} categories`);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seedDatabase().then(() => {
  console.log('Seed script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Seed script failed:', error);
  process.exit(1);
});
