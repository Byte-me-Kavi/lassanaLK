"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Material } from "@/lib/types";

type Option = { name: string; slug: string };
type Category = { id: string; name: string; slug: string; sort_order: number };

interface FilterData {
  materials?: Material[];
  categories?: Category[];
}

// Long lists show this many rows until "Show all" is pressed, keeping the panel short
const VISIBLE_ROWS = 6;

/** Filter state lives in the URL; local state mirrors it so controls respond instantly. */
function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsKey = searchParams.toString();

  const read = () => ({
    category: searchParams.get("category")?.split(",").filter(Boolean)[0] ?? "",
    materials: searchParams.get("material")?.split(",").filter(Boolean) ?? [],
    personalized: searchParams.get("personalized") === "1",
  });

  const [syncedKey, setSyncedKey] = useState(paramsKey);
  const [state, setState] = useState(read);

  if (syncedKey !== paramsKey) {
    setSyncedKey(paramsKey);
    setState(read());
  }

  const commit = (next: typeof state) => {
    setState(next);
    const params = new URLSearchParams(paramsKey);
    if (next.category) params.set("category", next.category);
    else params.delete("category");
    if (next.materials.length) params.set("material", next.materials.join(","));
    else params.delete("material");
    if (next.personalized) params.set("personalized", "1");
    else params.delete("personalized");
    params.delete("page");
    const query = params.toString();
    // Stay where the shopper is — don't jump back to the top of the page
    router.push(query ? `/?${query}` : "/", { scroll: false });
  };

  return {
    ...state,
    activeCount: (state.category ? 1 : 0) + state.materials.length + (state.personalized ? 1 : 0),
    setCategory: (slug: string) => commit({ ...state, category: slug }),
    toggleMaterial: (slug: string) =>
      commit({
        ...state,
        materials: state.materials.includes(slug)
          ? state.materials.filter((m) => m !== slug)
          : [...state.materials, slug],
      }),
    setPersonalized: (value: boolean) => commit({ ...state, personalized: value }),
    clearAll: () => commit({ category: "", materials: [], personalized: false }),
  };
}

function FilterGroup({
  title,
  count,
  expanded,
  onToggleExpanded,
  children,
}: {
  title: string;
  count: number;
  expanded: boolean;
  onToggleExpanded: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-border pt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-1 text-sm font-semibold text-foreground"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", !open && "-rotate-90")} />
      </button>
      {open && (
        <div className="mt-1.5">
          <ul className="space-y-px">{children}</ul>
          {count > VISIBLE_ROWS && (
            <button
              type="button"
              onClick={onToggleExpanded}
              className="mt-1 px-2 py-1 text-[13px] font-semibold text-brand-gold-deep underline-offset-4 hover:underline"
            >
              {expanded ? "Show fewer" : `Show all ${count}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Keeps the selected option visible even when the list is collapsed. */
function visibleOptions<T extends Option>(options: T[], expanded: boolean, selected: string[]) {
  if (expanded || options.length <= VISIBLE_ROWS) return options;
  const head = options.slice(0, VISIBLE_ROWS);
  const hiddenSelected = options.slice(VISIBLE_ROWS).filter((o) => selected.includes(o.slug));
  return [...head, ...hiddenSelected];
}

function RadioDot({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors",
        on ? "border-brand-purple" : "border-brand-purple/35"
      )}
    >
      <span className={cn("h-2 w-2 rounded-full bg-brand-purple transition-transform duration-150", on ? "scale-100" : "scale-0")} />
    </span>
  );
}

export function ProductFilters({ materials = [], categories = [], className }: FilterData & { className?: string }) {
  const f = useFilters();
  const [allCategories, setAllCategories] = useState(false);
  const [allMaterials, setAllMaterials] = useState(false);

  const rowClass =
    "flex h-[30px] w-full items-center gap-2.5 rounded-lg px-2 text-left text-sm transition-colors hover:bg-brand-cream/60";

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex h-7 items-center justify-between">
        <p className="text-base font-semibold text-brand-purple">Filter</p>
        {f.activeCount > 0 && (
          <button
            type="button"
            onClick={f.clearAll}
            className="text-[13px] font-semibold text-brand-gold-deep underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-white px-3 py-2.5">
        <span className="text-sm font-medium text-foreground">Personalizable only</span>
        <Switch checked={f.personalized} onCheckedChange={(v) => f.setPersonalized(Boolean(v))} />
      </label>

      <FilterGroup
        title="Category"
        count={categories.length}
        expanded={allCategories}
        onToggleExpanded={() => setAllCategories((v) => !v)}
      >
        <li>
          <button
            type="button"
            onClick={() => f.setCategory("")}
            aria-pressed={!f.category}
            className={cn(rowClass, !f.category ? "bg-brand-cream/70 font-semibold text-brand-purple" : "text-foreground/80")}
          >
            <RadioDot on={!f.category} />
            All categories
          </button>
        </li>
        {visibleOptions(categories, allCategories, [f.category]).map((cat) => {
          const on = f.category === cat.slug;
          return (
            <li key={cat.slug}>
              <button
                type="button"
                onClick={() => f.setCategory(cat.slug)}
                aria-pressed={on}
                className={cn(rowClass, on ? "bg-brand-cream/70 font-semibold text-brand-purple" : "text-foreground/80")}
              >
                <RadioDot on={on} />
                <span className="truncate">{cat.name}</span>
              </button>
            </li>
          );
        })}
      </FilterGroup>

      <FilterGroup
        title="Material"
        count={materials.length}
        expanded={allMaterials}
        onToggleExpanded={() => setAllMaterials((v) => !v)}
      >
        {visibleOptions(materials, allMaterials, f.materials).map((mat) => {
          const on = f.materials.includes(mat.slug);
          return (
            <li key={mat.slug}>
              <label
                htmlFor={`mat-${mat.slug}`}
                className={cn(rowClass, "cursor-pointer", on ? "font-semibold text-brand-purple" : "text-foreground/80")}
              >
                <Checkbox id={`mat-${mat.slug}`} checked={on} onCheckedChange={() => f.toggleMaterial(mat.slug)} />
                <span className="truncate">{mat.name}</span>
              </label>
            </li>
          );
        })}
      </FilterGroup>
    </div>
  );
}

/** Phones: a Filter button that opens the same panel as a bottom sheet. */
export function MobileFilterButton({ materials, categories, resultCount }: FilterData & { resultCount: number }) {
  const f = useFilters();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="press inline-flex h-11 items-center gap-2 rounded-full border border-border bg-white px-4 text-[15px] font-medium text-brand-purple hover:bg-brand-cream lg:hidden">
        <SlidersHorizontal className="h-4 w-4" />
        Filter
        {f.activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-purple px-1.5 text-xs font-bold text-white">
            {f.activeCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" showCloseButton={false} className="max-h-[85vh] gap-0 rounded-t-3xl bg-background p-0">
        <SheetTitle className="sr-only">Filter products</SheetTitle>
        <div aria-hidden className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-border" />
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-3">
          <ProductFilters materials={materials} categories={categories} />
        </div>
        <div className="border-t border-border bg-white px-5 py-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="press h-12 w-full rounded-full bg-brand-purple text-[15px] font-semibold text-white hover:bg-brand-purple-light"
          >
            {resultCount === 1 ? "Show 1 piece" : `Show ${resultCount} pieces`}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Removable tags above the grid, so applied filters are always visible. */
export function ActiveFilters({ materials = [], categories = [] }: FilterData) {
  const f = useFilters();
  if (f.activeCount === 0) return null;

  const tags: { label: string; remove: () => void }[] = [];
  if (f.personalized) tags.push({ label: "Personalizable", remove: () => f.setPersonalized(false) });
  if (f.category) {
    const name = categories.find((c) => c.slug === f.category)?.name ?? f.category;
    tags.push({ label: name, remove: () => f.setCategory("") });
  }
  for (const slug of f.materials) {
    const name = materials.find((m) => m.slug === slug)?.name ?? slug;
    tags.push({ label: name, remove: () => f.toggleMaterial(slug) });
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {tags.map((t) => (
        <button
          key={t.label}
          type="button"
          onClick={t.remove}
          aria-label={`Remove filter: ${t.label}`}
          className="press inline-flex h-8 items-center gap-1.5 rounded-full bg-brand-cream/80 pl-3 pr-2 text-[13px] font-semibold text-brand-purple hover:bg-brand-cream"
        >
          {t.label}
          <X className="h-3.5 w-3.5" />
        </button>
      ))}
      <button
        type="button"
        onClick={f.clearAll}
        className="px-1 text-[13px] font-semibold text-brand-gold-deep underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
