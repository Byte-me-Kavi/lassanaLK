"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  sort_order: z.coerce.number(),
  is_active: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CategoryDialog({ 
  initialData, 
  categoryId,
  trigger
}: { 
  initialData?: Partial<CategoryFormValues>;
  categoryId?: string;
  trigger: React.ReactElement;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      sort_order: 0,
      is_active: true,
    },
  });

  const generateSlug = () => {
    const name = form.watch("name");
    if (name) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      if (categoryId) {
        const { error } = await supabase.from("categories").update(data).eq("id", categoryId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert([data]);
        if (error) throw error;
      }
      setOpen(false);
      form.reset();
      router.refresh();
      toast.add({ title: "Success", description: "Category saved.", type: "success" });
    } catch (error: any) {
      toast.add({ title: "Error", description: "Failed to save category: " + error.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{categoryId ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2">
              <Input id="slug" {...form.register("slug")} />
              <Button type="button" variant="secondary" onClick={generateSlug}>Gen</Button>
            </div>
            {form.formState.errors.slug && <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input id="sort_order" type="number" {...form.register("sort_order")} />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              checked={form.watch("is_active")}
              onCheckedChange={(val) => form.setValue("is_active", val)}
            />
            <Label>Active</Label>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CategoryRowActions({ category }: { category: any }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${category.name}? Products in this category will lose their category association.`)) {
      setIsDeleting(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from("categories").delete().eq("id", category.id);
        if (error) throw error;
        router.refresh();
        toast.add({ title: "Success", description: "Category deleted.", type: "success" });
      } catch (error: any) {
        toast.add({ title: "Error", description: "Failed to delete category: " + error.message, type: "error" });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const initialData = {
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    sort_order: category.sort_order || 0,
    is_active: category.status === "Active" || category.is_active,
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <CategoryDialog 
        categoryId={category.id} 
        initialData={initialData}
        trigger={
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-brand-purple">
            <Edit className="h-4 w-4" />
          </Button>
        } 
      />
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
