'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Pencil, Trash2, Plus } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { Car } from '@/types/car';
import { carService } from '@/services/carService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CarDialog } from '@/components/admin/car-dialog';
import { StatusModal } from '@/components/admin/status-modal';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { useToast } from '@/components/hooks/use-toast';

export default function AdminCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ error: string; details?: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | undefined>();
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
  const { toast } = useToast();

  const fetchCars = async () => {
    try {
      setError(null);
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const carsData = await carService.getAllCars();
      // Force a re-render by creating a new array
      setCars([...carsData]);
    } catch (error: any) {
      console.error('Error fetching cars:', error);
      setError({
        error: 'Failed to fetch cars',
        details: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleAddCar = () => {
    setSelectedCar(undefined);
    setDialogOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setDialogOpen(true);
  };

  const handleDeleteCar = async (car: Car) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      await carService.deleteCar(car.id);
      toast({
        title: 'Car deleted',
        description: `${car.name} has been deleted successfully.`,
      });
      fetchCars();
    } catch (error: any) {
      console.error('Error deleting car:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete car. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveCar = async (carData: Partial<Car>) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      let savedCar: Car;
      if (selectedCar) {
        savedCar = await carService.updateCar(selectedCar.id, carData);
        // Update the car in the local state immediately
        setCars(prevCars => 
          prevCars.map(car => 
            car.id === selectedCar.id ? { ...car, ...savedCar } : car
          )
        );
      } else {
        savedCar = await carService.createCar(carData);
        // Add the new car to the local state immediately
        setCars(prevCars => [...prevCars, savedCar]);
      }

      // Close dialog and show success message
      setDialogOpen(false);
      setSelectedCar(undefined);
      setStatusModal({
        open: true,
        title: selectedCar ? 'Car Updated' : 'Car Added',
        description: `${carData.name} has been ${selectedCar ? 'updated' : 'added'} successfully.`,
        status: 'success',
      });

      // Fetch fresh data in the background
      fetchCars();
    } catch (error: any) {
      console.error('Error saving car:', error);
      setStatusModal({
        open: true,
        title: 'Error',
        description: 'Failed to save car. Please try again.',
        status: 'error',
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <div className="flex justify-between items-center p-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Cars</h2>
            <p className="text-sm text-muted-foreground">
              Manage your car listings here.
            </p>
          </div>
          <Button onClick={handleAddCar}>
            <Plus className="h-4 w-4 mr-2" />
            Add Car
          </Button>
        </div>

        <CardContent>
          {error ? (
            <div className="flex items-center gap-2 text-red-500 mb-4">
              <AlertCircle className="h-4 w-4" />
              <p>{error.error}</p>
            </div>
          ) : null}

          <div className="relative">
            {/* Fade out current table when loading */}
            <div className={`transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cars.map((car) => (
                    <TableRow key={car.id} className="transition-colors hover:bg-secondary/70">
                      <TableCell>
                        {car.images && car.images.length > 0 ? (
                          <div className="relative w-16 h-16 rounded-md overflow-hidden">
                            <Image
                              src={car.images[0]}
                              alt={car.name}
                              fill
                              className="object-cover transition-transform hover:scale-110"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-secondary rounded-md flex items-center justify-center">
                            <span className="text-muted-foreground">No image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{car.name}</TableCell>
                      <TableCell>{car.brand}</TableCell>
                      <TableCell>AED {car.dailyPrice.toLocaleString()}/day</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          car.available 
                            ? 'bg-green-800/20 text-green-400' 
                            : 'bg-red-900/20 text-red-400'
                        }`}>
                          {car.available ? 'Available' : 'Unavailable'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditCar(car)}
                            className="transition-colors hover:bg-primary hover:text-primary-foreground"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteCar(car)}
                            className="transition-colors hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Show skeleton loader when loading */}
            <div className={`absolute inset-0 transition-opacity duration-200 ${
              loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <TableSkeleton />
            </div>
          </div>
        </CardContent>
      </Card>

      <CarDialog
        car={selectedCar}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveCar}
      />
      <StatusModal
        open={statusModal.open}
        onOpenChange={(open) => setStatusModal({ ...statusModal, open })}
        title={statusModal.title}
        description={statusModal.description}
        status={statusModal.status}
      />
    </div>
  );
}
