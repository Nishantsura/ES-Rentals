import { Category } from '@/types/category';
import { categoryAPI } from './api';
import { auth } from '@/lib/firebase';

// Since we're in a browser environment, we can use the global File type
interface CategoryCreate extends Omit<Category, 'image'> {
  image?: File | string;
}

class CategoryService {
  async getCategoriesByType(type: 'carType' | 'fuelType' | 'tag'): Promise<Category[]> {
    return categoryAPI.getCategoriesByType(type);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return categoryAPI.getCategoryBySlug(slug);
  }

  async getFeaturedCategories(): Promise<Category[]> {
    return categoryAPI.getFeaturedCategories();
  }

  async createCategory(category: Partial<CategoryCreate>): Promise<Category> {
    if (!auth.currentUser) {
      throw new Error('Not authenticated');
    }

    // Validate required fields
    if (!category.name?.trim()) {
      throw new Error('Name is required');
    }
    if (!category.type) {
      throw new Error('Type is required');
    }
    if (!category.slug?.trim()) {
      throw new Error('Slug is required');
    }

    // Prepare category data
    const formData = new FormData();
    
    // Add required fields
    formData.append('name', category.name.trim());
    formData.append('type', category.type);
    formData.append('slug', category.slug.trim());
    
    // Add optional fields
    if (category.description) {
      formData.append('description', category.description.trim());
    }
    if (typeof category.featured === 'boolean') {
      formData.append('featured', String(category.featured));
    }
    
    // Handle image if present
    if (category.image) {
      if (category.image instanceof File) {
        formData.append('image', category.image);
      } else if (typeof category.image === 'string') {
        formData.append('image', category.image);
      }
    }

    return categoryAPI.createCategory(formData);
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    if (!auth.currentUser) {
      throw new Error('Not authenticated');
    }

    // Validate required fields for update
    if (category.name !== undefined && !category.name.trim()) {
      throw new Error('Name cannot be empty');
    }
    if (category.type !== undefined && !category.type) {
      throw new Error('Type cannot be empty');
    }
    if (category.slug !== undefined && !category.slug.trim()) {
      throw new Error('Slug cannot be empty');
    }

    // Convert category to FormData
    const formData = new FormData();
    Object.entries(category).forEach(([key, value]: [string, any]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          formData.append(key, String(value));
        } else if (value !== null) {
          formData.append(key, JSON.stringify(value));
        }
      }
    });

    return categoryAPI.updateCategory(id, formData);
  }

  async deleteCategory(id: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('Not authenticated');
    }
    return categoryAPI.deleteCategory(id);
  }
}

export const categoryService = new CategoryService();
