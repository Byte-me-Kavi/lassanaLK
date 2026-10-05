import { Suspense } from "react";
import { HomeSplash } from "@/components/home/home-splash";
import { ProductFilters } from "@/components/product/product-filters";
import { FilterDrawer } from "@/components/product/filter-drawer";
import { ProductSort } from "@/components/product/product-sort";
import { ProductCard } from "@/components/product/product-card";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";

export const metadata = {
  title: "Home | Lassana LK",
  description: "Browse our beautiful collection of personalized jewelry, name necklaces, and elegant pieces.",
};

export const revalidate = 3600;

export default async function HomePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categoryParam = searchParams.category as string;
  const materialParam = searchParams.material as string;
  const sortParam = searchParams.sort as string;

  const supabase = createAdminClient();
  let query = supabase
    .from("products")
    .select(`
      id, name, slug, price, compare_price, short_description, stock_quantity, 
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

  return (
    <div className="min-h-screen pb-20">
      <HomeSplash />
      
      <div className="container-main pt-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start z-10">
            <div className="bg-brand-cream p-6 rounded-2xl border border-brand-purple/10">
              <h2 className="font-heading text-xl font-bold text-brand-purple mb-6 pb-2 border-b border-brand-purple/10">
                Categories & Filters
              </h2>
              <Suspense fallback={<div>Loading filters...</div>}>
                <ProductFilters materials={materials} categories={categories} />
              </Suspense>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
              <p className="text-sm text-muted-foreground font-medium">
                Showing {products.length} products
              </p>
              
              <div className="flex items-center gap-3">
                <Suspense fallback={<div className="w-10" />}>
                  <FilterDrawer materials={materials} categories={categories} />
                </Suspense>
                
                <Suspense fallback={<div className="w-32" />}>
                  <ProductSort />
                </Suspense>
              </div>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-in fade-in duration-1000 delay-300 fill-mode-both">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-border/40">
                <h3 className="font-heading text-2xl font-bold text-brand-purple mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
