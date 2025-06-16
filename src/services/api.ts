import { Car } from '@/types/car';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';
import { auth } from '@/lib/firebase';

// Use the current origin for API calls in the browser, or an empty string for server-side rendering
const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';
// console.log('API_BASE_URL:', API_BASE_URL);
// console.log('NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

// Car API endpoints
export const carAPI = {
  getAllCars: async (): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch cars');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching cars:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getCarsByType: async (type: string): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/type/${encodeURIComponent(type)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch cars by type');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching cars by type:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getCarsByTag: async (tag: string): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/tag/${encodeURIComponent(tag)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch cars by tag');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching cars by tag:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getCarsByFuelType: async (fuelType: string): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/fuel-type/${encodeURIComponent(fuelType)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch cars by fuel type');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching cars by fuel type:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getCarsByBrand: async (brand: string): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/brand/${encodeURIComponent(brand)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch cars by brand');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching cars by brand:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getFeaturedCars: async (): Promise<Car[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/featured`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch featured cars');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching featured cars:', error);
      return []; // Return empty array instead of throwing
    }
  },

  getCarById: async (id: string): Promise<Car> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch car');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching car:', error);
      throw error; // Re-throw the error
    }
  },

  createCar: async (car: Partial<Car>): Promise<Car> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(car),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create car');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  },

  updateCar: async (id: string, car: Partial<Car>): Promise<Car> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(car),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to update car');
      }
      const updatedCar = await response.json();
      return updatedCar;
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  },

  deleteCar: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  },
};

// Category API endpoints
export const categoryAPI = {
  getCategoriesByType: async (type: 'carType' | 'fuelType' | 'tag'): Promise<Category[]> => {
    try {
      // Using the server-side Admin SDK API route we created
      const response = await fetch(`${API_BASE_URL}/api/categories/${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Failed to fetch categories of type ${type}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching categories by type:', error);
      return [];
    }
  },

  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/slug/${encodeURIComponent(slug)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const error = await response.text();
        throw new Error(error || 'Failed to fetch category by slug');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  },

  getFeaturedCategories: async (): Promise<Category[]> => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/categories/featured`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch featured categories');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      return [];
    }
  },

  createCategory: async (category: FormData): Promise<Category> => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Convert FormData to JSON object
      const categoryData: Record<string, any> = {};
      category.forEach((value, key) => {
        categoryData[key] = value;
      });

      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(errorText || 'Failed to create category');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id: string, category: FormData): Promise<Category> => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log('Updating category with ID:', id);
      console.log('FormData contents:');
      for (const [key, value] of category.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      const response = await fetch(`${API_BASE_URL}/api/categories/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: category,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Failed to update category');
        } catch (e) {
          throw new Error(errorText || 'Failed to update category');
        }
      }

      const result = await response.json();
      console.log('Update successful:', result);
      return result;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      if (!auth.currentUser) {
        throw new Error('Not authenticated');
      }
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(`${API_BASE_URL}/api/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

// Brand API endpoints
export const brandAPI = {
  getAllBrands: async (): Promise<Brand[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/brands`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || 'Failed to fetch brands';
        console.error('Server error:', errorMessage);
        return [];
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  },

  getBrandBySlug: async (slug: string): Promise<Brand | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/brands/slug/${encodeURIComponent(slug)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 404) return null;
        const errorMessage = errorData?.error || 'Failed to fetch brand';
        console.error('Server error:', errorMessage);
        return null;
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching brand:', error);
      return null;
    }
  },

  getFeaturedBrands: async (): Promise<Brand[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/brands/featured`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'cache-control': 'no-cache'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || 'Failed to fetch featured brands';
        console.error('Server error:', errorMessage);
        return [];
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching featured brands:', error);
      return [];
    }
  },

  createBrand: async (brand: Partial<Brand>): Promise<Brand> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/brands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(brand)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to create brand');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  },

  updateBrand: async (id: string, brand: Partial<Brand>): Promise<Brand> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/brands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(brand)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to update brand');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  },

  deleteBrand: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/brands/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to delete brand');
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error;
    }
  }
};

// Search API endpoint
export const searchAPI = {
  search: async (query: string): Promise<Car[]> => {
    try {
      const { searchClient } = await import('@/lib/algolia');
      const index = searchClient.initIndex('autoluxe-dxb');
      const { hits } = await index.search<Car>(query, {
        restrictSearchableAttributes: ['brand', 'name', 'model'],
        hitsPerPage: 8,
        distinct: true,
        attributesToRetrieve: [
          'objectID',
          'brand',
          'name',
          'model',
          'year',
          'dailyPrice',
          'images'
        ],
        attributesToHighlight: ['brand', 'name', 'model']
      });
      return hits.map(hit => ({
        ...hit,
        _id: hit.objectID,
        dailyPrice: Number(hit.dailyPrice),
        images: hit.images || []
      }));
    } catch (error) {
      console.error('Error searching cars:', error);
      return [];
    }
  }
};
