// =============================================================
// Lassana LK — Personalised wallet styles for the live preview
// =============================================================
//
// Keyed by product slug. The renderer (components/product/wallet-preview.tsx)
// draws the leather wallet, an engraved brass nameplate and the charm.

export type WalletCharm = "crown" | "mr" | "infinityLove";

export interface WalletDesign {
  /** Leather colour */
  leather: string;
  /** Stitching thread colour */
  thread: string;
  charm: WalletCharm;
  /** Nameplate lettering: italic serif, or bold capitals */
  plate: "serifItalic" | "sansCaps";
  /** Two names on the plate joined by a red heart */
  joinWithHeart?: boolean;
  /** Matching black name keychain beside the wallet */
  keychain?: boolean;
}

export const WALLET_DESIGNS: Record<string, WalletDesign> = {
  "wallet-design-1": { leather: "#1d1b19", thread: "#c9a640", charm: "crown", plate: "serifItalic" },
  "wallet-design-2": { leather: "#b4652c", thread: "#eaa55e", charm: "mr", plate: "sansCaps", keychain: true },
  "wallet-design-3": { leather: "#6e3b31", thread: "#dba06a", charm: "infinityLove", plate: "serifItalic", joinWithHeart: true },
};

export function walletDesignFromSlug(slug: string): string | null {
  return slug in WALLET_DESIGNS ? slug : null;
}
