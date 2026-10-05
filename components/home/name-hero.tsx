"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Banknote, MessageCircle, PenLine, PenTool } from "lucide-react";
import { useSplashSeen } from "@/components/home/home-splash";

const DEMO_NAMES = ["Amaya", "Nethmi", "Kavindi", "Sahan", "Dilini", "Tharushi"];
const MAX_NAME = 12;

/** Script size shrinks as the name gets longer so it always fits the chain. */
function nameSize(length: number) {
  if (length <= 6) return "text-[64px] sm:text-[84px] lg:text-[96px]";
  if (length <= 9) return "text-[52px] sm:text-[68px] lg:text-[78px]";
  return "text-[40px] sm:text-[54px] lg:text-[62px]";
}

/** One half of the necklace chain, drawn from the outer top corner down to the name. */
function ChainHalf({ side, delay }: { side: "left" | "right"; delay: string }) {
  const gradientId = useId();
  const path = side === "left"
    ? "M 0 0 C 8 52, 48 84, 100 80"
    : "M 100 0 C 92 52, 52 84, 0 80";

  return (
    <div className="relative min-w-6 flex-1">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        className="absolute inset-0 h-full w-full overflow-visible"
        style={{
          animation: `${side === "left" ? "chain-reveal-left" : "chain-reveal-right"} 1100ms var(--ease-in-out) ${delay} both`,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8A5A1F" />
            <stop offset="45%" stopColor="#F6D59A" />
            <stop offset="100%" stopColor="#B57F39" />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={2.5}
          strokeDasharray="5 2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Jump ring where the chain meets the name */}
      <span
        aria-hidden
        className={`absolute top-[80%] -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-brand-gold-light ${
          side === "left" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
        }`}
        style={{ animation: `rise-in 400ms var(--ease-out) calc(${delay} + 900ms) both` }}
      />
    </div>
  );
}

export function NameHero() {
  const splashSeen = useSplashSeen();
  const inputId = useId();
  const [typed, setTyped] = useState("");
  const [focused, setFocused] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);

  // Start the hero sequence right after the intro lifts (or almost immediately on repeat visits)
  const delay = splashSeen ? "150ms" : "2200ms";

  const isTyping = typed.trim().length > 0;
  const displayName = isTyping ? typed.trim() : DEMO_NAMES[demoIndex];

  // Cycle sample names until the visitor types their own
  useEffect(() => {
    if (isTyping || focused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setDemoIndex((i) => (i + 1) % DEMO_NAMES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [isTyping, focused]);

  return (
    <section className="relative isolate overflow-hidden bg-brand-purple-deep text-white">
      {/* Photograph: gold on black satin, faded into the plum */}
      <div aria-hidden className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[62%]">
        <Image
          src="/splash-bg.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="object-cover object-[70%_center] opacity-30 lg:opacity-55"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 45%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 45%)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-purple-deep via-transparent to-brand-purple-deep/60" />
      </div>

      <div className="container-main">
        <div className="grid items-center gap-10 pb-12 pt-12 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-16 lg:pt-20">
          {/* Copy */}
          <div className="max-w-xl" style={{ animation: `rise-in 700ms var(--ease-out) ${delay} both` }}>
            <h1 className="text-white text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl">
              Your name, set in gold.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 md:text-lg">
              Personalized pendants and keepsakes, made to order in Sri Lanka. Order online and pay in cash when it reaches your door.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="#shop"
                className="press inline-flex h-12 items-center justify-center rounded-full bg-brand-gold-light px-7 text-[15px] font-semibold text-brand-purple-deep shadow-[0_10px_30px_-10px_rgba(235,182,104,0.7)] hover:bg-[#F2C680]"
              >
                Shop the collection
              </Link>
              <Link
                href="/delivery"
                className="text-[15px] font-medium text-white/85 underline decoration-white/30 underline-offset-[6px] transition-colors hover:text-white hover:decoration-brand-gold-light"
              >
                How delivery works
              </Link>
            </div>
          </div>

          {/* Live name pendant */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Plum vignette so the gold name reads cleanly over the photograph */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[130%] w-[115%] -translate-x-1/2 -translate-y-1/2"
              style={{ background: "radial-gradient(closest-side, rgb(32 0 48 / 0.88), rgb(32 0 48 / 0.55) 55%, transparent)" }}
            />
            <div className="flex h-44 items-stretch sm:h-52 lg:h-60" aria-live="polite">
              <ChainHalf side="left" delay={delay} />
              <div className="flex items-end">
                <span
                  key={isTyping ? "typed" : displayName}
                  className={`gold-foil font-script whitespace-nowrap px-1 pb-1 leading-[1.15] ${nameSize(displayName.length)}`}
                  style={{
                    filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.45))",
                    animation: isTyping
                      ? undefined
                      : `fade-blur-in 600ms var(--ease-out) ${demoIndex === 0 ? `calc(${delay} + 500ms)` : "0ms"} both, foil-sweep 1.6s var(--ease-out) ${demoIndex === 0 ? `calc(${delay} + 500ms)` : "0ms"} both`,
                  }}
                >
                  {displayName}
                </span>
              </div>
              <ChainHalf side="right" delay={delay} />
            </div>

            <div
              className="mx-auto mt-6 max-w-sm"
              style={{ animation: `rise-in 600ms var(--ease-out) calc(${delay} + 700ms) both` }}
            >
              <label htmlFor={inputId} className="sr-only">
                Type a name to preview it in gold
              </label>
              <div className="group relative">
                <PenLine className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gold-light" />
                <input
                  id={inputId}
                  value={typed}
                  maxLength={MAX_NAME}
                  onChange={(e) => setTyped(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Type a name to preview"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-12 w-full rounded-full border border-white/20 bg-white/[0.07] pl-11 pr-14 text-[15px] text-white placeholder:text-white/55 backdrop-blur-sm transition-[border-color,background-color] duration-200 focus:border-brand-gold-light/70 focus:bg-white/[0.11] focus:outline-none"
                />
                <span className="tabular pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/50">
                  {typed.length}/{MAX_NAME}
                </span>
              </div>
              <p className="mt-2.5 text-center text-[13px] leading-snug text-white/60">
                A quick look at our style. Ask us on WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* What every order comes with */}
        <ul className="grid grid-cols-1 gap-3 border-t border-white/10 py-6 text-sm text-white/85 sm:grid-cols-3 sm:gap-6">
          <li className="flex items-center gap-3">
            <Banknote className="h-5 w-5 shrink-0 text-brand-gold-light" />
            Cash on delivery, anywhere in Sri Lanka
          </li>
          <li className="flex items-center gap-3">
            <PenTool className="h-5 w-5 shrink-0 text-brand-gold-light" />
            Each personalized piece is made to order
          </li>
          <li className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 shrink-0 text-brand-gold-light" />
            Questions answered on WhatsApp
          </li>
        </ul>
      </div>
    </section>
  );
}
