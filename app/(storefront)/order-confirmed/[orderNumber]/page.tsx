import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmedPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  return (
    <div className="bg-brand-cream min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 text-center shadow-xl border border-border relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-50 rounded-full -z-10" />

        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm border-4 border-white">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-brand-purple mb-4">
          Order Confirmed!
        </h1>
        
        <p className="text-muted-foreground mb-8 text-lg">
          Thank you for your purchase. Your order has been received and is now being processed.
        </p>

        <div className="bg-brand-ivory rounded-xl p-6 mb-8 text-left border border-border">
          <p className="text-sm text-muted-foreground mb-1">Order Number</p>
          <p className="text-xl font-mono font-bold text-foreground tracking-wider mb-4">
            {params.orderNumber}
          </p>
          
          <div className="h-px bg-border/60 mb-4" />
          
          <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>1. Our team will review your order and customization details.</li>
            <li>2. We will contact you via WhatsApp to confirm the final design.</li>
            <li>3. Your order will be made within 3–7 business days, then delivered in 1–3 business days.</li>
            <li>4. You will pay the courier in cash upon delivery.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button render={<Link href="/" />} size="lg" className="h-12 bg-brand-purple hover:bg-brand-purple-deep">
            <span className="flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </span>
          </Button>
          <Button render={<Link href="/" />} variant="outline" size="lg" className="h-12 border-brand-purple text-brand-purple hover:bg-brand-cream">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
