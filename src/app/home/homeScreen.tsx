'use client'

import { Suspense, useEffect, useState, Component, ReactNode } from "react"
import { Car } from "@/types/car"
import { Brand } from "@/types/brand"
import { Category } from "@/types/category"
import { carService } from "@/services/carService"
import { brandService } from "@/services/brandService"
import { categoryService } from "@/services/categoryService"
// Header is now imported globally in RootLayout
import { SearchBar } from "./components/SearchBar"
import HeroSection from "./components/HeroSection"

import { FeaturedBrands } from "./components/FeaturedBrands"
import { Categories } from "./components/Categories"
import { FeaturedVehicles } from "./components/FeaturedVehicles"
import { CardSkeleton, CategoryCardSkeleton } from '@/components/ui/card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { StaggerTestimonials } from "@/components/ui/testimonials";
import { FeaturesBenefits } from "@/components/ui/features-benefits";
import { FaWhatsapp } from "react-icons/fa";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4">
          <p className="heading-4 text-red-500">Something went wrong:</p>
          <pre className="body-2">{this.state.error?.message}</pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function LoadingSpinner() {
  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
      <CategoryCardSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Custom cache implementation
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  // Only use cache in browser
  if (typeof window === 'undefined') {
    return fetcher();
  }

  const cached = cache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: now });
  return data;
}

function FeaturedContent() {
  const [data, setData] = useState<{
    cars: Car[];
    brands: Brand[];
    categories: Category[];
  }>({
    cars: [],
    brands: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cars, brands, categories] = await Promise.all([
          fetchWithCache('featuredCars', carService.getFeaturedCars),
          fetchWithCache('featuredBrands', brandService.getFeaturedBrands),
          fetchWithCache('featuredCategories', categoryService.getFeaturedCategories),
        ]);
        setData({ cars, brands, categories });
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="heading-4 text-red-500">Something went wrong:</p>
        <pre className="body-2">{error.message}</pre>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <FeaturedBrands brands={data.brands} />
      <FeaturedVehicles cars={data.cars} />
      <Categories categories={data.categories} />
      <FeaturesBenefits />
      <div className="relative w-full overflow-visible my-16">
        <div className="relative z-10 mb-14">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-center text-white mb-2 px-4 tracking-tight">Hear From Our <span className="text-primary dark:text-primary">Happy Customers</span></h2>
          <p className="text-center text-white/70 max-w-md mx-auto">Read what our premium customers say about their luxury car rental experiences</p>
        </div>
        <StaggerTestimonials />
      </div>
    </>
  );
}

function WhatsAppFAB() {
  const whatsappNumber = "+919121883163"; // Replace with your actual WhatsApp number
  const message = "Hi, I'm interested in renting a car"; // Default message
  
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-12 right-12 sm:right-12 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 ease-in-out z-50"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6" />
    </button>
  );
}

export default function HomeScreen() {
  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-visible">
      <HeroSection />
      <div className="relative z-0 md:mt-4 w-full">
        <SearchBar />
        <main className="flex-1 max-w-7xl mx-auto w-full p-4">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedContent />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <WhatsAppFAB />
    </div>
  );
}
