import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Brand } from '@/types/brand';
import { Switch } from '@/components/ui/switch';
import { uploadImage } from '@/lib/uploadImages';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface BrandDialogProps {
  brand?: Brand;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (brand: Partial<Brand>) => Promise<void>;
}

const defaultBrand: Partial<Brand> = {
  name: '',
  slug: '',
  logo: '',
  featured: false,
};

export function BrandDialog({ brand, open, onOpenChange, onSave }: BrandDialogProps) {
  const [formData, setFormData] = useState<Partial<Brand>>(brand || defaultBrand);
  const [uploading, setUploading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string>(brand?.logo || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(brand || defaultBrand);
    setPreviewLogo(brand?.logo || '');
  }, [brand]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create temporary preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewLogo(previewUrl);

      // Upload logo to Firebase Storage
      const tempId = brand?.id || 'temp-' + Date.now();
      const uploadedUrl = await uploadImage(file, `brands/${tempId}/logo`);

      // Update form data with new logo URL
      setFormData(prev => ({
        ...prev,
        logo: uploadedUrl
      }));

      // Clean up temporary preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error('Error uploading logo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name?.trim()) {
      alert('Name is required');
      return;
    }
    if (!formData.logo?.trim()) {
      alert('Logo is required');
      return;
    }
    if (!formData.slug?.trim()) {
      alert('Slug is required');
      return;
    }

    await onSave(formData);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{brand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
          <DialogDescription>
            Fill in the brand details below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: generateSlug(name)
                  });
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Featured Brand</Label>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-4">
            <Label>Brand Logo</Label>
            <div className="flex items-center gap-4">
              {previewLogo ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                  <Image
                    src={previewLogo}
                    alt="Brand logo preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 border rounded-lg flex items-center justify-center bg-gray-50">
                  <span className="text-gray-400 text-sm">No logo</span>
                </div>
              )}
              <div className="space-y-2">
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Logo'}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={uploading}
          >
            Save Brand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
