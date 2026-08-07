'use server';

export interface GoogleReviewItem {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetailsResponse {
  name: string;
  rating: number;
  user_ratings_total: number;
  url: string;
  reviews: GoogleReviewItem[];
  isConfigured: boolean;
  error?: string;
}

// Sri Arumugam Pyro Park Google Place ID or fallback
const DEFAULT_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || 'ChIJ_____wEU2zsR7zCriaX0w_o';

export async function fetchLiveGoogleReviews(): Promise<GooglePlaceDetailsResponse> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || DEFAULT_PLACE_ID;

  if (!apiKey) {
    return {
      name: 'Sri Arumugam Pyro Park',
      rating: 4.8,
      user_ratings_total: 31,
      url: 'https://www.google.com/maps/place/Sri+Arumugam+Pyro+Park/data=!4m2!3m1!1s0x0:0xfac1f45c99ab30ef?sa=X&ved=1t:2428&ictx=111',
      reviews: [],
      isConfigured: false,
      error: 'GOOGLE_PLACES_API_KEY is missing in .env.local. Please add your Google Maps Places API Key.',
    };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total,url&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const json = await res.json();

    if (json.status !== 'OK' || !json.result) {
      console.error('Google Places API Error:', json.error_message || json.status);
      return {
        name: 'Sri Arumugam Pyro Park',
        rating: 4.8,
        user_ratings_total: 31,
        url: 'https://www.google.com/maps/place/Sri+Arumugam+Pyro+Park/data=!4m2!3m1!1s0x0:0xfac1f45c99ab30ef?sa=X&ved=1t:2428&ictx=111',
        reviews: [],
        isConfigured: true,
        error: json.error_message || `Google Places API status: ${json.status}`,
      };
    }

    return {
      name: json.result.name || 'Sri Arumugam Pyro Park',
      rating: json.result.rating || 4.8,
      user_ratings_total: json.result.user_ratings_total || 31,
      url: json.result.url || 'https://www.google.com/maps/place/Sri+Arumugam+Pyro+Park/data=!4m2!3m1!1s0x0:0xfac1f45c99ab30ef?sa=X&ved=1t:2428&ictx=111',
      reviews: json.result.reviews || [],
      isConfigured: true,
    };
  } catch (err: any) {
    console.error('Failed to fetch Google reviews:', err);
    return {
      name: 'Sri Arumugam Pyro Park',
      rating: 4.8,
      user_ratings_total: 31,
      url: 'https://www.google.com/maps/place/Sri+Arumugam+Pyro+Park/data=!4m2!3m1!1s0x0:0xfac1f45c99ab30ef?sa=X&ved=1t:2428&ictx=111',
      reviews: [],
      isConfigured: true,
      error: err.message || 'Connection error',
    };
  }
}
