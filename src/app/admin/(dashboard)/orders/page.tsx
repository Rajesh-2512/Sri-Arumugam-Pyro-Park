import { adminSupabase } from '@/lib/supabase/admin';
import OrderManager from './OrderManager';
import type { Order } from '@/types/order';
import type { Product } from '@/types/product';
import type { GiftBox } from '@/types/giftbox';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const [ordersRes, productsRes, giftBoxesRes] = await Promise.all([
    adminSupabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false }),
    adminSupabase
      .from('products')
      .select('*, categories(name)')
      .order('name', { ascending: true }),
    adminSupabase
      .from('gift_boxes')
      .select('*')
      .order('price', { ascending: true }),
  ]);

  const orders = (ordersRes.data ?? []) as unknown as Order[];
  const products = (productsRes.data ?? []) as unknown as Product[];
  const giftBoxes = (giftBoxesRes.data ?? []) as unknown as GiftBox[];

  return <OrderManager orders={orders} products={products} giftBoxes={giftBoxes} />;
}

