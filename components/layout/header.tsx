"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useMounted } from "@/hooks/use-hooks";
import { MobileNav } from "./mobile-nav";

/**
 * Sticky header with logo, navigation, search, wishlist, and cart.
 * Responsive: desktop shows full nav, mobile shows hamburger menu.
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mounted = useMounted();

  const cartItemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.getCount());

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full",
          "bg-white/95 backdrop-blur-md",
          "border-b border-border/60",
          "transition-shadow duration-300"
        )}
      >
        <div className="container-main">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* ─── Mobile: Hamburger ──── */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* ─── Logo ──── */}
            <Link href="/" className="flex-shrink-0" aria-label="Lassana LK Home">
              <Image
                src="/logo/full logo.png"
                alt="Lassana LK"
                width={140}
                height={50}
                className="h-10 w-auto lg:h-12"
                priority
              />
            </Link>

            {/* ─── Desktop Navigation ──── */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg",
                    "text-foreground/80 hover:text-foreground",
                    "hover:bg-muted transition-colors"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ─── Right Actions ──── */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                type="button"
                className="hidden sm:flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted transition-colors"
                aria-label="Search products"
              >
                <Search className="h-5 w-5 text-foreground/70" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted transition-colors"
                aria-label={`Wishlist${mounted && wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`}
              >
                <Heart className="h-5 w-5 text-foreground/70" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-purple text-[10px] font-bold text-white px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                type="button"
                onClick={openCart}
                className="relative flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted transition-colors"
                aria-label={`Shopping cart${mounted && cartItemCount > 0 ? ` (${cartItemCount} items)` : ""}`}
              >
                <ShoppingBag className="h-5 w-5 text-foreground/70" />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-purple text-[10px] font-bold text-white px-1">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
