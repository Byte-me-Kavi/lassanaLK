import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/**
 * Homepage Hero Section
 * Features a large visual, headline, and primary CTAs.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-cream">
      <div className="container-main py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left z-10">
            <p className="text-sm font-medium text-brand-gold uppercase tracking-widest mb-4">
              Premium Personalized Jewelry
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-brand-purple">
              Jewelry Made <br className="hidden lg:block" />
              <span className="gradient-gold">Personal</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8">
              Beautiful pieces crafted to celebrate your story. Each design is
              made with care and attention to detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-purple px-8 text-sm font-medium text-white transition-all hover:bg-brand-purple-deep hover:shadow-lg hover:-translate-y-0.5"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/shop/personalized-jewelry"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-brand-purple px-8 text-sm font-medium text-brand-purple transition-all hover:bg-brand-purple hover:text-white"
              >
                Customize Yours
              </Link>
            </div>
          </div>

          {/* Right — Visual */}
          <div className="flex justify-center lg:justify-end relative h-[400px] md:h-[500px] w-full">
            {/* Soft glow behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-gold-soft/20 rounded-full blur-3xl" />
            
            <Image
              src="/placeholder.jpg"
              alt="Elegant Gold Name Pendant"
              fill
              className="object-cover rounded-2xl shadow-2xl"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
