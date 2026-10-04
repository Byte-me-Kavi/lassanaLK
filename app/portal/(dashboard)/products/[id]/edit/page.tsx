import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Edit Product | Lassana LK Admin",
};

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const productId = params.id;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name, id),
      customization_fields:product_customization_fields(
        id,
        field_name,
        field_label,
        field_type,
        is_required,
        sort_order
      ),
      images:product_images(url, is_primary)
    `)
    .eq("id", productId)
    .single();

  if (error || !product) {
    notFound();
  }

  // Format initialData to match ProductFormValues schema
  const initialData = {
    name: product.name,
    slug: product.slug,
    price: product.price,
    compare_price: product.compare_price || undefined,
    description: product.description || undefined,
    short_description: product.short_description || undefined,
    category: typeof product.category === 'object' && product.category ? (product.category as any).id : product.category_id,
    sku: product.sku || undefined,
    stock_quantity: product.stock_quantity,
    material_id: product.material_id || undefined,
    is_featured: product.is_featured,
    is_new: product.is_new,
    is_active: product.is_active,
    is_customizable: product.is_customizable,
    customization_fields: product.customization_fields || [],
  };

  const initialImages = (product.images || []).map((img: any) => img.url);

  return (
    <div className="max-w-6xl mx-auto">
      <ProductForm 
        productId={productId} 
        initialData={initialData} 
        initialImages={initialImages} 
      />
    </div>
  );
}
