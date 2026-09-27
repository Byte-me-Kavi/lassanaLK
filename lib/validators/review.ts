// =============================================================
// Lassana LK — Zod Validation Schemas: Review
// =============================================================

import { z } from "zod";

/**
 * Review creation schema (Admin).
 */
export const reviewFormSchema = z.object({
  customer_name: z
    .string()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Name is too long"),

  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),

  review_text: z
    .string()
    .max(1000, "Review text must be under 1000 characters")
    .optional()
    .or(z.literal("")),

  product_id: z.string().uuid("Invalid product").optional().nullable(),

  is_approved: z.boolean().default(false),
  is_featured: z.boolean().default(false),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

/**
 * Category form schema (Admin).
 */
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Name is too long"),

  slug: z
    .string()
    .min(2, "Slug is too short")
    .max(100, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),

  description: z
    .string()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),

  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
