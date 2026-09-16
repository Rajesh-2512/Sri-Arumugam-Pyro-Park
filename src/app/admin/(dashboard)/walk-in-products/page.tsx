import { adminSupabase } from '@/lib/supabase/admin';
import type { WalkInProduct } from '@/types/product';
import type { Category } from '@/types/product';
import WalkInProductManager from './WalkInProductManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WalkInProductsPage() {
  const { data } = await adminSupabase
    .from('walk_in_products')
    .select('*, categories(id, name)')
    .order('name');
  const { data: categories } = await adminSupabase.from('categories').select('*').order('name');

  return <WalkInProductManager products={(data ?? []) as unknown as WalkInProduct[]} categories={(categories ?? []) as Category[]} />;
}
