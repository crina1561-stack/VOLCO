/*
  # Populate Categories and Subcategories

  1. Description
    - Populates the categories table with main categories and subcategories
    - Creates hierarchical structure with parent_id relationships
    - Adds icons and display order for proper menu organization

  2. Categories Structure
    - Main categories (parent_id = NULL):
      * Telefoane & Tablete
      * Laptopuri
      * Calculatoare & Componente
      * TV & Audio-Video
      * Gaming
      * Electrocasnice
      * Parfumuri & Cosmetice
      * Fashion & Accesorii
      * Rechizite Școlare
    
    - Each main category has subcategories with appropriate slugs and display order

  3. Notes
    - All categories have unique slugs for navigation
    - Display order ensures consistent menu appearance
    - Icons use emoji for visual identification
*/

DO $$
DECLARE
  telefoane_id uuid;
  laptopuri_id uuid;
  calculatoare_id uuid;
  tv_audio_id uuid;
  gaming_id uuid;
  electrocasnice_id uuid;
  parfumuri_id uuid;
  fashion_id uuid;
  rechizite_id uuid;
BEGIN
  -- Main Categories
  INSERT INTO categories (name, slug, icon, parent_id, display_order)
  VALUES 
    ('Telefoane & Tablete', 'telefoane-tablete', '📱', NULL, 1),
    ('Laptopuri', 'laptopuri', '💻', NULL, 2),
    ('Calculatoare & Componente', 'calculatoare-componente', '🖥️', NULL, 3),
    ('TV & Audio-Video', 'tv-audio-video', '📺', NULL, 4),
    ('Gaming', 'gaming', '🎮', NULL, 5),
    ('Electrocasnice', 'electrocasnice', '🏠', NULL, 6),
    ('Parfumuri & Cosmetice', 'parfumuri-cosmetice', '💄', NULL, 7),
    ('Fashion & Accesorii', 'fashion-accesorii', '👔', NULL, 8),
    ('Rechizite Școlare', 'rechizite-scolare', '📚', NULL, 9)
  ON CONFLICT (slug) DO NOTHING;

  -- Get IDs
  SELECT id INTO telefoane_id FROM categories WHERE slug = 'telefoane-tablete' LIMIT 1;
  SELECT id INTO laptopuri_id FROM categories WHERE slug = 'laptopuri' LIMIT 1;
  SELECT id INTO calculatoare_id FROM categories WHERE slug = 'calculatoare-componente' LIMIT 1;
  SELECT id INTO tv_audio_id FROM categories WHERE slug = 'tv-audio-video' LIMIT 1;
  SELECT id INTO gaming_id FROM categories WHERE slug = 'gaming' LIMIT 1;
  SELECT id INTO electrocasnice_id FROM categories WHERE slug = 'electrocasnice' LIMIT 1;
  SELECT id INTO parfumuri_id FROM categories WHERE slug = 'parfumuri-cosmetice' LIMIT 1;
  SELECT id INTO fashion_id FROM categories WHERE slug = 'fashion-accesorii' LIMIT 1;
  SELECT id INTO rechizite_id FROM categories WHERE slug = 'rechizite-scolare' LIMIT 1;

  -- Telefoane & Tablete subcategories
  IF telefoane_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, icon, parent_id, display_order)
    VALUES 
      ('Telefoane Mobile', 'telefoane-mobile', NULL, telefoane_id, 1),
      ('Tablete', 'tablete', NULL, telefoane_id, 2),
      ('Accesorii Telefoane', 'accesorii-telefoane', NULL, telefoane_id, 3),
      ('Smartwatch-uri', 'smartwatch-uri', NULL, telefoane_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Laptopuri subcategories
  IF laptopuri_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, icon, parent_id, display_order)
    VALUES 
      ('Laptopuri Gaming', 'laptopuri-gaming', NULL, laptopuri_id, 1),
      ('Laptopuri Business', 'laptopuri-business', NULL, laptopuri_id, 2),
      ('Ultrabook-uri', 'ultrabook-uri', NULL, laptopuri_id, 3),
      ('Accesorii Laptop', 'accesorii-laptop', NULL, laptopuri_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Calculatoare & Componente subcategories
  IF calculatoare_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, icon, parent_id, display_order)
    VALUES 
      ('Desktop PC', 'desktop-pc', NULL, calculatoare_id, 1),
      ('Placi Video', 'placi-video', NULL, calculatoare_id, 2),
      ('Procesoare', 'procesoare', NULL, calculatoare_id, 3),
      ('Memorii RAM', 'memorii-ram', NULL, calculatoare_id, 4),
      ('Placi de baza', 'placi-baza', NULL, calculatoare_id, 5),
      ('SSD & HDD', 'ssd-hdd', NULL, calculatoare_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- TV & Audio-Video subcategories
  IF tv_audio_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, icon, parent_id, display_order)
    VALUES 
      ('Televizoare', 'televizoare', NULL, tv_audio_id, 1),
      ('Soundbar-uri', 'soundbar-uri', NULL, tv_audio_id, 2),
      ('Boxe', 'boxe', NULL, tv_audio_id, 3),
      ('Casti', 'casti', NULL, tv_audio_id, 4),
      ('Proiectoare', 'proiectoare', NULL, tv_audio_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Gaming subcategories
  IF gaming_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, icon, parent_id, display_order)
    VALUES 
      ('Console', 'console', NULL, gaming_id, 1),
      ('Jocuri Console', 'jocuri-console', NULL, gaming_id, 2),
      ('Accesorii Gaming', 'accesorii-gaming', NULL, gaming_id, 3),
      ('Monitoare Gaming', 'monitoare-gaming', NULL, gaming_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Electrocasnice subcategories
  IF electrocasnice_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, icon, parent_id, display_order)
    VALUES 
      ('Electrocasnice Mari', 'electrocasnice-mari', NULL, electrocasnice_id, 1),
      ('Electrocasnice Mici', 'electrocasnice-mici', NULL, electrocasnice_id, 2),
      ('Aer Conditionat', 'aer-conditionat', NULL, electrocasnice_id, 3),
      ('Ingrijire personala', 'ingrijire-personala', NULL, electrocasnice_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Parfumuri & Cosmetice subcategories
  IF parfumuri_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, icon, parent_id, display_order)
    VALUES 
      ('Parfumuri Femei', 'parfumuri-femei', NULL, parfumuri_id, 1),
      ('Parfumuri Barbati', 'parfumuri-barbati', NULL, parfumuri_id, 2),
      ('Cosmetice', 'cosmetice', NULL, parfumuri_id, 3),
      ('Seturi cadou', 'seturi-cadou', NULL, parfumuri_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Fashion & Accesorii subcategories
  IF fashion_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, icon, parent_id, display_order)
    VALUES 
      ('Imbracaminte', 'imbracaminte', NULL, fashion_id, 1),
      ('Incaltaminte', 'incaltaminte', NULL, fashion_id, 2),
      ('Accesorii Fashion', 'accesorii-fashion', NULL, fashion_id, 3),
      ('Bijuterii', 'bijuterii', NULL, fashion_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Rechizite Școlare subcategories
  IF rechizite_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, icon, parent_id, display_order)
    VALUES 
      ('Ghiozdane & Genți', 'ghiozdane-genti', NULL, rechizite_id, 1),
      ('Cărți & Caiete', 'carti-caiete', NULL, rechizite_id, 2),
      ('Instrumente de Scris', 'instrumente-scris', NULL, rechizite_id, 3),
      ('Papetărie', 'papetarie', NULL, rechizite_id, 4),
      ('Accesorii Școlare', 'accesorii-scolare', NULL, rechizite_id, 5),
      ('Artă & Desen', 'arta-desen', NULL, rechizite_id, 6)
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
