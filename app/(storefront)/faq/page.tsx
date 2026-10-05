import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { generalInquiryLink } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about ordering personalized jewelry from Lassana LK: cash on delivery, 3–7 day production, islandwide delivery, materials and returns.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    category: "Ordering & Payment",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We currently exclusively offer Cash on Delivery (COD) across Sri Lanka. You only pay when your jewelry is safely delivered to your hands.",
      },
      {
        q: "How do I place an order?",
        a: "Simply browse our collection, select your desired customizations (like name and finish), and add the item to your cart. Proceed to checkout, fill in your delivery details, and click 'Place COD Order'.",
      },
    ],
  },
  {
    category: "Customization & Crafting",
    questions: [
      {
        q: "How long does it take to make personalized jewelry?",
        a: "Since each piece is custom-made to your exact specifications, crafting takes 3 to 7 business days. Delivery then takes 1 to 3 business days anywhere in Sri Lanka.",
      },
      {
        q: "Will the jewelry tarnish?",
        a: "We use high-quality materials, such as 18k Gold Plating over Brass or Sterling Silver. While highly resistant to tarnishing, we recommend keeping your jewelry away from harsh chemicals, perfumes, and excessive water exposure to maintain its shine for years.",
      },
      {
        q: "Can I see a preview of my name pendant?",
        a: "Our website offers a general preview of the font style. For a more detailed mock-up, you can contact us via WhatsApp after placing your order, and our design team will assist you.",
      },
    ],
  },
  {
    category: "Delivery & Returns",
    questions: [
      {
        q: "Do you deliver islandwide?",
        a: "Yes! We offer islandwide delivery across all districts in Sri Lanka through our trusted courier partners.",
      },
      {
        q: "How much is the delivery fee?",
        a: "Our standard delivery fee is Rs. 450 per product. We occasionally run free delivery promotions, which will be highlighted during checkout.",
      },
      {
        q: "What is your return policy?",
        a: "Because our personalized items are custom-made specifically for you, they cannot be returned or exchanged unless there is a manufacturing defect or an error on our part. If you receive a defective item, please contact us on WhatsApp within 48 hours of delivery.",
      },
    ],
  },
];

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.flatMap((group) =>
      group.questions.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      }))
    ),
  };

  return (
    <div className="bg-brand-cream min-h-screen pb-20 pt-12">
      <JsonLd data={faqJsonLd} />
      <div className="container-main max-w-4xl">
        <SectionHeading 
          title="Frequently Asked Questions" 
          subtitle="Find answers to common questions about our products, delivery, and ordering process."
        />

        <div className="space-y-12 mt-12">
          {FAQS.map((group, groupIdx) => (
            <div key={groupIdx} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border">
              <h2 className="text-2xl font-heading font-semibold text-brand-purple mb-6 pb-2 border-b border-border">
                {group.category}
              </h2>
              
              <Accordion className="w-full">
                {group.questions.map((faq, idx) => (
                  <AccordionItem key={idx} value={`item-${groupIdx}-${idx}`}>
                    <AccordionTrigger className="py-4 text-left text-[15px] font-semibold text-foreground hover:text-brand-purple hover:no-underline md:text-base">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-16 text-center bg-brand-purple text-white p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative z-10">
            <h3 className="text-2xl text-white font-bold mb-4">Still have questions?</h3>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Our team is always happy to help you via WhatsApp.
            </p>
            <a
              href={generalInquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#25D366] px-8 text-sm font-medium text-white transition-all hover:bg-[#20BD5A]"
            >
              <WhatsAppIcon className="mr-2 h-5 w-5" />
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
