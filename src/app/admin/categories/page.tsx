'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Pencil, Trash2, Plus } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { Category } from '@/types/category';
import { categoryService } from '@/services/categoryService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CategoryDialog } from '@/components/admin/category-dialog';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { useToast } from '@/components/hooks/use-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ error: string; details?: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
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

  const fetchCategories = async () => {
    try {
      setError(null);
      setLoading(true);
      if (!auth.currentUser) {
        throw new Error('Not authenticated');
      }
      const token = await auth.currentUser.getIdToken();

      // Fetch all category types
      const [carTypes, fuelTypes, tags] = await Promise.all([
        categoryService.getCategoriesByType('carType'),
        categoryService.getCategoriesByType('fuelType'),
        categoryService.getCategoriesByType('tag')
      ]);

      // Combine and sort by name
      const allCategories = [...carTypes, ...fuelTypes, ...tags]
        .sort((a, b) => a.name.localeCompare(b.name));

      setCategories(allCategories);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError({
        error: 'Failed to fetch categories',
        details: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setSelectedCategory(undefined);
    setDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      if (!auth.currentUser) {
        throw new Error('Not authenticated');
      }
      if (!category.id) {
        throw new Error('Category ID is required');
      }
      const token = await auth.currentUser.getIdToken();

      await categoryService.deleteCategory(category.id);
      toast({
        title: 'Category deleted',
        description: `${category.name} has been deleted successfully.`,
      });
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    try {
      if (!auth.currentUser) {
        throw new Error('Not authenticated');
      }
      const token = await auth.currentUser.getIdToken();

      let savedCategory: Category;
      if (selectedCategory?.id) {
        savedCategory = await categoryService.updateCategory(selectedCategory.id, categoryData);
        setCategories(prevCategories => 
          prevCategories.map(category => 
            category.id === selectedCategory.id ? { ...category, ...savedCategory } : category
          )
        );
      } else {
        savedCategory = await categoryService.createCategory(categoryData);
        setCategories(prevCategories => [...prevCategories, savedCategory]);
      }

      setDialogOpen(false);
      setSelectedCategory(undefined);
      toast({
        title: selectedCategory ? 'Category Updated' : 'Category Added',
        description: `${categoryData.name} has been ${selectedCategory ? 'updated' : 'added'} successfully.`,
      });

      // Refresh the list to ensure we have the latest data
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      throw error; // Let the dialog component handle the error display
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="p-6">
            <TableSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <div className="flex justify-between items-center p-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Categories</h2>
            <p className="text-sm text-muted-foreground">
              Manage your categories here.
            </p>
          </div>
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <CardContent>
          {error ? (
            <div className="flex items-center gap-2 text-red-500 mb-4">
              <AlertCircle className="h-4 w-4" />
              <p>{error.error}</p>
              {error.details && (
                <p className="text-sm text-muted-foreground">{error.details}</p>
              )}
            </div>
          ) : null}

          <div className="relative">
            <div className={`transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} className="transition-colors hover:bg-muted/50">
                      <TableCell>
                        {category.image ? (
                          <div className="relative w-12 h-12">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.type}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>{category.featured ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
