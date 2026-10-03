"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Mobile navigation drawer.
 * Opens from the left with smooth animation.
 */
export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-75 bg-white p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <Link href="/" onClick={onClose} aria-label="Lassana LK Home">
            <Image
              src="/logo/onlyl-ogo.png"
              alt="Lassana LK"
              width={40}
              height={40}
              className="h-9 w-auto"
              style={{ width: "auto" }}
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-4" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-lg",
                    "text-base font-medium text-foreground/80",
                    "hover:bg-muted hover:text-foreground",
                    "transition-colors"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <div className="mx-5 border-t border-border/60" />

        {/* Additional Links */}
        <div className="px-3 py-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/wishlist"
                onClick={onClose}
                className="flex items-center px-3 py-3 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Wishlist
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                onClick={onClose}
                className="flex items-center px-3 py-3 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/delivery"
                onClick={onClose}
                className="flex items-center px-3 py-3 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Delivery Info
              </Link>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-auto px-5 py-4 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Lassana LK
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
