export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  status: OrderStatus;
  total_amount: number;
  aadhar_pan?: string | null;
  paid_amount?: number | null;
  remaining_amount?: number | null;
  notes: string | null;
  created_at: string;
  updated_at?: string;
  order_items?: OrderItem[];
}
