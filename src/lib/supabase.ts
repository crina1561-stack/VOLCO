import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          discount_price: number | null;
          discount_percentage: number | null;
          category_id: string | null;
          brand_id: string | null;
          stock_quantity: number;
          is_available: boolean;
          is_featured: boolean;
          is_new: boolean;
          rating: number;
          review_count: number;
          views: number;
          sales_count: number;
          images: string[];
          specifications: Record<string, string>;
          created_at: string;
          updated_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          parent_id: string | null;
          icon: string | null;
          image: string | null;
          description: string | null;
          display_order: number;
          created_at: string;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo: string | null;
          created_at: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          order_number: string;
          status: string;
          total_amount: number;
          discount_amount: number;
          shipping_address: Record<string, string>;
          billing_address: Record<string, string>;
          payment_method: string;
          payment_status: string;
          stripe_payment_intent_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string | null;
          comment: string | null;
          is_verified_purchase: boolean;
          helpful_count: number;
          created_at: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          default_shipping_address: Record<string, string> | null;
          default_billing_address: Record<string, string> | null;
          newsletter_subscribed: boolean;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
