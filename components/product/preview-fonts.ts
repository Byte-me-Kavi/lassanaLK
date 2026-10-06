// =============================================================
// Lassana LK — Fonts for the live personalisation previews
// =============================================================
//
// None are preloaded: each face downloads only when a preview on the page uses it.

import {
  Abhaya_Libre,
  Great_Vibes,
  Kaushan_Script,
  Lora,
  Montserrat,
  Norican,
  Pinyon_Script,
  Playfair_Display,
  Sacramento,
} from "next/font/google";

import type { PendantFont } from "@/lib/pendant-designs";

const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", display: "swap", preload: false });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap", preload: false });
const norican = Norican({ subsets: ["latin"], weight: "400", display: "swap", preload: false });
const kaushan = Kaushan_Script({ subsets: ["latin"], weight: "400", display: "swap", preload: false });
const sacramento = Sacramento({ subsets: ["latin"], weight: "400", display: "swap", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], weight: "700", display: "swap", preload: false });
// Sinhala names (bracelets)
const abhaya = Abhaya_Libre({ subsets: ["sinhala", "latin"], weight: "600", display: "swap", preload: false });
// Engraved wallet nameplates and keychains
const lora = Lora({ subsets: ["latin"], weight: "500", style: "italic", display: "swap", preload: false });
const montserrat = Montserrat({ subsets: ["latin"], weight: "700", display: "swap", preload: false });

export const FONT_FAMILY: Record<PendantFont, string> = {
  pinyon: pinyon.style.fontFamily,
  greatVibes: greatVibes.style.fontFamily,
  norican: norican.style.fontFamily,
  kaushan: kaushan.style.fontFamily,
  sacramento: sacramento.style.fontFamily,
  playfair: playfair.style.fontFamily,
  abhaya: abhaya.style.fontFamily,
};

export const WALLET_FONTS = {
  serifItalic: { family: lora.style.fontFamily, weight: 500, style: "italic" },
  sansCaps: { family: montserrat.style.fontFamily, weight: 700, style: "normal" },
  script: { family: greatVibes.style.fontFamily, weight: 400, style: "normal" },
} as const;

export type FontSpec = { family: string; weight?: number; style?: string };

/** CSS font shorthand for canvas measuring and FontFace loading */
export const fontCss = (f: FontSpec, px: number) => `${f.style ?? "normal"} ${f.weight ?? 400} ${px}px ${f.family}`;

// A Sinhala sample makes the browser fetch the Sinhala subset too (subsets are split by unicode-range)
const SAMPLE = "Aa Bb Qq සිංහල";

const fontLoads = new Map<string, Promise<unknown>>();
export function loadFont(f: FontSpec | string) {
  const css = fontCss(typeof f === "string" ? { family: f } : f, 100);
  if (!fontLoads.has(css)) fontLoads.set(css, document.fonts.load(css, SAMPLE));
  return fontLoads.get(css)!;
}

/** Split text into what a reader sees as letters (keeps Sinhala vowel signs with their consonant) */
export function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].map((s) => s.segment);
  }
  return [...text];
}
