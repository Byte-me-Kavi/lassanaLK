"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function HomeSplash() {
  const [show, setShow] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Start exit animation very quickly
    const timer1 = setTimeout(() => {
      setAnimateOut(true);
    }, 800);

    // Completely remove from DOM after animation completes
    const timer2 = setTimeout(() => {
      setShow(false);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-cream transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        animateOut ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Image 
          src="/logo/full logo.png" 
          alt="Lassana LK" 
          width={320} 
          height={120} 
          className="mb-8 object-contain drop-shadow-md"
          priority
        />
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-brand-purple mb-4 tracking-tight drop-shadow-sm">
          Exclusive Jewelry Collection
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light text-center px-4">
          Discover our premium range of handcrafted pieces, designed to celebrate your unique story.
        </p>
        <div className="mt-8 h-1 w-16 bg-brand-gold rounded-full"></div>
      </div>
    </div>
  );
}
