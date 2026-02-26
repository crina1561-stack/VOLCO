/*
  # Add Reviews, Discount Codes, Admin and SEO Features

  1. New Tables
    - `product_reviews` - Customer reviews and ratings
    - `discount_codes` - Promo codes and campaigns
    - `admin_users` - Admin panel access
    - `seo_meta` - SEO metadata for pages
    - `product_imports` - Dropshipping import history

  2. Security
    - Enable RLS on all tables
    - Admin-only access for management tables
*/

CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  verified_purchase boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  images text[],
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id, order_id)
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews"
  ON product_reviews FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Users can create own reviews"
  ON product_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON product_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric(10,2) NOT NULL,
  min_purchase_amount numeric(10,2) DEFAULT 0,
  max_discount_amount numeric(10,2),
  usage_limit integer,
  usage_count integer DEFAULT 0,
  per_user_limit integer DEFAULT 1,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  is_active boolean DEFAULT true,
  applicable_categories uuid[],
  applicable_products uuid[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active discount codes"
  ON discount_codes FOR SELECT
  TO public
  USING (is_active = true AND (end_date IS NULL OR end_date > now()));

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

CREATE TABLE IF NOT EXISTS seo_meta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL CHECK (page_type IN ('home', 'product', 'category', 'static')),
  reference_id uuid,
  title text NOT NULL,
  description text NOT NULL,
  keywords text[],
  og_title text,
  og_description text,
  og_image text,
  canonical_url text,
  schema_markup jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE seo_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view SEO meta"
  ON seo_meta FOR SELECT
  TO public
  USING (true);

CREATE TABLE IF NOT EXISTS product_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_source text NOT NULL CHECK (import_source IN ('csv', 'api', 'xml', 'json')),
  file_url text,
  api_config jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_products integer DEFAULT 0,
  imported_products integer DEFAULT 0,
  failed_products integer DEFAULT 0,
  error_log jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage imports"
  ON product_imports FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE products ADD COLUMN average_rating numeric(3,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE products ADD COLUMN review_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'discount_code_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN discount_code_id uuid REFERENCES discount_codes(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN discount_amount numeric(10,2) DEFAULT 0;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_status ON product_reviews(status);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_seo_meta_page_type ON seo_meta(page_type);
CREATE INDEX IF NOT EXISTS idx_seo_meta_reference_id ON seo_meta(reference_id);
