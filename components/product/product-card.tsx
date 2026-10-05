"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, PenLine } from "lucide-react";
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

  const primary = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const primaryImage = primary?.url || "";
  // A second photo, shown on hover so shoppers can see the piece from another angle
  const secondaryImage = product.images?.find((img) => img.url && img.url !== primaryImage)?.url;
  const isOutOfStock = product.stock_quantity <= 0;
  const isWishlisted = mounted && isInWishlist;
  const materialName = typeof product.material === "string" ? product.material : product.material?.name;
  const href = `/products/${product.slug}`;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      price: product.price,
      delivery_fee: product.delivery_fee ?? 450,
      quantity: 1,
      imageUrl: primaryImage,
      isCustomizable: product.is_customizable,
      customizations: [],
    });
  };

  const handleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      price: product.price,
      imageUrl: primaryImage,
    });
  };

  const actionClass =
    "press flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand-cream/80 text-sm font-semibold text-brand-purple hover:bg-brand-purple hover:text-white disabled:opacity-50 disabled:hover:bg-brand-cream/80 disabled:hover:text-brand-purple sm:h-11";

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border border-border bg-white p-2 shadow-[0_1px_2px_rgba(48,1,79,0.04)] transition-[border-color,box-shadow,transform] duration-300 ease-out sm:p-2.5",
        "[@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-brand-purple/30 [@media(hover:hover)]:hover:shadow-[0_18px_40px_-22px_rgba(48,1,79,0.45)]",
        className
      )}
    >
      <div className="relative">
        <Link
          href={href}
          className="relative block aspect-square overflow-hidden rounded-xl bg-brand-cream/50"
          aria-label={product.name}
        >
          {primaryImage ? (
            <>
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-[1.04]"
                priority={priority}
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover opacity-0 transition-opacity duration-500 ease-out [@media(hover:hover)]:group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-brand-purple/20" />
            </div>
          )}

          {/* Status */}
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
            {product.is_new && (
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-purple shadow-sm">
                New
              </span>
            )}
            {product.is_best_seller && (
              <span className="rounded-full bg-brand-purple px-2.5 py-1 text-xs font-semibold text-brand-gold-light shadow-sm">
                Best seller
              </span>
            )}
            {isOutOfStock && (
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                Sold out
              </span>
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleWishlist}
          className={cn(
            "press absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm",
            isWishlisted ? "text-brand-purple" : "text-foreground/60 hover:text-brand-purple"
          )}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
        >
          <Heart
            key={isWishlisted ? "on" : "off"}
            className={cn("h-4.5 w-4.5", isWishlisted && "animate-heart-pop fill-current")}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3 sm:px-2">
        <Link href={href} className="block">
          <h3 className="text-[15px] font-semibold leading-snug tracking-normal text-foreground transition-colors line-clamp-2 group-hover:text-brand-purple md:text-base">
            {product.name}
          </h3>
        </Link>

        {materialName && (
          <p className="mt-1 text-[13px] font-medium text-brand-gold-deep">{materialName}</p>
        )}

        {(product.review_count ?? 0) > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <StarRating rating={product.average_rating ?? 0} size="sm" />
            <span className="text-xs text-muted-foreground">({product.review_count})</span>
          </div>
        )}

        <div className="mt-auto pt-3">
          <PriceDisplay
            price={product.price}
            comparePrice={product.compare_price}
            size="lg"
            className="mb-3 border-t border-border pt-3"
          />

          {product.is_customizable ? (
            <Link href={href} className={actionClass} aria-label={`Personalize ${product.name}`}>
              <PenLine className="h-4 w-4" />
              Personalize
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={actionClass}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="h-4 w-4" />
              {isOutOfStock ? "Sold out" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
