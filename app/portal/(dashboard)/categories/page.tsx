import { Plus, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createClient } from "@/lib/supabase/server";
import { CategoryDialog, CategoryRowActions } from "@/components/admin/category-dialog";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: rawCategories } = await supabase
    .from("categories")
    .select("id, name, slug, is_active, products(id)")
    .order("sort_order", { ascending: true });

  const categories = (rawCategories || []).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    sort_order: cat.sort_order,
    is_active: cat.is_active,
    products: cat.products?.length || 0,
    status: cat.is_active ? "Active" : "Inactive"
  }));
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brand-purple">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage product categories for your store.</p>
        </div>
        
        <CategoryDialog 
          trigger={
            <Button className="bg-brand-purple hover:bg-brand-purple-deep">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          } 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border/40 overflow-hidden">
        <div className="p-4 border-b border-border/40 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search categories..." className="pl-9 bg-brand-cream/30" />
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell>{category.products}</TableCell>
                <TableCell>
                  <Badge variant={category.status === "Active" ? "default" : "secondary"} className={category.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                    {category.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <CategoryRowActions category={category} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
