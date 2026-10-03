import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { FOOTER_LINKS, SOCIAL_LINKS, SITE_CONFIG } from "@/lib/constants";

/**
 * Site-wide footer with shop links, help, company info, and social links.
 */
export function Footer() {
  return (
    <footer className="bg-white border-t border-border/40">
      <div className="container-main section-padding-sm">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo/full logo.png"
                alt="Lassana LK"
                width={120}
                height={42}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-brand-purple/70 max-w-xs leading-relaxed">
              {SITE_CONFIG.tagline}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
                aria-label="Contact us on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-bold text-brand-purple mb-4 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-purple/70 hover:text-brand-purple transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-sm font-bold text-brand-purple mb-4 uppercase tracking-wider">
              Help
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-purple/70 hover:text-brand-purple transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-bold text-brand-purple mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-purple/70 hover:text-brand-purple transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-brand-purple/60 font-medium">
              © {new Date().getFullYear()} Lassana LK. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-brand-purple/60 font-medium">
              <Link href="/privacy" className="hover:text-brand-purple transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-brand-purple transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
