/*
  # Add Info Pages and Favorites System

  1. New Tables
    - `favorites` - User favorite products
    
  2. Updates
    - Add info pages to legal_pages table
*/

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON favorites(product_id);

INSERT INTO legal_pages (slug, title, content, meta_description) VALUES
  ('despre-noi', 'Despre Noi', 
   'DESPRE VOLCO

Bine ați venit la VOLCO - destinația ta de încredere pentru electronice, tehnologie și lifestyle premium.

CINE SUNTEM

VOLCO este unul dintre cele mai mari magazine online din România, specializat în vânzarea de produse electronice, tehnologie IT, electrocasnice și multe altele. Cu o experiență de peste 10 ani în domeniu, ne-am construit reputația pe baza calității produselor și serviciilor excepționale oferite clienților noștri.

MISIUNEA NOASTRĂ

Misiunea noastră este să oferim clienților noștri acces la cele mai noi și mai performante produse tehnologice, la prețuri competitive, cu livrare rapidă și un serviciu clienți de excepție.

VALORILE NOASTRE

✓ Calitate garantată - Doar produse originale de la branduri premium
✓ Prețuri competitive - Cele mai bune oferte de pe piață
✓ Livrare rapidă - 24-48 ore în toată România
✓ Service profesional - Asistență tehnică și garanție extinsă
✓ Satisfacție client - Peste 500.000 de clienți mulțumiți

DE CE SĂ ALEGI VOLCO?

- Peste 100.000 de produse în stoc
- Livrare gratuită pentru comenzi peste 500 RON
- Plată în rate fără dobândă
- Deschidere colet la livrare
- Retur în 30 de zile
- Garanție extinsă disponibilă
- Program non-stop online
- Asistență telefonică Luni-Vineri 09:00-18:00

ECHIPA NOASTRĂ

Echipa VOLCO este formată din specialiști pasionați de tehnologie, care sunt mereu la curent cu cele mai noi tendințe și inovații din domeniu. Suntem aici pentru a te ajuta să faci alegerea potrivită!

PARTENERI

Colaborăm cu cele mai importante branduri internaționale: Apple, Samsung, ASUS, Dell, HP, Lenovo, Sony, LG, Bosch, Philips și multe altele.

CONTACT

Sediu: București, România
Email: contact@volco.ro
Telefon: +40 800 123 456

Data înființării: 2014',
   'Despre VOLCO - Magazin online de electronice și tehnologie'),

  ('contact', 'Contact', 
   'CONTACTEAZĂ-NE

Suntem aici pentru tine! Echipa VOLCO este disponibilă pentru a răspunde întrebărilor tale.

INFORMAȚII DE CONTACT

📧 Email: contact@volco.ro
📞 Telefon: +40 800 123 456
📱 WhatsApp: +40 700 123 456
⏰ Program: Luni-Vineri 09:00-18:00

DEPARTAMENTE

🛒 Comenzi: comenzi@volco.ro
💳 Facturare: facturare@volco.ro
📦 Livrări: livrari@volco.ro
🔧 Service: service@volco.ro
👥 Vânzători: marketplace@volco.ro

SEDIU CENTRAL

VOLCO S.R.L.
Str. Tehnologiei nr. 123
Sector 1, București
România

SHOWROOM

Luni-Vineri: 10:00-20:00
Sâmbătă: 10:00-18:00
Duminică: Închis

SOCIAL MEDIA

Facebook: /volco.romania
Instagram: @volco.ro
Twitter: @volco_ro

SUGESTII ȘI RECLAMAȚII

Pentru sugestii sau reclamații: reclamatii@volco.ro
Răspundem în maxim 24 de ore!

CARIERE

Vrei să te alături echipei VOLCO?
Trimite CV-ul la: cariere@volco.ro',
   'Contact VOLCO - Telefon, email, adresă'),

  ('politica-confidentialitate', 'Politica de Confidențialitate', 
   'POLITICA DE CONFIDENȚIALITATE

VOLCO S.R.L. respectă confidențialitatea datelor tale personale.

1. COLECTAREA DATELOR

Colectăm următoarele categorii de date:
- Date de identificare (nume, prenume)
- Date de contact (email, telefon, adresă)
- Date de plată (procesate securizat)
- Date de navigare (cookies)

2. UTILIZAREA DATELOR

Utilizăm datele pentru:
- Procesarea comenzilor
- Comunicare cu clienții
- Îmbunătățirea serviciilor
- Marketing (cu consimțământ)

3. PARTAJAREA DATELOR

Datele pot fi partajate cu:
- Curieri (pentru livrare)
- Procesatori de plăți (Stripe)
- Autorități (la cerere legală)

4. SECURITATEA DATELOR

Implementăm măsuri de securitate:
- Criptare SSL/TLS
- Acces restricționat
- Backup regulat
- Monitorizare continuă

5. DREPTURILE TALE

- Acces la date
- Rectificare
- Ștergere
- Opoziție
- Portabilitate

6. COOKIES

Utilizăm cookies pentru funcționare optimă.
Poți gestiona cookies din browser.

7. MODIFICĂRI

Ne rezervăm dreptul de a modifica această politică.
Modificările vor fi publicate pe site.

8. CONTACT

dpo@volco.ro | +40 800 123 456',
   'Politica de confidențialitate VOLCO')
ON CONFLICT (slug) DO NOTHING;
