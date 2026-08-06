'use server';

import { adminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateGlobalSettings(data: {
  shop_name: string;
  contact_number: string;
  global_discount_percentage: number;
  price_list_url?: string;
  is_shop_open: boolean;
}) {
  const { data: existing } = await adminSupabase
    .from('global_settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { error } = await adminSupabase
      .from('global_settings')
      .update({
        shop_name: data.shop_name,
        contact_number: data.contact_number,
        global_discount_percentage: data.global_discount_percentage,
        price_list_url: data.price_list_url || null,
        is_shop_open: data.is_shop_open,
      })
      .eq('id', existing.id);

    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await adminSupabase
      .from('global_settings')
      .insert({
        shop_name: data.shop_name,
        contact_number: data.contact_number,
        global_discount_percentage: data.global_discount_percentage,
        price_list_url: data.price_list_url || null,
        is_shop_open: data.is_shop_open,
      });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/settings');
  return { success: true };
}

export async function uploadPriceListPdf(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get('file') as File;
  if (!file || file.size === 0) return { success: false, error: 'No PDF file selected' };

  const ext = file.name.split('.').pop() || 'pdf';
  const filename = `price-list-${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await adminSupabase
    .storage
    .from('product-images')
    .upload(filename, buffer, { contentType: file.type || 'application/pdf', upsert: true });

  if (error || !data) return { success: false, error: error?.message || 'Upload failed' };

  const { data: { publicUrl } } = adminSupabase
    .storage
    .from('product-images')
    .getPublicUrl(data.path);

  return { success: true, url: publicUrl };
}
