import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout & Delivery Details',
  description: 'Enter your shipping address and contact details to generate your official order receipt and PDF invoice.',
};

export default async function CheckoutPage() {
  const supabase = await createServerSupabaseClient();
  const { data: settings } = await supabase.from('global_settings').select('is_shop_open').single();
  const isShopOpen = settings?.is_shop_open ?? true;

  return <CheckoutClient isShopOpen={isShopOpen} />;
}
