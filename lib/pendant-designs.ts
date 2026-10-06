// =============================================================
// Lassana LK — Name pendant design styles for the live preview
// =============================================================
//
// Each catalogue design (product slug "name-pendant-design-<n>") maps to the
// lettering and the ornaments that make up its look. The preview renderer
// (components/product/pendant-preview.tsx) places the ornaments around the
// customer's name using the measured letter shapes.

export type PendantFont = "pinyon" | "greatVibes" | "norican" | "kaushan" | "sacramento" | "playfair" | "abhaya";

export type OrnamentName =
  // crowns, stars, diamonds
  | "crown" // solid crown on the first letter
  | "crownOutline" // open crown on the first letter
  | "crownEnd" // solid crown on the last letter
  | "crownCenter" // solid crown standing on the middle of the name
  | "starTrail" // star with a shooting trail above the name
  | "starEnd" // star after the last letter
  | "diamondTop" // gem sitting on the first letter
  | "diamondEnd" // large outlined gem after the name
  | "diamondsSides" // gems at both ends
  // hearts
  | "heartEnd" // solid heart after the last letter
  | "heartStart" // solid heart before the first letter
  | "openHeartEnd" // outlined heart after the last letter
  | "openHeartStart" // outlined heart before the first letter
  | "linkedHeartsEnd" // two interlocked open hearts after the name
  | "heartCharmEnd" // heart charm with the initial, hanging after the name
  | "heartsSides" // solid hearts at both ends
  | "heartsUnder" // two little hearts under the first letter
  | "stoneHeartEnd" // stone-studded heart after the name
  | "heartBetween" // big heart between two stacked names
  | "heartFrame" // open heart outline wrapped around the name(s)
  | "loopFrame" // loop around two names with twin hearts on top
  | "infinityFrame" // infinity loop: names on the loops, stones or hearts on the band
  | "stethoscope" // heart-shaped stethoscope tube around the name
  | "lipsEnd" // kiss lips after the name
  // butterflies
  | "butterflyEnd"
  | "butterflyStart"
  | "butterfliesSides"
  // bases & underlines
  | "scrollBase" // mirrored scroll under the name with a centre heart
  | "heartUnderline" // long swoosh under the name with a centre heart
  | "underlineSwash" // sweeping tail under the name rising at the end
  | "underlineBar" // straight bar under the name
  | "heartSwashUnder" // big heart under the first letter with a swash
  | "vineBase" // leafy vines under the name
  | "squaresBase" // overlapping square frames under the name
  | "waveBase" // ornamental waves under the name
  | "swashUnder" // crossing swash lines under the name
  | "endFlourish" // swash curling up from the last letter
  | "drips" // paint drips hanging from the last line
  | "ecgLine" // heartbeat pulse running into a line under the text, heart at the end
  | "chainSides" // fine cable chain running out from both ends (name bracelets)
  | "stoneTop" // small prong-set stone above a letter
  // specials
  | "peacockFeather" // peacock feather on the first letter with an arc to the right ring
  | "monogram"; // big script initial behind the name

export interface OrnamentOptions {
  /** Scale relative to the ornament's default size */
  size?: number;
  /** Outlined instead of solid (butterflies) */
  outline?: boolean;
  /** Centre piece for bases */
  center?: "heart" | "openHeart" | "hearts" | "flower" | "none";
  /** Extra heart on underline swashes */
  heart?: boolean;
  /** Which name a charm hangs on in two-name designs (default: the first) */
  line?: 1 | 2;
  /** Birthstones on the infinity band */
  stones?: "round" | "hearts";
  /** Stone colour (stoneTop) */
  color?: string;
  /** Letter the stone sits over, counted from the start (stoneTop) */
  letter?: number;
}

export type OrnamentSpec = OrnamentName | [OrnamentName, OrnamentOptions];

export interface PendantDesign {
  font: PendantFont;
  /** Extra outline (in font units at 100px) to thicken the letters like cut metal */
  weight: number;
  /** Lettering size relative to the default (monogram names are small) */
  size?: number;
  uppercase?: boolean;
  /** Two names stacked on two lines (couple designs) */
  twoNames?: boolean;
  /** Second line: shifted right by this share of the first line's width, or centred */
  secondLine?: number | "center";
  /** Names written along an infinity loop (top-left and bottom-right) */
  layout?: "infinity";
  /** Font for the big initial of monogram designs */
  accentFont?: PendantFont;
  /** Sparkling, textured metal */
  texture?: "glitter";
  ornaments: OrnamentSpec[];
}

const PINYON = { font: "pinyon", weight: 4.4 } as const;
const VIBES = { font: "greatVibes", weight: 4.2 } as const;
const BRUSH = { font: "norican", weight: 2.2 } as const;
const KAUSHAN = { font: "kaushan", weight: 1.6 } as const;
const HAND = { font: "sacramento", weight: 4.2 } as const;
const PLAY = { font: "playfair", weight: 1.6 } as const;
const BLOCK = { ...PLAY, uppercase: true } as const;

export const PENDANT_DESIGNS: Record<number, PendantDesign> = {
  // ---- necklace photos ----
  1: { ...PINYON, ornaments: ["openHeartEnd"] },
  2: { ...VIBES, ornaments: ["butterflyEnd"] },
  3: { ...PINYON, ornaments: ["crown"] },
  4: { ...PINYON, ornaments: ["crown", ["underlineSwash", { heart: true }]] },
  5: { ...PINYON, ornaments: ["crown", "endFlourish"] },
  6: { ...KAUSHAN, ornaments: ["heartEnd"] },
  7: { ...PINYON, ornaments: ["openHeartEnd"] },
  8: { ...HAND, ornaments: [] },
  9: { ...PINYON, ornaments: ["crown", "starTrail", "heartEnd"] },

  // ---- 90s: decorative bases ----
  90: { ...BRUSH, ornaments: [["vineBase", { center: "flower" }]] },
  91: { ...KAUSHAN, ornaments: ["heartStart", "squaresBase"] },
  92: { ...KAUSHAN, ornaments: ["heartStart", ["vineBase", { center: "none", size: 1.2 }]] },
  93: { ...BRUSH, ornaments: ["underlineSwash", ["butterflyEnd", { size: 0.9 }]] },
  94: { ...BRUSH, ornaments: [["vineBase", { center: "none" }]] },
  95: { ...BRUSH, ornaments: [["underlineSwash", { heart: true }]] },
  96: { ...PINYON, ornaments: ["waveBase"] },
  97: { ...HAND, ornaments: [["vineBase", { center: "flower" }]] },
  98: { ...PINYON, ornaments: ["underlineBar", ["vineBase", { center: "flower" }]] },

  // ---- 100s: calligraphy with charms ----
  100: { font: "pinyon", weight: 4.6, ornaments: ["crownOutline"] },
  101: { ...PINYON, ornaments: [["heartEnd", { size: 1.4 }]] },
  102: { ...PINYON, ornaments: ["openHeartStart", "openHeartEnd", ["butterflyEnd", { size: 0.8 }]] },
  103: { ...PINYON, ornaments: ["crown", "linkedHeartsEnd"] },
  104: { ...PINYON, ornaments: ["openHeartStart", "crown", "openHeartEnd", ["butterflyEnd", { size: 0.8 }]] },
  105: { ...PINYON, ornaments: [["butterflyEnd", { outline: true }]] },
  106: { ...PINYON, ornaments: ["butterflyStart", "heartEnd", "underlineBar"] },
  107: { ...PINYON, ornaments: ["heartSwashUnder"] },
  108: { ...PINYON, ornaments: ["butterflyEnd"] },
  110: { ...PINYON, ornaments: ["crown", "heartCharmEnd"] },
  111: { ...PINYON, ornaments: ["crownOutline", "heartEnd"] },
  112: { ...BRUSH, texture: "glitter", ornaments: ["butterflyEnd"] },
  113: { ...PINYON, ornaments: [["openHeartEnd", { size: 1.6 }]] },
  114: { ...PINYON, ornaments: [["butterflyEnd", { size: 1.5, outline: true }], "swashUnder"] },
  115: { font: "playfair", weight: 1.8, size: 0.6, uppercase: true, accentFont: "greatVibes", ornaments: ["monogram"] },
  116: { ...BRUSH, ornaments: ["butterflyEnd"] },
  117: { ...BRUSH, ornaments: ["heartUnderline"] },
  118: { ...VIBES, ornaments: ["heartEnd"] },

  // ---- 120s: two names ----
  120: { ...VIBES, twoNames: true, ornaments: ["heartFrame"] },
  121: { ...PINYON, twoNames: true, secondLine: 0.12, ornaments: ["crown", ["butterflyEnd", { outline: true }]] },
  122: { ...KAUSHAN, twoNames: true, secondLine: 0.1, ornaments: ["crown", ["butterflyEnd", { size: 1.15 }]] },
  123: { ...VIBES, twoNames: true, secondLine: "center", ornaments: ["heartBetween"] },
  124: { ...PINYON, twoNames: true, secondLine: 0.1, ornaments: ["loopFrame"] },
  125: { ...VIBES, twoNames: true, secondLine: 0.06, ornaments: ["stoneHeartEnd"] },
  126: { ...KAUSHAN, twoNames: true, secondLine: 0.22, ornaments: ["openHeartStart", "underlineSwash", "openHeartEnd"] },
  127: { ...HAND, twoNames: true, secondLine: 0.12, ornaments: ["linkedHeartsEnd"] },
  128: { ...HAND, twoNames: true, secondLine: 0.1, ornaments: [["diamondEnd", { size: 1.3 }]] },

  // ---- 129–146: names on a scroll base ----
  129: { ...PINYON, ornaments: ["crown", "scrollBase"] },
  130: { ...BRUSH, ornaments: [["scrollBase", { center: "openHeart" }]] },
  131: { ...BRUSH, ornaments: [["scrollBase", { center: "hearts" }], "heartsSides"] },
  132: { ...BRUSH, ornaments: ["scrollBase"] },
  133: { ...BRUSH, ornaments: ["crown", "butterfliesSides", "scrollBase"] },
  134: { ...BRUSH, ornaments: ["scrollBase"] },
  135: { ...BRUSH, ornaments: ["diamondTop", "scrollBase"] },
  136: { ...PINYON, ornaments: ["crownEnd", "scrollBase"] },
  137: { ...BRUSH, ornaments: ["butterfliesSides", "scrollBase"] },
  138: { ...PINYON, ornaments: ["crown", "scrollBase"] },
  139: { ...BRUSH, ornaments: ["crown", "heartsSides", "scrollBase"] },
  140: { ...BRUSH, ornaments: [["scrollBase", { center: "openHeart" }]] },
  141: { ...BRUSH, ornaments: [["scrollBase", { center: "hearts" }]] },
  142: { ...BRUSH, ornaments: ["butterflyEnd", "heartUnderline"] },
  143: { ...PINYON, ornaments: ["crown", "diamondsSides", "scrollBase"] },
  144: { ...BRUSH, ornaments: ["heartsSides", ["scrollBase", { center: "hearts" }]] },
  145: { ...BRUSH, ornaments: [["scrollBase", { size: 1.4 }]] },
  146: { ...PINYON, texture: "glitter", ornaments: ["crown", "butterfliesSides", ["scrollBase", { center: "hearts" }]] },

  // ---- 147–155: crowns and charms ----
  147: { ...PINYON, ornaments: ["crown", "openHeartEnd", "heartsUnder"] },
  148: { ...VIBES, ornaments: ["crown", "heartEnd", "underlineSwash"] },
  149: { ...PINYON, ornaments: ["crown", "heartEnd"] },
  150: { ...PINYON, ornaments: ["crown", "starTrail", "openHeartEnd"] },
  151: { ...PINYON, ornaments: ["starEnd"] },
  152: { ...PINYON, ornaments: [["butterflyEnd", { size: 1.2 }]] },
  153: { ...PINYON, ornaments: ["crown", "linkedHeartsEnd"] },
  154: { font: "greatVibes", weight: 6.4, ornaments: ["peacockFeather", "swashUnder"] },
  155: { ...VIBES, ornaments: ["crown", "heartEnd", "underlineSwash"] },

  // ---- 200–207: couples ----
  200: { ...PINYON, twoNames: true, secondLine: 0.15, ornaments: ["crown", "openHeartEnd"] },
  201: { ...PINYON, twoNames: true, secondLine: 0.02, ornaments: ["crownOutline", ["heartEnd", { line: 2 }]] },
  202: { ...PINYON, twoNames: true, secondLine: 0.05, ornaments: [["lipsEnd", { line: 2 }]] },
  203: { ...BRUSH, twoNames: true, secondLine: 0.45, ornaments: ["openHeartEnd", "underlineSwash"] },
  204: { ...VIBES, size: 0.55, twoNames: true, layout: "infinity", ornaments: [["infinityFrame", { stones: "round" }]] },
  205: { ...VIBES, size: 0.55, twoNames: true, layout: "infinity", ornaments: [["infinityFrame", { stones: "hearts" }]] },
  206: { ...HAND, twoNames: true, secondLine: 0.05, ornaments: ["heartFrame"] },
  207: { ...PINYON, twoNames: true, secondLine: 0.12, ornaments: ["openHeartEnd"] },

  // ---- 208–216: block letters ----
  208: { ...BLOCK, twoNames: true, secondLine: "center", ornaments: ["crownCenter", "drips"] },
  209: { ...PINYON, ornaments: ["butterflyEnd"] },
  210: { ...PLAY, twoNames: true, secondLine: 0, ornaments: ["crown"] },
  211: { ...BLOCK, ornaments: ["scrollBase"] },
  212: { ...BLOCK, twoNames: true, secondLine: "center", ornaments: [] },
  213: { ...BLOCK, ornaments: ["crown"] },
  214: { ...PINYON, ornaments: ["crown", "heartEnd", "underlineSwash"] },
  215: { ...BLOCK, ornaments: [] },
  216: { ...BLOCK, twoNames: true, secondLine: "center", ornaments: ["crownCenter"] },

  // ---- 217–222: charms and symbols ----
  217: { ...VIBES, ornaments: ["heartUnderline"] },
  218: { ...VIBES, ornaments: ["heartFrame"] },
  219: { ...VIBES, size: 0.55, layout: "infinity", ornaments: [["infinityFrame", { center: "hearts" }]] },
  220: { ...PLAY, size: 0.45, ornaments: ["ecgLine"] },
  221: { ...PINYON, ornaments: [["butterflyEnd", { size: 1.5, outline: true }], "swashUnder"] },
  222: { ...VIBES, size: 0.8, ornaments: ["stethoscope"] },
};

/** Name bracelets use the same gold lettering, keyed by product slug */
export const BRACELET_DESIGNS: Record<string, PendantDesign> = {
  "sinhala-name-bracelet": { font: "abhaya", weight: 2.4, ornaments: ["chainSides"] },
  "name-bracelet-with-stone": { font: "greatVibes", weight: 5.2, ornaments: [["stoneTop", { letter: 1, color: "#35b4e8" }], "chainSides"] },
};

export type PreviewKey = number | string;

export function getPendantDesign(key: PreviewKey): PendantDesign | undefined {
  return typeof key === "number" ? PENDANT_DESIGNS[key] : BRACELET_DESIGNS[key];
}

/** "name-pendant-design-100" -> 100; bracelet slugs map to themselves (only when a preview style exists) */
export function pendantDesignFromSlug(slug: string): PreviewKey | null {
  if (slug in BRACELET_DESIGNS) return slug;
  const match = /^name-pendant-design-(\d+)$/.exec(slug);
  if (!match) return null;
  const design = Number(match[1]);
  return design in PENDANT_DESIGNS ? design : null;
}
