// =============================================================
// Lassana LK — SEO helpers (site URL, shared copy, structured data)
// =============================================================

import { SITE_CONFIG, SOCIAL_LINKS } from "./constants";

/** Absolute site origin without a trailing slash. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = SITE_CONFIG.url.replace(/\/+$/, "");

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const SEO_COPY = {
  defaultTitle: "Lassana LK | Personalized Name Pendants & Jewelry in Sri Lanka",
  description:
    "Personalized name pendants, custom jewelry and laser-cut 2D metal signs, made to order in Sri Lanka. Order online and pay cash on delivery anywhere in the island.",
  keywords: [
    "Lassana LK",
    "name pendant Sri Lanka",
    "personalized jewelry Sri Lanka",
    "custom name necklace",
    "name necklace Sri Lanka",
    "personalized gifts Sri Lanka",
    "custom jewelry",
    "18k gold plated jewelry",
    "2D metal sign",
    "laser cut metal sign",
    "cash on delivery jewelry",
    "online jewelry store Sri Lanka",
  ],
};

/** Phone in international format, e.g. +94755040704 */
export const PHONE_E164 = `+${SITE_CONFIG.whatsappNumber.replace(/\D/g, "")}`;

/** Organisation / online store — rendered once on every storefront page. */
export function storeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OnlineStore",
        "@id": `${SITE_URL}/#store`,
        name: SITE_CONFIG.name,
        url: SITE_URL,
        logo: absoluteUrl("/logo/full%20logo.png"),
        image: absoluteUrl("/opengraph-image"),
        description: SEO_COPY.description,
        slogan: SITE_CONFIG.tagline,
        sameAs: [SOCIAL_LINKS.facebook],
        areaServed: { "@type": "Country", name: "Sri Lanka" },
        currenciesAccepted: SITE_CONFIG.currency,
        paymentAccepted: "Cash on delivery",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: PHONE_E164,
          contactType: "customer service",
          areaServed: "LK",
          url: `https://wa.me/${SITE_CONFIG.whatsappNumber}`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_CONFIG.name,
        url: SITE_URL,
        inLanguage: "en-LK",
        publisher: { "@id": `${SITE_URL}/#store` },
      },
    ],
  };
}

/** Serialises JSON-LD safely for a <script> tag (escapes "<" to block injection). */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
