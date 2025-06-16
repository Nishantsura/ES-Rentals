# AutoLuxe

A luxury car rental platform based in Dubai, UAE. This application allows users to browse, search, and rent premium luxury vehicles, with a streamlined booking process and customer support via WhatsApp.

## Project Overview

AutoLuxe is built using modern web technologies:

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage, Functions)
- **Search**: Algolia for advanced search capabilities
- **Deployment**: Firebase Hosting with GitHub Actions CI/CD

## Features

- Luxury car listings with detailed specifications and high-quality images
- Advanced search and filtering by car type, brand, price range, etc.
- User authentication and profile management
- Booking and reservation system
- Direct customer support via WhatsApp integration
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Firebase account
- Algolia account (for search functionality)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/autoluxe.git
cd autoluxe
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Firebase and Algolia credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_algolia_search_key
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

### GitHub Setup

1. Initialize Git in the project directory (if not already done):

```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub and link it:

```bash
git remote add origin https://github.com/YOUR_USERNAME/autoluxe.git
git push -u origin main
```

### GitHub Actions for Firebase Deployment

We've set up a GitHub Actions workflow (`.github/workflows/firebase-deploy.yml`) that automatically builds and deploys the application to Firebase Hosting whenever changes are pushed to the main branch.

To make this work:

1. Set up the following secrets in your GitHub repository (Settings > Secrets > Actions):
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `ALGOLIA_APP_ID`
   - `ALGOLIA_SEARCH_KEY`
   - `FIREBASE_SERVICE_ACCOUNT` (a JSON key for a service account with deployment permissions)

2. Commit and push changes to the main branch to trigger the deployment:

```bash
git push origin main
```

### Manual Firebase Deployment

If you prefer to deploy manually:

1. Build the production version of the app:

```bash
npm run build
npx next export
```

2. Deploy to Firebase:

```bash
firebase deploy
```

## Project Structure

- `/src/app` - Next.js app router pages and layouts
- `/src/components` - React components
- `/src/contexts` - Context providers (including CarHireContext)
- `/functions` - Firebase Cloud Functions
- `/public` - Static assets

## Recent Changes

- Added WhatsApp integration to the homepage hero section for direct customer inquiries
- Set up CI/CD pipeline with GitHub Actions for automated deployment

## Contributors

- Your Name - Lead Developer

## License

This project is proprietary. All rights reserved.

