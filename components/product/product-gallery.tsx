"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: { id: string; url: string; is_primary: boolean }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback to placeholder if no images
  const displayImages = images.length > 0 ? images : [{ id: "fallback", url: "/placeholder.jpg", isPrimary: true }];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md border border-border/40 aspect-4/3 md:aspect-square max-h-[45vh] md:max-h-none">
        <Image
          src={displayImages[activeIndex].url}
          alt={`${productName} - Image ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 hover:scale-105 cursor-zoom-in"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {displayImages.map((image, idx) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg bg-white/40 backdrop-blur-md border-2 transition-all",
                activeIndex === idx
                  ? "border-brand-purple shadow-sm opacity-100"
                  : "border-border/40 opacity-70 hover:opacity-100 hover:border-border"
              )}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
