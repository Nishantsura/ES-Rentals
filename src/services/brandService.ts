import { Brand } from '@/types/brand';
import { brandAPI } from './api';

class BrandService {
  async getAllBrands(): Promise<Brand[]> {
    return brandAPI.getAllBrands();
  }

  async getBrandBySlug(slug: string): Promise<Brand | null> {
    return brandAPI.getBrandBySlug(slug);
  }

  async getFeaturedBrands(): Promise<Brand[]> {
    return brandAPI.getFeaturedBrands();
  }

  async createBrand(brand: Partial<Brand>): Promise<Brand> {
    return brandAPI.createBrand(brand);
  }

  async updateBrand(id: string, brand: Partial<Brand>): Promise<Brand> {
    return brandAPI.updateBrand(id, brand);
  }

  async deleteBrand(id: string): Promise<void> {
    return brandAPI.deleteBrand(id);
  }
}

export const brandService = new BrandService();
