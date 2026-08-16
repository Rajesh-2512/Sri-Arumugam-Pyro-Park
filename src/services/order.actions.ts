'use server';

import { adminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { OrderStatus } from '@/types/order';
import { sendOrderNotificationEmail } from '@/lib/email';

const orderSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
  phone: z.string().min(5, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  aadhar_pan: z.string().min(1, 'Aadhar or PAN number is required'),
  paid_amount: z.number().optional(),
  notes: z.string().optional(),
  total_amount: z.number(),
  items: z.array(z.any()).min(1, 'Order must contain at least 1 item'),
});

type PlaceOrderInput = z.infer<typeof orderSchema>;

export async function placeOrder(input: PlaceOrderInput) {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }
  const { items, ...orderData } = parsed.data;

  // Enforce Minimum Order Amount (TN ₹3000, Others ₹5000) with Pincode Intelligence
  const pin = (orderData.pincode || '').trim().replace(/\D/g, '');
  const st = (orderData.state || '').trim().toLowerCase();
  const ct = (orderData.city || '').trim().toLowerCase();

  let isTN = false;
  if (pin.length === 6) {
    // Tamil Nadu pincodes start with 60xxxx - 64xxxx (excluding 605xxx Pondicherry)
    isTN = !pin.startsWith('605') && /^6[0-4]\d{4}$/.test(pin);
  } else {
    isTN = st.includes('tamil nadu') || st === 'tn' || ct.includes('chennai') || ct.includes('sivakasi') || ct.includes('madurai');
  }

  const minRequiredAmount = isTN ? 3000 : 5000;

  if (orderData.total_amount < minRequiredAmount) {
    const diff = minRequiredAmount - orderData.total_amount;
    const regionName = isTN ? 'Tamil Nadu' : `Other States / Outside TN (Pincode ${orderData.pincode || 'Entered'})`;
    return {
      success: false,
      error: `⚠️ Minimum order amount for ${regionName} is ₹${minRequiredAmount.toLocaleString('en-IN')}. Please add ₹${diff.toLocaleString('en-IN')} more to your cart before submitting.`,
    };
  }

  // Check if store is open for orders
  const { data: settings } = await adminSupabase
    .from('global_settings')
    .select('is_shop_open')
    .single();

  if (settings && settings.is_shop_open === false) {
    return {
      success: false,
      error: '⚠️ Shop is currently closed for new orders. Orders placed now will be processed when shop reopens.',
    };
  }

  const notesText = [
    orderData.aadhar_pan ? `Aadhar/PAN: ${orderData.aadhar_pan}` : null,
    orderData.paid_amount !== undefined ? `Paid: ₹${orderData.paid_amount}` : null,
    orderData.notes || null,
  ].filter(Boolean).join(' | ');

  // Insert main order
  const insertPayload: any = {
    customer_name: orderData.customer_name,
    phone: orderData.phone,
    address: orderData.address,
    city: orderData.city,
    pincode: orderData.pincode,
    notes: notesText || null,
    total_amount: orderData.total_amount,
    status: 'pending',
    device_id: 'web_checkout',
  };

  if (orderData.aadhar_pan) {
    insertPayload.aadhar_pan = orderData.aadhar_pan;
  }
  if (orderData.paid_amount !== undefined) {
    insertPayload.paid_amount = orderData.paid_amount;
    insertPayload.remaining_amount = Math.max(0, orderData.total_amount - orderData.paid_amount);
  }

  let order: any = null;
  let orderError: any = null;

  // Attempt insert with custom fields
  const res1 = await adminSupabase
    .from('orders')
    .insert(insertPayload)
    .select('id')
    .single();

  if (res1.error) {
    // Fallback without extra columns if DB schema doesn't have them yet
    delete insertPayload.aadhar_pan;
    delete insertPayload.paid_amount;
    delete insertPayload.remaining_amount;

    const res2 = await adminSupabase
      .from('orders')
      .insert(insertPayload)
      .select('id')
      .single();

    order = res2.data;
    orderError = res2.error;
  } else {
    order = res1.data;
  }

  if (orderError || !order) {
    console.error('Order insert error:', orderError);
    return { success: false, error: orderError?.message || 'Failed to create order' };
  }

  // Fetch all existing product IDs to prevent foreign key errors for combo boxes or custom items
  const { data: existingProducts } = await adminSupabase.from('products').select('id');
  const validProductIds = new Set(existingProducts?.map((p) => p.id) || []);

  // Insert order snapshot items with robust sanitization
  const orderItems = items.map((item: any) => {
    const itemPrice = typeof item.finalPrice === 'number' && !isNaN(item.finalPrice)
      ? item.finalPrice
      : (typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0);

    return {
      order_id: order.id,
      product_id: validProductIds.has(item.id) ? item.id : null,
      product_name: String(item.name || item.product_name || 'Cracker Item'),
      price: Number(itemPrice),
      quantity: Math.max(1, Number(item.quantity || 1)),
    };
  });

  const { error: itemsError } = await adminSupabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Order items insert error, retrying with null product_id:', itemsError);
    const fallbackItems = orderItems.map((i) => ({
      order_id: i.order_id,
      product_id: null,
      product_name: i.product_name,
      price: i.price,
      quantity: i.quantity,
    }));
    await adminSupabase.from('order_items').insert(fallbackItems);
  }

  revalidatePath('/admin/orders');

  // Asynchronously trigger email notification to sriarumugampyropark.svks@gmail.com
  sendOrderNotificationEmail({
    orderId: order.id,
    customerName: orderData.customer_name,
    phone: orderData.phone,
    address: orderData.address,
    city: orderData.city,
    state: orderData.state,
    pincode: orderData.pincode,
    aadharPan: orderData.aadhar_pan,
    totalAmount: orderData.total_amount,
    paidAmount: orderData.paid_amount,
    notes: orderData.notes,
    items: items,
  }).catch((err) => console.error('[EMAIL ERROR] Failed to dispatch order email:', err));

  return { success: true, orderId: order.id };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { error } = await adminSupabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Failed to update order status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

export async function updateOrderPaymentDetails(
  orderId: string,
  paidAmount: number,
  totalAmount: number,
  status?: OrderStatus
) {
  const remainingAmount = Math.max(0, totalAmount - paidAmount);
  const updatePayload: any = {
    paid_amount: paidAmount,
    remaining_amount: remainingAmount,
  };
  if (status) {
    updatePayload.status = status;
  }

  let { error } = await adminSupabase
    .from('orders')
    .update(updatePayload)
    .eq('id', orderId);

  if (error) {
    // Fallback: update notes field with payment info if columns don't exist
    const noteUpdate = `[Payment Update] Paid: ₹${paidAmount} | Remaining: ₹${remainingAmount}`;
    const { data: currentOrder } = await adminSupabase
      .from('orders')
      .select('notes')
      .eq('id', orderId)
      .single();

    const existingNotes = currentOrder?.notes || '';
    const newNotes = existingNotes ? `${existingNotes} | ${noteUpdate}` : noteUpdate;
    
    const fallbackPayload: any = { notes: newNotes };
    if (status) fallbackPayload.status = status;

    const res2 = await adminSupabase
      .from('orders')
      .update(fallbackPayload)
      .eq('id', orderId);

    if (res2.error) {
      return { success: false, error: res2.error.message };
    }
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  return { success: true };
}

export async function getOrdersByPhone(phone: string) {
  const cleanPhone = phone.trim();
  if (!cleanPhone || cleanPhone.length < 10) return { success: false, data: [] };

  const { data, error } = await adminSupabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('phone', cleanPhone)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders by phone:', error);
    return { success: false, data: [] };
  }

  return { success: true, data: data || [] };
}

export async function getOrdersByQuery(query: string) {
  const clean = query.trim().toLowerCase();
  if (!clean) return { success: false, data: [] };

  const isPhone = /^\d{10}$/.test(clean);

  if (isPhone) {
    const { data, error } = await adminSupabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('phone', clean)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders by phone:', error);
      return { success: false, data: [] };
    }
    return { success: true, data: data || [] };
  }

  // If query is an Order ID or short hex code (e.g. E59B9B5F)
  const { data, error } = await adminSupabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching orders for ID search:', error);
    return { success: false, data: [] };
  }

  const cleanNoDash = clean.replace(/-/g, '');
  const filtered = (data || []).filter((ord) => {
    const ordIdLower = ord.id.toLowerCase();
    const ordIdNoDash = ordIdLower.replace(/-/g, '');
    const phone = (ord.phone || '').toLowerCase();
    const name = (ord.customer_name || '').toLowerCase();

    return (
      ordIdLower.includes(clean) ||
      ordIdNoDash.includes(cleanNoDash) ||
      phone.includes(clean) ||
      name.includes(clean)
    );
  });

  return { success: true, data: filtered };
}

export async function getOrders() {
  const { data, error } = await adminSupabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) return { success: false, data: null, error: error.message };
  return { success: true, data };
}

export async function getOrderById(orderId: string) {
  const { data, error } = await adminSupabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (error) return { success: false, data: null, error: error.message };
  return { success: true, data };
}

