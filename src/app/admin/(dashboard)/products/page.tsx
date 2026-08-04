import { adminSupabase } from '@/lib/supabase/admin';
import ProductManager from './ProductManager';
import type { Product, Category } from '@/types/product';

export default async function AdminProductsPage() {
  const { data: productsData } = await adminSupabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  const { data: categoriesData } = await adminSupabase
    .from('categories')
    .select('*')
    .order('name');

  const products = (productsData ?? []) as unknown as Product[];
  const categories = (categoriesData ?? []) as unknown as Category[];

  return <ProductManager products={products} categories={categories} />;
}
