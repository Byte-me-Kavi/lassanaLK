// =============================================================
// Lassana LK — COD Order Management Supabase Client
// =============================================================

import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for the COD Order Management system.
 *
 * This is a separate Supabase project used for waybill tracking
 * and courier order management. When a customer places an order
 * on Lassana LK, we also insert a record into this system so
 * it auto-assigns a waybill number.
 *
 * ⚠️ SERVER-SIDE ONLY — uses the anon key with service-level
 *    access configured via RLS policies on the COD database.
 */
export function createCodClient() {
  const url = process.env.COD_SUPABASE_URL;
  const key = process.env.COD_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing COD_SUPABASE_URL or COD_SUPABASE_SERVICE_ROLE_KEY. " +
        "These must be set in environment variables for order management integration."
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
