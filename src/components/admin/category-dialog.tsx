'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from '@/types/category';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, X, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { uploadImage } from '@/lib/uploadImages';
import { Textarea } from '@/components/ui/textarea';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  onSave: (category: Partial<Category>) => Promise<void>;
}

export function CategoryDialog({ open, onOpenChange, category, onSave }: CategoryDialogProps) {
  const [formData, setFormData] = useState<Partial<Category>>(
    category || {
      name: '',
      type: 'carType',
      slug: '',
      featured: false,
      image: '',
      description: '',
    }
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(category || {
        name: '',
        type: 'carType',
        slug: '',
        featured: false,
        image: '',
        description: '',
      });
      setSelectedImage(null);
      setPreviewUrl(category?.image || null);
      setError(null);
      setIsSubmitting(false);
    }
  }, [open, category]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG and WebP are allowed.');
      return;
    }
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create temporary preview
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setSelectedImage(file);

      // Upload to Firebase Storage
      const categoryId = category?.id || 'temp-' + Date.now();
      const imageUrl = await uploadImage(file, `categories/${categoryId}/image`);

      // Update form data with the new image URL
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }));

      // Clean up preview URL
      URL.revokeObjectURL(newPreviewUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name?.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.type) {
        throw new Error('Type is required');
      }
      if (!formData.slug?.trim()) {
        throw new Error('Slug is required');
      }

      // Prepare category data
      const categoryData: Partial<Category> = {
        name: formData.name.trim(),
        type: formData.type,
        slug: formData.slug.trim(),
        featured: formData.featured || false,
        description: formData.description?.trim() || '',
        image: formData.image || ''
      };

      // Submit the category data
      await onSave(categoryData);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setError(error.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof Category, value: string | boolean) => {
    setFormData((prev) => {
      const updates: Partial<Category> = {
        ...prev,
        [field]: value,
      };

      // Always auto-generate slug from name when name changes, unless slug was manually edited
      if (field === 'name' && typeof value === 'string') {
        const autoSlug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        // Only update slug if it's empty or was auto-generated from previous name
        if (!prev.slug || prev.slug === prev.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')) {
          updates.slug = autoSlug;
        }
      }

      return updates;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="category-form-description">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <p id="category-form-description" className="text-sm text-muted-foreground">
            {category ? 'Edit the category details below.' : 'Fill in the details to create a new category.'}
          </p>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter category name"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carType">Car Type</SelectItem>
                <SelectItem value="fuelType">Fuel Type</SelectItem>
                <SelectItem value="tag">Tag</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug || ''}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="category-slug"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter category description (optional)"
              disabled={isSubmitting}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <div className="mt-2 flex items-center gap-4">
              {previewUrl ? (
                <div className="relative w-32 h-32">
                  <img
                    src={previewUrl}
                    alt="Category preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    disabled={isSubmitting || isUploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-md">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm text-gray-600">Upload Image</span>
                      </>
                    )}
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className="sr-only"
                    disabled={isSubmitting || isUploading}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured || false}
              onCheckedChange={(checked) => handleInputChange('featured', checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? 'Saving...' : isUploading ? 'Uploading...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
