"use client";

import Link from "next/link";
import Image from "next/image";
import { HeartCrack, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import { useMounted } from "@/hooks/use-hooks";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";

export default function WishlistPage() {
  const mounted = useMounted();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (!mounted) return <div className="min-h-screen bg-brand-ivory" />;

  const handleMoveToCart = (item: any) => {
    // We add with default quantity of 1 and no customizations yet (they can customize on product page or we redirect)
    // Actually, if it's customizable, they should go to the product page.
    // For now, let's just link to product page for "Move to Cart" if it's complex, or add directly if simple.
    // Easiest is to direct them to the product page to select customizations.
    // But for a pure "move to cart", let's redirect to product page.
    window.location.href = `/products/${item.productSlug}`;
  };

  return (
    <div className="bg-brand-ivory min-h-screen pb-20 pt-8">
      <div className="container-main max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-purple mb-2">
              Your Wishlist
            </h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved for later.
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="ghost" onClick={clearWishlist} className="text-red-500 hover:text-red-600 hover:bg-red-50 w-fit">
              Clear All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border/40 p-12 text-center flex flex-col items-center">
            <div className="h-20 w-20 bg-brand-cream rounded-full flex items-center justify-center text-brand-purple mb-6">
              <HeartCrack className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold font-heading mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't saved any items yet. Start browsing our collection and click the heart icon to save your favorites.
            </p>
            <Button render={<Link href="/" />} size="lg" className="bg-brand-purple hover:bg-brand-purple-deep">
              Explore Collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl border border-border/40 p-4 flex flex-col group">
                <Link href={`/products/${item.productSlug}`} className="relative aspect-square rounded-xl bg-brand-cream mb-4 overflow-hidden block">
                  {item.imageUrl ? (
                    <Image 
                      src={item.imageUrl} 
                      alt={item.productName} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                </Link>
                
                <Link href={`/products/${item.productSlug}`} className="font-semibold text-foreground hover:text-brand-purple transition-colors mb-1 line-clamp-1">
                  {item.productName}
                </Link>
                
                <div className="mb-4">
                  <PriceDisplay price={item.price} size="sm" />
                </div>
                
                <div className="mt-auto flex gap-2">
                  <Button 
                    className="flex-1 bg-brand-purple hover:bg-brand-purple-deep" 
                    onClick={() => handleMoveToCart(item)}
                  >
                    View Product
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="shrink-0 text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                    onClick={() => removeItem(item.productId)}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
