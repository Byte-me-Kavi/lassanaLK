"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  text: string;
}

const GOLD_DASH_X = "repeating-linear-gradient(90deg, #EBB668 0 7px, transparent 7px 11px)";
const GOLD_DASH_Y = "repeating-linear-gradient(180deg, #EBB668 0 7px, transparent 7px 11px)";

/**
 * The four stages of an order, joined by a gold "chain" that draws itself
 * the first time the list scrolls into view.
 */
export function OrderJourney({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className="relative grid gap-9 lg:grid-cols-4 lg:gap-8">
      {/* Chain: horizontal on desktop, vertical on phones */}
      <span
        aria-hidden
        className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-0.5 transition-[clip-path] duration-[1400ms] ease-in-out lg:block"
        style={{ backgroundImage: GOLD_DASH_X, clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
      />
      <span
        aria-hidden
        className="absolute bottom-5 left-5 top-5 w-0.5 -translate-x-1/2 transition-[clip-path] duration-[1400ms] ease-in-out lg:hidden"
        style={{ backgroundImage: GOLD_DASH_Y, clipPath: inView ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
      />

      {steps.map((step, i) => (
        <li key={step.title} className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
          <span
            className={cn(
              "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-gold-light bg-brand-purple-deep text-[15px] font-bold text-brand-gold-light transition-[transform,opacity] duration-500 ease-out",
              inView ? "scale-100 opacity-100" : "scale-75 opacity-0"
            )}
            style={{ transitionDelay: `${150 + i * 300}ms` }}
          >
            {i + 1}
          </span>
          <div
            className={cn(
              "transition-[transform,opacity] duration-500 ease-out lg:mt-5",
              inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
            style={{ transitionDelay: `${250 + i * 300}ms` }}
          >
            <h3 className="text-lg text-white md:text-xl">{step.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-white/75 lg:mx-auto lg:max-w-[15rem]">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
