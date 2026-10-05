import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import type { Product, CustomizationField } from "@/lib/types";

// Shared by generateMetadata and the page so the product is fetched once per request
const getProductRow = cache(async (slug: string) => {
  const supabase = createAdminClient();
  return supabase
    .from("products")
    .select(`
      id, name, slug, description, short_description, price, compare_price, delivery_fee, sku, stock_quantity,
      category_id, material_id, color, is_featured, is_new, is_best_seller, is_customizable,
      is_active, seo_title, seo_description, tags, created_at, updated_at,
      images:product_images(id, product_id, url, alt_text, sort_order, is_primary, created_at),
      category:categories(name, slug),
      material:materials(name)
    `)
    .eq("slug", slug)
    .single();
});

type ProductRow = NonNullable<Awaited<ReturnType<typeof getProductRow>>["data"]>;

function primaryImageUrl(row: ProductRow) {
  const images = (row.images || []) as { url: string; is_primary: boolean; sort_order: number }[];
  return (images.find((i) => i.is_primary) || [...images].sort((a, b) => a.sort_order - b.sort_order)[0])?.url;
}

function relationName(rel: unknown): string | undefined {
  const one = Array.isArray(rel) ? rel[0] : rel;
  return (one as { name?: string } | null | undefined)?.name ?? undefined;
}

function metaDescription(row: ProductRow) {
  const text = row.seo_description || row.short_description || row.description || "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean) return clean.length > 158 ? `${clean.slice(0, 155).trimEnd()}…` : clean;
  return `${row.name} from Lassana LK. Made to order in Sri Lanka and paid cash on delivery.`;
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const { data: row } = await getProductRow(slug);
  if (!row) return { title: "Product not found", robots: { index: false } };

  const title = row.seo_title || row.name;
  const socialTitle = `${title} | Lassana LK`;
  const description = metaDescription(row);
  const image = primaryImageUrl(row);
  const path = `/products/${row.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: "Lassana LK",
      locale: "en_LK",
      title: socialTitle,
      description,
      images: image ? [{ url: image, alt: row.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const supabase = createAdminClient();

  const { data: productData, error: productError } = await getProductRow(slug);

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productData?.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (productError || !productData) {
    console.error("Product Error:", productError);
    return notFound();
  }

  // Map to Product type
  const product: Product = {
    id: productData.id,
    name: productData.name,
    slug: productData.slug,
    description: productData.description,
    short_description: productData.short_description,
    price: productData.price,
    compare_price: productData.compare_price,
    delivery_fee: productData.delivery_fee,
    sku: productData.sku,
    stock_quantity: productData.stock_quantity,
    category_id: productData.category_id,
    material_id: productData.material_id,
    material: productData.material,
    color: productData.color,
    is_featured: productData.is_featured,
    is_new: productData.is_new,
    is_best_seller: productData.is_best_seller,
    is_customizable: productData.is_customizable,
    is_active: productData.is_active,
    seo_title: productData.seo_title,
    seo_description: productData.seo_description,
    tags: productData.tags,
    created_at: productData.created_at,
    updated_at: productData.updated_at,
    images: (productData.images || []).map((img: any) => ({
      id: img.id,
      product_id: img.product_id,
      url: img.url,
      alt_text: img.alt_text,
      sort_order: img.sort_order,
      is_primary: img.is_primary,
      created_at: img.created_at,
    })).sort((a: any, b: any) => a.sort_order - b.sort_order),
    category: productData.category,
  } as Product;

  // Fetch customization fields if the product is customizable
  let customizationFields: CustomizationField[] = [];
  if (product.is_customizable) {
    const { data: fieldsData } = await supabase
      .from("product_customization_fields")
      .select(`
        id, product_id, field_name, field_label, field_type, is_required, placeholder, 
        max_length, min_value, max_value, sort_order, created_at,
        options:product_customization_options(id, field_id, label, value, price_modifier, sort_order)
      `)
      .eq("product_id", product.id)
      .order("sort_order", { ascending: true });

    if (fieldsData) {
      customizationFields = fieldsData.map((f: any) => ({
        id: f.id,
        product_id: f.product_id,
        field_name: f.field_name,
        field_label: f.field_label,
        field_type: f.field_type,
        is_required: f.is_required,
        placeholder: f.placeholder,
        max_length: f.max_length,
        min_value: f.min_value,
        max_value: f.max_value,
        sort_order: f.sort_order,
        created_at: f.created_at,
        options: (f.options || []).map((o: any) => ({
          id: o.id,
          field_id: o.field_id,
          label: o.label,
          value: o.value,
          price_modifier: o.price_modifier,
          sort_order: o.sort_order,
        })).sort((a: any, b: any) => a.sort_order - b.sort_order)
      }));
    }
  }

  // Structured data: product, price, delivery and reviews for rich results
  const reviews = reviewsData || [];
  const productUrl = absoluteUrl(`/products/${product.slug}`);
  const imageUrls = (product.images || []).map((img) => img.url).filter(Boolean);
  const deliveryFee = product.delivery_fee ?? 450;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        url: productUrl,
        image: imageUrls,
        description: product.description || product.short_description || undefined,
        sku: product.sku || undefined,
        category: relationName(productData.category),
        material: relationName(productData.material),
        color: product.color || undefined,
        brand: { "@type": "Brand", name: SITE_CONFIG.name },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: SITE_CONFIG.currency,
          price: product.price,
          itemCondition: "https://schema.org/NewCondition",
          availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          seller: { "@id": `${SITE_URL}/#store` },
          acceptedPaymentMethod: "https://schema.org/COD",
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: { "@type": "MonetaryAmount", value: deliveryFee, currency: SITE_CONFIG.currency },
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "LK" },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 7, unitCode: "DAY" },
              transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
            },
          },
        },
        ...(reviews.length > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length,
          },
          review: reviews.slice(0, 10).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.customer_name },
            datePublished: r.created_at,
            reviewBody: r.review_text,
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
          })),
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/#shop") },
          { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <ProductDetailClient
        product={product}
        customizationFields={customizationFields}
        reviews={reviews}
      />
    </>
  );
}
