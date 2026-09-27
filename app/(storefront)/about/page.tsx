import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShieldCheck, Sparkles, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "About Us | Lassana LK",
  description: "Learn about our story, our craftsmanship, and why Lassana LK is Sri Lanka's premium choice for personalized jewelry.",
};

const VALUES = [
  {
    title: "Premium Craftsmanship",
    description: "Every piece is crafted with meticulous attention to detail using high-quality materials designed to last.",
    icon: Sparkles,
  },
  {
    title: "Personal Connection",
    description: "We believe jewelry should tell a story. Our personalized pieces are designed to celebrate your unique moments.",
    icon: HeartHandshake,
  },
  {
    title: "Trust & Transparency",
    description: "From honest pricing to our secure Cash on Delivery service, we put your trust at the center of everything we do.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="bg-brand-cream py-16 md:py-24 text-center px-4">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-brand-purple mb-6">
          Our Story
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Bringing premium personalized jewelry to Sri Lanka with unmatched elegance and convenience.
        </p>
      </div>

      <div className="container-main pt-16 md:pt-24">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden bg-brand-cream border border-border/40">
            <Image
              src="/placeholder.jpg"
              alt="Crafting Jewelry"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-purple mb-6">
              Jewelry Made Personal
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>
                Founded with a passion for elegant design, Lassana LK was created to bring high-quality, personalized jewelry to customers across Sri Lanka without the hassle of complicated online payments.
              </p>
              <p>
                We understand that jewelry is more than just an accessory—it's a memory, a statement, and a celebration of the people you love. That's why we specialize in custom name pendants, engraved rings, and bespoke pieces that carry meaning.
              </p>
              <p>
                Our commitment is simple: beautiful designs, durable materials, and a seamless shopping experience capped off with our trusted Cash on Delivery service.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-brand-ivory rounded-3xl p-8 md:p-16 border border-border/40">
          <SectionHeading 
            title="Our Core Values" 
            subtitle="The principles that guide every piece we create."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream text-brand-purple shadow-sm">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
