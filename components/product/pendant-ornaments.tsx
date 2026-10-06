// =============================================================
// Lassana LK — Ornament library for the name pendant preview
// =============================================================
//
// Everything is drawn in font units (lettering at 100px, baseline at y = 0)
// and positioned from the measured ink of the customer's name, so crowns sit
// on the first letter, charms hang off the last one and bases span the name.

import type { ReactNode } from "react";

import type { OrnamentName, OrnamentOptions } from "@/lib/pendant-designs";

export const F = 100;
export const RING = 4.6;

export type Pt = [number, number];
export interface Box { x0: number; y0: number; x1: number; y1: number }
export interface Line { text: string; x: number; y: number; size: number; ink: Box; chars: Box[] }
export interface Layout {
  lines: Line[];
  /** Union of the lettering ink */
  ink: Box;
  /** x-height of the lettering */
  xh: number;
  first: Box;
  last: Box;
  weight: number;
  family: string;
  accentFamily: string;
  /** Topmost / bottommost inked y in the column at x */
  top: (x: number) => number | undefined;
  bottom: (x: number) => number | undefined;
  /** Leftmost / rightmost inked x in the row at y */
  left: (y: number) => number | undefined;
  right: (y: number) => number | undefined;
  /** Ink box of text set in another family at the given pixel size (baseline at 0) */
  measure: (text: string, family: string, px: number) => Box;
  /** Infinity layouts: loop half-width and vertical centre */
  infinity?: { a: number; cy: number };
}
export interface Piece {
  node: ReactNode;
  box: Box;
  bails?: { left?: Pt; right?: Pt };
  /** Non-metal parts (stones, cut-outs) drawn on top without the gold finish */
  overlay?: ReactNode;
  /** Drawn behind the lettering, with the name cut out of it (monogram initial) */
  behind?: boolean;
}

/** Ornaments chained after the name (or before it) start where the previous one ended */
export interface Cursor {
  left?: number;
  right?: number;
  /** Name the current charm hangs on (two-name designs) */
  line?: 1 | 2;
}

// ---------- geometry helpers ----------

export const union = (...boxes: Box[]): Box => ({
  x0: Math.min(...boxes.map((b) => b.x0)),
  y0: Math.min(...boxes.map((b) => b.y0)),
  x1: Math.max(...boxes.map((b) => b.x1)),
  y1: Math.max(...boxes.map((b) => b.y1)),
});
export const boxOf = (pts: Pt[], pad = 0): Box => ({
  x0: Math.min(...pts.map((p) => p[0])) - pad,
  y0: Math.min(...pts.map((p) => p[1])) - pad,
  x1: Math.max(...pts.map((p) => p[0])) + pad,
  y1: Math.max(...pts.map((p) => p[1])) + pad,
});
const around = (cx: number, cy: number, rx: number, ry = rx): Box => ({ x0: cx - rx, y0: cy - ry, x1: cx + rx, y1: cy + ry });
export const width = (b: Box) => b.x1 - b.x0;
export const height = (b: Box) => b.y1 - b.y0;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const n = (v: number) => Math.round(v * 10) / 10;
const p = (x: number, y: number) => `${n(x)},${n(y)}`;

/** Build a path from unit-square commands mapped into a box (a box with x0 > x1 mirrors it) */
function unitPath(cmds: (string | number)[][], b: Box) {
  return cmds
    .map(([c, ...v]) => `${c}${(v as number[]).map((t, i) => n(i % 2 === 0 ? b.x0 + t * (b.x1 - b.x0) : b.y0 + t * (b.y1 - b.y0))).join(",")}`)
    .join(" ");
}

function bezier(a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
}

/** Topmost inked point of the letters at x (falls back to x-height) */
const topAt = (layout: Layout, x: number) => layout.top(x) ?? -layout.xh;

/** Outermost inked point on one side, searched within a band of rows */
export function outermost(layout: Layout, side: "left" | "right", yFrom: number, yTo: number): Pt | undefined {
  let best: Pt | undefined;
  for (let y = Math.ceil(yFrom); y <= yTo; y++) {
    const x = layout[side](y);
    if (x !== undefined && (!best || (side === "left" ? x < best[0] : x > best[0]))) best = [x, y];
  }
  return best;
}

/** Vertical centre for charms: mid x-height of the name; on couples, a little lower on the first name or level with the second */
function charmY(layout: Layout, line: 1 | 2 = 1) {
  const { lines, xh } = layout;
  if (line === 2 && lines.length > 1) return lines[1].y - xh * 0.5;
  return lines[0].y - xh * (lines.length > 1 ? 0.3 : 0.5);
}

/** Where the next charm attaches on a side: after the previous charm, else the letters' outer edge */
function edge(layout: Layout, cursor: Cursor, side: "left" | "right", cy: number): number {
  const prev = cursor[side];
  if (prev !== undefined) return prev;
  const out = outermost(layout, side, cy - 16, cy + 16);
  return out ? out[0] : side === "right" ? layout.ink.x1 : layout.ink.x0;
}

/** Highest letter point under a span, so toppers rest on the tallest stroke */
function peakUnder(layout: Layout, x0: number, x1: number, fallback: number) {
  let peak = Infinity;
  for (let x = x0; x <= x1; x += 2) peak = Math.min(peak, layout.top(x) ?? Infinity);
  return Number.isFinite(peak) ? peak : fallback;
}

// ---------- shapes ----------

const heartPath = (cx: number, cy: number, w: number) =>
  unitPath(
    [
      ["M", 0.5, 0.28], ["C", 0.5, 0.1, 0.38, 0, 0.25, 0], ["C", 0.1, 0, 0, 0.13, 0, 0.3],
      ["C", 0, 0.56, 0.3, 0.76, 0.5, 1], ["C", 0.7, 0.76, 1, 0.56, 1, 0.3],
      ["C", 1, 0.13, 0.9, 0, 0.75, 0], ["C", 0.62, 0, 0.5, 0.1, 0.5, 0.28], ["Z"],
    ],
    { x0: cx - w / 2, y0: cy - w * 0.45, x1: cx + w / 2, y1: cy + w * 0.45 }
  );

const Heart = ({ cx, cy, w, open = false }: { cx: number; cy: number; w: number; open?: boolean }) =>
  open ? (
    <path d={heartPath(cx, cy, w)} fill="none" strokeWidth={clamp(w * 0.15, 3.4, 6.5)} strokeLinejoin="round" />
  ) : (
    <path d={heartPath(cx, cy, w)} stroke="none" />
  );

const starPath = (cx: number, cy: number, R: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? R * 0.45 : R;
    return `${i ? "L" : "M"}${p(cx + r * Math.cos(a), cy + r * Math.sin(a))}`;
  }).join(" ") + " Z";

// Front-facing butterfly, right half (mirrored for the left), about 64 × 52 units
const WING_UP = "M1,-1 C5,-17 20,-30 30,-24 C37,-19 31,-6 19,-2 C12,0 6,0 1,-1 Z";
const WING_LOW = "M1,1 C10,2 24,6 22,16 C20,24 8,22 4,12 C2,8 1,4 1,1 Z";
const WING_HOLES = "M11,-8 C14,-16 23,-21 25,-16 C26,-12 19,-9 11,-8 Z M7,6 C12,7 17,10 16,14 C14,17 9,14 7,6 Z";

function Butterfly({ cx, cy, s, outline }: { cx: number; cy: number; s: number; outline?: boolean }) {
  const half = outline ? (
    <path d={`${WING_UP} ${WING_LOW}`} fill="none" strokeWidth={3.4 / s} strokeLinejoin="round" />
  ) : (
    <path d={`${WING_UP} ${WING_LOW} ${WING_HOLES}`} fillRule="evenodd" stroke="none" />
  );
  return (
    <g transform={`translate(${p(cx, cy)}) scale(${n(s * 100) / 100})`}>
      {half}
      <g transform="scale(-1 1)">{half}</g>
      <ellipse cx={0} cy={1} rx={2.8} ry={13} stroke="none" />
      <path d="M-1,-11 Q-4,-20 -9,-25 M1,-11 Q4,-20 9,-25" fill="none" strokeWidth={1.8 / s} strokeLinecap="round" />
    </g>
  );
}

// Brilliant-cut gem, about 60 × 46 units
const GEM = "M-18,-20 L18,-20 L30,-6 L0,26 L-30,-6 Z";
const GEM_FACETS = "M-30,-6 L30,-6 M-18,-20 L-9,-6 L0,26 M18,-20 L9,-6 L0,26 M0,-20 L-9,-6 M0,-20 L9,-6";

const Gem = ({ cx, cy, s }: { cx: number; cy: number; s: number }) => (
  <g transform={`translate(${p(cx, cy)}) scale(${n(s * 100) / 100})`}>
    <path d={`${GEM} ${GEM_FACETS}`} fill="none" strokeWidth={3.6 / s} strokeLinejoin="round" />
  </g>
);

// Five-point crown with balls, about 92 × 72 units, origin at the bottom centre
export const CROWN = "M-38,0 L-40,-14 L-46,-46 L-28,-28 L-23,-56 L-9,-30 L0,-64 L9,-30 L23,-56 L28,-28 L46,-46 L40,-14 L38,0 Z";
const CROWN_JEWELS = "M-26,-7 L-21,-11 L-16,-7 L-21,-3 Z M-5,-7 L0,-11 L5,-7 L0,-3 Z M16,-7 L21,-11 L26,-7 L21,-3 Z";
export const CROWN_BALLS: Pt[] = [[-46, -50], [-23, -60], [0, -69], [23, -60], [46, -50]];

function Leaf({ at, angle, len }: { at: Pt; angle: number; len: number }) {
  return (
    <path
      transform={`translate(${p(at[0], at[1])}) rotate(${n(angle)})`}
      d={`M0,0 C${n(len * 0.3)},${n(-len * 0.32)} ${n(len * 0.75)},${n(-len * 0.3)} ${n(len)},0 C${n(len * 0.75)},${n(len * 0.3)} ${n(len * 0.3)},${n(len * 0.32)} 0,0 Z`}
      stroke="none"
    />
  );
}

function Flower({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (-90 + i * 72) * (Math.PI / 180);
        return <ellipse key={i} cx={n(cx + r * 0.62 * Math.cos(a))} cy={n(cy + r * 0.62 * Math.sin(a))} rx={n(r * 0.52)} ry={n(r * 0.52)} stroke="none" />;
      })}
    </g>
  );
}

// ---------- ornaments ----------

type Ornament = (layout: Layout, opts: OrnamentOptions, cursor: Cursor) => Piece;

function crownOn(layout: Layout, opts: OrnamentOptions, outline: boolean, at: "first" | "last" | "center"): Piece {
  const mid = (layout.lines[0].ink.x0 + layout.lines[0].ink.x1) / 2;
  const letter = at === "first" ? layout.first : at === "last" ? layout.last : { ...layout.lines[0].ink, x0: mid - 34, x1: mid + 34 };
  const fw = width(letter);
  const s = (clamp(fw * 0.9, 40, 68) / 92) * (opts.size ?? 1);
  const cx = (letter.x0 + letter.x1) / 2 + fw * (at === "first" ? 0.1 : 0);
  const by = peakUnder(layout, cx - 36 * s, cx + 36 * s, letter.y0) + 8;
  const node = (
    <g transform={`translate(${p(cx, by)}) scale(${n(s * 100) / 100})`}>
      {outline ? (
        <>
          <path d={CROWN} fill="none" strokeWidth={7} strokeLinejoin="round" />
          <path d="M-40,-14 L40,-14" fill="none" strokeWidth={6} />
        </>
      ) : (
        <path d={`${CROWN} ${CROWN_JEWELS}`} fillRule="evenodd" stroke="none" />
      )}
      {CROWN_BALLS.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={outline ? 7 : 7.5} stroke="none" />
      ))}
    </g>
  );
  return { node, box: { x0: cx - 52 * s, y0: by - 76 * s, x1: cx + 52 * s, y1: by } };
}

const starTrail: Ornament = (layout) => {
  const { ink, xh } = layout;
  const sx = ink.x0 + width(ink) * 0.62;
  const top = topAt(layout, sx);
  const sy = Math.min(top, -xh) - 22;
  const R = 12;
  const node = (
    <g>
      <path d={starPath(sx, sy, R)} stroke="none" />
      <path d={`M${p(sx, sy + R * 0.5)} L${p(sx - 1, top + 4)}`} fill="none" strokeWidth={4} strokeLinecap="round" />
      <path d={`M${p(sx + 8, sy - 3)} Q${p(sx + 30, sy - 16)} ${p(sx + 54, sy - 8)}`} fill="none" strokeWidth={3.4} strokeLinecap="round" />
      <path d={`M${p(sx + 9, sy + 4)} Q${p(sx + 34, sy - 3)} ${p(sx + 50, sy + 6)}`} fill="none" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
  return { node, box: { x0: sx - R, y0: sy - 16, x1: sx + 56, y1: top } };
};

/** A charm attached at one end of the name (or after the previous charm on that side) */
function charm(
  layout: Layout,
  cursor: Cursor,
  side: "left" | "right",
  halfWidth: number,
  overlap: number,
  draw: (cx: number, cy: number) => { node: ReactNode; box: Box; overlay?: ReactNode },
  cy = charmY(layout, cursor.line)
): Piece {
  const dir = side === "right" ? 1 : -1;
  const cx = edge(layout, cursor, side, cy) + dir * (halfWidth - overlap);
  const piece = draw(cx, cy);
  cursor[side] = side === "right" ? piece.box.x1 : piece.box.x0;
  const ringX = side === "right" ? piece.box.x1 + RING - 2 : piece.box.x0 - RING + 2;
  const ring: Pt = [ringX, piece.box.y0 + height(piece.box) * 0.3];
  return { ...piece, bails: side === "right" ? { right: ring } : { left: ring } };
}

const heartCharm = (side: "left" | "right", open: boolean): Ornament => (layout, opts, cursor) => {
  const w = 32 * (opts.size ?? 1);
  return charm(layout, cursor, side, w / 2, open ? 3 : 4, (cx, cy) => ({
    node: <Heart cx={cx} cy={cy} w={w} open={open} />,
    box: around(cx, cy, w / 2, w * 0.45),
  }));
};

const linkedHeartsEnd: Ornament = (layout, opts, cursor) => {
  const w = 28 * (opts.size ?? 1);
  return charm(layout, cursor, "right", w * 0.95, 3, (cx, cy) => {
    const a: Pt = [cx - w * 0.45, cy - 3];
    const b: Pt = [cx + w * 0.45, cy + w * 0.22];
    return {
      node: (
        <g>
          <Heart cx={a[0]} cy={a[1]} w={w} open />
          <Heart cx={b[0]} cy={b[1]} w={w} open />
        </g>
      ),
      box: union(around(a[0], a[1], w / 2, w * 0.45), around(b[0], b[1], w / 2, w * 0.45)),
    };
  });
};

const heartCharmEnd: Ornament = (layout, opts, cursor) => {
  const w = 46 * (opts.size ?? 1);
  const initial = layout.lines[0].text[0]?.toLowerCase() ?? "";
  return charm(
    layout,
    cursor,
    "right",
    w / 2,
    2,
    (cx, cy) => ({
      node: (
        <g>
          <Heart cx={cx} cy={cy} w={w} open />
          <text x={n(cx)} y={n(cy + w * 0.16)} fontSize={w * 0.62} textAnchor="middle" style={{ fontFamily: layout.family }} stroke="none">
            {initial}
          </text>
        </g>
      ),
      box: around(cx, cy, w / 2, w * 0.45),
    }),
    -layout.xh * 0.1
  );
};

const starEnd: Ornament = (layout, opts, cursor) => {
  const R = 18 * (opts.size ?? 1);
  return charm(
    layout,
    cursor,
    "right",
    R,
    4,
    (cx, cy) => ({ node: <path d={starPath(cx, cy, R)} stroke="none" />, box: around(cx, cy, R) }),
    -layout.xh * 0.75
  );
};

const butterflyCharm = (side: "left" | "right"): Ornament => (layout, opts, cursor) => {
  const s = 1.5 * (opts.size ?? 1);
  return charm(layout, cursor, side, 30 * s, 4 * s, (cx, cy) => ({
    node: <Butterfly cx={cx} cy={cy} s={s} outline={opts.outline} />,
    box: { x0: cx - 32 * s, y0: cy - 28 * s, x1: cx + 32 * s, y1: cy + 24 * s },
  }));
};

const pair = (one: (side: "left" | "right") => Ornament): Ornament => (layout, opts, cursor) => {
  const l = one("left")(layout, opts, cursor);
  const r = one("right")(layout, opts, cursor);
  return { node: <g>{l.node}{r.node}</g>, box: union(l.box, r.box), bails: { left: l.bails?.left, right: r.bails?.right } };
};

const gemCharm = (side: "left" | "right", size: number): Ornament => (layout, opts, cursor) => {
  const s = size * (opts.size ?? 1);
  return charm(layout, cursor, side, 30 * s, 3, (cx, cy) => ({ node: <Gem cx={cx} cy={cy} s={s} />, box: around(cx, cy, 31 * s, 24 * s) }));
};

const diamondTop: Ornament = (layout, opts) => {
  const { first } = layout;
  const s = 0.62 * (opts.size ?? 1);
  const cx = (first.x0 + first.x1) / 2;
  const by = peakUnder(layout, cx - 20 * s, cx + 20 * s, first.y0) + 4;
  const cy = by - 26 * s;
  return { node: <Gem cx={cx} cy={cy} s={s} />, box: around(cx, cy, 31 * s, 24 * s) };
};

const stoneHeartEnd: Ornament = (layout, opts, cursor) => {
  const w = 46 * (opts.size ?? 1);
  // Crystal positions inside the heart, in unit heart coordinates
  const stones: Pt[] = [[0.27, 0.22], [0.5, 0.36], [0.73, 0.22], [0.36, 0.5], [0.64, 0.5], [0.5, 0.68], [0.16, 0.36], [0.84, 0.36]];
  return charm(layout, cursor, "right", w / 2, 6, (cx, cy) => ({
    node: <Heart cx={cx} cy={cy} w={w} />,
    box: around(cx, cy, w / 2, w * 0.45),
    overlay: (
      <g>
        {stones.map(([u, v], i) => (
          <circle key={i} cx={n(cx - w / 2 + u * w)} cy={n(cy - w * 0.45 + v * w * 0.9)} r={n(w * 0.075)} fill="#f6f4ef" stroke="#8d8372" strokeWidth={0.8} />
        ))}
      </g>
    ),
  }));
};

const heartsSides = pair((side) => heartCharm(side, false));

const heartsUnder: Ornament = (layout, opts) => {
  const { ink } = layout;
  const w = 20 * (opts.size ?? 1);
  const a: Pt = [ink.x0 - w * 0.2, Math.max(ink.y1 - 10, 4)];
  const b: Pt = [ink.x0 + width(ink) * 0.16, Math.max(ink.y1, 10) + 6];
  return {
    node: (
      <g>
        <Heart cx={a[0]} cy={a[1]} w={w} />
        <Heart cx={b[0]} cy={b[1]} w={w} />
      </g>
    ),
    box: union(around(a[0], a[1], w / 2), around(b[0], b[1], w / 2)),
  };
};

const heartBetween: Ornament = (layout, opts) => {
  const { lines, ink, xh } = layout;
  const w = 52 * (opts.size ?? 1);
  const cx = (ink.x0 + ink.x1) / 2 - width(ink) * 0.06;
  const cy = lines.length > 1 ? (lines[0].y + lines[1].y) / 2 - xh * 0.35 : ink.y1 + w * 0.4;
  return { node: <Heart cx={cx} cy={cy} w={w} />, box: around(cx, cy, w / 2, w * 0.45) };
};

const heartFrame: Ornament = (layout) => {
  const { ink, lines, xh } = layout;
  const H = height(ink) * 1.25;
  const x0 = ink.x0 + width(ink) * 0.36;
  const W = Math.max(H * 1.12, (ink.x1 - x0) * 1.22);
  const b: Box = { x0, y0: ink.y0 - H * 0.12, x1: x0 + W, y1: ink.y0 - H * 0.12 + H };
  // Open on the left: the left lobe dives into the names, the tip curls back under them
  const d = unitPath(
    [
      ["M", 0.03, 0.42], ["C", -0.02, 0.14, 0.1, 0, 0.25, 0], ["C", 0.38, 0, 0.47, 0.09, 0.5, 0.22],
      ["C", 0.55, 0.06, 0.64, 0, 0.76, 0], ["C", 0.92, 0, 1.01, 0.14, 1, 0.32],
      ["C", 0.98, 0.58, 0.72, 0.78, 0.5, 1], ["C", 0.46, 0.96, 0.4, 0.93, 0.33, 0.92],
    ],
    b
  );
  const left = outermost(layout, "left", lines[0].ink.y0, -xh * 0.6);
  return {
    node: <path d={d} fill="none" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />,
    box: b,
    bails: { left: left ? [left[0] - RING + 1, left[1]] : undefined, right: [b.x0 + W * 0.8, b.y0 - RING - 1.5] },
  };
};

const loopFrame: Ornament = (layout) => {
  const { lines, ink, xh } = layout;
  const w = width(ink);
  const l0 = lines[0];
  const l1 = lines[lines.length - 1];
  const start: Pt = [l0.ink.x1 - 6, l0.y - xh * 0.9];
  const d = `M${p(...start)} C${p(ink.x1 + 0.14 * w, l0.y - 0.1 * F)} ${p(ink.x1 + 0.1 * w, ink.y1 + 0.14 * F)} ${p(ink.x0 + 0.62 * w, ink.y1 + 0.1 * F)}
    C${p(ink.x0 + 0.42 * w, ink.y1 + 0.07 * F)} ${p(l1.ink.x0 - 0.04 * w, l1.y + 0.02 * F)} ${p(l1.ink.x0 + 6, l1.y - xh * 0.4)}`;
  const hw = 30;
  const hx = l0.ink.x1 - 0.04 * w;
  const h1: Pt = [hx, topAt(layout, hx) - hw * 0.25];
  const h2: Pt = [h1[0] + hw * 0.85, h1[1] + 2];
  return {
    node: (
      <g>
        <path d={d} fill="none" strokeWidth={6} strokeLinecap="round" />
        <Heart cx={h1[0]} cy={h1[1]} w={hw} />
        <Heart cx={h2[0]} cy={h2[1]} w={hw} />
      </g>
    ),
    box: union(boxOf([start, [ink.x1 + 0.12 * w, ink.y1 + 0.14 * F]]), around(h1[0], h1[1], hw / 2), around(h2[0], h2[1], hw / 2)),
    bails: { right: [h2[0] + hw / 2 + RING - 2, h2[1] - 2] },
  };
};

const scrollBase: Ornament = (layout, opts) => {
  const { first, last, ink } = layout;
  const w = width(ink);
  const cx = (ink.x0 + ink.x1) / 2;
  const yb = Math.max(ink.y1, 0) + 14;
  const side = (dir: 1 | -1) => {
    const ex = dir === 1 ? first.x0 + 7 : last.x1 - 7;
    const ey = (layout.bottom(ex) ?? (dir === 1 ? first.y1 : last.y1)) - 6;
    const X = (dx: number) => ex + dir * dx;
    return `M${p(X(0), ey)} C${p(X(-0.07 * w), yb - 2)} ${p(X(0.02 * w), yb + 14)} ${p(X(0.12 * w), yb + 6)}
      C${p(X(0.24 * w), yb - 2)} ${p(cx - dir * 0.16 * w, yb + 12)} ${p(cx - dir * 0.05 * w, yb + 4)}`;
  };
  const s = opts.size ?? 1;
  const center = opts.center ?? "heart";
  const hy = yb + 8 * s;
  const lx = first.x0 + width(first) * 0.2;
  const rx = last.x1 - width(last) * 0.2;
  return {
    node: (
      <g>
        <path d={`${side(1)} ${side(-1)}`} fill="none" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        {center === "heart" && <Heart cx={cx} cy={hy} w={34 * s} />}
        {center === "openHeart" && <Heart cx={cx} cy={hy + 2} w={38 * s} open />}
        {center === "hearts" &&
          [-1, 0, 1].map((k) => <Heart key={k} cx={cx + k * 24 * s} cy={hy + (k === 0 ? 2 : 0)} w={26 * s} />)}
      </g>
    ),
    box: { x0: ink.x0 - 0.06 * w, y0: ink.y1, x1: ink.x1 + 0.06 * w, y1: yb + 28 * s },
    bails: { left: [lx, topAt(layout, lx) - RING + 1], right: [rx, topAt(layout, rx) - RING + 1] },
  };
};

const heartUnderline: Ornament = (layout, opts) => {
  const { ink } = layout;
  const w = width(ink);
  const cx = (ink.x0 + ink.x1) / 2;
  const yb = Math.max(ink.y1, 0) + 8;
  const d = `M${p(ink.x0 - 0.04 * w, yb - 16)} C${p(ink.x0 + 0.25 * w, yb + 16)} ${p(ink.x1 - 0.25 * w, yb + 16)} ${p(ink.x1 + 0.04 * w, yb - 18)}`;
  const hw = 30 * (opts.size ?? 1);
  return {
    node: (
      <g>
        <path d={d} fill="none" strokeWidth={6} strokeLinecap="round" />
        <Heart cx={cx} cy={yb + 14} w={hw} />
      </g>
    ),
    box: { x0: ink.x0 - 0.05 * w, y0: ink.y1, x1: ink.x1 + 0.05 * w, y1: yb + 14 + hw * 0.5 },
  };
};

const underlineSwash: Ornament = (layout, opts) => {
  const { ink, first } = layout;
  const w = width(ink);
  const yb = Math.max(ink.y1, 0) + 12;
  const sx = first.x0 + width(first) * 0.3;
  const sy = (layout.bottom(sx) ?? first.y1) - 4;
  const end: Pt = [ink.x1 + 0.05 * w, yb - 22];
  const d = `M${p(sx, sy)} C${p(ink.x0 + 0.15 * w, yb + 26)} ${p(ink.x1 - 0.3 * w, yb + 8)} ${p(...end)}
    C${p(end[0] + 0.03 * w, yb - 30)} ${p(end[0] - 0.01 * w, yb - 40)} ${p(end[0] - 0.04 * w, yb - 31)}`;
  const hw = 24;
  const h: Pt = [ink.x1 - 0.14 * w, yb + 6];
  return {
    node: (
      <g>
        <path d={d} fill="none" strokeWidth={6} strokeLinecap="round" />
        {opts.heart && <Heart cx={h[0]} cy={h[1]} w={hw} />}
      </g>
    ),
    box: { x0: Math.min(sx, ink.x0), y0: ink.y1, x1: end[0] + 0.02 * w, y1: yb + 20 },
  };
};

const underlineBar: Ornament = (layout) => {
  const { ink } = layout;
  const w = width(ink);
  const yb = Math.max(ink.y1 * 0.4, 0) + 6;
  const d = `M${p(ink.x0 + 0.04 * w, yb)} Q${p(ink.x0 + 0.5 * w, yb + 6)} ${p(ink.x1 + 0.02 * w, yb - 8)}`;
  return { node: <path d={d} fill="none" strokeWidth={6.5} strokeLinecap="round" />, box: { x0: ink.x0, y0: yb - 10, x1: ink.x1 + 0.03 * w, y1: yb + 8 } };
};

const heartSwashUnder: Ornament = (layout) => {
  const { ink, xh } = layout;
  const w = width(ink);
  const yb = Math.max(ink.y1, 0) + 10;
  const hw = 40;
  const h: Pt = [ink.x0 + 0.06 * w, yb + 4];
  const d = `M${p(h[0] + hw * 0.4, yb + 8)} C${p(ink.x0 + 0.4 * w, yb + 30)} ${p(ink.x1 - 0.22 * w, yb + 12)} ${p(ink.x1 + 0.03 * w, -xh * 0.4)}
    M${p(ink.x0 + 0.24 * w, yb + 18)} C${p(ink.x0 + 0.2 * w, yb + 34)} ${p(ink.x0 + 0.3 * w, yb + 40)} ${p(ink.x0 + 0.34 * w, yb + 30)}`;
  return {
    node: (
      <g>
        <Heart cx={h[0]} cy={h[1]} w={hw} />
        <path d={d} fill="none" strokeWidth={6} strokeLinecap="round" />
      </g>
    ),
    box: { x0: h[0] - hw / 2, y0: ink.y1, x1: ink.x1 + 0.04 * w, y1: yb + 42 },
  };
};

const vineBase: Ornament = (layout, opts) => {
  const { ink } = layout;
  const w = width(ink);
  const s = opts.size ?? 1;
  const cx = (ink.x0 + ink.x1) / 2;
  const yb = Math.max(ink.y1, 0) + 10;
  const center = opts.center ?? "flower";
  const parts: ReactNode[] = [];
  const stems: string[] = [];
  for (const dir of [1, -1] as const) {
    const a: Pt = [cx + dir * 10, yb + 16 * s];
    const b: Pt = [cx + dir * 0.2 * w, yb + 46 * s];
    const c: Pt = [cx + dir * 0.36 * w, yb + 38 * s];
    const d: Pt = [cx + dir * 0.47 * w, yb + 6 * s];
    // Curl at the outer end, rising into the last letters
    stems.push(
      `M${p(...a)} C${p(...b)} ${p(...c)} ${p(...d)} C${p(d[0] + dir * 12 * s, yb - 8 * s)} ${p(d[0] - dir * 2, yb - 20 * s)} ${p(d[0] - dir * 12 * s, yb - 10 * s)}`
    );
    const leaves = Math.round(5 * s);
    for (let i = 0; i < leaves; i++) {
      const t = 0.12 + (i * 0.76) / Math.max(1, leaves - 1);
      const at = bezier(a, b, c, d, t);
      const ahead = bezier(a, b, c, d, Math.min(1, t + 0.02));
      const tangent = (Math.atan2(ahead[1] - at[1], ahead[0] - at[0]) * 180) / Math.PI;
      const up = i % 2 === 0 ? -1 : 1;
      parts.push(<Leaf key={`${dir}-${i}`} at={at} angle={tangent + up * 48} len={28 * s} />);
    }
  }
  return {
    node: (
      <g>
        <path d={stems.join(" ")} fill="none" strokeWidth={5.5} strokeLinecap="round" />
        {parts}
        {center === "flower" && <Flower cx={cx} cy={yb + 14 * s} r={16 * s} />}
        {center === "heart" && <Heart cx={cx} cy={yb + 14 * s} w={28 * s} />}
      </g>
    ),
    box: { x0: ink.x0, y0: ink.y1, x1: ink.x1, y1: yb + 64 * s },
    overlay: center === "flower" ? <circle cx={n(cx)} cy={n(yb + 14 * s)} r={n(4.5 * s)} fill="#120d09" /> : undefined,
  };
};

const squaresBase: Ornament = (layout) => {
  const { ink } = layout;
  const w = width(ink);
  const y0 = Math.max(ink.y1 - 8, 2);
  const H = 0.9 * F;
  // Overlapping frames, staggered like the catalogue piece: [x, y, w, h] as shares of the base area
  const frames = [
    [0.0, 0.0, 0.2, 0.32], [0.16, 0.22, 0.2, 0.34], [0.32, 0.46, 0.18, 0.34], [0.44, 0.08, 0.16, 0.4],
    [0.56, 0.4, 0.18, 0.36], [0.7, 0.04, 0.17, 0.34], [0.83, 0.0, 0.17, 0.28],
  ];
  return {
    node: (
      <g fill="none" strokeWidth={4}>
        {frames.map(([fx, fy, fw, fh], i) => (
          <rect key={i} x={n(ink.x0 + fx * w)} y={n(y0 + fy * H)} width={n(fw * w)} height={n(fh * H)} />
        ))}
      </g>
    ),
    box: { x0: ink.x0 - 2, y0, x1: ink.x1 + 2, y1: y0 + 0.82 * H },
  };
};

const waveBase: Ornament = (layout) => {
  const { ink } = layout;
  const w = width(ink);
  const cx = (ink.x0 + ink.x1) / 2;
  const y0 = Math.max(ink.y1, 0) - 6;
  const wave = [
    ["M", 0, 0.35], ["C", 0.2, 0.15, 0.35, 0.1, 0.5, 0.3], ["C", 0.62, 0.48, 0.8, 0.45, 0.92, 0.2],
    ["C", 0.97, 0.1, 1.03, 0.3, 0.95, 0.45], ["C", 0.82, 0.75, 0.6, 0.75, 0.48, 0.55],
    ["C", 0.38, 0.4, 0.22, 0.42, 0.1, 0.6], ["C", 0.05, 0.68, 0, 0.6, 0, 0.35], ["Z"],
  ];
  const H = 0.62 * F;
  const rx = ink.x1 + 0.04 * w;
  const lx = ink.x0 - 0.04 * w;
  const right = unitPath(wave, { x0: cx - 4, y0, x1: rx, y1: y0 + H });
  const left = unitPath(wave, { x0: cx + 4, y0, x1: lx, y1: y0 + H });
  const curlY = y0 + 0.62 * H;
  return {
    node: (
      <g>
        <path d={`${right} ${left}`} stroke="none" />
        <circle cx={n(rx - 0.02 * w)} cy={n(curlY)} r={7} stroke="none" />
        <circle cx={n(lx + 0.02 * w)} cy={n(curlY)} r={7} stroke="none" />
      </g>
    ),
    box: { x0: lx - 8, y0, x1: rx + 8, y1: y0 + H },
  };
};

const swashUnder: Ornament = (layout) => {
  const { ink } = layout;
  const w = width(ink);
  const y = Math.max(ink.y1 - 10, 12);
  const d1 = `M${p(ink.x0 + 0.12 * w, y - 6)} C${p(ink.x0 + 0.3 * w, y + 30)} ${p(ink.x0 + 0.72 * w, y + 8)} ${p(ink.x1 + 0.02 * w, -8)}`;
  const d2 = `M${p(ink.x0 + 0.02 * w, y + 30)} C${p(ink.x0 + 0.1 * w, y + 14)} ${p(ink.x0 + 0.45 * w, y + 4)} ${p(ink.x0 + 0.78 * w, y + 22)}`;
  return { node: <path d={`${d1} ${d2}`} fill="none" strokeWidth={7} strokeLinecap="round" />, box: { x0: ink.x0, y0: ink.y1, x1: ink.x1 + 0.03 * w, y1: y + 34 } };
};

const endFlourish: Ornament = (layout, _opts, cursor) => {
  const { xh } = layout;
  const x = edge(layout, cursor, "right", -xh * 0.4) - 4;
  const d = `M${p(x, -xh * 0.4)} C${p(x + 24, -xh * 0.9)} ${p(x + 16, -xh * 2.1)} ${p(x - 8, -xh * 1.9)}`;
  cursor.right = x + 22;
  return {
    node: <path d={d} fill="none" strokeWidth={4.5} strokeLinecap="round" />,
    box: { x0: x - 10, y0: -xh * 2.2, x1: x + 22, y1: -xh * 0.3 },
    bails: { right: [x + 22 + RING - 1, -xh * 1.2] },
  };
};

const lipsEnd: Ornament = (layout, opts, cursor) => {
  const w = 40 * (opts.size ?? 1);
  return charm(layout, cursor, "right", w / 2, 4, (cx, cy) => {
    const b: Box = { x0: cx - w / 2, y0: cy - w * 0.3, x1: cx + w / 2, y1: cy + w * 0.3 };
    // Upper lip with a cupid's bow, lower lip, and the mouth line cut between them
    const upper = unitPath([["M", 0, 0.55], ["C", 0.15, 0.3, 0.3, 0.0, 0.42, 0.1], ["C", 0.47, 0.15, 0.53, 0.15, 0.58, 0.1], ["C", 0.7, 0.0, 0.85, 0.3, 1, 0.55], ["C", 0.7, 0.45, 0.3, 0.45, 0, 0.55], ["Z"]], b);
    const lower = unitPath([["M", 0.02, 0.6], ["C", 0.3, 0.52, 0.7, 0.52, 0.98, 0.6], ["C", 0.8, 1.0, 0.2, 1.0, 0.02, 0.6], ["Z"]], b);
    return { node: <path d={`${upper} ${lower}`} stroke="none" />, box: b };
  });
};

/** Bernoulli lemniscate: width 2a, centred on (cx, cy) */
export function lemniscate(cx: number, cy: number, a: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const d = 1 + Math.sin(t) ** 2;
    pts.push(`${i ? "L" : "M"}${p(cx + (a * Math.cos(t)) / d, cy + (a * Math.sin(t) * Math.cos(t)) / d)}`);
  }
  return pts.join(" ") + " Z";
}

const GEM_COLORS = { round: ["#c2185b", "#1e3a8a"], hearts: ["#7b4bb7", "#d81b60"] } as const;

const infinityFrame: Ornament = (layout, opts) => {
  const { lines } = layout;
  const a = layout.infinity!.a;
  const cy = layout.infinity!.cy;
  const stones = opts.stones;
  const band = lemniscate(0, cy, a);
  const gem = (x: number, y: number, color: string, heart: boolean, key: string) =>
    heart ? (
      <g key={key}>
        <path d={heartPath(x, y, 22)} fill={color} stroke="#5a3a10" strokeWidth={0.8} />
        <ellipse cx={n(x - 4)} cy={n(y - 4)} rx={3.5} ry={2} fill="#fff" opacity={0.55} />
      </g>
    ) : (
      <g key={key}>
        <circle cx={n(x)} cy={n(y)} r={8} fill={color} stroke="#5a3a10" strokeWidth={0.8} />
        <circle cx={n(x - 2.5)} cy={n(y - 2.5)} r={2.4} fill="#fff" opacity={0.6} />
      </g>
    );
  // Stones sit in settings on the band: lower-left loop and upper-right loop
  const left: Pt = [-0.72 * a, cy + 0.2 * a];
  const right: Pt = [0.72 * a, cy - 0.2 * a];
  const heartsInLoop = opts.center === "hearts" && lines.length === 1;
  return {
    node: (
      <g>
        <path d={band} fill="none" strokeWidth={6} strokeLinejoin="round" />
        {stones && [left, right].map(([x, y], i) => <circle key={i} cx={n(x)} cy={n(y)} r={11} stroke="none" />)}
        {heartsInLoop && (
          <g>
            <Heart cx={0.55 * a} cy={cy} w={0.16 * a} open />
            <Heart cx={0.68 * a} cy={cy + 0.03 * a} w={0.16 * a} open />
          </g>
        )}
      </g>
    ),
    overlay: stones ? (
      <g>{[left, right].map(([x, y], i) => gem(x, y, GEM_COLORS[stones][i], stones === "hearts", String(i)))}</g>
    ) : undefined,
    box: { x0: -a - 4, y0: cy - 0.36 * a - 4, x1: a + 4, y1: cy + 0.36 * a + 4 },
    bails: { left: [-a - RING - 1, cy], right: [a + RING + 1, cy] },
    behind: true,
  };
};

const drips: Ornament = (layout) => {
  const l = layout.lines[layout.lines.length - 1];
  const w = width(l.ink);
  const count = Math.max(3, Math.round(w / 22));
  const parts: ReactNode[] = [];
  let low = l.ink.y1;
  for (let i = 0; i < count; i++) {
    const x = l.ink.x0 + w * ((i + 0.5) / count);
    const bottom = layout.bottom(x);
    if (bottom === undefined || bottom < l.y - 6) continue;
    const len = 10 + ((i * 7) % 3) * 6; // varied drip lengths
    parts.push(<path key={i} d={`M${p(x, bottom - 3)} L${p(x, bottom + len)}`} fill="none" strokeWidth={6} strokeLinecap="round" />);
    parts.push(<circle key={`d${i}`} cx={n(x)} cy={n(bottom + len + 1)} r={4.6} stroke="none" />);
    low = Math.max(low, bottom + len + 6);
  }
  return { node: <g>{parts}</g>, box: { x0: l.ink.x0, y0: l.ink.y1 - 4, x1: l.ink.x1, y1: low } };
};

const ecgLine: Ornament = (layout) => {
  const { ink } = layout;
  const x0 = ink.x0 - 6;
  const b = 5;
  // Heartbeat spikes, then a flat line under the text ending in a little heart
  const pulse: Pt[] = [[x0 - 100, b], [x0 - 82, b], [x0 - 72, b - 62], [x0 - 60, b + 22], [x0 - 48, b - 82], [x0 - 36, b + 12], [x0 - 26, b], [ink.x1 + 8, b]];
  const d = pulse.map(([x, y], i) => `${i ? "L" : "M"}${p(x, y)}`).join(" ");
  const hw = 22;
  const hx = ink.x1 + 8 + hw * 0.45;
  return {
    node: (
      <g>
        <path d={d} fill="none" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
        <Heart cx={hx} cy={b - 4} w={hw} />
      </g>
    ),
    box: { x0: x0 - 104, y0: b - 86, x1: hx + hw / 2, y1: b + 26 },
    bails: { left: [x0 - 100 - RING, b], right: [hx + hw / 2 + RING - 2, b - 8] },
  };
};

const stethoscope: Ornament = (layout) => {
  const { ink } = layout;
  const w = width(ink);
  const W = Math.max(w * 1.4, 1.5 * F);
  const H = W * 0.9;
  // The name sits across the lower right of the heart, like the catalogue piece
  const cx = (ink.x0 + ink.x1) / 2 - W * 0.08;
  const y0 = ink.y0 - H * 0.6;
  const hb: Box = { x0: cx - W / 2, y0, x1: cx + W / 2, y1: y0 + H };
  const heart = unitPath(
    [
      ["M", 0.5, 0.26], ["C", 0.5, 0.08, 0.38, 0, 0.25, 0], ["C", 0.1, 0, 0, 0.13, 0, 0.3],
      ["C", 0, 0.56, 0.3, 0.76, 0.5, 1], ["C", 0.7, 0.76, 1, 0.56, 1, 0.3],
      ["C", 1, 0.13, 0.9, 0, 0.75, 0], ["C", 0.62, 0, 0.5, 0.08, 0.5, 0.26],
    ],
    hb
  );
  // Tube from the heart's tip down to the chest piece at the lower left
  const tip: Pt = [cx, hb.y1];
  const piece: Pt = [hb.x0 + W * 0.05, hb.y1 + H * 0.26];
  const r = H * 0.11;
  const tube = `M${p(...tip)} C${p(cx - W * 0.1, hb.y1 + H * 0.12)} ${p(piece[0] + r * 2.4, piece[1] + r * 0.2)} ${p(piece[0] + r, piece[1])}`;
  const beat = `M${p(piece[0] - r * 0.7, piece[1])} L${p(piece[0] - r * 0.25, piece[1])} L${p(piece[0] - r * 0.05, piece[1] - r * 0.5)} L${p(piece[0] + r * 0.15, piece[1] + r * 0.4)} L${p(piece[0] + r * 0.3, piece[1])} L${p(piece[0] + r * 0.7, piece[1])}`;
  return {
    node: (
      <g>
        <path d={`${heart} ${tube}`} fill="none" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={n(piece[0])} cy={n(piece[1])} r={n(r)} fill="none" strokeWidth={6} />
        <path d={beat} fill="none" strokeWidth={2.4} strokeLinejoin="round" />
      </g>
    ),
    box: { x0: piece[0] - r - 4, y0: hb.y0 - 4, x1: hb.x1 + 4, y1: piece[1] + r + 4 },
    bails: { left: [hb.x0 + W * 0.1, hb.y0 + H * 0.02], right: [hb.x1 - W * 0.06, hb.y0 + H * 0.08] },
  };
};

/** Fine cable chain from each end of the name: alternating flat and edge-on links, drooping slightly */
const chainSides: Ornament = (layout) => {
  const { xh, ink } = layout;
  const y = -xh * 0.45;
  const l = outermost(layout, "left", y - 10, y + 10) ?? [ink.x0, y];
  const r = outermost(layout, "right", y - 10, y + 10) ?? [ink.x1, y];
  const L = 1.5 * F;
  const links: ReactNode[] = [];
  const pts: Pt[] = [];
  for (const [sx, sy, dir] of [[l[0] - RING, l[1], -1], [r[0] + RING, r[1], 1]] as const) {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const x = sx + dir * (RING + t * L);
      const yy = sy + 10 * t * t; // gentle droop
      pts.push([x, yy]);
      links.push(
        i % 2 === 0 ? (
          <ellipse key={`${dir}${i}`} cx={n(x)} cy={n(yy)} rx={7} ry={3.8} fill="none" strokeWidth={2.2} transform={`rotate(${n(dir * 8 * t)} ${n(x)} ${n(yy)})`} />
        ) : (
          <path key={`${dir}${i}`} d={`M${p(x - 6.5, yy)} L${p(x + 6.5, yy)}`} fill="none" strokeWidth={2.4} strokeLinecap="round" />
        )
      );
    }
  }
  return {
    node: <g>{links}</g>,
    box: boxOf(pts, 8),
    bails: { left: [l[0] - RING + 1, l[1]], right: [r[0] + RING - 1, r[1]] },
  };
};

/** Small prong-set stone sitting above a letter */
const stoneTop: Ornament = (layout, opts) => {
  const chars = layout.lines[0].chars;
  const c = chars[Math.min(opts.letter ?? 0, chars.length - 1)];
  const x = c.x1 - 2;
  const y = Math.min(layout.top(x) ?? c.y0, -layout.xh) - 9;
  const r = 7 * (opts.size ?? 1);
  return {
    node: (
      <g>
        <circle cx={n(x)} cy={n(y)} r={n(r + 2.2)} stroke="none" />
        <path d={`M${p(x, y + r)} L${p(x, layout.top(x) ?? y + r + 6)}`} fill="none" strokeWidth={3} />
      </g>
    ),
    overlay: (
      <g>
        <circle cx={n(x)} cy={n(y)} r={n(r)} fill={opts.color ?? "#35b4e8"} stroke="#0b4f6c" strokeWidth={0.6} />
        <path d={`M${p(x - r * 0.6, y)} L${p(x, y - r * 0.6)} L${p(x + r * 0.6, y)} L${p(x, y + r * 0.6)} Z`} fill="#fff" opacity={0.28} />
        <circle cx={n(x - r * 0.35)} cy={n(y - r * 0.35)} r={n(r * 0.25)} fill="#fff" opacity={0.8} />
      </g>
    ),
    box: around(x, y, r + 3),
  };
};

const peacockFeather: Ornament = (layout) => {
  const { first, ink, xh } = layout;
  const bx = first.x0 + width(first) * 0.55;
  const by = topAt(layout, bx) + 6;
  // Drawn along +x in local space, then turned to rise up and to the left
  const L = 92;
  const ANGLE = -146;
  const rad = (ANGLE * Math.PI) / 180;
  const toWorld = ([x, y]: Pt): Pt => [bx + x * Math.cos(rad) - y * Math.sin(rad), by + x * Math.sin(rad) + y * Math.cos(rad)];
  const stemY = (t: number) => -12 * 4 * t * (1 - t);
  const barbs: string[] = [];
  const ends: Pt[] = [[0, 0], [L + 26, 0]];
  const barb = (from: Pt, to: Pt) => {
    barbs.push(`M${p(...from)} L${p(...to)}`);
    ends.push(to);
  };
  // Barbs sweep forward along the quill, growing towards the eye
  for (let t = 0.22; t <= 0.8; t += 0.052) {
    const at: Pt = [t * L, stemY(t)];
    const len = 6 + 34 * t;
    for (const side of [-1, 1]) barb(at, [at[0] + len * 0.74, at[1] + side * len * 0.68]);
  }
  // Tuft fanning out around the eye
  for (let a = -70; a <= 70; a += 20) {
    const r = (a * Math.PI) / 180;
    barb([L + 4, 0], [L + 4 + 20 * Math.cos(r), 22 * Math.sin(r)]);
  }
  // Long arc from the feather over the name to the right-hand ring
  const end: Pt = [ink.x1 + 8, -xh - 12];
  const arc = `M${p(bx + 3, by - 6)} C${p(bx + width(ink) * 0.28, by - 66)} ${p(ink.x1 - width(ink) * 0.08, -xh - 74)} ${p(...end)}`;
  const e = L - 14; // eye starts here along the quill
  const eye = `M${e},0 C${e + 6},-19 ${e + 30},-21 ${e + 38},0 C${e + 30},21 ${e + 6},19 ${e},0 Z M${e + 10},0 C${e + 13},-9 ${e + 24},-9 ${e + 28},0 C${e + 24},9 ${e + 13},9 ${e + 10},0 Z`;
  return {
    node: (
      <g>
        <g transform={`translate(${p(bx, by)}) rotate(${ANGLE})`}>
          <path d={`M0,0 Q${L * 0.5},-24 ${L},0`} fill="none" strokeWidth={5.5} strokeLinecap="round" />
          <path d={barbs.join(" ")} fill="none" strokeWidth={3.6} strokeLinecap="round" />
          <path d={eye} fillRule="evenodd" stroke="none" />
          <circle cx={e + 19} cy={0} r={4} stroke="none" />
        </g>
        <path d={arc} fill="none" strokeWidth={5.5} strokeLinecap="round" />
      </g>
    ),
    box: union(boxOf([...ends.map(toWorld), end], 14), { x0: bx, y0: -xh - 72, x1: end[0], y1: end[1] }),
    bails: { right: [end[0] + RING - 1.5, end[1] + 1] },
  };
};

const monogram: Ornament = (layout) => {
  const { ink, lines } = layout;
  const initial = lines[0].text[0] ?? "";
  const px = 2.7 * F;
  const b = layout.measure(initial, layout.accentFamily, px);
  // Centre the big initial on the name, so the name runs across its middle
  const x = (ink.x0 + ink.x1) / 2 - (b.x0 + b.x1) / 2;
  const y = (ink.y0 + ink.y1) / 2 - (b.y0 + b.y1) / 2 + 0.06 * F;
  return {
    node: (
      <text x={n(x)} y={n(y)} fontSize={px} style={{ fontFamily: layout.accentFamily }} strokeWidth={10} strokeLinejoin="round" paintOrder="stroke">
        {initial}
      </text>
    ),
    box: { x0: x + b.x0 - 5, y0: y + b.y0 - 5, x1: x + b.x1 + 5, y1: y + b.y1 + 5 },
    behind: true,
  };
};

export const ORNAMENTS: Record<OrnamentName, Ornament> = {
  crown: (l, o) => crownOn(l, o, false, "first"),
  crownOutline: (l, o) => crownOn(l, o, true, "first"),
  crownEnd: (l, o) => crownOn(l, o, false, "last"),
  crownCenter: (l, o) => crownOn(l, o, false, "center"),
  starTrail,
  starEnd,
  diamondTop,
  diamondEnd: gemCharm("right", 1),
  diamondsSides: pair((side) => gemCharm(side, 0.6)),
  heartEnd: heartCharm("right", false),
  heartStart: heartCharm("left", false),
  openHeartEnd: heartCharm("right", true),
  openHeartStart: heartCharm("left", true),
  linkedHeartsEnd,
  heartCharmEnd,
  heartsSides,
  heartsUnder,
  stoneHeartEnd,
  heartBetween,
  heartFrame,
  loopFrame,
  butterflyEnd: butterflyCharm("right"),
  butterflyStart: butterflyCharm("left"),
  butterfliesSides: (l, o, c) => pair(butterflyCharm)(l, { ...o, size: (o.size ?? 1) * 0.7 }, c),
  scrollBase,
  heartUnderline,
  underlineSwash,
  underlineBar,
  heartSwashUnder,
  vineBase,
  squaresBase,
  waveBase,
  swashUnder,
  endFlourish,
  peacockFeather,
  monogram,
  lipsEnd,
  infinityFrame,
  drips,
  ecgLine,
  stethoscope,
  chainSides,
  stoneTop,
};
