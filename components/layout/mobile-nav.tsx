"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Truck, CircleHelp } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { generalInquiryLink } from "@/lib/whatsapp";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECONDARY_LINKS = [
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/delivery", label: "Delivery information", icon: Truck },
  { href: "/faq", label: "FAQ", icon: CircleHelp },
];

/**
 * Mobile navigation drawer. Links settle in one after another as it opens.
 */
export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="gap-0 bg-white p-0 data-[side=left]:w-[86vw] data-[side=left]:max-w-sm">
        <SheetTitle className="sr-only">Menu</SheetTitle>

        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Link href="/" onClick={onClose} aria-label="Lassana LK home" className="flex items-center gap-3">
            <Image
              src="/logo/only logo.png"
              alt=""
              width={28}
              height={48}
              className="h-11 w-auto"
              style={{ width: "auto" }}
            />
            <span className="font-display text-2xl text-brand-purple">
              Lassana <span className="text-brand-gold">LK</span>
            </span>
          </Link>
        </div>

        <nav className="px-3 py-5" aria-label="Mobile navigation">
          <ul>
            {NAV_LINKS.map((link, i) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li
                  key={link.href}
                  style={isOpen ? { animation: `rise-in 380ms var(--ease-out) ${120 + i * 45}ms both` } : undefined}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-3 font-heading font-semibold text-[22px] leading-tight transition-colors",
                      active ? "text-brand-purple" : "text-foreground/80 hover:bg-brand-cream/50 hover:text-brand-purple"
                    )}
                  >
                    {link.label}
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mx-5 border-t border-border" />

        <ul className="px-3 py-4">
          {SECONDARY_LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-foreground/80 transition-colors hover:bg-brand-cream/50 hover:text-brand-purple"
              >
                <Icon className="h-[18px] w-[18px] text-brand-gold-deep" />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto border-t border-border p-5">
          <a
            href={generalInquiryLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="press flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] text-[15px] font-semibold text-white hover:bg-[#1FB957]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat with us on WhatsApp
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
