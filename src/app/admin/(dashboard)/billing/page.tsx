import { adminSupabase } from '@/lib/supabase/admin';
import BillingManager from './BillingManager';
import { getGiftBoxes } from '@/services/giftbox.actions';
import type { Product } from '@/types/product';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'POS Billing & Tax Invoices | Admin Portal',
};

export default async function AdminBillingPage() {
  const { data: productsData } = await adminSupabase
    .from('products')
    .select('*, categories(name)')
    .order('name');

  const giftBoxRes = await getGiftBoxes();

  const products = (productsData ?? []) as unknown as Product[];
  const giftBoxes = giftBoxRes.data || [];

  return <BillingManager products={products} giftBoxes={giftBoxes} />;
}
