#!/bin/bash

# Script to update Firebase API key in .env.local
# Usage: ./update-api-key.sh "your-new-api-key"

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <new-api-key>"
  echo "Example: $0 AIzaSyABCDEF-NEW-API-KEY-12345"
  exit 1
fi

NEW_API_KEY=$1
ENV_FILE=".env.local"

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE does not exist."
  exit 1
fi

# Update the API key in .env.local
if sed -i.bak "s/^NEXT_PUBLIC_FIREBASE_API_KEY=.*/NEXT_PUBLIC_FIREBASE_API_KEY=\"$NEW_API_KEY\"/" "$ENV_FILE"; then
  echo "✅ API key successfully updated in $ENV_FILE"
  echo "ℹ️ Backup created at $ENV_FILE.bak"
  
  # Restart Next.js server if it's running
  if pgrep -f "next dev" > /dev/null; then
    echo "ℹ️ Detected running Next.js server"
    echo "⚠️ You should restart your Next.js server to apply the changes"
    echo "   Run: pkill -f \"next dev\" && npm run dev"
  fi
else
  echo "❌ Failed to update API key"
  exit 1
fi
