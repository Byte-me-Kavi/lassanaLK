"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Heart, MessageCircle, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCustomizer } from "@/components/product/product-customizer";
import { PriceDisplay } from "@/components/ui/price-display";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useMounted } from "@/hooks/use-hooks";
import { productInquiryLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { Product, CustomizationField, CustomizationFieldWithOptions } from "@/lib/types";

interface ProductDetailClientProps {
  product: Product;
  customizationFields: CustomizationField[];
}

export function ProductDetailClient({ product, customizationFields }: ProductDetailClientProps) {
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


    setTimeout(() => {
      addItem({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        price: product.price,
        quantity: 1,
        imageUrl: product.images?.[0]?.url || "",
        isCustomizable: product.is_customizable,
        customizations: formattedCustomizations,
      });
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="bg-brand-ivory min-h-screen pb-20">
      <div className="container-main pt-6 pb-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-brand-purple transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/" className="hover:text-brand-purple transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div className="lg:col-span-5 md:sticky md:top-24 h-fit">
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Right: Info & Actions */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex flex-wrap gap-2">
                  {product.is_best_seller && (
                    <Badge className="bg-brand-gold text-white hover:bg-brand-gold-soft border-none rounded-sm px-2">Best Seller</Badge>
                  )}
                  {product.is_new && (
                    <Badge className="bg-brand-purple text-white hover:bg-brand-purple-deep border-none rounded-sm px-2">New Arrival</Badge>
                  )}
                  {isOutOfStock && (
                    <Badge variant="secondary" className="rounded-sm px-2">Out of Stock</Badge>
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
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-purple transition-colors"
                >
                  <Heart className={cn("h-5 w-5", isWishlisted && "fill-red-500 text-red-500")} />
                  <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-purple mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={4.9} showValue />
                <span className="text-sm text-muted-foreground underline cursor-pointer">128 Reviews</span>
              </div>

              <PriceDisplay price={product.price} comparePrice={product.compare_price} size="lg" />
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
              {product.description}
            </p>

            {/* Product Specifications */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6 bg-white p-4 rounded-xl border border-border/40">
              {product.category?.name && (
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Category</span>
                  <span className="text-sm font-semibold text-foreground">{product.category.name}</span>
                </div>
              )}
              {product.material && (
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Material</span>
                  <span className="text-sm font-semibold text-foreground">
                    {typeof product.material === 'string' ? product.material : product.material?.name}
                  </span>
                </div>
              )}
              {product.color && (
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Color</span>
                  <span className="text-sm font-semibold text-foreground">{product.color}</span>
                </div>
              )}
            </div>

            {/* Customizer */}
            {product.is_customizable && (
              <div className="mb-6">
                <ProductCustomizer fields={customizationFields as CustomizationFieldWithOptions[]} onChange={setCustomizationValues} />
              </div>
            )}


            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <Button 
                size="lg" 
                className="w-full h-14 text-base font-semibold rounded-xl bg-brand-purple hover:bg-brand-purple-deep shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={isOutOfStock || (!isValid && product.is_customizable) || isAdding}
              >
                {isAdding ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
                {!isAdding && !isOutOfStock && <ShoppingBag className="ml-2 h-5 w-5" />}
              </Button>
              
              <a 
                href={productInquiryLink(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-14 text-sm font-medium rounded-xl border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all whitespace-nowrap px-2"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Inquire via WhatsApp
              </a>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/40 mt-auto">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-purple">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Cash on Delivery</p>
                  <p className="text-muted-foreground text-xs">Available islandwide</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-purple">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Premium Quality</p>
                  <p className="text-muted-foreground text-xs">Tarnish resistant</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
