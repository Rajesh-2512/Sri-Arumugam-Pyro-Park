export interface GiftBoxItemContent {
  name: string;
  quantity: number | string;
  image_url?: string;
}

export interface GiftBox {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discount: number;
  images: string[];
  contents: GiftBoxItemContent[];
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
}
