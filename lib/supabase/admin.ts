// =============================================================
// Lassana LK — Supabase Admin Client (Service Role)
// =============================================================

import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client with the service-role key.
 *
 * ⚠️ SERVER-SIDE ONLY — NEVER import this in client components.
 *
 * This bypasses Row Level Security (RLS) and should only be used
 * for trusted server operations like:
 * - Creating orders
 * - Updating inventory
 * - Admin operations
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "These must be set in environment variables."
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
