// =============================================================
// Lassana LK — Custom 404 Page
// =============================================================

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Image
        src="/logo/full logo.png"
        alt="Lassana LK"
        width={200}
        height={70}
        className="mb-10 w-auto h-16 md:h-20"
      />
      <h1 className="text-6xl font-bold text-brand-purple mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Page Not Found
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go Home
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
