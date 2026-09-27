import { Truck, ShieldCheck, Gem, HeadphonesIcon } from "lucide-react";

const BADGES = [
  {
    title: "Cash on Delivery",
    description: "Pay when you receive your order across Sri Lanka.",
    icon: Truck,
  },
  {
    title: "Premium Quality",
    description: "Crafted with durable materials that won't tarnish easily.",
    icon: Gem,
  },
  {
    title: "Secure Packaging",
    description: "Every piece arrives in a beautiful, safe gift box.",
    icon: ShieldCheck,
  },
  {
    title: "Customer Support",
    description: "We're always here to help via WhatsApp.",
    icon: HeadphonesIcon,
  },
];

export function TrustBadges() {
  return (
    <section className="py-12 bg-white border-y border-border/40">
      <div className="container-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream text-brand-purple">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">{badge.title}</h3>
                <p className="text-sm text-muted-foreground max-w-[200px]">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
