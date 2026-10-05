import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductDetailClient } from "@/components/product/product-detail-client";
import type { Product, CustomizationField } from "@/lib/types";



export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const supabase = createAdminClient();

  const { data: productData, error: productError } = await supabase
    .from("products")
    .select(`
      id, name, slug, description, short_description, price, compare_price, sku, stock_quantity,
      category_id, material_id, color, is_featured, is_new, is_best_seller, is_customizable,
      is_active, seo_title, seo_description, tags, created_at, updated_at,
      images:product_images(id, product_id, url, alt_text, sort_order, is_primary, created_at),
      category:categories(name),
      material:materials(name)
    `)
    .eq("slug", slug)
    .single();

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

  return (
    <ProductDetailClient 
      product={product} 
      customizationFields={customizationFields} 
      reviews={reviewsData || []}
    />
  );
}
