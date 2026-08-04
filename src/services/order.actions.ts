'use server';

import { adminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { OrderStatus } from '@/types/order';

const orderSchema = z.object({
  customer_name: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  address: z.string().min(10),
  city: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  notes: z.string().optional(),
  total_amount: z.number().positive(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    finalPrice: z.number(),
    quantity: z.number().int().positive(),
  })),
});

type PlaceOrderInput = z.infer<typeof orderSchema>;

export async function placeOrder(input: PlaceOrderInput) {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }
  const { items, ...orderData } = parsed.data;

  // Insert main order
  const { data: order, error: orderError } = await adminSupabase
    .from('orders')
    .insert({
      customer_name: orderData.customer_name,
      phone: orderData.phone,
      address: orderData.address,
      city: orderData.city,
      pincode: orderData.pincode,
      notes: orderData.notes || null,
      total_amount: orderData.total_amount,
      status: 'pending',
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('Order insert error:', orderError);
    return { success: false, error: orderError?.message || 'Failed to create order' };
  }

  // Insert order snapshot items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id.includes('-') ? item.id : null,
    product_name: item.name,
    price: item.finalPrice,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await adminSupabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Order items insert error:', itemsError);
    await adminSupabase.from('orders').delete().eq('id', order.id);
    return { success: false, error: 'Failed to save order line items' };
  }

  revalidatePath('/admin/orders');
  return { success: true, orderId: order.id };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { error } = await adminSupabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/orders');
  return { success: true };
}

export async function getOrders() {
  const { data, error } = await adminSupabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) return { success: false, data: null, error: error.message };
  return { success: true, data };
}
