// =============================================================
// Lassana LK — WhatsApp Deep Link Generator
// =============================================================

import { SITE_CONFIG } from "./constants";
import type { CartItem, CustomizationValue } from "./types";

const WHATSAPP_BASE = "https://wa.me/";

/**
 * Get the configured WhatsApp number.
 */
function getWhatsAppNumber(): string {
  return SITE_CONFIG.whatsappNumber;
}

/**
 * Create a WhatsApp deep link with a pre-filled message.
 */
export function createWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message.trim());
  return `${WHATSAPP_BASE}${getWhatsAppNumber()}?text=${encoded}`;
}

/**
 * Generate a WhatsApp link for a general inquiry.
 */
export function generalInquiryLink(): string {
  return createWhatsAppLink(
    `Hi Lassana LK,\n\nI'd like to know more about your jewelry collection.`
  );
}

/**
 * Generate a WhatsApp link for a product inquiry.
 */
export function productInquiryLink(
  productName: string,
  sku?: string | null
): string {
  let message = `Hi Lassana LK,\n\nI'm interested in:\n${productName}`;
  if (sku) {
    message += `\n\nProduct ID: ${sku}`;
  }
  message += `\n\nCould you provide more information?`;
  return createWhatsAppLink(message);
}

/**
 * Generate a WhatsApp link for a customized product inquiry.
 */
export function customizedProductInquiryLink(
  productName: string,
  customizations: CustomizationValue[],
  sku?: string | null
): string {
  let message = `Hi Lassana LK,\n\nI would like to order:\n\n${productName}`;

  if (sku) {
    message += `\nProduct ID: ${sku}`;
  }

  if (customizations.length > 0) {
    message += "\n";
    for (const c of customizations) {
      message += `\n${c.fieldLabel}: ${c.value}`;
    }
  }

  return createWhatsAppLink(message);
}

/**
 * Generate a WhatsApp link for order status inquiry.
 */
export function orderInquiryLink(orderNumber: string): string {
  return createWhatsAppLink(
    `Hi Lassana LK,\n\nI'd like to check on my order:\n\nOrder Number: ${orderNumber}`
  );
}

/**
 * Generate a WhatsApp link for admin to contact a customer.
 */
export function adminContactCustomerLink(
  customerPhone: string,
  orderNumber: string
): string {
  const phone = customerPhone.replace(/[^0-9]/g, "");
  const formattedPhone = phone.startsWith("0")
    ? `94${phone.slice(1)}`
    : phone.startsWith("94")
      ? phone
      : `94${phone}`;

  return `${WHATSAPP_BASE}${formattedPhone}?text=${encodeURIComponent(
    `Hi, this is Lassana LK regarding your order ${orderNumber}.`
  )}`;
}

/**
 * Generate a WhatsApp link for cart items (post-checkout).
 */
export function cartSummaryLink(items: CartItem[]): string {
  let message = "Hi Lassana LK,\n\nI'm interested in ordering:\n";

  for (const item of items) {
    message += `\n• ${item.productName} (×${item.quantity})`;
    if (item.customizations.length > 0) {
      for (const c of item.customizations) {
        message += `\n  ${c.fieldLabel}: ${c.value}`;
      }
    }
  }

  return createWhatsAppLink(message);
}
