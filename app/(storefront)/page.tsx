import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { HomeSplash } from "@/components/home/home-splash";
import { NameHero } from "@/components/home/name-hero";
import { ActiveFilters, MobileFilterButton, ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { ProductCard } from "@/components/product/product-card";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: "Lassana LK | Personalized Name Pendants & Jewelry in Sri Lanka" },
  description:
    "Shop personalized name pendants, custom jewelry and laser-cut 2D metal signs from Lassana LK. Made to order in 3–7 business days and delivered anywhere in Sri Lanka with cash on delivery.",
  alternates: { canonical: "/" },
};

export const revalidate = 3600;

export default async function HomePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categoryParam = searchParams.category as string;
  const materialParam = searchParams.material as string;
  const sortParam = searchParams.sort as string;
  const personalizedOnly = searchParams.personalized === "1";

  const supabase = createAdminClient();
  let query = supabase
    .from("products")
    .select(`
      id, name, slug, price, compare_price, delivery_fee, short_description, stock_quantity, 
      is_customizable, is_best_seller, is_new, category_id, material_id, created_at, updated_at, is_active,
      images:product_images(id, product_id, url, is_primary),
      categories${categoryParam ? '!inner' : ''}(name, slug),
      materials${materialParam ? '!inner' : ''}(name, slug),
      reviews:reviews(rating, is_approved)
    `)
    .eq("is_active", true);

  if (categoryParam) {
    query = query.in("categories.slug", categoryParam.split(","));
  }

  if (materialParam) {
    query = query.in("materials.slug", materialParam.split(","));
  }

  if (personalizedOnly) {
    query = query.eq("is_customizable", true);
  }

  // Sorting
  if (sortParam === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (sortParam === "price-desc") {
    query = query.order("price", { ascending: false });
  } else if (sortParam === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false }); // Default
  }

  const [{ data: rawProducts }, { data: materialsData }, { data: categoriesData }] = await Promise.all([
    query,
    supabase.from("materials").select("id, name, slug").order("name"),
    supabase.from("categories").select("id, name, slug, sort_order").eq("is_active", true).order("sort_order", { ascending: true })
  ]);

  const materials = materialsData || [];
  const categories = categoriesData || [];

  let parsedProducts: Product[] = (rawProducts || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compare_price: p.compare_price,
    delivery_fee: p.delivery_fee,
    short_description: p.short_description,
    stock_quantity: p.stock_quantity,
    is_customizable: p.is_customizable,
    is_best_seller: p.is_best_seller,
    is_new: p.is_new,
    material_id: p.material_id,
    material: p.materials,
    images: (p.images || []).map((img: any) => ({
      id: img.id,
      product_id: img.product_id,
      url: img.url,
      is_primary: img.is_primary,
    })),
    category_id: p.category_id,
    category: p.categories,
    is_active: p.is_active,
    created_at: p.created_at,
    updated_at: p.updated_at,
    review_count: (p.reviews || []).filter((r: any) => r.is_approved).length,
    average_rating: (p.reviews || []).filter((r: any) => r.is_approved).length > 0 
      ? (p.reviews || []).filter((r: any) => r.is_approved).reduce((sum: number, r: any) => sum + r.rating, 0) / (p.reviews || []).filter((r: any) => r.is_approved).length 
      : 0,
  } as Product));

  let products = parsedProducts;

  // Re-keying the grid replays its stagger, so a filter change visibly lands
  const gridKey = [categoryParam, materialParam, sortParam, personalizedOnly].join("|");
  const hasFilters = Boolean(categoryParam || materialParam || personalizedOnly);

  return (
    <div className="min-h-screen pb-24">
      <HomeSplash />
      <NameHero />

      <section id="shop" className="container-main scroll-mt-24 pt-14 md:pt-20" aria-labelledby="shop-heading">
        {/* Section heading + toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="shop-heading">The collection</h2>
            <p className="mt-2 text-muted-foreground" aria-live="polite">
              {products.length === 1 ? "1 piece" : `${products.length} pieces`}
              {hasFilters ? " match your filters" : ", ready to order"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="h-11 w-24 lg:hidden" />}>
              <MobileFilterButton materials={materials} categories={categories} resultCount={products.length} />
            </Suspense>
            <Suspense fallback={<div className="h-11 w-48" />}>
              <ProductSort />
            </Suspense>
          </div>
        </div>

        <div className="flex items-start gap-10 border-t border-border pt-8">
          {/* Desktop sidebar: short enough to read in one glance */}
          <aside
            aria-label="Filters"
            className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 overflow-y-auto pr-1 scrollbar-none lg:block"
          >
            <Suspense fallback={<div className="h-96" />}>
              <ProductFilters materials={materials} categories={categories} />
            </Suspense>
          </aside>

          {/* Product grid */}
          <div className="min-w-0 flex-1">
            <Suspense fallback={null}>
              <ActiveFilters materials={materials} categories={categories} />
            </Suspense>
            {products.length > 0 ? (
              <div
                key={gridKey}
                className="grid-stagger grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-5"
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-brand-purple/20 bg-white px-6 py-20 text-center">
                <h3>No pieces match these filters</h3>
                <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
                  Try removing a category or material to see more of the collection.
                </p>
                <Link
                  href="/#shop"
                  className="press mt-6 inline-flex h-11 items-center rounded-full bg-brand-purple px-6 text-sm font-semibold text-white hover:bg-brand-purple-light"
                >
                  Clear filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
