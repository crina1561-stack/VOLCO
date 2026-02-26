/*
  # Add Missing Premium Features for VOLCO E-commerce

  1. New Tables
    - `email_verifications` - Email verification tokens
    - `invoices` - Invoice management
    - `product_warranties` - Warranty information
    - `user_addresses` - Saved addresses
    - `newsletters` - Newsletter subscriptions

  2. Modifications
    - Add email verification to user_profiles
    - Add tracking and invoice fields to orders
    - Add warranty and SKU to products

  3. Security
    - Enable RLS on all tables
    - Proper access policies
*/

CREATE TABLE IF NOT EXISTS email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'email_verifications' AND policyname = 'Users can view own verification tokens'
  ) THEN
    ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can view own verification tokens"
      ON email_verifications FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  invoice_number text NOT NULL UNIQUE,
  invoice_date timestamptz DEFAULT now(),
  due_date timestamptz,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  tax_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  invoice_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  pdf_url text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'invoices' AND policyname = 'Users can view own invoices'
  ) THEN
    ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can view own invoices"
      ON invoices FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM orders
          WHERE orders.id = invoices.order_id
          AND orders.user_id = auth.uid()
        )
      );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS product_warranties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warranty_duration_months integer NOT NULL DEFAULT 24,
  warranty_type text NOT NULL DEFAULT 'manufacturer',
  warranty_terms text,
  extended_warranty_available boolean DEFAULT false,
  extended_warranty_price numeric(10,2),
  extended_warranty_months integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'product_warranties' AND policyname = 'Anyone can view warranties'
  ) THEN
    ALTER TABLE product_warranties ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can view warranties"
      ON product_warranties FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS user_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address_type text NOT NULL DEFAULT 'shipping',
  full_name text NOT NULL,
  phone text NOT NULL,
  street text NOT NULL,
  city text NOT NULL,
  county text NOT NULL,
  postal_code text NOT NULL,
  country text DEFAULT 'România',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_addresses' AND policyname = 'Users can manage own addresses'
  ) THEN
    ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage own addresses"
      ON user_addresses FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  subscribed boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'newsletters'
  ) THEN
    ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can subscribe to newsletter"
      ON newsletters FOR INSERT
      TO public
      WITH CHECK (true);
    CREATE POLICY "Users can manage own newsletter subscription"
      ON newsletters FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email_verified boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'email_verified_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email_verified_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'invoice_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN invoice_number text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tracking_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shipped_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipped_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivered_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivered_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'warranty_months'
  ) THEN
    ALTER TABLE products ADD COLUMN warranty_months integer DEFAULT 24;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'sku'
  ) THEN
    ALTER TABLE products ADD COLUMN sku text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'warranty_id'
  ) THEN
    ALTER TABLE order_items ADD COLUMN warranty_id uuid REFERENCES product_warranties(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'extended_warranty'
  ) THEN
    ALTER TABLE order_items ADD COLUMN extended_warranty boolean DEFAULT false;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_product_warranties_product_id ON product_warranties(product_id);
