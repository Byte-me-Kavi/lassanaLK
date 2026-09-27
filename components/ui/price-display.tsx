import { cn, formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  comparePrice?: number | null;
  size?: "sm" | "md" | "lg";
  showDecimals?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
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
    <div className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-semibold text-foreground",
          sizeClasses[size],
          hasDiscount && "text-brand-purple"
        )}
      >
        {formatPrice(price, showDecimals)}
      </span>
      {hasDiscount && (
        <span
          className={cn(
            "text-muted-foreground line-through",
            size === "lg" ? "text-sm" : "text-xs"
          )}
        >
          {formatPrice(comparePrice, showDecimals)}
        </span>
      )}
    </div>
  );
}
