import { adminSupabase } from '@/lib/supabase/admin';
import BillingManager from './BillingManager';
import type { WalkInProduct } from '@/types/product';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'POS Billing & Tax Invoices | Admin Portal',
};

export default async function AdminBillingPage() {
  const { data: walkInProductsData } = await adminSupabase
    .from('walk_in_products')
    .select('*, categories(id, name)')
    .order('name');

  const walkInProducts = (walkInProductsData ?? []) as unknown as WalkInProduct[];

  return <BillingManager products={[]} giftBoxes={[]} walkInProducts={walkInProducts} />;
}
