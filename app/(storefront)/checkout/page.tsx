import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { ShieldCheck, Truck } from "lucide-react";

export const metadata = {
  title: "Checkout | Lassana LK",
  description: "Complete your order securely with Cash on Delivery.",
};

export default function CheckoutPage() {
  return (
    <div className="bg-brand-ivory min-h-screen pb-20 pt-8">
      <div className="container-main max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-purple mb-3">
            Checkout
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#25D366]" />
            Secure Cash on Delivery Order
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Form Area */}
          <div className="w-full lg:flex-1 order-2 lg:order-1">
            <CheckoutForm />
          </div>

          {/* Order Summary Sidebar */}
          <aside className="w-full lg:w-[400px] xl:w-[450px] shrink-0 order-1 lg:order-2">
            <OrderSummary />
            
            <div className="mt-6 flex items-start gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
              <Truck className="h-6 w-6 shrink-0 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Islandwide Delivery</h4>
                <p className="text-xs opacity-90 leading-relaxed">
                  Your order will be crafted and delivered within 7-10 business days. We will contact you via WhatsApp to confirm the final delivery date.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
