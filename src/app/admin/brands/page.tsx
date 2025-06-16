'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { Brand, NewBrand } from '@/types/brand';
import { brandService } from '@/services/brandService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BrandDialog } from '@/components/admin/brand-dialog';
import { StatusModal } from '@/components/admin/status-modal';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ error: string; details?: string } | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    status: 'success' | 'error';
  }>({
    open: false,
    title: '',
    description: '',
    status: 'success',
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setError(null);
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        const brandsData = await brandService.getAllBrands();
        setBrands(brandsData);
      } catch (error: any) {
        console.error('Error fetching brands:', error);
        setError({
          error: 'Failed to fetch brands',
          details: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleSaveBrand = async (brandData: Partial<Brand>) => {
    try {
      if (selectedBrand && selectedBrand.id) {
        // Update existing brand
        await brandService.updateBrand(selectedBrand.id, brandData);
        setStatusModal({
          open: true,
          title: 'Brand Updated',
          description: 'The brand has been updated successfully.',
          status: 'success',
        });
      } else {
        // Create new brand
        await brandService.createBrand(brandData as NewBrand);
        setStatusModal({
          open: true,
          title: 'Brand Created',
          description: 'The brand has been created successfully.',
          status: 'success',
        });
      }
      
      // Refresh brands list
      const brandsData = await brandService.getAllBrands();
      setBrands(brandsData);
      setDialogOpen(false);
      setSelectedBrand(undefined);
    } catch (error: any) {
      console.error('Error saving brand:', error);
      setStatusModal({
        open: true,
        title: 'Error',
        description: error.message || 'An error occurred while saving the brand.',
        status: 'error',
      });
    }
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrand || !selectedBrand.id) return;

    try {
      await brandService.deleteBrand(selectedBrand.id);
      setStatusModal({
        open: true,
        title: 'Brand Deleted',
        description: 'The brand has been deleted successfully.',
        status: 'success',
      });
      
      // Refresh brands list
      const brandsData = await brandService.getAllBrands();
      setBrands(brandsData);
      setDeleteDialogOpen(false);
      setSelectedBrand(undefined);
    } catch (error: any) {
      console.error('Error deleting brand:', error);
      setStatusModal({
        open: true,
        title: 'Error',
        description: error.message || 'An error occurred while deleting the brand.',
        status: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-40 animate-pulse bg-gray-200 rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error.error}</p>
          </div>
          {error.details && <p className="mt-2 text-sm text-gray-500">{error.details}</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Brands</h1>
        <Button
          onClick={() => {
            setSelectedBrand(undefined);
            setDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Car Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    {brand.logo ? (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          fill
                          className="object-contain"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-gray-400">No logo</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>{brand.slug}</TableCell>
                  <TableCell>{brand.featured ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{brand.carCount || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBrand(brand);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBrand(brand);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BrandDialog
        brand={selectedBrand}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveBrand}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <Trash2 className="h-8 w-8 text-red-500" />
              <DialogTitle>Are you sure?</DialogTitle>
            </div>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the brand
              and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteBrand}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StatusModal
        open={statusModal.open}
        onOpenChange={(open) => setStatusModal((prev) => ({ ...prev, open }))}
        title={statusModal.title}
        description={statusModal.description}
        status={statusModal.status}
      />
    </div>
  );
}
