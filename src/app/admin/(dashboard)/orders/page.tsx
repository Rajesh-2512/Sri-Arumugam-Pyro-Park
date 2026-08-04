import { adminSupabase } from '@/lib/supabase/admin';
import OrderManager from './OrderManager';
import type { Order } from '@/types/order';

export default async function AdminOrdersPage() {
  const { data: ordersData } = await adminSupabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  const orders = (ordersData ?? []) as unknown as Order[];

  return <OrderManager orders={orders} />;
}
