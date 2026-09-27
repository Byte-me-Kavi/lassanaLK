"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductFilters } from "./product-filters";

export function FilterDrawer() {
  return (
    <Sheet>
      <SheetTrigger 
        render={
          <Button variant="outline" className="lg:hidden border-border/40 hover:bg-brand-cream hover:text-brand-purple">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        }
      />
      <SheetContent side="left" className="w-[300px] sm:w-[340px] bg-brand-ivory p-0">
        <SheetHeader className="p-6 border-b border-border/40 text-left">
          <SheetTitle className="font-heading text-2xl text-brand-purple">Filters</SheetTitle>
        </SheetHeader>
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
          <ProductFilters />
        </div>
      </SheetContent>
    </Sheet>
  );
}
