import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function PersonalizedSection() {
  return (
    <section className="py-16 md:py-24 bg-brand-purple text-white overflow-hidden">
      <div className="container-main relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left - Content */}
          <div className="z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Make It Uniquely <span className="text-brand-gold-soft">Yours</span>
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed">
              Our signature personalized pieces are crafted to celebrate your name, your loved ones, and your special moments. Choose from elegant fonts and beautiful finishes.
            </p>
            
            <ul className="space-y-4 mb-10 text-white/90">
              {['18k Gold Plated or Sterling Silver', 'Hand-polished finish', 'Ready in 7-10 business days', 'Beautifully packaged for gifting'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold-soft">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/?category=personalized-jewelry"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-gold px-8 text-sm font-medium text-white transition-all hover:bg-brand-gold-soft hover:shadow-lg hover:-translate-y-0.5"
            >
              Start Customizing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Right - Image Grid */}
          <div className="relative h-100 md:h-125 w-full">
            <div className="absolute right-0 top-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-2xl z-20 transform translate-x-4 -translate-y-4">
              <Image
                src="/placeholder.jpg"
                alt="Personalized Jewelry Closeup"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute left-0 bottom-0 w-2/3 h-2/3 rounded-2xl overflow-hidden shadow-2xl z-10 transform -translate-x-4 translate-y-4">
              <Image
                src="/placeholder.jpg"
                alt="Couple Name Necklace"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
