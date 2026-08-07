import { NextResponse } from 'next/server';
import { fetchLiveGoogleReviews } from '@/services/google-reviews';

export async function GET() {
  const data = await fetchLiveGoogleReviews();
  return NextResponse.json(data);
}
