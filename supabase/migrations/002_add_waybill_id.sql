-- =============================================================
-- Migration: Add waybill_id column to orders table
-- =============================================================
-- Stores the waybill number auto-assigned by the COD Order
-- Management System when an order is placed.
-- =============================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS waybill_id BIGINT;

-- Optional index for quick lookups by waybill
CREATE INDEX IF NOT EXISTS idx_orders_waybill_id ON orders(waybill_id);
