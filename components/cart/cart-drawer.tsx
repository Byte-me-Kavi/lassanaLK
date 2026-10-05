"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useMounted } from "@/hooks/use-hooks";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Cart drawer — slides in from the right.
 * Primary cart interaction point (no need to navigate to /cart).
 */
export function CartDrawer() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  // Same per-item delivery calculation as the checkout order summary
  const deliveryFee = items.reduce((acc, item) => acc + (item.delivery_fee ?? 450) * item.quantity, 0);
  const isEmpty = items.length === 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="gap-0 bg-white p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-105">
        {/* Header */}
        <div className="flex items-baseline gap-3 border-b border-border px-6 pb-4 pt-5 pr-14">
          <SheetTitle className="font-heading text-2xl font-semibold text-brand-purple">Your cart</SheetTitle>
          {!isEmpty && (
            <span className="text-sm text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="relative mb-6 h-28 w-16 opacity-90">
              <Image src="/logo/only logo.png" alt="" fill sizes="64px" className="object-contain" />
            </div>
            <p className="font-heading font-semibold text-2xl text-brand-purple">Your cart is empty</p>
            <p className="mt-2 max-w-xs text-[15px] text-muted-foreground">
              Find a piece you love, or design one with a name that matters to you.
            </p>
            <Link
              href="/#shop"
              onClick={closeCart}
              className="press mt-7 inline-flex h-12 items-center rounded-full bg-brand-purple px-7 text-[15px] font-semibold text-white hover:bg-brand-purple-light"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <>
            <ScrollArea className="min-h-0 flex-1">
              <ul className="divide-y divide-border px-6">
                {items.map((item, i) => (
                  <li
                    key={item.cartId}
                    className="flex gap-4 py-5"
                    style={isOpen ? { animation: `rise-in 360ms var(--ease-out) ${100 + Math.min(i, 6) * 40}ms both` } : undefined}
                  >
                    <Link
                      href={`/products/${item.productSlug}`}
                      onClick={closeCart}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-cream/50"
                    >
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-brand-purple/25" />
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="text-[15px] font-semibold leading-snug text-foreground transition-colors line-clamp-2 hover:text-brand-purple"
                          onClick={closeCart}
                        >
                          {item.productName}
                        </Link>
                        <p className="tabular shrink-0 text-[15px] font-semibold text-brand-purple">
                          {formatPrice(item.price * item.quantity, false)}
                        </p>
                      </div>

                      {item.customizations.length > 0 && (
                        <dl className="mt-1.5 space-y-0.5 text-[13px]">
                          {item.customizations.map((c) => (
                            <div key={c.fieldName} className="flex gap-1.5">
                              <dt className="text-muted-foreground">{c.fieldLabel}:</dt>
                              <dd className="font-medium text-foreground">{c.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(qty) => updateQuantity(item.cartId, qty)}
                          size="sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.cartId)}
                          className="rounded-full px-2 py-1 text-[13px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-destructive hover:underline"
                          aria-label={`Remove ${item.productName} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>

            {/* Footer */}
            <div className="space-y-4 border-t border-border bg-brand-pearl px-6 pb-6 pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] text-muted-foreground">Subtotal</span>
                <span className="tabular font-heading font-semibold text-2xl text-brand-purple">{formatPrice(subtotal, false)}</span>
              </div>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Delivery will be {formatPrice(deliveryFee, false)}, added at checkout. You pay in cash when your order arrives.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="press flex h-13 w-full items-center justify-center rounded-full bg-brand-purple text-base font-semibold text-white shadow-[0_12px_30px_-12px_rgba(48,1,79,0.6)] hover:bg-brand-purple-light"
              >
                Go to checkout
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="w-full py-1 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-brand-purple"
              >
                Keep shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
