'use server';

import { adminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { getNextInvoiceNumber } from './order.actions';

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

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function deleteIncompleteBillingOrder(orderId: string) {
  const { error: itemsError } = await adminSupabase.from('order_items').delete().eq('order_id', orderId);
  const { error: orderError } = await adminSupabase.from('orders').delete().eq('id', orderId);
  if (itemsError || orderError) {
    console.error('Could not fully remove incomplete POS order:', { itemsError, orderError });
  }
}

export async function createAdminBillingOrder(input: CreateBillingInput) {
  if (!input.customer_name || !input.phone || input.items.length === 0) {
    return { success: false, error: 'Customer name, phone number, and items are required.' };
  }

  const productIds = Array.from(new Set(input.items.map((item) => item.id).filter((id) => UUID_PATTERN.test(id))));
  const { data: inventoryProducts, error: inventoryError } = productIds.length > 0
    ? await adminSupabase.from('products').select('id, name, price, discount, stock').in('id', productIds)
    : { data: [], error: null };

  if (inventoryError) return { success: false, error: `Could not verify product inventory: ${inventoryError.message}` };

  const productsById = new Map((inventoryProducts ?? []).map((product) => [product.id, product]));
  const stockItems: { product_id: string; quantity: number }[] = [];
  for (const item of input.items) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return { success: false, error: `Invalid quantity for ${item.name}.` };
    }

    if (UUID_PATTERN.test(item.id)) {
      const product = productsById.get(item.id);
      if (!product) return { success: false, error: `${item.name} is no longer in the product inventory.` };
      if (quantity > product.stock) {
        return { success: false, error: `Only ${product.stock} units of ${product.name} are currently in stock.` };
      }
      stockItems.push({ product_id: product.id, quantity });
    }
  }

  const paidVal = input.paid_amount !== undefined ? input.paid_amount : input.total_amount;
  const remVal = Math.max(0, input.total_amount - paidVal);

  const notesText = `[POS BILLING] Payment: ${input.payment_mode.toUpperCase()}${input.aadhar_pan ? ` | Aadhar/PAN: ${input.aadhar_pan}` : ''}${input.gstin ? ` | Buyer GSTIN: ${input.gstin}` : ''}${remVal > 0 ? ` | Paid: ₹${paidVal} (Remaining: ₹${remVal})` : ''}${input.notes ? ` | ${input.notes}` : ''}`;

  const insertPayload: any = {
    invoice_number: await getNextInvoiceNumber(),
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
    .select('id, invoice_number, created_at')
    .single();

  if (res1.error) {
    delete insertPayload.aadhar_pan;
    delete insertPayload.paid_amount;
    delete insertPayload.remaining_amount;

    const res2 = await adminSupabase
      .from('orders')
      .insert(insertPayload)
      .select('id, invoice_number, created_at')
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

  const orderItemsData = input.items.map((item) => {
    const product = productsById.get(item.id);
    const itemPrice = product
      ? Number(product.price) * (1 - Number(product.discount || 0) / 100)
      : Number.isFinite(item.finalPrice)
      ? item.finalPrice
      : (Number.isFinite(item.price) ? item.price : 0);

    return {
      order_id: order.id,
      product_id: product?.id ?? null,
      product_name: String(product?.name || item.name || 'POS Cracker Item'),
      price: Number(itemPrice),
      quantity: Number(item.quantity),
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
    const { error: fallbackError } = await adminSupabase.from('order_items').insert(fallbackItems);

    if (fallbackError) {
      console.error('Error creating billing order items without product_id:', fallbackError);
      await deleteIncompleteBillingOrder(order.id);
      return { success: false, error: `Order was created, but its product list could not be saved: ${fallbackError.message}` };
    }
  }

  if (stockItems.length > 0) {
    const { error: stockError } = await adminSupabase.rpc('decrement_product_stock', { p_items: stockItems });
    if (stockError) {
      console.error('Error decrementing POS product inventory:', stockError);
      await deleteIncompleteBillingOrder(order.id);
      return { success: false, error: stockError.message.includes('Insufficient stock')
        ? 'Stock changed while this bill was being completed. Refresh the product list and try again.'
        : `Could not update product inventory: ${stockError.message}` };
    }
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin/products');
  revalidatePath('/admin/billing');
  revalidatePath('/admin');
  return { success: true, orderId: order.id, invoiceNumber: order.invoice_number, createdAt: order.created_at };
}

export async function updateAdminBillingOrder(input: {
  orderId: string;
  totalAmount: number;
  paidAmount: number;
  invoiceNumber?: string;
  items?: BillingOrderItem[];
}) {
  if (!input.orderId || (input.items !== undefined && input.items.length === 0)) {
    return { success: false, error: 'Order ID and at least one item are required.' };
  }

  const invoiceNumber = input.invoiceNumber?.trim();
  if (input.invoiceNumber !== undefined && (!invoiceNumber || invoiceNumber.length > 50)) {
    return { success: false, error: 'Invoice number must be between 1 and 50 characters.' };
  }

  const remainingAmount = Math.max(0, input.totalAmount - input.paidAmount);
  const orderUpdate = {
    total_amount: input.totalAmount,
    paid_amount: input.paidAmount,
    remaining_amount: remainingAmount,
    ...(invoiceNumber ? { invoice_number: invoiceNumber } : {}),
  };

  const { error: orderError } = await adminSupabase
    .from('orders')
    .update(orderUpdate)
    .eq('id', input.orderId);

  if (orderError) {
    console.error('Error updating billing order:', orderError);
    return { success: false, error: orderError.message };
  }

  if (input.items) {
    const { error: deleteError } = await adminSupabase
      .from('order_items')
      .delete()
      .eq('order_id', input.orderId);

    if (deleteError) {
      console.error('Error replacing billing order items:', deleteError);
      return { success: false, error: deleteError.message };
    }

    const { data: existingProducts } = await adminSupabase.from('products').select('id');
    const validProductIds = new Set(existingProducts?.map((product) => product.id) || []);
    const orderItems = input.items.map((item) => ({
      order_id: input.orderId,
      product_id: validProductIds.has(item.id) ? item.id : null,
      product_name: item.name,
      price: item.finalPrice,
      quantity: Math.max(1, item.quantity),
    }));

    const { error: itemsError } = await adminSupabase.from('order_items').insert(orderItems);
    if (itemsError) {
      console.error('Error inserting updated billing order items:', itemsError);
      return { success: false, error: itemsError.message };
    }
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin/billing');
  return { success: true };
}
