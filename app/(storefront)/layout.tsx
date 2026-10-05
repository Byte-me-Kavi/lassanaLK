import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { JsonLd } from "@/components/seo/json-ld";
import { storeJsonLd } from "@/lib/seo";

/**
 * Storefront layout — wraps all customer-facing pages.
 * Includes sticky header, footer, floating WhatsApp button, and cart drawer.
 */
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={storeJsonLd()} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </>
  );
}
