import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl: string;
  description?: string;
  className?: string;
}

export function CategoryCard({ name, slug, imageUrl, description, className }: CategoryCardProps) {
  return (
    <Link
      href={`/shop/${slug}`}
      className={cn(
        "group relative flex h-50 md:h-70 w-full flex-col justify-end overflow-hidden rounded-2xl",
        className
      )}
    >
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90" />
      
      {/* Content */}
      <div className="relative z-10 p-4 md:p-6 flex flex-col">
        <h3 className="mb-1 md:mb-2 text-lg md:text-2xl font-bold text-white font-heading">{name}</h3>
        {description && (
          <p className="text-white/80 text-xs md:text-sm mb-2 md:mb-4 hidden sm:-webkit-box sm:line-clamp-2">{description}</p>
        )}
        <div className="inline-flex items-center text-xs md:text-sm font-medium text-brand-gold-light group-hover:text-white transition-colors">
          Shop Now <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
