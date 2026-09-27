"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { PriceDisplay } from "@/components/ui/price-display";
import { StarRating } from "@/components/ui/star-rating";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import { useMounted } from "@/hooks/use-hooks";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const mounted = useMounted();
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const addItem = useCartStore((s) => s.addItem);

  const primaryImage = product.images?.find((img) => img.is_primary)?.url || product.images?.[0]?.url || "";
  const isOutOfStock = product.stock_quantity <= 0;
  const isWishlisted = mounted && isInWishlist;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      price: product.price,
      quantity: 1,
      imageUrl: primaryImage,
      isCustomizable: product.is_customizable,
      customizations: [],
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      price: product.price,
      imageUrl: primaryImage,
    });
  };

  return (
    <div className={cn("group flex flex-col rounded-2xl bg-white p-3 shadow-sm border border-border/40 transition-all hover:shadow-md hover:border-border card-hover", className)}>
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-4 block">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
          {product.is_new && (
            <span className="inline-flex items-center rounded-full bg-brand-purple px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              New
            </span>
          )}
          {product.is_best_seller && (
            <span className="inline-flex items-center rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Best Seller
            </span>
          )}
          {isOutOfStock && (
            <span className="inline-flex items-center rounded-full bg-muted/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          className={cn(
            "absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:scale-110",
            isWishlisted ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4 transition-all", isWishlisted && "fill-current scale-110")} />
        </button>

        {/* Product Image */}
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1">
        {/* Optional Rating (mocked for now) */}
        <div className="mb-1.5">
          <StarRating rating={4.8} size="sm" showValue />
        </div>

        <Link href={`/products/${product.slug}`} className="block group-hover:text-brand-purple transition-colors">
          <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>
        
        {product.material && (
          <div className="mb-1.5">
            <span className="inline-block bg-brand-cream border border-brand-purple/20 text-brand-purple text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              {product.material}
            </span>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
          {product.short_description || "\u00A0"}
        </p>

        <div className="flex flex-col gap-3 mt-auto">
          <PriceDisplay 
            price={product.price} 
            comparePrice={product.compare_price} 
            size="md" 
          />
          
          {product.is_customizable ? (
            <Link
              href={`/products/${product.slug}`}
              className="flex w-full h-10 items-center justify-center rounded-lg bg-brand-cream text-brand-purple text-sm font-medium transition-colors hover:bg-brand-purple hover:text-white"
              aria-label={`Customize ${product.name}`}
            >
              <PenTool className="mr-2 h-4 w-4" />
              Customize
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex w-full h-10 items-center justify-center rounded-lg bg-brand-cream text-brand-purple text-sm font-medium transition-colors hover:bg-brand-purple hover:text-white disabled:opacity-50 disabled:hover:bg-brand-cream disabled:hover:text-brand-purple"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
