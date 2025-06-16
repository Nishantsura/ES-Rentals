import { Car } from '@/types/car';
import { carAPI } from './api';
import { categoryService } from './categoryService';

// Types
type CarType = 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Wagon';
type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
type CarTag = 'Luxury' | 'Track' | 'Collectors' | 'Vintage' | 'Performance';

class CarService {
  async getAllCars(): Promise<Car[]> {
    return carAPI.getAllCars();
  }

  async getFeaturedCars(): Promise<Car[]> {
    return carAPI.getFeaturedCars();
  }

  async getCarsByType(type: string): Promise<Car[]> {
    // Get all car type categories to validate against
    const carTypes = await categoryService.getCategoriesByType('carType');
    const validType = carTypes.find(category => 
      category.name.toLowerCase() === type.toLowerCase() || 
      category.slug.toLowerCase() === type.toLowerCase()
    );

    if (!validType) return [];
    return carAPI.getCarsByType(validType.name);
  }

  async getCarsByFuelType(fuelType: string): Promise<Car[]> {
    // Get all fuel type categories to validate against
    const fuelTypes = await categoryService.getCategoriesByType('fuelType');
    const validFuelType = fuelTypes.find(category => 
      category.name.toLowerCase() === fuelType.toLowerCase() || 
      category.slug.toLowerCase() === fuelType.toLowerCase()
    );

    if (!validFuelType) return [];
    return carAPI.getCarsByFuelType(validFuelType.name);
  }

  async getCarsByTag(tag: string): Promise<Car[]> {
    // Get all tag categories to validate against
    const tags = await categoryService.getCategoriesByType('tag');
    const validTag = tags.find(category => 
      category.name.toLowerCase() === tag.toLowerCase() || 
      category.slug.toLowerCase() === tag.toLowerCase()
    );

    if (!validTag) return [];
    return carAPI.getCarsByTag(validTag.name);
  }

  async getCarsByBrand(brand: string): Promise<Car[]> {
    return carAPI.getCarsByBrand(brand);
  }

  async createCar(car: Partial<Car>): Promise<Car> {
    return carAPI.createCar(car);
  }

  async updateCar(id: string, car: Partial<Car>): Promise<Car> {
    return carAPI.updateCar(id, car);
  }

  async deleteCar(id: string): Promise<void> {
    return carAPI.deleteCar(id);
  }

  private validateCarType(type: string): CarType | null {
    const validTypes: CarType[] = ['SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible', 'Wagon'];
    const normalizedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return validTypes.includes(normalizedType as CarType) ? normalizedType as CarType : null;
  }

  private validateFuelType(type: string): FuelType | null {
    const validTypes: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
    const normalizedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return validTypes.includes(normalizedType as FuelType) ? normalizedType as FuelType : null;
  }

  private validateTag(tag: string): CarTag | null {
    const validTags: CarTag[] = ['Luxury', 'Track', 'Collectors', 'Vintage', 'Performance'];
    const normalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
    return validTags.includes(normalizedTag as CarTag) ? normalizedTag as CarTag : null;
  }
}

export const carService = new CarService();
