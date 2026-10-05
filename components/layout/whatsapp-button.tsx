"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { generalInquiryLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  className?: string;
}

const GREETING_KEY = "llk-wa-greeting";
const GREETING_DELAY_MS = 7000;

/**
 * Floating WhatsApp button for customer communication.
 * A pill with a label on larger screens, a round button on phones.
 * A soft pulse plays a few times after load, and a short greeting
 * appears once per session so shoppers know help is a tap away.
 */
export function WhatsAppButton({ className }: WhatsAppButtonProps) {
  const pathname = usePathname();
  const [showGreeting, setShowGreeting] = useState(false);
  const hidden = pathname.startsWith("/checkout");

  useEffect(() => {
    if (hidden) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(GREETING_KEY) === "1";
    } catch {}
    if (seen) return;
    const timer = setTimeout(() => setShowGreeting(true), GREETING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [hidden]);

  const dismissGreeting = () => {
    setShowGreeting(false);
    try {
      sessionStorage.setItem(GREETING_KEY, "1");
    } catch {}
  };

  // On checkout it would cover form fields; the page has its own help text
  if (hidden) return null;

  return (
    <div className={cn("fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 md:bottom-7 md:right-7", className)}>
      {showGreeting && (
        <div
          role="status"
          className="relative max-w-60 rounded-2xl rounded-br-md bg-white py-3 pl-4 pr-9 text-sm leading-snug text-foreground shadow-[0_16px_40px_-12px_rgba(32,0,48,0.35)] ring-1 ring-border"
          style={{ animation: "rise-in 420ms var(--ease-out) both" }}
        >
          <p className="font-semibold text-brand-purple">Need help choosing?</p>
          <p className="mt-0.5 text-muted-foreground">Message us on WhatsApp and we will help you pick.</p>
          <button
            type="button"
            onClick={dismissGreeting}
            aria-label="Dismiss message"
            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <a
        href={generalInquiryLink()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={dismissGreeting}
        aria-label="Chat with us on WhatsApp"
        className={cn(
          "press relative flex h-14 items-center justify-center gap-2.5 rounded-full",
          "w-14 sm:w-auto sm:pl-4 sm:pr-5",
          "bg-[#25D366] text-white",
          "shadow-[0_14px_32px_-8px_rgba(37,211,102,0.7)] ring-4 ring-white",
          "hover:bg-[#1FB957]",
          "focus-visible:outline-none focus-visible:ring-[#25D366]/40"
        )}
      >
        {/* Attention pulse: a few rings after load, then it rests */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
          style={{ animation: "wa-ping 1.8s var(--ease-out) 2.5s 3 both" }}
        />
        <WhatsAppIcon className="relative h-7 w-7 sm:h-6 sm:w-6" />
        <span className="relative hidden text-[15px] font-semibold sm:inline">Chat with us</span>
      </a>
    </div>
  );
}
