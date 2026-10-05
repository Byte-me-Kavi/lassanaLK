import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for ordering from Lassana LK, including production times, delivery and returns.",
  alternates: { canonical: "/terms" },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen pb-20 pt-12">
      <div className="container-main max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-semibold text-brand-purple mb-8">
          Terms & Conditions
        </h1>
        
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-border max-w-none text-muted-foreground space-y-6">
          <p className="text-sm font-medium">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">1. Agreement to Terms</h2>
          <p>
            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Lassana LK ("we," "us," or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
          </p>
          <p className="mt-4">
            You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the Site and you must discontinue use immediately.
          </p>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">2. Products and Customizations</h2>
          <p>
            We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
          </p>
          <p className="mt-4">
            <strong className="text-foreground">Customized Jewelry:</strong> For personalized items (e.g., name necklaces, custom engravings), you are responsible for ensuring that the text, spelling, and formatting you provide are accurate. Once production begins, custom orders cannot be modified or canceled.
          </p>
          <p className="mt-4">
            <strong className="text-foreground">Tarnish Resistance:</strong> While our products are crafted with premium materials and are highly tarnish-resistant, proper care must be taken. Exposure to harsh chemicals, perfumes, or excessive moisture may impact the longevity of the piece.
          </p>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">3. Purchases and Payment</h2>
          <p>
            We accept <strong className="text-foreground">Cash on Delivery (COD)</strong> for all eligible regions in Sri Lanka.
          </p>
          <p className="mt-4">
            By placing an order for Cash on Delivery, you commit to making the full payment in cash to the courier upon delivery of your items. Refusal to pay upon delivery without a valid, pre-communicated reason may result in restrictions on your ability to place future COD orders on our Site.
          </p>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">4. Delivery and Shipping</h2>
          <p>
            Delivery times are estimates and commence from the date of dispatch, rather than the date of order. Delivery times are to be used as a guide only and are subject to the acceptance and approval of your order.
          </p>
          <p className="mt-4">
            Standard production time for customized jewelry may take between 3 to 7 business days before dispatch. You will be notified via phone or WhatsApp when your order is out for delivery.
          </p>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">5. Return and Refund Policy</h2>
          <p>
            Due to the nature of our products, our return policy varies based on the item type:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong className="text-foreground">Non-Customized Items:</strong> May be eligible for return or exchange within 7 days of delivery, provided they are unworn, in their original condition, and in the original packaging.</li>
            <li><strong className="text-foreground">Customized Items:</strong> Because personalized items are made specifically for you, they cannot be returned or exchanged unless the item is defective or we made an error in the customization based on your order details.</li>
          </ul>
          <p className="mt-4">
            If you receive a damaged or incorrect item, please <Link href="/" className="text-brand-purple underline hover:text-brand-gold">contact us</Link> immediately within 24 hours of delivery with photographic evidence.
          </p>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">6. Modifications and Interruptions</h2>
          <p>
            We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the products without notice at any time.
          </p>
          <p className="mt-4">
            We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site or our products.
          </p>

          <h2 className="text-xl font-heading font-semibold text-brand-purple mt-8 mb-4">7. Contact Us</h2>
          <p>
            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us through our official WhatsApp channel or by using the contact details provided on our website.
          </p>
        </div>
      </div>
    </div>
  );
}
