import { MessageCircle } from "lucide-react";
import { generalInquiryLink } from "@/lib/whatsapp";

export function WhatsappCta() {
  return (
    <section className="py-16 md:py-20 bg-brand-cream">
      <div className="container-main">
        <div className="rounded-3xl bg-white p-8 md:p-12 text-center shadow-sm border border-border/40 max-w-4xl mx-auto">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Need Help Choosing?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Our team is ready to help you find or customize the perfect piece of jewelry. Send us a message on WhatsApp for personalized assistance.
          </p>
          <a
            href={generalInquiryLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-[#25D366] px-8 text-sm font-medium text-white transition-all hover:bg-[#20BD5A] hover:shadow-lg hover:-translate-y-0.5 shadow-md shadow-[#25D366]/20"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
