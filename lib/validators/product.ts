// =============================================================
// Lassana LK — Zod Validation Schemas: Product
// =============================================================

import { z } from "zod";
import { UPLOAD_LIMITS } from "../constants";

/**
 * Product creation/edit form schema (Admin).
 */
export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name is too long"),

  slug: z
    .string()
    .min(2, "Slug is too short")
    .max(200, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),

  description: z.string().max(5000, "Description is too long").optional().or(z.literal("")),

  short_description: z.string().max(500, "Short description is too long").optional().or(z.literal("")),

  price: z.number().positive("Price must be greater than 0"),

  compare_price: z
    .number()
    .positive("Compare price must be greater than 0")
    .optional()
    .nullable(),

  sku: z
    .string()
    .max(50, "SKU is too long")
    .optional()
    .or(z.literal("")),

  stock_quantity: z.number().int().min(0, "Stock cannot be negative"),

  category_id: z.string().uuid("Invalid category").optional().nullable(),

  material: z.string().max(100).optional().or(z.literal("")),

  color: z.string().max(50).optional().or(z.literal("")),

  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_best_seller: z.boolean().default(false),
  is_customizable: z.boolean().default(false),
  is_active: z.boolean().default(true),

  seo_title: z.string().max(70, "SEO title should be under 70 characters").optional().or(z.literal("")),
  seo_description: z.string().max(160, "SEO description should be under 160 characters").optional().or(z.literal("")),

  tags: z.array(z.string()).optional().default([]),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

/**
 * Customization field schema (for the admin customization builder).
 */
export const customizationFieldSchema = z.object({
  field_name: z.string().min(1, "Field name is required"),
  field_label: z.string().min(1, "Field label is required"),
  field_type: z.enum(["text", "textarea", "select", "radio", "checkbox", "number"]),
  is_required: z.boolean().default(false),
  placeholder: z.string().optional().or(z.literal("")),
  max_length: z.number().int().positive().optional().nullable(),
  min_value: z.number().optional().nullable(),
  max_value: z.number().optional().nullable(),
  sort_order: z.number().int().default(0),
  options: z
    .array(
      z.object({
        label: z.string().min(1, "Option label is required"),
        value: z.string().min(1, "Option value is required"),
        price_modifier: z.number().default(0),
        sort_order: z.number().int().default(0),
      })
    )
    .optional()
    .default([]),
});

export type CustomizationFieldValues = z.infer<typeof customizationFieldSchema>;

/**
 * File upload validation.
 */
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => UPLOAD_LIMITS.allowedImageTypes.includes(file.type as typeof UPLOAD_LIMITS.allowedImageTypes[number]),
      "Only JPEG, PNG, WebP, and AVIF images are allowed"
    )
    .refine(
      (file) => file.size <= UPLOAD_LIMITS.imageMaxSize,
      `Image must be under ${UPLOAD_LIMITS.imageMaxSize / 1024 / 1024}MB`
    ),
  alt_text: z.string().max(200).optional(),
});

export const videoUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => UPLOAD_LIMITS.allowedVideoTypes.includes(file.type as typeof UPLOAD_LIMITS.allowedVideoTypes[number]),
      "Only MP4 and WebM videos are allowed"
    )
    .refine(
      (file) => file.size <= UPLOAD_LIMITS.videoMaxSize,
      `Video must be under ${UPLOAD_LIMITS.videoMaxSize / 1024 / 1024}MB`
    ),
  title: z.string().max(200).optional(),
});
