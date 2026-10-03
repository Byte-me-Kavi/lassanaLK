import { MessageCircle, Mail, Clock } from "lucide-react";
import { generalInquiryLink } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: "Contact Us | Lassana LK",
  description: "Get in touch with Lassana LK for inquiries about personalized jewelry, orders, and support.",
};

export default function ContactPage() {
  return (
    <div className="bg-brand-ivory min-h-screen pb-24 pt-16 md:pt-24">
      <div className="container-main max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-purple mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help you find the perfect personalized piece or answer any questions you might have about your order.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* WhatsApp Support Card */}
          <div className="bg-white p-8 rounded-3xl border border-border/40 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366] mb-6 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold font-heading text-foreground mb-3">WhatsApp Support</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              The fastest way to reach us for order updates, design previews, and quick questions.
            </p>
            <a 
              href={generalInquiryLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20b858] transition-colors w-full"
            >
              Message Us
            </a>
          </div>

          {/* Email Us Card */}
          <div className="bg-white p-8 rounded-3xl border border-border/40 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cream text-brand-purple mb-6 group-hover:scale-110 transition-transform duration-300">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold font-heading text-foreground mb-3">Email Us</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Prefer email? Reach out for business inquiries, bulk orders, and detailed questions.
            </p>
            <a 
              href="mailto:hello@lassanalk.lk" 
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-brand-purple text-white font-bold hover:bg-brand-purple-deep transition-colors w-full"
            >
              hello@lassanalk.lk
            </a>
          </div>

          {/* Working Hours Card */}
          <div className="bg-white p-8 rounded-3xl border border-border/40 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cream text-brand-purple mb-6 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold font-heading text-foreground mb-3">Working Hours</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Our digital doors never close. We are available to process orders and answer queries around the clock.
            </p>
            <div className="w-full bg-brand-ivory/50 rounded-xl p-3 border border-border/40">
              <p className="text-sm font-semibold text-brand-purple uppercase tracking-wider mb-1">All Days</p>
              <p className="text-lg font-bold text-foreground">24 Hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
