#!/bin/bash

# Script to start development environment with Firebase emulators

# Store original rules
cp firestore.rules firestore.rules.original

# Use development rules for emulator
cp firestore.rules.dev firestore.rules

echo "Switched to development Firebase rules for emulator"

# Start Firebase emulators
export JAVA_HOME=~/java_home/jdk-17.0.8+7/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

echo "Starting Firebase emulators..."
npx firebase emulators:start &
FIREBASE_PID=$!

# Wait for emulators to start
sleep 5

# Seed the database
echo "Seeding the database..."
node scripts/seed-emulator.js

# Start Next.js dev server
echo "Starting Next.js development server..."
export FIRESTORE_EMULATOR_HOST="127.0.0.1:8080" 
export FIREBASE_STORAGE_EMULATOR_HOST="127.0.0.1:9199"
npm run dev &
NEXTJS_PID=$!

# Cleanup function
cleanup() {
    echo "Shutting down servers..."
    kill $FIREBASE_PID $NEXTJS_PID
    
    # Restore original rules
    cp firestore.rules.original firestore.rules
    rm firestore.rules.original
    
    echo "Restored original Firebase rules"
    exit 0
}

# Trap signals
trap cleanup SIGINT SIGTERM

# Keep script running
echo "Development environment is running. Press Ctrl+C to stop."
wait
