import { MapPin, MessageCircle, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generalInquiryLink } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: "Contact Us | Lassana LK",
  description: "Get in touch with Lassana LK for inquiries about personalized jewelry, orders, and support.",
};

export default function ContactPage() {
  return (
    <div className="bg-brand-ivory min-h-screen pb-24 pt-12">
      <div className="container-main max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-purple mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help you find the perfect piece or answer any questions you might have about your order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-border/40 flex gap-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">WhatsApp Support</h3>
                <p className="text-sm text-muted-foreground mb-3">Fastest way to reach us for order updates and design previews.</p>
                <a href={generalInquiryLink()} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#25D366] hover:underline">
                  +{SITE_CONFIG.whatsappNumber}
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border/40 flex gap-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-purple">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-3">For business inquiries and general questions.</p>
                <a href="mailto:hello@lassanalk.lk" className="text-sm font-semibold text-brand-purple hover:underline">
                  hello@lassanalk.lk
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border/40 flex gap-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-purple">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Working Hours</h3>
                <p className="text-sm text-muted-foreground">Monday - Saturday</p>
                <p className="text-sm font-semibold text-foreground">9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-border/40 shadow-sm h-full">
              <h2 className="text-2xl font-bold font-heading text-brand-purple mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="John Doe" className="bg-brand-ivory/50 border-border/40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="bg-brand-ivory/50 border-border/40" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Order Inquiry #LLK-..." className="bg-brand-ivory/50 border-border/40" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" className="bg-brand-ivory/50 border-border/40 min-h-[150px] resize-none" />
                </div>
                
                <Button type="button" size="lg" className="w-full md:w-auto px-8 bg-brand-purple hover:bg-brand-purple-deep text-white h-12">
                  Send Message
                </Button>
                
                <p className="text-xs text-muted-foreground mt-4">
                  * Note: This form is for demonstration. For the fastest response, please use our WhatsApp support.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
