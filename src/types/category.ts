export interface Category {
  id?: string;
  name: string;
  slug: string;
  type: 'carType' | 'fuelType' | 'tag';
  image?: string;
  description?: string;
  carCount?: number;
  featured?: boolean;
}
