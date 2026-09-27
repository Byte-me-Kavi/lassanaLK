"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}

/**
 * Consistent section heading used across homepage and other pages.
 * Provides uniform spacing and typography for section titles.
 */
export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="mb-3">{title}</h2>
      {subtitle && (
        <p
          className={cn(
            "text-muted-foreground text-base md:text-lg max-w-2xl",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
