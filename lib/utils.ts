// =============================================================
// Lassana LK — Utility Functions
// =============================================================

// Re-export cn from the shadcn "cn" package
export { cn } from "cn";

/**
 * Format a number as Sri Lankan Rupee price.
 * @example formatPrice(4500) => "Rs. 4,500.00"
 * @example formatPrice(4500, false) => "Rs. 4,500"
 */
export function formatPrice(amount: number, showDecimals = true): string {
  const formatted = new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
  return `Rs. ${formatted}`;
}

/**
 * Generate a URL-friendly slug from a string.
 * @example generateSlug("Personalized Name Pendant") => "personalized-name-pendant"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate an order number in format: LLK-YYYYMMDD-XXXX
 * @param sequenceNumber - The daily sequence number
 */
export function generateOrderNumber(sequenceNumber: number): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(sequenceNumber).padStart(4, "0");
  return `LLK-${date}-${seq}`;
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Capitalize first letter of a string.
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Delay utility for async operations.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a value is a non-empty string.
 */
export function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Get the absolute URL for a path (useful for OG images, etc.)
 */
export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
