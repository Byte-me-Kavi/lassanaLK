"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Image as ImageIcon, Video, Save, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// We will fetch categories dynamically from Supabase instead

const customizationOptionSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  price_modifier: z.coerce.number(),
});

const customizationFieldSchema = z.object({
  field_name: z.string().min(1, "Field name is required"),
  field_label: z.string().min(1, "Field label is required"),
  field_type: z.enum(["text", "textarea", "select", "radio", "checkbox", "number"]),
  is_required: z.boolean(),
  options: z.array(customizationOptionSchema).optional(),
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  compare_price: z.coerce.number().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  sku: z.string().optional(),
  stock_quantity: z.coerce.number().min(0),
  material_id: z.string().optional(),
  is_featured: z.boolean(),
  is_new: z.boolean(),
  is_active: z.boolean(),
  is_customizable: z.boolean(),
  customization_fields: z.array(customizationFieldSchema).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [materials, setMaterials] = useState<{ id: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const [catRes, matRes] = await Promise.all([
        supabase.from("categories").select("id, name").eq("is_active", true).order("sort_order"),
        fetch("/api/materials").then(res => res.json())
      ]);
      
      if (catRes.data && !catRes.error) {
        setCategories(catRes.data);
      }
      if (matRes && Array.isArray(matRes)) {
        setMaterials(matRes);
      }
    }
    loadData();
  }, [supabase]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      price: 0,
      stock_quantity: 0,
      is_featured: false,
      is_new: false,
      is_active: true,
      is_customizable: false,
      customization_fields: [],
    },
  });

  const { fields: customFields, append: appendCustomField, remove: removeCustomField } = useFieldArray({
    control: form.control,
    name: "customization_fields",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to upload");

      setImages([...images, data.url]);
    } catch (err: any) {
      console.error(err);
      alert("Error uploading image: " + err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Insert product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert({
          name: data.name,
          slug: data.slug,
          price: data.price,
          compare_price: data.compare_price || null,
          description: data.description || null,
          short_description: data.short_description || null,
          category_id: data.category,
          sku: data.sku || null,
          stock_quantity: data.stock_quantity,
          material_id: data.material_id || null,
          is_featured: data.is_featured,
          is_new: data.is_new,
          is_active: data.is_active,
          is_customizable: data.is_customizable,
        })
        .select()
        .single();

      if (productError) throw productError;

      const productId = productData.id;

      // 2. Insert images
      if (images.length > 0) {
        const imageInserts = images.map((url, idx) => ({
          product_id: productId,
          url,
          sort_order: idx,
          is_primary: idx === 0,
        }));
        const { error: imagesError } = await supabase.from("product_images").insert(imageInserts);
        if (imagesError) throw imagesError;
      }

      // 3. Insert customization fields
      if (data.is_customizable && data.customization_fields && data.customization_fields.length > 0) {
        const fieldInserts = data.customization_fields.map((field, idx) => ({
          product_id: productId,
          field_name: field.field_name,
          field_label: field.field_label,
          field_type: field.field_type,
          is_required: field.is_required,
          sort_order: idx,
        }));
        const { error: fieldsError } = await supabase.from("product_customization_fields").insert(fieldInserts);
        if (fieldsError) throw fieldsError;
        // Note: For full completeness we would also insert options (for select/radio) by capturing the returned field IDs.
      }

      alert("Product saved successfully!");
      router.push("/portal/products");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert("Failed to save product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = () => {
    const name = form.watch("name");
    if (name) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  };

  const isCustomizable = form.watch("is_customizable");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-brand-purple">Add New Product</h2>
          <p className="text-muted-foreground text-sm">Create a new product for your catalog.</p>
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" className="bg-brand-purple hover:bg-brand-purple-deep" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" {...form.register("name")} placeholder="e.g. Classic Script Name Pendant" />
                {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <div className="flex gap-2">
                  <Input id="slug" {...form.register("slug")} placeholder="classic-script-name-pendant" />
                  <Button type="button" variant="secondary" onClick={generateSlug}>Generate</Button>
                </div>
                {form.formState.errors.slug && <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea id="description" {...form.register("description")} rows={6} placeholder="Detailed product description..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs.) *</Label>
                <Input id="price" type="number" {...form.register("price")} />
                {form.formState.errors.price && <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="compare_price">Compare-at Price (Rs.)</Label>
                <Input id="compare_price" type="number" {...form.register("compare_price")} placeholder="Optional original price" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" {...form.register("sku")} placeholder="e.g. PEN-001" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                <Input id="stock_quantity" type="number" {...form.register("stock_quantity")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customization Options</CardTitle>
                <CardDescription>Allow customers to personalize this piece.</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={isCustomizable}
                  onCheckedChange={(val) => form.setValue("is_customizable", val)}
                />
                <Label>Enable Customization</Label>
              </div>
            </CardHeader>
            
            {isCustomizable && (
              <CardContent className="space-y-6">
                {customFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg bg-slate-50 relative">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => removeCustomField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label>Field Internal Name (e.g. 'engraving_text')</Label>
                        <Input {...form.register(`customization_fields.${index}.field_name`)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Customer Facing Label (e.g. 'Enter Name')</Label>
                        <Input {...form.register(`customization_fields.${index}.field_label`)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Field Type</Label>
                        <Select 
                          onValueChange={(val: any) => form.setValue(`customization_fields.${index}.field_type`, val)}
                          defaultValue={form.watch(`customization_fields.${index}.field_type`)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Short Text</SelectItem>
                            <SelectItem value="textarea">Long Text</SelectItem>
                            <SelectItem value="select">Dropdown Select</SelectItem>
                            <SelectItem value="radio">Radio Buttons</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 mt-8">
                        <Switch 
                          checked={form.watch(`customization_fields.${index}.is_required`)}
                          onCheckedChange={(val) => form.setValue(`customization_fields.${index}.is_required`, val)}
                        />
                        <Label>Required Field</Label>
                      </div>
                    </div>
                  </div>
                ))}

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-dashed"
                  onClick={() => appendCustomField({ field_name: "", field_label: "", field_type: "text", is_required: false, options: [] })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customization Field
                </Button>
              </CardContent>
            )}
          </Card>

        </div>

        {/* Right Column - Media & Settings */}
        <div className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
              <CardDescription>Upload images to Cloudflare R2</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Mock ${i}`} className="object-cover w-full h-full" />
                    <button type="button" className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full" onClick={() => setImages(images.filter((_, idx) => idx !== i))}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                  />
                  <button 
                    type="button" 
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()} 
                    className="aspect-square w-full flex flex-col items-center justify-center border-2 border-dashed rounded-md hover:bg-slate-50 transition-colors text-muted-foreground disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="h-6 w-6 mb-2 animate-spin" /> : <ImageIcon className="h-6 w-6 mb-2" />}
                    <span className="text-xs">{isUploading ? "Uploading..." : "Add Image"}</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select onValueChange={(val: any) => form.setValue("category", val || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Material</Label>
                <Select onValueChange={(val: any) => form.setValue("material_id", val || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibility & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="is_active">Active on store</Label>
                <Switch 
                  id="is_active"
                  checked={form.watch("is_active")}
                  onCheckedChange={(val) => form.setValue("is_active", val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="is_featured">Featured Product</Label>
                <Switch 
                  id="is_featured"
                  checked={form.watch("is_featured")}
                  onCheckedChange={(val) => form.setValue("is_featured", val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="is_new">New Arrival</Label>
                <Switch 
                  id="is_new"
                  checked={form.watch("is_new")}
                  onCheckedChange={(val) => form.setValue("is_new", val)}
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </form>
  );
}
