// =============================================================
// Lassana LK — Delivery fee rules (shared by cart, checkout and the order API)
// =============================================================
//
// Delivery is charged once per order, not per item:
// - Every item has a delivery fee (its delivery group), e.g. Rs. 450 or Rs. 600.
// - An order pays the highest group fee among its items, once.
// - An order that mixes items from every group in FREE_DELIVERY_GROUPS ships free.

/** Fee used when a product has no delivery fee set */
export const DEFAULT_DELIVERY_FEE = 450;

/** Buying from all of these delivery groups in one order makes delivery free */
export const FREE_DELIVERY_GROUPS = [450, 600] as const;

export interface DeliveryQuote {
  /** What the customer pays for delivery */
  fee: number;
  /** What delivery would cost without the free-delivery combo */
  regularFee: number;
  /** True when the order mixes all free-delivery groups */
  isFree: boolean;
}

export function quoteDelivery(itemFees: (number | null | undefined)[]): DeliveryQuote {
  const groups = new Set(itemFees.map((f) => Number(f ?? DEFAULT_DELIVERY_FEE)).filter((f) => f > 0));
  const regularFee = groups.size ? Math.max(...groups) : 0;
  const isFree = FREE_DELIVERY_GROUPS.every((g) => groups.has(g));
  return { fee: isFree ? 0 : regularFee, regularFee, isFree };
}
