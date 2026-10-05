"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useDebounce } from "@/hooks/use-hooks";
import { formatPrice } from "@/lib/utils";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 200); // reduced delay for snappier feel
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Memoize the supabase client so it doesn't get recreated on every re-render
  // which would trigger the useEffect on every single keystroke.
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function searchProducts() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, name, slug, price,
          images:product_images(url, is_primary)
        `)
        .eq("is_active", true)
        .ilike("name", `%${debouncedQuery}%`)
        .limit(5);
        
      if (!error && data) {
        setResults(data);
      }
      setIsLoading(false);
    }
    
    searchProducts();
  }, [debouncedQuery, supabase]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => setQuery(""), 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className="press hidden h-10 w-10 items-center justify-center rounded-full text-brand-purple hover:bg-brand-cream/70 sm:flex"
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </DialogTrigger>
      
      <DialogContent className="top-[18%] translate-y-0 overflow-hidden rounded-2xl p-0 sm:max-w-xl" showCloseButton={false}>
        <div className="sr-only">
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>Search for personalized jewelry and gifts</DialogDescription>
        </div>
        
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-brand-purple" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pendants, rings, signs…"
            className="border-0 shadow-none focus-visible:ring-0 h-14 text-base bg-transparent"
            autoFocus
          />
          {isLoading && <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />}
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() !== "" && results.length === 0 && !isLoading ? (
            <div className="p-8 text-center text-[15px] text-muted-foreground">
              Nothing matches &ldquo;{query}&rdquo;. Try a shorter word, like &ldquo;name&rdquo; or &ldquo;ring&rdquo;.
            </div>
          ) : results.length > 0 ? (
            <div className="p-2 space-y-1">
              {results.map((product) => {
                const image = product.images?.find((img: any) => img.is_primary) || product.images?.[0];
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-brand-cream/60 focus-visible:bg-brand-cream/60"
                  >
                    <div className="relative h-12 w-12 rounded-md bg-brand-cream overflow-hidden shrink-0">
                      {image && (
                        <Image
                          src={image.url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[15px] font-medium text-foreground">{product.name}</p>
                      <p className="tabular text-sm font-semibold text-brand-purple">{formatPrice(product.price, false)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            query.trim() === "" && (
              <div className="p-8 text-center text-[15px] text-muted-foreground">
                Search by product name.
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
