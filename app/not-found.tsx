// =============================================================
// Lassana LK — Custom 404 Page
// =============================================================

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8 h-36 w-20" style={{ transformOrigin: "50% 0%", animation: "pendant-drop 1100ms var(--ease-out) both" }}>
        <Image src="/logo/only logo.png" alt="" fill sizes="80px" className="object-contain" priority />
      </div>
      <p className="tabular font-heading font-semibold text-2xl text-brand-gold-deep">404</p>
      <h1 className="mt-2 text-4xl md:text-5xl">This page slipped off the chain</h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        The link may be old, or the piece may no longer be in the collection.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/#shop"
          className="press inline-flex h-12 items-center justify-center rounded-full bg-brand-purple px-7 text-[15px] font-semibold text-white hover:bg-brand-purple-light"
        >
          Browse the collection
        </Link>
        <Link
          href="/contact"
          className="press inline-flex h-12 items-center justify-center rounded-full border border-brand-purple/25 bg-white px-7 text-[15px] font-semibold text-brand-purple hover:border-brand-purple"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
