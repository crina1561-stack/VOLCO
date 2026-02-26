/*
  # Add Complete Shipping and Tracking System

  1. New Tables
    - `romanian_cities` - Cities and postal codes
    - `courier_services` - Courier companies
    - `shipment_tracking` - AWB tracking
    - `saved_payment_methods` - Stored cards
    - `order_tracking_events` - Tracking history

  2. Updates
    - Add specifications to products
    - Add courier fields to orders
*/

CREATE TABLE IF NOT EXISTS romanian_cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  county text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  is_capital boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_romanian_cities_county ON romanian_cities(county);
CREATE INDEX IF NOT EXISTS idx_romanian_cities_city ON romanian_cities(city);
CREATE INDEX IF NOT EXISTS idx_romanian_cities_postal ON romanian_cities(postal_code);

ALTER TABLE romanian_cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cities"
  ON romanian_cities FOR SELECT
  TO public
  USING (true);

INSERT INTO romanian_cities (county, city, postal_code, is_capital) VALUES
  ('București', 'București Sector 1', '010001', true),
  ('București', 'București Sector 2', '020001', true),
  ('București', 'București Sector 3', '030001', true),
  ('București', 'București Sector 4', '040001', true),
  ('București', 'București Sector 5', '050001', true),
  ('București', 'București Sector 6', '060001', true),
  ('Cluj', 'Cluj-Napoca', '400001', true),
  ('Timiș', 'Timișoara', '300001', true),
  ('Iași', 'Iași', '700001', true),
  ('Constanța', 'Constanța', '900001', true),
  ('Brașov', 'Brașov', '500001', true),
  ('Sibiu', 'Sibiu', '550001', true),
  ('Prahova', 'Ploiești', '100001', true),
  ('Argeș', 'Pitești', '110001', true),
  ('Bacău', 'Bacău', '600001', true),
  ('Dolj', 'Craiova', '200001', true),
  ('Galați', 'Galați', '800001', true),
  ('Arad', 'Arad', '310001', true),
  ('Mureș', 'Târgu Mureș', '540001', true),
  ('Bihor', 'Oradea', '410001', true)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS courier_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  tracking_url text,
  api_endpoint text,
  is_active boolean DEFAULT true,
  logo_url text,
  estimated_days integer DEFAULT 2,
  price_per_kg numeric(10,2) DEFAULT 15.00,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courier_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active couriers"
  ON courier_services FOR SELECT
  TO public
  USING (is_active = true);

INSERT INTO courier_services (name, code, tracking_url, estimated_days, price_per_kg) VALUES
  ('FAN Courier', 'FAN', 'https://www.fancourier.ro/awb-tracking/?awb={AWB}', 1, 15.00),
  ('Cargus', 'CARGUS', 'https://www.cargus.ro/tracking/?awb={AWB}', 2, 14.00),
  ('DPD Romania', 'DPD', 'https://tracking.dpd.de/parcelstatus?query={AWB}', 2, 16.00),
  ('GLS Romania', 'GLS', 'https://gls-group.eu/RO/ro/urmarire-colet?match={AWB}', 2, 15.50),
  ('Sameday', 'SAMEDAY', 'https://sameday.ro/awb-tracking?awb={AWB}', 1, 18.00)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS shipment_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  courier_id uuid REFERENCES courier_services(id),
  awb_number text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed')),
  current_location text,
  estimated_delivery timestamptz,
  delivered_at timestamptz,
  recipient_name text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shipment_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shipments"
  ON shipment_tracking FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = shipment_tracking.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS saved_payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id text NOT NULL,
  card_brand text,
  card_last4 text,
  card_exp_month integer,
  card_exp_year integer,
  is_default boolean DEFAULT false,
  billing_name text,
  billing_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE saved_payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own payment methods"
  ON saved_payment_methods FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS order_tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  description text NOT NULL,
  location text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_tracking_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order events"
  ON order_tracking_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_tracking_events.order_id
      AND orders.user_id = auth.uid()
    )
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'courier_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN courier_id uuid REFERENCES courier_services(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'awb_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN awb_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_method_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_method_id uuid REFERENCES saved_payment_methods(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'invoice_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN invoice_number text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'specifications'
  ) THEN
    ALTER TABLE products ADD COLUMN specifications jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_shipment_tracking_order ON shipment_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_shipment_tracking_awb ON shipment_tracking(awb_number);
CREATE INDEX IF NOT EXISTS idx_saved_payment_user ON saved_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_events_order ON order_tracking_events(order_id);
