'use server';

import { adminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createCategory(name: string, description?: string) {
  const { error } = await adminSupabase
    .from('categories')
    .insert({ name, description: description || null });

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  revalidatePath('/admin/billing');
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function updateCategory(id: string, name: string, description?: string) {
  const { error } = await adminSupabase
    .from('categories')
    .update({ name, description: description || null })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  revalidatePath('/admin/billing');
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const { error } = await adminSupabase.from('categories').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  revalidatePath('/admin/billing');
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}
