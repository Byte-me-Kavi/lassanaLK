"use client";

import { useState } from "react";
import Link from "next/link";
import { Banknote, ChevronRight, Clock, Droplets, Heart, ShoppingBag, Truck } from "lucide-react";

import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCustomizer } from "@/components/product/product-customizer";
import { PriceDisplay } from "@/components/ui/price-display";
import { StarRating } from "@/components/ui/star-rating";
import { ProductReviews } from "@/components/product/product-reviews";

import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useMounted } from "@/hooks/use-hooks";
import { productInquiryLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn, formatPrice } from "@/lib/utils";
import type { Product, CustomizationField, CustomizationFieldWithOptions } from "@/lib/types";

interface Review {
  id: string;
  rating: number;
  customer_name: string;
  created_at: string;
  review_text: string;
}

interface ProductDetailClientProps {
  product: Product;
  customizationFields: CustomizationField[];
  reviews: Review[];
}

export function ProductDetailClient({ product, customizationFields, reviews }: ProductDetailClientProps) {
  const mounted = useMounted();
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const addItem = useCartStore((s) => s.addItem);

  const [customizationValues, setCustomizationValues] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);

  const isWishlisted = mounted && isInWishlist;
  const isOutOfStock = product.stock_quantity <= 0;

  // Validation check
  const missingRequiredFields = customizationFields.filter(
    (field) => field.is_required && (!customizationValues[field.field_name] || customizationValues[field.field_name] === "")
  );
  const isValid = missingRequiredFields.length === 0;

  const handleAddToCart = () => {
    if (isOutOfStock || (!isValid && product.is_customizable)) return;

    setIsAdding(true);

    // Format customizations for the cart
    const formattedCustomizations = Object.entries(customizationValues).map(([key, value]) => {
      const field = customizationFields.find(f => f.field_name === key);
      return {
        fieldName: key,
        fieldLabel: field?.field_label || key,
        value: value,
      };
    });


    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      price: product.price,
      delivery_fee: product.delivery_fee ?? 450,
      quantity: 1,
      imageUrl: product.images?.[0]?.url || "",
      isCustomizable: product.is_customizable,
      customizations: formattedCustomizations,
    });
    setIsAdding(false);
  };

  const materialName = typeof product.material === "string" ? product.material : product.material?.name;
  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
  const details = [
    { label: "Category", value: product.category?.name },
    { label: "Material", value: materialName },
    { label: "Color", value: product.color },
    { label: "Product code", value: product.sku },
  ].filter((d) => d.value);
  const keyDetails = details.filter((d) => d.label !== "Product code");
  const blockedByFields = product.is_customizable && !isValid && !isOutOfStock;
  const deliveryFee = product.delivery_fee ?? 450;
  // The gold script preview only makes sense for name pendants
  const isNamePendant = product.category?.slug === "name-pendants";

  return (
    <div className="min-h-screen pb-24">
      <div className="container-main pb-12 pt-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-brand-purple">Home</Link>
          <ChevronRight className="mx-1.5 h-4 w-4 shrink-0" />
          <Link href="/#shop" className="transition-colors hover:text-brand-purple">Shop</Link>
          <ChevronRight className="mx-1.5 h-4 w-4 shrink-0" />
          <span className="truncate font-medium text-foreground" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
          {/* Gallery — kept compact so the details stay in view */}
          <div className="h-fit md:sticky md:top-24">
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Info & actions */}
          <div className="rise-in flex min-w-0 flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {product.is_best_seller && (
                  <span className="rounded-full bg-brand-purple px-3 py-1 text-xs font-semibold text-brand-gold-light">Best seller</span>
                )}
                {product.is_new && (
                  <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-purple">New arrival</span>
                )}
                {product.is_customizable && (
                  <span className="rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-gold-deep">Personalizable</span>
                )}
                {isOutOfStock && (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Sold out</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist({
                  productId: product.id,
                  productName: product.name,
                  productSlug: product.slug,
                  price: product.price,
                  imageUrl: product.images?.[0]?.url || "",
                })}
                aria-pressed={isWishlisted}
                className={cn(
                  "press flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium",
                  isWishlisted
                    ? "border-brand-purple/30 bg-brand-cream/60 text-brand-purple"
                    : "border-border bg-white text-foreground/75 hover:border-brand-purple/30 hover:text-brand-purple"
                )}
              >
                <Heart
                  key={isWishlisted ? "on" : "off"}
                  className={cn("h-4.5 w-4.5", isWishlisted && "animate-heart-pop fill-current")}
                />
                {isWishlisted ? "Saved" : "Save"}
              </button>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl">{product.name}</h1>

            <div className="mt-2.5">
              {reviews.length > 0 ? (
                <a href="#reviews" className="group inline-flex items-center gap-2">
                  <StarRating rating={averageRating} showValue />
                  <span className="text-sm text-muted-foreground underline-offset-4 group-hover:text-brand-purple group-hover:underline">
                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </span>
                </a>
              ) : (
                <a href="#reviews" className="text-sm text-muted-foreground underline-offset-4 hover:text-brand-purple hover:underline">
                  No reviews yet. Be the first.
                </a>
              )}
            </div>

            <PriceDisplay price={product.price} comparePrice={product.compare_price} size="xl" className="mt-4" />

            {product.short_description && (
              <p className="mt-4 max-w-prose text-base leading-relaxed text-foreground/80">{product.short_description}</p>
            )}

            {/* Key details at a glance */}
            {keyDetails.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {keyDetails.map((d) => (
                  <div key={d.label} className="rounded-xl border border-border bg-white px-4 py-3">
                    <dt className="text-[13px] text-muted-foreground">{d.label}</dt>
                    <dd className="mt-0.5 text-[15px] font-semibold text-foreground">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {product.is_customizable && (
              <div className="mt-6">
                <ProductCustomizer
                  fields={customizationFields as CustomizationFieldWithOptions[]}
                  onChange={setCustomizationValues}
                  showNamePreview={isNamePendant}
                />
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || (!isValid && product.is_customizable) || isAdding}
                className="press flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-purple text-base font-semibold text-white shadow-[0_14px_30px_-14px_rgba(48,1,79,0.7)] hover:bg-brand-purple-light disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
              >
                {!isAdding && !isOutOfStock && <ShoppingBag className="h-5 w-5" />}
                {isAdding ? "Adding…" : isOutOfStock ? "Sold out" : "Add to cart"}
              </button>

              <a
                href={productInquiryLink(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="press flex h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-[#25D366] bg-white px-4 text-[15px] font-semibold text-[#128C4A] hover:bg-[#25D366] hover:text-white"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Ask on WhatsApp
              </a>
            </div>

            {blockedByFields && (
              <p className="mt-3 text-sm text-muted-foreground" role="status">
                Fill in {missingRequiredFields.map((f) => f.field_label).join(", ")} to add this to your cart.
              </p>
            )}

            {/* Delivery & payment */}
            <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-white">
              <li className="flex items-start gap-3 px-4 py-3.5">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-deep" />
                <p className="text-[15px] leading-snug">
                  <span className="font-semibold text-foreground">Made in 3–7 business days</span>
                  <span className="block text-sm text-muted-foreground">Each order is prepared for you after you place it.</span>
                </p>
              </li>
              <li className="flex items-start gap-3 px-4 py-3.5">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-deep" />
                <p className="text-[15px] leading-snug">
                  <span className="font-semibold text-foreground">Delivered in 1–3 business days</span>
                  <span className="block text-sm text-muted-foreground">
                    Anywhere in Sri Lanka. Delivery for this piece is {formatPrice(deliveryFee, false)}.
                  </span>
                </p>
              </li>
              <li className="flex items-start gap-3 px-4 py-3.5">
                <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-deep" />
                <p className="text-[15px] leading-snug">
                  <span className="font-semibold text-foreground">Pay cash on delivery</span>
                  <span className="block text-sm text-muted-foreground">No online payment needed.</span>
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* About this piece — full description and details, set for easy reading */}
        {(product.description || details.length > 0) && (
          <section className="mt-16 grid gap-10 border-t border-border pt-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16" aria-labelledby="about-piece">
            <div>
              <h2 id="about-piece" className="text-2xl md:text-3xl">About this piece</h2>
              {product.description ? (
                <p className="mt-4 max-w-prose whitespace-pre-line text-base leading-[1.75] text-foreground/85 md:text-[17px]">
                  {product.description}
                </p>
              ) : (
                <p className="mt-4 text-muted-foreground">Ask us on WhatsApp for more about this piece.</p>
              )}
            </div>

            <div className="space-y-8">
              {details.length > 0 && (
                <div>
                  <h3 className="text-lg md:text-xl">Details</h3>
                  <dl className="mt-3 divide-y divide-border border-y border-border">
                    {details.map((d) => (
                      <div key={d.label} className="flex items-center justify-between gap-4 py-3 text-[15px]">
                        <dt className="text-muted-foreground">{d.label}</dt>
                        <dd className="text-right font-semibold text-foreground">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div>
                <h3 className="text-lg md:text-xl">Care</h3>
                <p className="mt-3 flex items-start gap-3 text-[15px] leading-relaxed text-foreground/80">
                  <Droplets className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-deep" />
                  Keep it away from perfume, harsh chemicals and long contact with water so it keeps its shine.
                </p>
              </div>
            </div>
          </section>
        )}

        <ProductReviews productId={product.id} initialReviews={reviews} />
      </div>
    </div>
  );
}
