import { Metadata } from "next";
import { Truck, MapPin, Clock, Banknote, ShieldCheck } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Delivery Information",
  description:
    "Lassana LK delivers islandwide with Koombiyo Delivery. Orders are made in 3–7 business days, delivered in 1–3 business days, and paid in cash on delivery.",
  alternates: { canonical: "/delivery" },
};

export default function DeliveryPage() {
  return (
    <div className="min-h-screen pb-20 pt-12">
      <div className="container-main max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-heading font-semibold text-brand-purple mb-4 text-center">
          Delivery Information
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          We want to make sure your beautiful jewelry reaches you safely and on time. Here is everything you need to know about our delivery process.
        </p>
        
        {/* Main Delivery Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Truck className="w-24 h-24 text-brand-purple" />
            </div>
            <div className="w-12 h-12 bg-brand-cream rounded-xl flex items-center justify-center mb-6 text-brand-purple">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-brand-purple mb-3">Our Delivery Partner</h2>
            <p className="text-muted-foreground mb-4">
              We exclusively partner with <strong>Koombiyo Delivery</strong> to handle all our shipments. Koombiyo is known for its reliable and fast island-wide courier services across Sri Lanka, ensuring your precious items are handled with care.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock className="w-24 h-24 text-brand-purple" />
            </div>
            <div className="w-12 h-12 bg-brand-cream rounded-xl flex items-center justify-center mb-6 text-brand-purple">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-brand-purple mb-3">Delivery Timeframes</h2>
            <p className="text-muted-foreground mb-2">
              <strong>Production Time:</strong> 3 to 7 business days for customized pieces.
            </p>
            <p className="text-muted-foreground">
              <strong>Transit Time:</strong> Once handed over to Koombiyo Delivery, it typically takes 1 to 3 business days to reach your doorstep anywhere in Sri Lanka.
            </p>
          </div>
        </div>

        {/* How it Works / COD section */}
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-border mb-12">
          <h2 className="text-2xl font-heading font-semibold text-brand-purple mb-8 border-b border-border pb-4">Key Delivery Features</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 shrink-0 bg-brand-purple text-white rounded-full flex items-center justify-center mt-1">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-purple mb-2">Cash on Delivery (COD)</h3>
                <p className="text-muted-foreground">
                  We offer Cash on Delivery (COD) across the island through Koombiyo Delivery. Simply place your order online, and pay the courier agent in cash when your jewelry arrives at your home.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 shrink-0 bg-brand-purple text-white rounded-full flex items-center justify-center mt-1">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-purple mb-2">Island-wide Coverage</h3>
                <p className="text-muted-foreground">
                  No matter where you are in Sri Lanka, Koombiyo's extensive network ensures that we can deliver your Lassana LK package straight to your door.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 shrink-0 bg-brand-purple text-white rounded-full flex items-center justify-center mt-1">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-purple mb-2">Order Tracking</h3>
                <p className="text-muted-foreground">
                  Once your order is dispatched, you will receive a tracking link or waybill number. You can use this to track the live status of your delivery directly on the Koombiyo tracking portal.
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
