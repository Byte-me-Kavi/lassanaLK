"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Reusable quantity increment/decrement selector.
 * Enforces min/max bounds.
 */
export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 10,
  size = "md",
  className,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > min) onQuantityChange(quantity - 1);
  };

  const increase = () => {
    if (quantity < max) onQuantityChange(quantity + 1);
  };

  const buttonSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const textSize = size === "sm" ? "text-xs w-7" : "text-sm w-9";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-background",
        className
      )}
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= min}
        className={cn(
          buttonSize,
          "flex items-center justify-center rounded-l-lg transition-colors",
          "hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={iconSize} />
      </button>
      <span
        className={cn(
          textSize,
          "flex items-center justify-center font-medium tabular-nums border-x border-border"
        )}
        aria-live="polite"
        aria-label={`Quantity: ${quantity}`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={quantity >= max}
        className={cn(
          buttonSize,
          "flex items-center justify-center rounded-r-lg transition-colors",
          "hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
        )}
        aria-label="Increase quantity"
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
