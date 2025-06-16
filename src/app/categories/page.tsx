'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { CategoryCardSkeleton } from '@/components/ui/card-skeleton';
import { Category } from '@/types/category';
import { categoryService } from '@/services/categoryService';
import { carService } from '@/services/carService';
// Header is now imported globally in RootLayout
import { Button } from '@/components/ui/button';
import { SearchBar } from '../home/components/SearchBar';

interface CategoryFilterValues {
  types: string[];
  features: string[];
  fuelTypes: string[];
}

interface CategoryWithCarCount extends Category {
  realCarCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCarCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredCategories, setFilteredCategories] = useState<CategoryWithCarCount[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<CategoryFilterValues>({
    types: [],
    features: [],
    fuelTypes: [],
  });

  useEffect(() => {
    const loadCategoriesWithCarCount = async () => {
      try {
        // Fetch all categories
        const [carTypesList, fuelTypesList, tagsList] = await Promise.all([
          categoryService.getCategoriesByType('carType'),
          categoryService.getCategoriesByType('fuelType'),
          categoryService.getCategoriesByType('tag')
        ]);
        
        // Fetch car counts for each category
        const categoriesWithCount = await Promise.all([
          ...carTypesList.map(async (category) => {
            const cars = await carService.getCarsByType(category.slug);
            return { ...category, realCarCount: cars.length };
          }),
          ...fuelTypesList.map(async (category) => {
            const cars = await carService.getCarsByFuelType(category.slug);
            return { ...category, realCarCount: cars.length };
          }),
          ...tagsList.map(async (category) => {
            const cars = await carService.getCarsByTag(category.slug);
            return { ...category, realCarCount: cars.length };
          })
        ]);
        
        setCategories(categoriesWithCount);
        setFilteredCategories(categoriesWithCount);
      } catch (error) {
        console.error('Error loading categories with car count:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoriesWithCarCount();
  }, []);

  const handleFilterChange = (filterType: keyof CategoryFilterValues, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      const updatedFilters = {
        ...prev,
        [filterType]: newValues
      };
      
      // Apply filters
      const filtered = applyFilters(categories, updatedFilters);
      setFilteredCategories(filtered);
      
      return updatedFilters;
    });
  };

  const applyFilters = (allCategories: CategoryWithCarCount[], filters: CategoryFilterValues) => {
    // If no filters are selected, return all categories
    if (
      filters.types.length === 0 &&
      filters.features.length === 0 &&
      filters.fuelTypes.length === 0
    ) {
      return allCategories;
    }

    return allCategories.filter(category => {
      // Check if we have active filters for this category type
      const hasActiveTypeFilters = filters.types.length > 0;
      const hasActiveFuelTypeFilters = filters.fuelTypes.length > 0;
      const hasActiveFeatureFilters = filters.features.length > 0;
      
      // If we have active filters for a category type, only show categories of that type
      // that match the selected filters
      switch (category.type) {
        case 'carType':
          // If car type filters are active, only show car types that are selected
          if (hasActiveTypeFilters) {
            return filters.types.includes(category.slug);
          }
          // If other filters are active but not car type filters, hide car types
          return !hasActiveFuelTypeFilters && !hasActiveFeatureFilters;
          
        case 'fuelType':
          // If fuel type filters are active, only show fuel types that are selected
          if (hasActiveFuelTypeFilters) {
            return filters.fuelTypes.includes(category.slug);
          }
          // If other filters are active but not fuel type filters, hide fuel types
          return !hasActiveTypeFilters && !hasActiveFeatureFilters;
          
        case 'tag':
          // If feature filters are active, only show features that are selected
          if (hasActiveFeatureFilters) {
            return filters.features.includes(category.slug);
          }
          // If other filters are active but not feature filters, hide features
          return !hasActiveTypeFilters && !hasActiveFuelTypeFilters;
          
        default:
          return false;
      }
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      types: [],
      features: [],
      fuelTypes: [],
    });
    setFilteredCategories(categories);
  };

  const hasActiveFilters = selectedFilters.types.length > 0 || 
    selectedFilters.features.length > 0 || 
    selectedFilters.fuelTypes.length > 0;

  // Group categories by type for filter buttons
  const carTypes = categories.filter(cat => cat.type === 'carType');
  const fuelTypes = categories.filter(cat => cat.type === 'fuelType');
  const features = categories.filter(cat => cat.type === 'tag');

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen justify-center align-center max-w-7xl mx-auto">
        {/* Header now rendered globally in RootLayout */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto w-full">
      {/* Header now rendered globally in RootLayout */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="heading-4 font-semibold">All Categories</h1>
          <div className="text-sm text-muted-foreground">
            Showing {filteredCategories.length} of {categories.length} categories
          </div>
        </div>

        {/* Filter Sections */}
        <div className="mb-8 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Filter By:</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={hasActiveFilters ? "outline" : "default"}
                onClick={clearFilters}
                className={`
                  ${!hasActiveFilters
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-indigo-50'
                  }
                `}
              >
                All Categories
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Car Types</h2>
            <div className="flex flex-wrap gap-2">
              {carTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedFilters.types.includes(type.slug) ? "default" : "outline"}
                  onClick={() => handleFilterChange('types', type.slug)}
                  className={`
                    ${selectedFilters.types.includes(type.slug)
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-indigo-50'
                    }
                  `}
                >
                  {type.name} ({type.realCarCount})
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">Fuel Types</h2>
            <div className="flex flex-wrap gap-2">
              {fuelTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedFilters.fuelTypes.includes(type.slug) ? "default" : "outline"}
                  onClick={() => handleFilterChange('fuelTypes', type.slug)}
                  className={`
                    ${selectedFilters.fuelTypes.includes(type.slug)
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-indigo-50'
                    }
                  `}
                >
                  {type.name} ({type.realCarCount})
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">Features</h2>
            <div className="flex flex-wrap gap-2">
              {features.map((feature) => (
                <Button
                  key={feature.id}
                  variant={selectedFilters.features.includes(feature.slug) ? "default" : "outline"}
                  onClick={() => handleFilterChange('features', feature.slug)}
                  className={`
                    ${selectedFilters.features.includes(feature.slug)
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-indigo-50'
                    }
                  `}
                >
                  {feature.name} ({feature.realCarCount})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">Active Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-primary"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedFilters.types.map((type) => {
                const category = carTypes.find(c => c.slug === type);
                return (
                  <span
                    key={type}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    <span>{category?.name || type}</span>
                    <button 
                      onClick={() => handleFilterChange('types', type)}
                      className="ml-1 text-primary/70 hover:text-primary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </span>
                );
              })}
              {selectedFilters.fuelTypes.map((type) => {
                const category = fuelTypes.find(c => c.slug === type);
                return (
                  <span
                    key={type}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    <span>{category?.name || type}</span>
                    <button 
                      onClick={() => handleFilterChange('fuelTypes', type)}
                      className="ml-1 text-primary/70 hover:text-primary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </span>
                );
              })}
              {selectedFilters.features.map((feature) => {
                const category = features.find(c => c.slug === feature);
                return (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    <span>{category?.name || feature}</span>
                    <button 
                      onClick={() => handleFilterChange('features', feature)}
                      className="ml-1 text-primary/70 hover:text-primary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${encodeURIComponent(category.slug)}`}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full">
                <CardContent className="p-0">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={getCategoryImage(category.type, category.slug)}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                      <p className="text-white/80 mt-1">{category.realCarCount} cars</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {getCategoryTypeLabel(category.type)}
                      </div>
                      <Button className="rounded-full bg-indigo-500 hover:bg-indigo-700 text-white" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No categories match your filters</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filter criteria</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getCategoryTypeLabel(type: string): string {
  switch (type) {
    case 'carType':
      return 'Car Type';
    case 'fuelType':
      return 'Fuel Type';
    case 'tag':
      return 'Feature';
    default:
      return type;
  }
}

function getCategoryImage(type: string, slug: string): string {
  // Using placeholder images from Unsplash for each category type
  // In a real application, these would be stored in the database or a CDN
  
  // Base image URLs for each category type
  const typeImages: Record<string, string> = {
    'carType': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
    'fuelType': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1000',
    'tag': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000'
  };
  
  // Specific images for popular categories (based on slug)
  const specificImages: Record<string, string> = {
    // Car Types
    'suv': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000',
    'sedan': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000',
    'coupe': 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1000',
    'convertible': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000',
    'hatchback': 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?q=80&w=1000',
    
    // Fuel Types
    'petrol': 'https://images.unsplash.com/photo-1603768551289-7d6c4e3ca11c?q=80&w=1000',
    'diesel': 'https://images.unsplash.com/photo-1544461772-722f2a73a8a2?q=80&w=1000',
    'electric': 'https://images.unsplash.com/photo-1593941707882-a5bba53b0998?q=80&w=1000',
    'hybrid': 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=1000',
    
    // Features
    'luxury': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1000',
    'sports': 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000',
    'family': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000',
    'economy': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
  };
  
  // Return specific image if available, otherwise return type-based image
  return specificImages[slug.toLowerCase()] || typeImages[type] || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1000';
}
