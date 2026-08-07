export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          category_id: string | null;
          image_url: string | null;
          stock: number;
          discount: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          category_id?: string | null;
          image_url?: string | null;
          stock?: number;
          discount?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          category_id?: string | null;
          image_url?: string | null;
          stock?: number;
          discount?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      global_settings: {
        Row: {
          id: string;
          shop_name: string;
          contact_number: string;
          global_discount_percentage: number;
          price_list_url: string | null;
          is_shop_open: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shop_name?: string;
          contact_number?: string;
          global_discount_percentage?: number;
          price_list_url?: string | null;
          is_shop_open?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          shop_name?: string;
          contact_number?: string;
          global_discount_percentage?: number;
          price_list_url?: string | null;
          is_shop_open?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      gift_boxes: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          discount: number;
          images: Json;
          contents: Json;
          stock: number;
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          discount?: number;
          images?: Json;
          contents?: Json;
          stock?: number;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          discount?: number;
          images?: Json;
          contents?: Json;
          stock?: number;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          phone: string;
          address: string;
          city: string;
          pincode: string;
          status: 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
          total_amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          phone: string;
          address: string;
          city?: string;
          pincode?: string;
          status?: 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
          total_amount: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          phone?: string;
          address?: string;
          city?: string;
          pincode?: string;
          status?: 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
          total_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          price: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          price: number;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          price?: number;
          quantity?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      feedbacks: {
        Row: {
          id: string;
          name: string;
          phone_or_order: string | null;
          rating: number;
          message: string;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone_or_order?: string | null;
          rating?: number;
          message: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone_or_order?: string | null;
          rating?: number;
          message?: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      order_status: 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
