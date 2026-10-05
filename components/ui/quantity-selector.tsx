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

  const buttonSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const textSize = size === "sm" ? "text-sm w-7" : "text-[15px] w-9";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-white text-brand-purple",
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
          "press flex items-center justify-center rounded-full",
          "hover:bg-brand-cream/70 disabled:opacity-35 disabled:cursor-not-allowed"
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={iconSize} />
      </button>
      <span
        className={cn(
          textSize,
          "flex items-center justify-center font-semibold tabular-nums"
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
          "press flex items-center justify-center rounded-full",
          "hover:bg-brand-cream/70 disabled:opacity-35 disabled:cursor-not-allowed"
        )}
        aria-label="Increase quantity"
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
