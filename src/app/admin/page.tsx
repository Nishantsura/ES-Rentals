'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { Car } from '@/types/car';
import { carService } from '@/services/carService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ error: string; details?: string; stack?: string } | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setError(null);
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        const carsData = await carService.getAllCars();
        setCars(carsData);
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

    fetchCars();
  }, []);

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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Cars List</h1>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2 text-red-500">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">{error.error}</p>
              </div>
              {error.details && (
                <p className="text-sm text-red-400 ml-7">{error.details}</p>
              )}
              {process.env.NODE_ENV === 'development' && error.stack && (
                <pre className="mt-2 p-4 bg-red-50 rounded-lg text-xs overflow-x-auto">
                  {error.stack}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl lg:text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-3">Cars</h2>
            <p className="text-gray-600 text-sm lg:text-base mb-4">Manage your car inventory</p>
            <a href="/admin/cars" className="inline-flex items-center text-blue-500 hover:text-blue-600 hover:underline text-sm lg:text-base">
              Go to Cars
              <span className="ml-1">→</span>
            </a>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-3">Brands</h2>
            <p className="text-gray-600 text-sm lg:text-base mb-4">Manage car brands</p>
            <a href="/admin/brands" className="inline-flex items-center text-blue-500 hover:text-blue-600 hover:underline text-sm lg:text-base">
              Go to Brands
              <span className="ml-1">→</span>
            </a>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-3">Categories</h2>
            <p className="text-gray-600 text-sm lg:text-base mb-4">Manage car categories</p>
            <a href="/admin/categories" className="inline-flex items-center text-blue-500 hover:text-blue-600 hover:underline text-sm lg:text-base">
              Go to Categories
              <span className="ml-1">→</span>
            </a>
          </CardContent>
        </Card>
      </div>

      {cars.length > 0 && (
        <Card className="mt-8">
          <CardContent className="p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-4">Recent Cars</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Brand</TableHead>
                    <TableHead className="hidden lg:table-cell">Type</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cars.slice(0, 5).map((car) => (
                    <TableRow key={car.id}>
                      <TableCell className="font-medium">{car.id.slice(0, 8)}</TableCell>
                      <TableCell>{car.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{car.brand}</TableCell>
                      <TableCell className="hidden lg:table-cell">{car.type}</TableCell>
                      <TableCell className="text-right">${car.dailyPrice.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
