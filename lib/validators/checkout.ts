// =============================================================
// Lassana LK — Zod Validation Schemas: Checkout
// =============================================================

import { z } from "zod";
import { SRI_LANKAN_DISTRICTS } from "../constants";

/**
 * Checkout form validation schema.
 * Used on both client (React Hook Form) and server (API route).
 */
export const checkoutFormSchema = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  customerPhone: z
    .string()
    .min(9, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(
      /^[+]?[0-9\s-]{9,15}$/,
      "Please enter a valid phone number"
    ),

  customerWhatsapp: z
    .string()
    .regex(/^[+]?[0-9\s-]{9,15}$/, "Please enter a valid WhatsApp number")
    .optional()
    .or(z.literal("")),

  customerEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(300, "Address is too long"),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City is too long"),

  district: z.enum(SRI_LANKAN_DISTRICTS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a district" }),
  }),

  postalCode: z
    .string()
    .regex(/^[0-9]{5}$/, "Postal code must be 5 digits")
    .optional()
    .or(z.literal("")),

  notes: z
    .string()
    .max(500, "Notes must be under 500 characters")
    .optional()
    .or(z.literal("")),

  codConfirmed: z.literal(true, {
    errorMap: () => ({
      message: "Please confirm the Cash on Delivery order",
    }),
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

/**
 * Order item submitted from client (product ID + quantity + customizations).
 * Server will re-fetch prices — never trust client-submitted prices.
 */
export const orderItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Maximum 10 per item"),
  customizations: z.array(
    z.object({
      fieldName: z.string(),
      fieldLabel: z.string(),
      value: z.string(),
    })
  ),
});

/**
 * Full order creation payload validated on the server.
 */
export const createOrderSchema = z.object({
  customer: checkoutFormSchema,
  items: z.array(orderItemSchema).min(1, "Cart cannot be empty"),
});

export type CreateOrderValues = z.infer<typeof createOrderSchema>;
