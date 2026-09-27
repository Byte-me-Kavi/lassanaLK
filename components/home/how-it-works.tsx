import { SectionHeading } from "@/components/ui/section-heading";
import { MousePointer2, PenTool, ShoppingCart, CheckCircle, Gift } from "lucide-react";

const STEPS = [
  {
    title: "Choose",
    description: "Browse our beautiful collection of jewelry.",
    icon: MousePointer2,
  },
  {
    title: "Customize",
    description: "Add your name or special message.",
    icon: PenTool,
  },
  {
    title: "Order",
    description: "Place your order simply with Cash on Delivery.",
    icon: ShoppingCart,
  },
  {
    title: "Confirm",
    description: "We'll contact you to confirm the details.",
    icon: CheckCircle,
  },
  {
    title: "Receive",
    description: "Get your custom piece delivered to your door.",
    icon: Gift,
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <SectionHeading
          title="How It Works"
          subtitle="From choosing your piece to receiving it, we make the process simple and exciting."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          {/* Connector Line (Desktop only) */}
          <div className="hidden lg:block absolute top-10 left-16 right-16 h-0.5 bg-border -z-10" />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="mb-5 relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-cream border-4 border-white shadow-sm text-brand-purple">
                  <Icon className="h-8 w-8" />
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-white shadow-sm">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
