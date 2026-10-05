import { ProductForm } from "@/components/admin/product-form";

export const metadata = {
  title: "Add Product",
};

export default function NewProductPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <ProductForm />
    </div>
  );
}
