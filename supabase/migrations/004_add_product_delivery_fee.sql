-- Add delivery_fee column to products table
ALTER TABLE products ADD COLUMN delivery_fee NUMERIC(10,2) DEFAULT 450.00;
