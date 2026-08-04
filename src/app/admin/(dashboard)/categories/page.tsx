import { adminSupabase } from '@/lib/supabase/admin';
import CategoryManager from './CategoryManager';
import type { Category } from '@/types/product';

export default async function AdminCategoriesPage() {
  const { data: categoriesData } = await adminSupabase
    .from('categories')
    .select('*')
    .order('name');

  const categories = (categoriesData ?? []) as unknown as Category[];

  return <CategoryManager categories={categories} />;
}
