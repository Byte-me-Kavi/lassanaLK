"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X, Trash2 } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useMounted } from "@/hooks/use-hooks";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const isEmpty = items.length === 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] bg-white p-0 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {!isEmpty && (
              <span className="text-sm font-normal text-muted-foreground">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
        </div>

        {/* Cart Items */}
        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Add some beautiful pieces to get started."
              action={
                <Button variant="default" onClick={closeCart} render={<Link href="/" />}>
                  Continue Shopping
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-5">
              <div className="py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.cartId} className="flex gap-3">
                    {/* Product Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="text-sm font-medium text-foreground hover:text-brand-purple transition-colors line-clamp-1"
                        onClick={closeCart}
                      >
                        {item.productName}
                      </Link>

                      {/* Customization Details */}
                      {item.customizations.length > 0 && (
                        <div className="mt-0.5 space-y-0.5">
                          {item.customizations.map((c) => (
                            <p
                              key={c.fieldName}
                              className="text-xs text-muted-foreground"
                            >
                              {c.fieldLabel}: {c.value}
                            </p>
                          ))}
                        </div>
                      )}

                      <p className="text-sm font-semibold text-foreground mt-1">
                        {formatPrice(item.price, false)}
                      </p>

                      {/* Quantity + Remove */}
                      <div className="flex items-center justify-between mt-2">
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(qty) =>
                            updateQuantity(item.cartId, qty)
                          }
                          size="sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.cartId)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label={`Remove ${item.productName} from cart`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t border-border/60 px-5 py-4 space-y-3">
              <div className="flex items-center justify-between text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(subtotal, false)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery fee calculated at checkout.
              </p>
              <Button
                className="w-full h-11 bg-brand-purple hover:bg-brand-purple-deep text-white"
                onClick={closeCart}
                render={<Link href="/checkout" />}
                nativeButton={false}
              >
                Proceed to Order
              </Button>
              <button
                type="button"
                onClick={closeCart}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
