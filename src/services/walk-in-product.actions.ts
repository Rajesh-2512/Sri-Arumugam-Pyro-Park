'use server';

import { adminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const walkInProductSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().optional(),
  price: z.number().min(0),
  category_id: z.string().uuid().nullable(),
  image_url: z.union([z.string(), z.array(z.string())]).nullable(),
  stock: z.number().int().min(0),
  discount: z.number().min(0).max(100),
  is_active: z.boolean(),
});

function parseWalkInProduct(formData: FormData) {
  let imageUrl: unknown = null;
  const rawImageUrl = String(formData.get('image_url') || '');
  if (rawImageUrl) {
    try { imageUrl = JSON.parse(rawImageUrl); } catch { imageUrl = rawImageUrl; }
  }

  return walkInProductSchema.safeParse({
    name: String(formData.get('name') || ''),
    description: String(formData.get('description') || ''),
    price: Number(formData.get('price') || 0),
    category_id: String(formData.get('category_id') || '') === 'none' ? null : String(formData.get('category_id') || ''),
    image_url: imageUrl,
    stock: Number(formData.get('stock') || 0),
    discount: Number(formData.get('discount') || 0),
    is_active: formData.get('is_active') === 'true',
  });
}

export async function createWalkInProduct(formData: FormData) {
  const parsed = parseWalkInProduct(formData);
  if (!parsed.success) return { success: false, error: 'Enter a valid name, price, and stock quantity.' };

  const { error } = await adminSupabase.from('walk_in_products').insert({
    name: parsed.data.name,
    description: parsed.data.description || null,
    price: parsed.data.price,
    category_id: parsed.data.category_id,
    image_url: parsed.data.image_url,
    stock: parsed.data.stock,
    discount: parsed.data.discount,
    is_active: parsed.data.is_active,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/walk-in-products');
  revalidatePath('/admin/billing');
  return { success: true };
}

export async function updateWalkInProduct(id: string, formData: FormData) {
  const parsed = parseWalkInProduct(formData);
  if (!parsed.success) return { success: false, error: 'Enter a valid name, price, and stock quantity.' };

  const { error } = await adminSupabase.from('walk_in_products').update({
    name: parsed.data.name,
    description: parsed.data.description || null,
    price: parsed.data.price,
    category_id: parsed.data.category_id,
    image_url: parsed.data.image_url,
    stock: parsed.data.stock,
    discount: parsed.data.discount,
    is_active: parsed.data.is_active,
  }).eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/walk-in-products');
  revalidatePath('/admin/billing');
  return { success: true };
}

export async function deleteWalkInProduct(id: string) {
  const { error } = await adminSupabase.from('walk_in_products').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/walk-in-products');
  revalidatePath('/admin/billing');
  return { success: true };
}
