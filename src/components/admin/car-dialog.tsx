'use client';

import { useState, useEffect, useRef } from 'react';
import { Car } from '@/types/car';
import { Brand } from '@/types/brand';
import { Category } from '@/types/category';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { brandService } from '@/services/brandService';
import { categoryService } from '@/services/categoryService';
import { uploadImages } from '@/lib/uploadImages';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface CarDialogProps {
  car?: Car;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (car: Partial<Car>) => Promise<void>;
}

const defaultCar: Partial<Car> = {
  name: '',
  brand: '',
  transmission: 'Automatic',
  seats: 4,
  year: new Date().getFullYear(),
  rating: 5,
  advancePayment: false,
  rareCar: false,
  featured: false,
  fuelType: 'Petrol',
  engineCapacity: '',
  power: '',
  dailyPrice: 0,
  type: 'Sedan',
  tags: [],
  description: '',
  images: [],
  available: true,
  location: {
    name: '',
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
};

export function CarDialog({ car, open, onOpenChange, onSave }: CarDialogProps) {
  const [formData, setFormData] = useState<Partial<Car>>(car || defaultCar);
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>(car?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset form data and preview images when car prop changes
    setFormData(car || defaultCar);
    setPreviewImages(car?.images || []);
  }, [car]);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [tagCategories, setTagCategories] = useState<Category[]>([]);
  const [carTypeCategories, setCarTypeCategories] = useState<Category[]>([]);
  type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  type CarType = 'Supercar' | 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Wagon';
  const fuelTypes: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const carTypes: CarType[] = ['Supercar', 'SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible', 'Wagon'];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, tagData, carTypeData] = await Promise.all([
          brandService.getAllBrands(),
          categoryService.getCategoriesByType('tag'),
          categoryService.getCategoriesByType('carType')
        ]);
        setBrands(brandsData);
        setTagCategories(tagData);
        setCarTypeCategories(carTypeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Create temporary preview URLs
      const newPreviewUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviewUrls]);

      // Upload images to Firebase Storage
      const tempId = car?.id || 'temp-' + Date.now(); // Use existing car ID or generate temp ID
      const uploadedUrls = await uploadImages(files, tempId);

      // Update form data with new image URLs
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }));

      // Clean up temporary preview URLs
      newPreviewUrls.forEach(URL.revokeObjectURL);
    } catch (error) {
      console.error('Error uploading images:', error);
      // Handle error (show toast notification, etc.)
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{car ? 'Edit Car' : 'Add New Car'}</DialogTitle>
          <DialogDescription>
            Fill in the car details below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => setFormData({ ...formData, brand: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seats">Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technical Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) => setFormData({ ...formData, transmission: value as 'Manual' | 'Automatic' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value: FuelType) => setFormData({ ...formData, fuelType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuelType) => (
                      <SelectItem key={fuelType} value={fuelType}>
                        {fuelType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="engineCapacity">Engine Capacity (cc)</Label>
                <Input
                  id="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="power">Power (HP)</Label>
                <Input
                  id="power"
                  value={formData.power}
                  onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Pricing and Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing and Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyPrice">Daily Price *</Label>
                <Input
                  id="dailyPrice"
                  type="number"
                  value={formData.dailyPrice}
                  onChange={(e) => setFormData({ ...formData, dailyPrice: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Car Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: CarType) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select car type" />
                  </SelectTrigger>
                  <SelectContent>
                    {carTypes.map((carType) => (
                      <SelectItem key={carType} value={carType}>
                        {carType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Features and Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features and Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available">Available for Rent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="advancePayment"
                  checked={formData.advancePayment}
                  onCheckedChange={(checked) => setFormData({ ...formData, advancePayment: checked })}
                />
                <Label htmlFor="advancePayment">Requires Advance Payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="rareCar"
                  checked={formData.rareCar}
                  onCheckedChange={(checked) => setFormData({ ...formData, rareCar: checked })}
                />
                <Label htmlFor="rareCar">Rare Car</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>
            
            {/* Categories */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border rounded-lg p-4">
                {tagCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={formData.tags?.includes(category.id || '') || false}
                      onCheckedChange={(checked) => {
                        const categoryId = category.id || '';
                        const currentTags = formData.tags || [];
                        const newTags = checked
                          ? [...currentTags, categoryId]
                          : currentTags.filter(id => id !== categoryId);
                        setFormData({ ...formData, tags: newTags });
                      }}
                      disabled={loading}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Images</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Add Images
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
              
              {/* Image Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewImages.map((url, index) => (
                  <div key={url} className="relative group aspect-video">
                    <Image
                      src={url}
                      alt={`Car image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <div className="space-y-2">
              <Label htmlFor="description">Car Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-32"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location</h3>
            <div className="space-y-2">
              <Label htmlFor="location">Location Name *</Label>
              <Input
                id="location"
                value={formData.location?.name || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: {
                      name: e.target.value,
                      coordinates: formData.location?.coordinates || { lat: 0, lng: 0 }
                    }
                  })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.location?.coordinates?.lat || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        name: formData.location?.name || '',
                        coordinates: {
                          lat: parseFloat(e.target.value),
                          lng: formData.location?.coordinates?.lng || 0
                        }
                      }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.location?.coordinates?.lng || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        name: formData.location?.name || '',
                        coordinates: {
                          lat: formData.location?.coordinates?.lat || 0,
                          lng: parseFloat(e.target.value)
                        }
                      }
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save Car</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
