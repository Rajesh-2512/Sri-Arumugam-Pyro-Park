'use server';

import { adminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface BillingOrderItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  finalPrice: number;
  quantity: number;
}

export interface CreateBillingInput {
  customer_name: string;
  phone: string;
  address?: string;
  city?: string;
  pincode?: string;
  gstin?: string;
  gst_rate?: number;
  gst_amount?: number;
  payment_mode: 'cash' | 'upi' | 'card' | 'bank_transfer';
  notes?: string;
  total_amount: number;
  items: BillingOrderItem[];
}

export async function createAdminBillingOrder(input: CreateBillingInput) {
  if (!input.customer_name || !input.phone || input.items.length === 0) {
    return { success: false, error: 'Customer name, phone number, and items are required.' };
  }

  const notesText = `[POS BILLING] Payment: ${input.payment_mode.toUpperCase()}${input.gstin ? ` | Buyer GSTIN: ${input.gstin}` : ''}${input.notes ? ` | ${input.notes}` : ''}`;

  const { data: order, error: orderError } = await adminSupabase
    .from('orders')
    .insert({
      customer_name: input.customer_name,
      phone: input.phone,
      address: input.address || 'In-Store Counter Buyer',
      city: input.city || 'Sivakasi',
      pincode: input.pincode || '626123',
      notes: notesText,
      total_amount: input.total_amount,
      status: 'confirmed',
    })
    .select('id, created_at')
    .single();

  if (orderError || !order) {
    console.error('Error creating billing order:', orderError);
    return { success: false, error: orderError?.message || 'Failed to create order' };
  }

  const orderItemsData = input.items.map((i) => ({
    order_id: order.id,
    product_id: i.id.startsWith('custom_') || i.id.startsWith('giftbox_') ? null : i.id,
    product_name: i.name,
    price: i.finalPrice,
    quantity: i.quantity,
  }));

  const { error: itemsError } = await adminSupabase
    .from('order_items')
    .insert(orderItemsData);

  if (itemsError) {
    console.error('Error creating billing order items:', itemsError);
  }

  revalidatePath('/admin/orders');
  return { success: true, orderId: order.id, createdAt: order.created_at };
}
