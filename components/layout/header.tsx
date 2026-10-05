"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useMounted } from "@/hooks/use-hooks";
import { MobileNav } from "./mobile-nav";
import { SearchDialog } from "./search-dialog";

const iconButton =
  "press relative flex h-10 w-10 items-center justify-center rounded-full text-brand-purple hover:bg-brand-cream/70";

/**
 * Announcement bar + sticky header with logo, navigation, search, wishlist, and cart.
 * The header gains a soft shadow once the page scrolls under it.
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mounted = useMounted();
  const pathname = usePathname();

  const cartItemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.getCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-brand-purple-deep px-4 py-2 text-center text-[13px] text-white/85">
        Cash on delivery anywhere in Sri Lanka<span className="hidden sm:inline">. Pay when your order arrives</span>.
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-lg transition-[box-shadow,border-color] duration-300",
          scrolled
            ? "border-transparent shadow-[0_8px_30px_-12px_rgba(48,1,79,0.22)]"
            : "border-border"
        )}
      >
        <div className="container-main">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-18 lg:grid-cols-[auto_1fr_auto]">
            {/* Mobile: menu */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                className={iconButton}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            {/* Logo */}
            <Link
              href="/"
              className="press flex shrink-0 items-center gap-2 justify-self-center lg:justify-self-start"
              aria-label="Lassana LK home"
            >
              <Image
                src="/logo/only logo.png"
                alt=""
                width={26}
                height={44}
                className="h-10 w-auto lg:h-11"
                style={{ width: "auto" }}
                priority
              />
              <span className="font-display text-[26px] leading-none text-brand-purple lg:text-[28px]">
                Lassana <span className="text-brand-gold">LK</span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Main navigation">
              {NAV_LINKS.map((link) => {
                const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "link-rule px-3 py-2.5 text-[15px] font-medium transition-colors",
                      active ? "text-brand-purple" : "text-foreground/75 hover:text-brand-purple"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center justify-end gap-0.5">
              <SearchDialog />

              <Link
                href="/wishlist"
                className={cn(iconButton, "hidden sm:flex")}
                aria-label={`Wishlist${mounted && wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`}
              >
                <Heart className="h-5 w-5" />
                {mounted && wishlistCount > 0 && (
                  <span
                    key={wishlistCount}
                    className="animate-bump absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-white"
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="press flex h-10 items-center gap-2 rounded-full pl-2.5 pr-2.5 text-brand-purple hover:bg-brand-cream/70 sm:pr-4"
                aria-label={`Shopping cart${mounted && cartItemCount > 0 ? ` (${cartItemCount} items)` : ""}`}
              >
                <span className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {mounted && cartItemCount > 0 && (
                    <span
                      key={cartItemCount}
                      className="animate-bump absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-purple px-1 text-[10px] font-bold text-white ring-2 ring-white"
                    >
                      {cartItemCount}
                    </span>
                  )}
                </span>
                <span className="hidden text-[15px] font-semibold sm:inline">Cart</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
