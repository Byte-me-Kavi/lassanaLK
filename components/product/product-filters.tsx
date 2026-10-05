"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Material } from "@/lib/types";

export function ProductFilters({ 
  className, 
  materials = [],
  categories = [] 
}: { 
  className?: string;
  materials?: Material[];
  categories?: { id: string; name: string; slug: string; sort_order: number }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for immediate UI updates before URL change (optimistic)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",") || []
  );
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    searchParams.get("material")?.split(",") || []
  );

  const updateFilters = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set(key, values.join(","));
    } else {
      params.delete(key);
    }
    // Reset page on filter change if pagination existed
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const toggleCategory = (id: string) => {
    const updated = selectedCategories.includes(id)
      ? selectedCategories.filter((c) => c !== id)
      : [...selectedCategories, id];
    setSelectedCategories(updated);
    updateFilters("category", updated);
  };

  const toggleMaterial = (id: string) => {
    const updated = selectedMaterials.includes(id)
      ? selectedMaterials.filter((m) => m !== id)
      : [...selectedMaterials, id];
    setSelectedMaterials(updated);
    updateFilters("material", updated);
  };

  return (
    <div className={cn("w-full", className)}>
      <Accordion defaultValue={["category", "material", "options"]} className="w-full">
        {/* Category Filter */}
        <AccordionItem value="category" className="border-b-border/40">
          <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline hover:text-brand-purple">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {categories.map((cat) => (
                <div key={cat.slug} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`cat-${cat.slug}`} 
                    checked={selectedCategories.includes(cat.slug)}
                    onCheckedChange={() => toggleCategory(cat.slug)}
                  />
                  <label 
                    htmlFor={`cat-${cat.slug}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {cat.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Material Filter */}
        <AccordionItem value="material" className="border-b-border/40">
          <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline hover:text-brand-purple">
            Material
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {materials.map((mat) => (
                <div key={mat.slug} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`mat-${mat.slug}`}
                    checked={selectedMaterials.includes(mat.slug)}
                    onCheckedChange={() => toggleMaterial(mat.slug)}
                  />
                  <label 
                    htmlFor={`mat-${mat.slug}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {mat.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
