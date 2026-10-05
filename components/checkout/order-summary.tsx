"use client";

import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { PriceDisplay } from "@/components/ui/price-display";
import { Separator } from "@/components/ui/separator";

export function OrderSummary() {
  const { items, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = items.reduce((acc, item) => acc + ((item.delivery_fee ?? 450) * item.quantity), 0);
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="py-4">
        <h3 className="font-heading text-2xl font-semibold text-brand-purple mb-4">Order Summary</h3>
        <p className="text-muted-foreground text-sm">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h3 className="font-heading text-2xl font-semibold text-brand-purple mb-6 pb-4 border-b border-brand-purple/10">Order Summary</h3>
      
      <div className="space-y-4 mb-6 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.cartId} className="flex gap-4">
            <div className="relative h-16 w-16 shrink-0 rounded-lg bg-brand-cream overflow-hidden border border-border">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.productName} fill sizes="64px" className="object-cover" />
              ) : null}
              <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-purple text-[10px] font-bold text-white z-10">
                {item.quantity}
              </div>
            </div>
            
            <div className="flex flex-1 flex-col justify-center">
              <h4 className="text-sm font-medium leading-none mb-1 text-foreground line-clamp-1">{item.productName}</h4>
              
              {item.customizations && item.customizations.length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {item.customizations.map((c) => (
                    <p key={c.fieldName} className="text-[11px] text-muted-foreground">
                      <span className="font-medium">{c.fieldLabel}:</span> {c.value}
                    </p>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-sm font-semibold text-foreground text-right shrink-0">
              <PriceDisplay price={item.price * item.quantity} size="sm" />
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="mb-4" />
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium"><PriceDisplay price={subtotal} size="sm" /></span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium"><PriceDisplay price={deliveryFee} size="sm" /></span>
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      <div className="flex justify-between items-center mb-6">
        <span className="text-base font-semibold text-foreground">Total</span>
        <span className="text-xl font-bold text-brand-purple">
          <PriceDisplay price={total} size="md" />
        </span>
      </div>
      
      <div className="rounded-lg bg-brand-cream/50 p-4 border border-brand-gold-soft/20">
        <p className="text-sm text-center text-muted-foreground">
          Payment method: <strong className="text-brand-purple">Cash on Delivery</strong>
        </p>
      </div>
    </div>
  );
}
