'use server';

import { adminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateGlobalSettings(data: {
  shop_name: string;
  contact_number: string;
  global_discount_percentage: number;
  festival_banner_url?: string;
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
        festival_banner_url: data.festival_banner_url || null,
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
        festival_banner_url: data.festival_banner_url || null,
        is_shop_open: data.is_shop_open,
      });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/settings');
  return { success: true };
}
