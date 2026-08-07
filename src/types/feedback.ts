export interface Feedback {
  id: string;
  name: string;
  phone_or_order: string | null;
  rating: number;
  message: string;
  is_approved: boolean;
  created_at: string;
}
