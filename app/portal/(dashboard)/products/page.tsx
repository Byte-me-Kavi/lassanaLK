import Link from "next/link";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { ProductRowActions } from "@/components/admin/product-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: rawProducts } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false });

  const products = (rawProducts || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    sku: p.sku || "N/A",
    price: p.price,
    stock: p.stock_quantity,
    category: p.category?.name || "Uncategorized",
    status: p.is_active ? "Active" : "Inactive",
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brand-purple">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your store inventory and catalog.</p>
        </div>
        
        <Button render={<Link href="/portal/products/new" />} nativeButton={false} className="bg-brand-purple hover:bg-brand-purple-deep">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border/40 overflow-hidden">
        <div className="p-4 border-b border-border/40 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9 bg-brand-cream/30" />
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Info</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>Rs. {product.price}</TableCell>
                <TableCell>
                  <span className={product.stock === 0 ? "text-red-500 font-medium" : ""}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={product.status === "Active" ? "default" : "secondary"} className={product.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ProductRowActions productId={product.id} productName={product.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
