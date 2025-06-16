// Car Type
export interface Car {
  id: string;
  name: string;
  brand: string;
  category: string;
  pricePerDay: number;
  image: string;
  featured?: boolean;
  specifications: {
    seats: number;
    doors: number;
    transmission: string;
    fuel: string;
    year: number;
  };
  description?: string;
  tags?: string[];
  type?: string;
}

// Brand Type
export interface Brand {
  id: string;
  name: string;
  logo: string;
  featured?: boolean;
  description?: string;
}

// Category Type
export interface Category {
  id: string;
  name: string;
  featured?: boolean;
  description?: string;
  image?: string;
}
