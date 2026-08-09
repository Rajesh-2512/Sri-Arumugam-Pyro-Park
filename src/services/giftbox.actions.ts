'use server';

import { adminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { GiftBox } from '@/types/giftbox';

export async function getGiftBoxes(): Promise<{ success: boolean; data: GiftBox[]; error?: string }> {
  const { data, error } = await adminSupabase
    .from('gift_boxes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching gift boxes:', error);
    return { success: false, data: [], error: error.message };
  }

  const formatted: GiftBox[] = (data || []).map((item: any) => ({
    ...item,
    images: Array.isArray(item.images) ? item.images : typeof item.images === 'string' ? JSON.parse(item.images) : [],
    contents: Array.isArray(item.contents) ? item.contents : typeof item.contents === 'string' ? JSON.parse(item.contents) : [],
  }));

  return { success: true, data: formatted };
}

export async function getActiveGiftBoxes(): Promise<{ success: boolean; data: GiftBox[]; error?: string }> {
  const { data, error } = await adminSupabase
    .from('gift_boxes')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active gift boxes:', error);
    return { success: false, data: [], error: error.message };
  }

  const formatted: GiftBox[] = (data || []).map((item: any) => ({
    ...item,
    images: Array.isArray(item.images) ? item.images : typeof item.images === 'string' ? JSON.parse(item.images) : [],
    contents: Array.isArray(item.contents) ? item.contents : typeof item.contents === 'string' ? JSON.parse(item.contents) : [],
  }));

  return { success: true, data: formatted };
}

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
    || `box-${Date.now().toString(36)}`;
}

export async function createGiftBox(input: {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  discount: number;
  stock: number;
  images: string[];
  contents: { name: string; quantity: string | number; image_url?: string }[];
  is_active?: boolean;
  is_featured?: boolean;
}) {
  const autoSlug = slugify(input.slug || input.name || '');

  const payload = {
    name: input.name,
    slug: autoSlug,
    description: input.description || null,
    price: input.price,
    discount: input.discount || 0,
    stock: input.stock || 100,
    images: input.images as any,
    contents: input.contents as any,
    is_active: input.is_active ?? true,
    is_featured: input.is_featured ?? false,
  };

  const { data, error } = await adminSupabase.from('gift_boxes').insert(payload).select().single();

  if (error) {
    console.error('Create gift box error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/gift-boxes');
  return { success: true, data };
}

export async function updateGiftBox(id: string, input: Partial<GiftBox>) {
  const payload: any = { ...input };
  delete payload.id;
  delete payload.created_at;

  const { error } = await adminSupabase.from('gift_boxes').update(payload).eq('id', id);

  if (error) {
    console.error('Update gift box error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/gift-boxes');
  return { success: true };
}

export async function deleteGiftBox(id: string) {
  const { error } = await adminSupabase.from('gift_boxes').delete().eq('id', id);

  if (error) {
    console.error('Delete gift box error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/gift-boxes');
  return { success: true };
}
