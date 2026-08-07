'use server';

import { adminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { Feedback } from '@/types/feedback';

export interface SubmitFeedbackInput {
  name: string;
  phone_or_order?: string;
  rating: number;
  message: string;
}

export async function submitFeedback(input: SubmitFeedbackInput) {
  if (!input.name || !input.name.trim()) {
    return { success: false, error: 'Name is required' };
  }
  if (!input.message || !input.message.trim()) {
    return { success: false, error: 'Feedback message is required' };
  }

  const { data, error } = await adminSupabase
    .from('feedbacks')
    .insert({
      name: input.name.trim(),
      phone_or_order: input.phone_or_order ? input.phone_or_order.trim() : null,
      rating: Math.max(1, Math.min(5, input.rating || 5)),
      message: input.message.trim(),
      is_approved: true,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/feedbacks');
  revalidatePath('/track-order');
  return { success: true, data: data as Feedback };
}

export async function getFeedbacks() {
  const { data, error } = await adminSupabase
    .from('feedbacks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching feedbacks:', error);
    return { success: false, data: [] as Feedback[], error: error.message };
  }

  return { success: true, data: (data || []) as Feedback[] };
}

export async function getApprovedFeedbacks() {
  const { data, error } = await adminSupabase
    .from('feedbacks')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching approved feedbacks:', error);
    return { success: false, data: [] as Feedback[] };
  }

  return { success: true, data: (data || []) as Feedback[] };
}

export async function toggleFeedbackApproval(id: string, is_approved: boolean) {
  const { error } = await adminSupabase
    .from('feedbacks')
    .update({ is_approved })
    .eq('id', id);

  if (error) {
    console.error('Error updating feedback status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/feedbacks');
  return { success: true };
}

export async function deleteFeedback(id: string) {
  const { error } = await adminSupabase
    .from('feedbacks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting feedback:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/feedbacks');
  return { success: true };
}
