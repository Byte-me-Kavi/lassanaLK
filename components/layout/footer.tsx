import Link from "next/link";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { FOOTER_LINKS, SOCIAL_LINKS, SITE_CONFIG } from "@/lib/constants";

const LINK_GROUPS = [
  { title: "Shop", links: FOOTER_LINKS.shop },
  { title: "Help", links: FOOTER_LINKS.help },
  { title: "Company", links: FOOTER_LINKS.company },
];

const socialClass =
  "press flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 hover:border-brand-gold-light hover:text-brand-gold-light";

/**
 * Site-wide footer with shop links, help, company info, and social links.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-purple-deep text-white">
      {/* Thin gold edge, like the rim of a setting */}
      <div aria-hidden className="h-px bg-linear-to-r from-transparent via-brand-gold/70 to-transparent" />

      <div className="container-main pb-8 pt-14 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Lassana LK home">
              <Image
                src="/logo/only logo.png"
                alt=""
                width={30}
                height={52}
                className="h-14 w-auto"
                style={{ width: "auto" }}
              />
              <span className="font-display text-3xl text-white">
                Lassana <span className="text-brand-gold-light">LK</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/70">
              {SITE_CONFIG.tagline} Personalized pieces, delivered anywhere in Sri Lanka with cash on delivery.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white hover:bg-[#1FB957]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Chat on WhatsApp
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label="Follow us on Facebook"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="font-heading font-semibold text-lg text-brand-gold-light">{group.title}</p>
                <ul className="mt-3 space-y-0.5">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="inline-block py-1.5 text-[15px] text-white/75 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-[13px] text-white/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Lassana LK. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="py-2 transition-colors hover:text-white">
              Privacy policy
            </Link>
            <Link href="/terms" className="py-2 transition-colors hover:text-white">
              Terms and conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
