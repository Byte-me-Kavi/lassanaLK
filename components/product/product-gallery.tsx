"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: { id: string; url: string; is_primary: boolean }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [{ id: "fallback", url: "/placeholder.jpg", is_primary: true }];
  const hasMany = displayImages.length > 1;

  const select = (idx: number) => {
    setActiveIndex((idx + displayImages.length) % displayImages.length);
  };

  const arrowClass =
    "press absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-purple shadow-sm backdrop-blur-sm hover:bg-white";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 md:max-w-none">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border bg-white md:aspect-square">
        {displayImages.map((image, idx) => (
          <Image
            key={image.id}
            src={image.url}
            alt={idx === activeIndex ? `${productName}, photo ${idx + 1} of ${displayImages.length}` : ""}
            fill
            priority={idx === 0}
            sizes="(max-width: 768px) 90vw, 40vw"
            className={cn(
              "object-cover transition-opacity duration-400 ease-out",
              idx === activeIndex ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {hasMany && (
          <>
            <button type="button" onClick={() => select(activeIndex - 1)} aria-label="Previous photo" className={cn(arrowClass, "left-3")}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => select(activeIndex + 1)} aria-label="Next photo" className={cn(arrowClass, "right-3")}>
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="tabular absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-purple shadow-sm backdrop-blur-sm">
              {activeIndex + 1} / {displayImages.length}
            </span>
          </>
        )}
      </div>

      {hasMany && (
        <div className="flex gap-2.5 overflow-x-auto p-0.5 scrollbar-none" role="group" aria-label="Product photos">
          {displayImages.map((image, idx) => (
            <button
              key={image.id}
              type="button"
              onClick={() => select(idx)}
              aria-label={`Show photo ${idx + 1}`}
              aria-pressed={activeIndex === idx}
              className={cn(
                "press relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg bg-white ring-offset-2 ring-offset-background",
                activeIndex === idx ? "ring-2 ring-brand-purple" : "opacity-70 ring-1 ring-border hover:opacity-100"
              )}
            >
              <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
