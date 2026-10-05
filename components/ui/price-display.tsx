import { cn, formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  comparePrice?: number | null;
  size?: "sm" | "md" | "lg" | "xl";
  showDecimals?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl md:text-3xl",
};

/**
 * Reusable price display with optional compare-at price strikethrough.
 * All prices formatted in Sri Lankan Rupees.
 */
export function PriceDisplay({
  price,
  comparePrice,
  size = "md",
  showDecimals = false,
  className,
}: PriceDisplayProps) {
  const hasDiscount = comparePrice && comparePrice > price;

  return (
    <div className={cn("tabular flex flex-wrap items-baseline gap-x-2", className)}>
      <span
        className={cn(
          "font-semibold text-brand-purple",
          sizeClasses[size]
        )}
      >
        {formatPrice(price, showDecimals)}
      </span>
      {hasDiscount && (
        <span
          aria-label={`Was ${formatPrice(comparePrice, showDecimals)}`}
          className={cn(
            "text-muted-foreground line-through",
            size === "lg" || size === "xl" ? "text-sm" : "text-xs"
          )}
        >
          {formatPrice(comparePrice, showDecimals)}
        </span>
      )}
    </div>
  );
}
