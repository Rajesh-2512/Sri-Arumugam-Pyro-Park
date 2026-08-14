'use server';

import { adminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

function slugify(text: string): string {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    || `item-${Date.now().toString(36)}`;
}

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0),
  category_id: z.string().uuid().nullable().optional(),
  image_url: z.union([z.string(), z.array(z.string())]).nullable().optional(),
  stock: z.number().int().min(0),
  discount: z.number().min(0).max(100),
  is_active: z.boolean().default(true),
});

export async function createProduct(formData: FormData) {
  const rawCategoryId = formData.get('category_id') as string;
  const rawImageUrl = formData.get('image_url') as string;

  let imageUrlParsed: any = null;
  if (rawImageUrl) {
    try {
      imageUrlParsed = JSON.parse(rawImageUrl);
    } catch {
      imageUrlParsed = rawImageUrl;
    }
  }

  const rawName = (formData.get('name') as string) || '';
  const rawSlug = (formData.get('slug') as string) || '';
  const autoSlug = slugify(rawSlug || rawName);

  const data = {
    name: rawName,
    slug: autoSlug,
    description: (formData.get('description') as string) || undefined,
    price: parseFloat(formData.get('price') as string) || 0,
    category_id: rawCategoryId && rawCategoryId !== 'none' ? rawCategoryId : null,
    image_url: imageUrlParsed,
    stock: parseInt(formData.get('stock') as string) || 0,
    discount: parseFloat(formData.get('discount') as string) || 0,
    is_active: formData.get('is_active') === 'true',
  };

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.flatten() };

  const { error } = await adminSupabase.from('products').insert({
    name: parsed.data.name,
    slug: autoSlug,
    description: parsed.data.description || null,
    price: parsed.data.price,
    category_id: parsed.data.category_id || null,
    image_url: (parsed.data.image_url || null) as any,
    stock: parsed.data.stock,
    discount: parsed.data.discount,
    is_active: parsed.data.is_active,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/products');
  revalidatePath('/admin/billing');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const rawCategoryId = formData.get('category_id') as string;
  const rawImageUrl = formData.get('image_url') as string;

  let imageUrlParsed: any = null;
  if (rawImageUrl) {
    try {
      imageUrlParsed = JSON.parse(rawImageUrl);
    } catch {
      imageUrlParsed = rawImageUrl;
    }
  }

  const rawName = (formData.get('name') as string) || '';
  const rawSlug = (formData.get('slug') as string) || '';
  const autoSlug = slugify(rawSlug || rawName);

  const data = {
    name: rawName,
    slug: autoSlug,
    description: (formData.get('description') as string) || undefined,
    price: parseFloat(formData.get('price') as string) || 0,
    category_id: rawCategoryId && rawCategoryId !== 'none' ? rawCategoryId : null,
    image_url: imageUrlParsed,
    stock: parseInt(formData.get('stock') as string) || 0,
    discount: parseFloat(formData.get('discount') as string) || 0,
    is_active: formData.get('is_active') === 'true',
  };

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.flatten() };

  const { error } = await adminSupabase.from('products').update({
    name: parsed.data.name,
    slug: autoSlug,
    description: parsed.data.description || null,
    price: parsed.data.price,
    category_id: parsed.data.category_id || null,
    image_url: (parsed.data.image_url || null) as any,
    stock: parsed.data.stock,
    discount: parsed.data.discount,
    is_active: parsed.data.is_active,
  }).eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/products');
  revalidatePath('/admin/billing');
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteProduct(id: string) {
  const { error } = await adminSupabase.from('products').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/products');
  revalidatePath('/admin/billing');
  revalidatePath('/admin');
  return { success: true };
}

export async function uploadProductImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get('file') as File;
  if (!file || file.size === 0) return { success: false, error: 'No file provided' };

  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await adminSupabase
    .storage
    .from('product-images')
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error || !data) return { success: false, error: error?.message || 'Upload failed' };

  const { data: { publicUrl } } = adminSupabase
    .storage
    .from('product-images')
    .getPublicUrl(data.path);

  return { success: true, url: publicUrl };
}
