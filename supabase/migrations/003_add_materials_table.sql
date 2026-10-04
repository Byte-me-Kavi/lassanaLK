-- ─── Materials ─────────────────────────────────────────────────
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and allow public reads
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on materials" ON materials FOR SELECT TO public USING (true);

-- Insert initial materials
INSERT INTO materials (name, slug) VALUES 
('18k Gold Plated', '18k-gold-plated'),
('Sterling Silver', 'sterling-silver'),
('Rose Gold', 'rose-gold'),
('Stainless Steel', 'stainless-steel'),
('Brass', 'brass'),
('High Quality Material', 'high-quality-material');

-- Add material_id to products
ALTER TABLE products ADD COLUMN material_id UUID REFERENCES materials(id) ON DELETE SET NULL;

-- Migrate existing material data if possible
UPDATE products p
SET material_id = m.id
FROM materials m
WHERE 
  p.material = m.name OR 
  p.material = m.slug OR 
  (p.material ILIKE '%gold%' AND m.slug = '18k-gold-plated') OR
  (p.material ILIKE '%silver%' AND m.slug = 'sterling-silver');

-- Drop old text column
ALTER TABLE products DROP COLUMN material;
