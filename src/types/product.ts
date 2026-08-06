export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  image_url: string | string[] | null;
  stock: number;
  discount: number;       // product-level discount %
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  categories?: Category | null;
}

export interface GlobalSettings {
  id: string;
  shop_name: string;
  contact_number: string;
  global_discount_percentage: number;
  price_list_url?: string | null;
  is_shop_open: boolean;
  updated_at?: string;
}
