"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "featured";

  const handleSortChange = (value: string | null) => {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") {
      params.delete("sort"); // default state
    } else {
      params.set("sort", value);
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/", { scroll: false });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:inline-block">Sort by</span>
      {/* `items` lets the trigger show the label ("Featured") instead of the raw value */}
      <Select items={SORT_OPTIONS} value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger
          aria-label="Sort products"
          className="h-11 w-48 rounded-full border-border bg-white px-4 text-[15px] font-medium text-brand-purple"
        >
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
