import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Banknote, Gem, Undo2 } from "lucide-react";
import { OrderJourney } from "@/components/about/order-journey";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { generalInquiryLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Lassana LK makes personalized name pendants and custom jewelry for customers across Sri Lanka, with simple cash on delivery ordering.",
  alternates: { canonical: "/about" },
};

const FACTS = [
  { value: "3–7 days", label: "to make your piece" },
  { value: "1–3 days", label: "to deliver islandwide" },
  { value: "Cash", label: "on delivery, no card needed" },
];

const JOURNEY = [
  { title: "Choose and personalize", text: "Pick a piece and add the name or words you want on it." },
  { title: "We confirm the details", text: "We contact you on WhatsApp to confirm the final design before we start." },
  { title: "Made for you", text: "Your piece is made in 3–7 business days." },
  { title: "Delivered, then paid", text: "Koombiyo Delivery brings it to your door in 1–3 business days. Pay the courier in cash." },
];

const PROMISES = [
  {
    icon: Gem,
    title: "Materials that last",
    text: "18k gold plated, sterling silver, stainless steel and more, chosen to resist tarnish with everyday wear.",
  },
  {
    icon: Banknote,
    title: "No online payment",
    text: "You pay only when your order is in your hands. No cards or bank transfers needed.",
  },
  {
    icon: WhatsAppIcon,
    title: "Help from real people",
    text: "Ask questions, get design previews and follow your order on WhatsApp.",
  },
  {
    icon: Undo2,
    title: "Made right, or we fix it",
    text: "If a piece arrives with a manufacturing defect, message us on WhatsApp within 48 hours of delivery.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container-main grid items-center gap-10 pb-16 pt-10 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-24">
        <div className="rise-in">
          <h1 className="text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl">Jewelry made personal.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80 md:text-xl">
            Lassana LK makes personalized name pendants, engraved pieces and laser-cut metal signs for people across
            Sri Lanka. You choose the words, we make the piece, and you pay in cash when it reaches your door.
          </p>

          <dl className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-border border-y border-border">
            {FACTS.map((fact) => (
              <div key={fact.value} className="px-3 py-4 first:pl-0 sm:px-5">
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <span className="block text-xl font-semibold text-brand-purple sm:text-2xl">{fact.value}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-muted-foreground sm:text-sm">{fact.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-brand-cream sm:aspect-5/4 lg:aspect-4/5">
            <Image
              src="/about-hero.jpg"
              alt="A customer wearing a gold name pendant"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          {/* Small note pinned to the photo */}
          <p className="absolute -bottom-5 left-4 right-4 rounded-2xl bg-white px-5 py-4 text-[15px] leading-snug text-foreground shadow-[0_18px_40px_-18px_rgba(32,0,48,0.45)] ring-1 ring-border sm:left-auto sm:right-6 sm:max-w-xs">
            <span className="font-semibold text-brand-purple">Every name is checked with you</span> on WhatsApp before
            we make it.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="border-t border-border bg-white" aria-labelledby="story-heading">
        <div className="container-main grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl lg:order-2">
            <Image
              src="/about-craft.jpg"
              alt="A jeweler shaping a gold ring at the workbench"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[65%_center]"
            />
          </div>

          <div className="lg:order-1">
            <h2 id="story-heading">Why we started</h2>
            <div className="mt-5 max-w-prose space-y-4 text-base leading-[1.75] text-foreground/80 md:text-[17px]">
              <p>
                Lassana LK began with a simple idea: beautiful, personalized jewelry should be easy to order anywhere in
                Sri Lanka, without complicated online payments.
              </p>
              <p>
                We specialize in custom name pendants, engraved rings and bespoke pieces that carry meaning, and we keep
                ordering simple with cash on delivery to your door.
              </p>
            </div>
            <blockquote className="mt-8 border-l-2 border-brand-gold pl-5">
              <p className="text-xl font-semibold leading-snug text-brand-purple md:text-2xl">
                Jewelry is more than an accessory. It&apos;s a memory, a statement, and a celebration of the people you
                love.
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* How an order works */}
      <section className="relative overflow-hidden bg-brand-purple-deep text-white" aria-labelledby="journey-heading">
        <div aria-hidden className="h-px bg-linear-to-r from-transparent via-brand-gold/60 to-transparent" />
        <div className="container-main py-16 md:py-24">
          <div className="mb-12 max-w-2xl md:mb-16">
            <h2 id="journey-heading" className="text-white">
              From your idea to your door
            </h2>
            <p className="mt-3 text-lg text-white/75">Four steps, and you only pay at the last one.</p>
          </div>
          <OrderJourney steps={JOURNEY} />
        </div>
      </section>

      {/* Promises */}
      <section className="container-main py-16 md:py-24" aria-labelledby="promises-heading">
        <h2 id="promises-heading" className="max-w-xl">
          What you can count on
        </h2>
        <ul className="mt-10 grid gap-x-12 sm:grid-cols-2">
          {PROMISES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 border-t border-border py-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-purple">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg md:text-xl">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-foreground/75 md:text-base">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Call to action */}
      <section className="container-main pb-20 md:pb-28">
        <div className="flex flex-col items-start gap-6 rounded-3xl bg-brand-cream px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between md:py-12">
          <div>
            <h2 className="text-3xl md:text-4xl">Have a name in mind?</h2>
            <p className="mt-2 max-w-md text-base text-foreground/75 md:text-lg">
              Browse the collection, or tell us what you want on WhatsApp.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/#shop"
              className="press inline-flex h-12 items-center justify-center rounded-full bg-brand-purple px-7 text-[15px] font-semibold text-white hover:bg-brand-purple-light"
            >
              Browse the collection
            </Link>
            <a
              href={generalInquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#128C4A] ring-1 ring-[#25D366]/50 hover:bg-[#25D366] hover:text-white"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
