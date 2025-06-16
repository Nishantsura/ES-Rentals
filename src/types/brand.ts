export interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
  featured?: boolean;
  carCount?: number;
}

export interface NewBrand extends Omit<Brand, 'id'> {
  id?: string;
}
