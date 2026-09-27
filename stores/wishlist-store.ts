// =============================================================
// Lassana LK — Wishlist Store (Zustand + localStorage persistence)
// =============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem } from "@/lib/types";

interface WishlistState {
  items: WishlistItem[];

  // Actions
  addItem: (item: Omit<WishlistItem, "addedAt">) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: Omit<WishlistItem, "addedAt">) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Don't add duplicates
          if (state.items.some((i) => i.productId === item.productId)) {
            return state;
          }
          return {
            items: [
              ...state.items,
              { ...item, addedAt: new Date().toISOString() },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      toggleItem: (item) => {
        const isInWishlist = get().items.some(
          (i) => i.productId === item.productId
        );
        if (isInWishlist) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),

      getCount: () => get().items.length,
    }),
    {
      name: "lassana-lk-wishlist",
    }
  )
);
