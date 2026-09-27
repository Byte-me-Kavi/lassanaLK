-- =============================================================
-- Lassana LK — Initial Database Schema
-- Run this in Supabase SQL Editor
-- =============================================================

-- ─── Drop Existing Tables (since they are empty) ──────────────────
DROP TABLE IF EXISTS order_item_customizations CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_customization_options CASCADE;
DROP TABLE IF EXISTS product_customization_fields CASCADE;
DROP TABLE IF EXISTS product_videos CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- ─── Categories ───────────────────────────────────────────────
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Products ─────────────────────────────────────────────────
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price NUMERIC(10,2) NOT NULL,
  compare_price NUMERIC(10,2),
  sku TEXT UNIQUE,
  stock_quantity INT DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  material TEXT,
  color TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_customizable BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Product Images ───────────────────────────────────────────
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Product Videos ───────────────────────────────────────────
CREATE TABLE product_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Product Customization Fields ─────────────────────────────
CREATE TABLE product_customization_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text','textarea','select','radio','checkbox','number')),
  is_required BOOLEAN DEFAULT false,
  placeholder TEXT,
  max_length INT,
  min_value NUMERIC,
  max_value NUMERIC,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Product Customization Options (for select/radio) ─────────
CREATE TABLE product_customization_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES product_customization_fields(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  price_modifier NUMERIC(10,2) DEFAULT 0,
  sort_order INT DEFAULT 0
);

-- ─── Orders ───────────────────────────────────────────────────
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_whatsapp TEXT,
  customer_email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  postal_code TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'COD',
  status TEXT DEFAULT 'PENDING' CHECK (status IN (
    'PENDING','CONFIRMED','PROCESSING','READY_TO_SHIP',
    'SHIPPED','DELIVERED','CANCELLED'
  )),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Order Items (snapshot of product at purchase time) ───────
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image_url TEXT,
  price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total NUMERIC(10,2) NOT NULL
);

-- ─── Order Item Customizations (snapshot) ─────────────────────
CREATE TABLE order_item_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  value TEXT NOT NULL
);

-- ─── Reviews ──────────────────────────────────────────────────
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  image_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Site Settings ────────────────────────────────────────────
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- Indexes for Performance
-- =============================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_new ON products(is_new);
CREATE INDEX idx_products_best_seller ON products(is_best_seller);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_videos_product ON product_videos(product_id);
CREATE INDEX idx_customization_fields_product ON product_customization_fields(product_id);
CREATE INDEX idx_customization_options_field ON product_customization_options(field_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_item_customizations_item ON order_item_customizations(order_item_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
CREATE INDEX idx_reviews_featured ON reviews(is_featured);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- =============================================================
-- Auto-update updated_at timestamps
-- =============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- Row Level Security (RLS)
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_customization_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for active categories
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

-- Public read access for active products
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Public read access for product images
CREATE POLICY "Public can view product images" ON product_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.is_active = true)
  );

-- Public read access for product videos
CREATE POLICY "Public can view product videos" ON product_videos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_videos.product_id AND products.is_active = true)
  );

-- Public read access for customization fields
CREATE POLICY "Public can view customization fields" ON product_customization_fields
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_customization_fields.product_id AND products.is_active = true)
  );

-- Public read access for customization options
CREATE POLICY "Public can view customization options" ON product_customization_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM product_customization_fields f
      JOIN products p ON p.id = f.product_id
      WHERE f.id = product_customization_options.field_id AND p.is_active = true
    )
  );

-- Public can create orders (COD)
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Public can create order items
CREATE POLICY "Public can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Public can create order item customizations
CREATE POLICY "Public can create order item customizations" ON order_item_customizations
  FOR INSERT WITH CHECK (true);

-- Public can view approved reviews
CREATE POLICY "Public can view approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Public can read site settings
CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT USING (true);

-- Authenticated users (admin) can do everything
-- Note: For production, restrict to specific admin role
CREATE POLICY "Admin full access to categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to product_images" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to product_videos" ON product_videos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to customization_fields" ON product_customization_fields
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to customization_options" ON product_customization_options
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to order_items" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to order_item_customizations" ON order_item_customizations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to reviews" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================================
-- Seed initial site settings
-- =============================================================
INSERT INTO site_settings (key, value) VALUES
  ('delivery_fee', '350'),
  ('free_delivery_threshold', '10000'),
  ('whatsapp_number', '94774671009'),
  ('site_name', 'Lassana LK'),
  ('site_tagline', 'Beautiful jewelry, made personal.');

-- =============================================================
-- Seed initial categories
-- =============================================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Name Pendants', 'name-pendants', 'Beautiful personalized name pendants crafted just for you.', 1),
  ('Necklaces', 'necklaces', 'Elegant necklaces for every occasion.', 2),
  ('Bracelets', 'bracelets', 'Stunning bracelets to complement your style.', 3),
  ('Rings', 'rings', 'Timeless rings for special moments.', 4),
  ('Earrings', 'earrings', 'Delicate earrings that add the perfect touch.', 5),
  ('Personalized Jewelry', 'personalized-jewelry', 'Make it uniquely yours with personalized designs.', 6),
  ('New Arrivals', 'new-arrivals', 'Discover our latest jewelry designs.', 7),
  ('Best Sellers', 'best-sellers', 'Our most loved and popular pieces.', 8),
  ('Gifts', 'gifts', 'Perfect gifts for your loved ones.', 9);
