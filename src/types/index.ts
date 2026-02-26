export interface Product {
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
  average_rating: number;
  views: number;
  sales_count: number;
  warranty_months: number;
  images: string[];
  specifications: Record<string, string>;
  created_at: string;
  updated_at: string;
  category?: Category;
  brand?: Brand;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  type: string;
  value: string;
  price_adjustment: number;
  stock_quantity: number;
  sku: string | null;
  image: string | null;
  display_order: number;
  is_available: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon: string | null;
  image: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  user_profile?: {
    full_name: string | null;
  };
}

export interface Order {
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
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  discount_price: number | null;
  product_snapshot: Record<string, unknown>;
  created_at: string;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number | null;
  inStock: boolean;
  onSale: boolean;
  specifications: Record<string, string[]>;
}

export interface SortOption {
  value: string;
  label: string;
}
