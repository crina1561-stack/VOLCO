/*
  # Add Vendor Marketplace and Legal Pages

  1. New Tables
    - `vendor_applications`
    - `vendors`
    - `legal_pages`

  2. Security
    - RLS policies
*/

CREATE TABLE IF NOT EXISTS vendor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  company_cui text NOT NULL,
  company_address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  description text,
  website text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own vendor application"
  ON vendor_applications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own vendor application"
  ON vendor_applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  company_cui text NOT NULL UNIQUE,
  company_address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  description text,
  website text,
  logo_url text,
  rating numeric(3,2) DEFAULT 5.00,
  total_sales integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active vendors"
  ON vendors FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Vendors can update own profile"
  ON vendors FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS legal_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  meta_description text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published legal pages"
  ON legal_pages FOR SELECT
  TO public
  USING (is_published = true);

INSERT INTO legal_pages (slug, title, content, meta_description) VALUES
  ('termeni-conditii', 'Termeni și Condiții', 
   'TERMENI ȘI CONDIȚII DE UTILIZARE

Bine ați venit pe VOLCO.ro. Prin accesarea și utilizarea acestui site, acceptați să respectați următorii termeni.

1. DEFINIȚII
Site = platforma VOLCO.ro
Utilizator = orice persoană care accesează Site-ul
Client = orice persoană care efectuează o comandă

2. COMENZI ȘI PREȚURI
- Toate prețurile includ TVA
- Prețurile pot fi modificate fără notificare
- Confirmarea comenzii = acceptarea prețului

3. LIVRARE
- Livrare prin curieri parteneri
- Termenele sunt estimate
- Verificați coletul la primire

4. RETURNĂRI
- 30 de zile pentru returnare
- Produse în stare originală
- Costuri retur suportate de client

5. CONTACT
contact@volco.ro | +40 800 123 456',
   'Termeni și condiții VOLCO'),

  ('protectia-datelor', 'Protecția Datelor', 
   'POLITICA DE PROTECȚIE A DATELOR

VOLCO S.R.L. respectă GDPR și legislația română.

1. DATE PRELUCRATE
- Identificare, contact, plată
- Date navigare

2. SCOPURI
- Procesarea comenzilor
- Marketing
- Îmbunătățiri

3. DREPTURILE TALE
- Acces, rectificare, ștergere
- Restricționare, opoziție
- Portabilitate

4. CONTACT DPO
dpo@volco.ro | +40 800 123 456',
   'Protecția datelor VOLCO'),

  ('gdpr', 'GDPR', 
   'INFORMAȚII GDPR

În conformitate cu Regulamentul UE 2016/679:

OPERATOR: VOLCO S.R.L.
CUI: RO12345678
Contact: contact@volco.ro

DREPTURILE TALE:
✓ Acces la date
✓ Rectificare
✓ Ștergere
✓ Restricționare
✓ Opoziție
✓ Portabilitate

AUTORITATE: ANSPDCP
www.dataprotection.ro',
   'GDPR VOLCO'),

  ('anpc', 'A.N.P.C.', 
   'PROTECȚIA CONSUMATORILOR

VOLCO S.R.L.
CUI: RO12345678
Contact: contact@volco.ro

DREPTURI:
- Retragere 30 zile
- Garanție 24 luni
- Reparații în termen

ANPC:
B-dul Aviatorilor 72, București
Tel: +40 21 9551
www.anpc.ro

SOL: https://ec.europa.eu/consumers/odr',
   'ANPC - Protecția consumatorilor VOLCO')
ON CONFLICT (slug) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'vendor_id'
  ) THEN
    ALTER TABLE products ADD COLUMN vendor_id uuid REFERENCES vendors(id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_vendor_applications_user ON vendor_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_user ON vendors(user_id);
