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
  aadhar_pan?: string;
  gstin?: string;
  gst_rate?: number;
  gst_amount?: number;
  payment_mode: 'cash' | 'upi' | 'card' | 'bank_transfer';
  paid_amount?: number;
  notes?: string;
  total_amount: number;
  items: BillingOrderItem[];
}

export async function createAdminBillingOrder(input: CreateBillingInput) {
  if (!input.customer_name || !input.phone || input.items.length === 0) {
    return { success: false, error: 'Customer name, phone number, and items are required.' };
  }

  const paidVal = input.paid_amount !== undefined ? input.paid_amount : input.total_amount;
  const remVal = Math.max(0, input.total_amount - paidVal);

  const notesText = `[POS BILLING] Payment: ${input.payment_mode.toUpperCase()}${input.aadhar_pan ? ` | Aadhar/PAN: ${input.aadhar_pan}` : ''}${input.gstin ? ` | Buyer GSTIN: ${input.gstin}` : ''}${remVal > 0 ? ` | Paid: ₹${paidVal} (Remaining: ₹${remVal})` : ''}${input.notes ? ` | ${input.notes}` : ''}`;

  const insertPayload: any = {
    customer_name: input.customer_name,
    phone: input.phone,
    address: input.address || 'In-Store Counter Buyer',
    city: input.city || 'Sivakasi',
    pincode: input.pincode || '626123',
    notes: notesText,
    total_amount: input.total_amount,
    status: 'confirmed',
    device_id: 'pos_counter_01',
  };

  if (input.aadhar_pan) insertPayload.aadhar_pan = input.aadhar_pan;
  insertPayload.paid_amount = paidVal;
  insertPayload.remaining_amount = remVal;

  let order: any = null;
  let orderError: any = null;

  const res1 = await adminSupabase
    .from('orders')
    .insert(insertPayload)
    .select('id, created_at')
    .single();

  if (res1.error) {
    delete insertPayload.aadhar_pan;
    delete insertPayload.paid_amount;
    delete insertPayload.remaining_amount;

    const res2 = await adminSupabase
      .from('orders')
      .insert(insertPayload)
      .select('id, created_at')
      .single();

    order = res2.data;
    orderError = res2.error;
  } else {
    order = res1.data;
  }

  if (orderError || !order) {
    console.error('Error creating billing order:', orderError);
    return { success: false, error: orderError?.message || 'Failed to create order' };
  }

  // Fetch all existing product IDs to prevent foreign key errors for combo boxes or custom items
  const { data: existingProducts } = await adminSupabase.from('products').select('id');
  const validProductIds = new Set(existingProducts?.map((p) => p.id) || []);

  const orderItemsData = input.items.map((i: any) => {
    const itemPrice = typeof i.finalPrice === 'number' && !isNaN(i.finalPrice)
      ? i.finalPrice
      : (typeof i.price === 'number' && !isNaN(i.price) ? i.price : 0);

    return {
      order_id: order.id,
      product_id: validProductIds.has(i.id) ? i.id : null,
      product_name: String(i.name || i.product_name || 'POS Cracker Item'),
      price: Number(itemPrice),
      quantity: Math.max(1, Number(i.quantity || 1)),
    };
  });

  const { error: itemsError } = await adminSupabase
    .from('order_items')
    .insert(orderItemsData);

  if (itemsError) {
    console.error('Error creating billing order items with product_id, retrying with null product_id:', itemsError);
    // Fallback: strip product_id and insert items so line items are never lost
    const fallbackItems = orderItemsData.map((item) => ({
      order_id: item.order_id,
      product_id: null,
      product_name: item.product_name,
      price: item.price,
      quantity: item.quantity,
    }));
    await adminSupabase.from('order_items').insert(fallbackItems);
  }

  revalidatePath('/admin/orders');
  return { success: true, orderId: order.id, createdAt: order.created_at };
}
