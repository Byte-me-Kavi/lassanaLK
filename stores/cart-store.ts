// =============================================================
// Lassana LK — Cart Store (Zustand + localStorage persistence)
// =============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CustomizationValue } from "@/lib/types";

/**
 * Generate a unique cart ID from product ID + customization values.
 * Same product with different customizations = different cart entries.
 */
function generateCartId(
  productId: string,
  customizations: CustomizationValue[]
): string {
  if (customizations.length === 0) return productId;
  const customKey = customizations
    .map((c) => `${c.fieldName}:${c.value}`)
    .sort()
    .join("|");
  return `${productId}__${customKey}`;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "cartId">) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed (getters as functions)
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const cartId = generateCartId(item.productId, item.customizations);
        set((state) => {
          const existing = state.items.find((i) => i.cartId === cartId);
          if (existing) {
            // Increment quantity for matching product + customizations
            return {
              items: state.items.map((i) =>
                i.cartId === cartId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          // Add new item
          return {
            items: [...state.items, { ...item, cartId }],
            isOpen: true,
          };
        });
      },

      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartId !== cartId),
        }));
      },

      updateQuantity: (cartId, quantity) => {
        if (quantity < 1) {
          get().removeItem(cartId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.cartId === cartId ? { ...i, quantity: Math.min(quantity, 10) } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "lassana-lk-cart",
      // Only persist items, not UI state like isOpen
      partialize: (state) => ({ items: state.items }),
    }
  )
);
