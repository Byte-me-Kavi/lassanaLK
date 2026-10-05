"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";

export const SPLASH_KEY = "llk-splash-seen";

const noopSubscribe = () => () => {};

function readSeen() {
  try {
    return sessionStorage.getItem(SPLASH_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * True once the intro has played in this browser session.
 * The server always reports `false`; an inline script in the root layout
 * hides the splash before paint on repeat visits so there is no flash.
 */
export function useSplashSeen() {
  return useSyncExternalStore(noopSubscribe, readSeen, () => false);
}

const HOLD_MS = 1700;
const LIFT_MS = 700;

export function HomeSplash() {
  const seen = useSplashSeen();
  const [phase, setPhase] = useState<"intro" | "lifting" | "done">("intro");

  // Hold, then lift. Any key press skips ahead.
  useEffect(() => {
    if (seen || phase !== "intro") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skip = () => setPhase("lifting");
    const timer = setTimeout(skip, reduced ? 0 : HOLD_MS);
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", skip);
    };
  }, [seen, phase]);

  useEffect(() => {
    if (phase !== "lifting") return;
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(SPLASH_KEY, "1");
      } catch {}
      document.documentElement.dataset.splash = "seen";
      setPhase("done");
    }, LIFT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  if (seen || phase === "done") return null;

  return (
    <div
      role="presentation"
      onClick={() => setPhase("lifting")}
      className="home-splash fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-brand-purple-deep"
      style={{
        transform: phase === "lifting" ? "translateY(-100%)" : "translateY(0)",
        transition: `transform ${LIFT_MS}ms var(--ease-in-out)`,
      }}
    >
      {/* Soft lamp-light behind the pendant */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgb(181 127 57 / 0.28), rgb(80 16 112 / 0.22) 55%, transparent)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <div
          className="relative h-48 w-28 md:h-64 md:w-36"
          style={{
            transformOrigin: "50% 0%",
            animation: "pendant-drop 1100ms var(--ease-out) both",
          }}
        >
          <Image
            src="/logo/only logo.png"
            alt=""
            fill
            priority
            sizes="144px"
            className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
          />
        </div>

        <p
          className="mt-6 font-display text-4xl md:text-5xl text-white tracking-tight"
          style={{ animation: "fade-blur-in 700ms var(--ease-out) 450ms both" }}
        >
          Lassana <span className="text-brand-gold-light">LK</span>
        </p>
        <p
          className="mt-3 text-sm md:text-base text-white/75"
          style={{ animation: "fade-blur-in 700ms var(--ease-out) 650ms both" }}
        >
          Beautiful jewelry, made personal.
        </p>
      </div>
    </div>
  );
}
