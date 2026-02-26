/*
  # Add Product Variants

  1. New Tables
    - `product_variants` - stores different variants (color, storage, etc.) for products
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `name` (text) - e.g., "128GB Space Gray", "256GB Silver"
      - `type` (text) - e.g., "storage", "color"
      - `value` (text) - e.g., "128GB", "Space Gray"
      - `price_adjustment` (decimal) - price difference from base product
      - `stock_quantity` (integer)
      - `sku` (text, unique)
      - `image` (text) - optional variant-specific image
      - `display_order` (integer)
      - `is_available` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `product_variants` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  value text NOT NULL,
  price_adjustment decimal(10,2) DEFAULT 0,
  stock_quantity integer DEFAULT 0,
  sku text UNIQUE,
  image text,
  display_order integer DEFAULT 0,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product variants"
  ON product_variants
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_type ON product_variants(type);
CREATE INDEX IF NOT EXISTS idx_product_variants_available ON product_variants(is_available);
