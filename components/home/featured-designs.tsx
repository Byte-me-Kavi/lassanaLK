import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export async function FeaturedDesigns() {
  const supabase = await createClient();
  const { data: rawProducts } = await supabase
    .from("products")
    .select(`
      id, name, slug, price, compare_price, short_description, stock_quantity, 
      is_customizable, is_best_seller, is_new, category_id, is_active, created_at, updated_at,
      images:product_images(id, product_id, url, is_primary)
    `)
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4);

  const products: Product[] = (rawProducts || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compare_price: p.compare_price,
    short_description: p.short_description,
    stock_quantity: p.stock_quantity,
    is_customizable: p.is_customizable,
    is_best_seller: p.is_best_seller,
    is_new: p.is_new,
    images: (p.images || []).map((img: any) => ({
      id: img.id,
      product_id: img.product_id,
      url: img.url,
      is_primary: img.is_primary,
    })),
    category_id: p.category_id,
    is_active: p.is_active,
    created_at: p.created_at,
    updated_at: p.updated_at,
  } as Product));
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <SectionHeading
          title="Our Signature Designs"
          subtitle="Discover our most loved and carefully crafted jewelry pieces."
        />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-brand-purple px-8 text-sm font-medium text-brand-purple transition-all hover:bg-brand-purple hover:text-white group"
          >
            View All Designs
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
