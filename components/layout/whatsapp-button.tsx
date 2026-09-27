"use client";

import { MessageCircle } from "lucide-react";
import { generalInquiryLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  className?: string;
}

/**
 * Floating WhatsApp button for customer communication.
 * Fixed position bottom-right on desktop, adjusted on mobile
 * to avoid overlapping important UI elements.
 */
export function WhatsAppButton({ className }: WhatsAppButtonProps) {
  return (
    <a
      href={generalInquiryLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed z-40",
        "bottom-6 right-6 md:bottom-8 md:right-8",
        "flex items-center justify-center",
        "h-14 w-14 rounded-full",
        "bg-[#25D366] text-white",
        "shadow-lg shadow-[#25D366]/30",
        "hover:bg-[#20BD5A] hover:shadow-xl hover:shadow-[#25D366]/40",
        "hover:scale-105",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
        className
      )}
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
