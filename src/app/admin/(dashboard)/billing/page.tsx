import { adminSupabase } from '@/lib/supabase/admin';
import BillingManager from './BillingManager';
import type { Product } from '@/types/product';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'POS Billing & Tax Invoices | Admin Portal',
};

export default async function AdminBillingPage() {
  const { data: productsData } = await adminSupabase
    .from('products')
    .select('*, categories(id, name)')
    .order('name');

  const products = (productsData ?? []) as unknown as Product[];

  return <BillingManager products={products} giftBoxes={[]} />;
}
