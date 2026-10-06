"use client";

import { useEffect, useId, useState } from "react";
import { getPendantDesign, type PendantDesign, type PreviewKey } from "@/lib/pendant-designs";
import { FONT_FAMILY, graphemes, loadFont } from "@/components/product/preview-fonts";
import {
  F,
  ORNAMENTS,
  RING,
  boxOf,
  height,
  n,
  outermost,
  union,
  width,
  type Box,
  type Cursor,
  type Layout,
  type Line,
  type Pt,
} from "@/components/product/pendant-ornaments";

// ---------- measuring ----------

function measureLayout(names: string[], design: PendantDesign): Layout {
  const family = FONT_FAMILY[design.font];
  const px = F * (design.size ?? 1);
  const ctx = document.createElement("canvas").getContext("2d")!;
  const inkOf = (text: string, dx: number, dy: number): Box => {
    const m = ctx.measureText(text);
    return { x0: dx - m.actualBoundingBoxLeft, y0: dy - m.actualBoundingBoxAscent, x1: dx + m.actualBoundingBoxRight, y1: dy + m.actualBoundingBoxDescent };
  };
  ctx.font = `${px}px ${family}`;
  const xh = ctx.measureText("x").actualBoundingBoxAscent;

  // Letter boxes by visible letter, so Sinhala vowel signs stay with their consonant
  const charBoxes = (text: string, x: number, y: number) => {
    let before = "";
    return graphemes(text).map((g) => {
      const box = inkOf(g, x + ctx.measureText(before).width, y);
      before += g;
      return box;
    });
  };

  const firstWidth = width(inkOf(names[0], 0, 0));
  const centred = design.secondLine === "center";
  const shift = typeof design.secondLine === "number" ? design.secondLine : 0.28;
  // Infinity designs: the loop is sized to the names. The first name sits on the top of the left loop
  // and the second on the bottom of the right loop, with the band cut away behind them
  const widest = Math.max(...names.map((t) => width(inkOf(t, 0, 0))));
  const a = Math.max(F, 1.6 * widest);
  const mid = (t: string) => { const b = inkOf(t, 0, 0); return (b.y0 + b.y1) / 2; };
  const infinity = design.layout === "infinity" ? { a, cy: mid(names[0]) + 0.354 * a } : undefined;
  const lines: Line[] = names.map((text, i) => {
    const tw = width(inkOf(text, 0, 0));
    if (infinity) {
      const x = (i === 0 ? -0.61 * a : 0.61 * a) - tw / 2;
      const y = i === 0 ? 0 : infinity.cy + 0.354 * a - mid(text);
      return { text, x, y, size: px, ink: inkOf(text, x, y), chars: charBoxes(text, x, y) };
    }
    // Second line of a couple design sits lower and shifted right (or centred), like the catalogue pieces
    const x = i === 0 ? 0 : centred ? (firstWidth - tw) / 2 : firstWidth * shift;
    const y = i * px * (centred ? 0.95 : 0.78);
    const chars = charBoxes(text, x, y);
    return { text, x, y, size: px, ink: inkOf(text, x, y), chars };
  });
  const all = union(...lines.map((l) => l.ink));

  // Render the lettering (with its metal thickening) and scan the real ink edges
  const pad = Math.ceil(design.weight) + 4;
  const ox = Math.floor(all.x0) - pad;
  const oy = Math.floor(all.y0) - pad;
  const W = Math.ceil(width(all)) + pad * 2;
  const H = Math.ceil(height(all)) + pad * 2;
  const scan = document.createElement("canvas");
  scan.width = W;
  scan.height = H;
  const g = scan.getContext("2d", { willReadFrequently: true })!;
  g.font = ctx.font;
  g.lineWidth = design.weight;
  g.lineJoin = "round";
  for (const l of lines) {
    g.fillText(l.text, l.x - ox, l.y - oy);
    g.strokeText(l.text, l.x - ox, l.y - oy);
  }
  const alpha = g.getImageData(0, 0, W, H).data;
  const on = (x: number, y: number) => alpha[(y * W + x) * 4 + 3] > 110;
  const scanCol = (x: number, dir: 1 | -1) => {
    const c = Math.round(x) - ox;
    if (c < 0 || c >= W) return undefined;
    for (let y = dir === 1 ? 0 : H - 1; y >= 0 && y < H; y += dir) if (on(c, y)) return y + oy;
  };
  const scanRow = (y: number, dir: 1 | -1) => {
    const r = Math.round(y) - oy;
    if (r < 0 || r >= H) return undefined;
    for (let x = dir === 1 ? 0 : W - 1; x >= 0 && x < W; x += dir) if (on(x, r)) return x + ox;
  };

  const lastLine = lines[lines.length - 1];
  return {
    lines,
    ink: all,
    xh,
    first: lines[0].chars[0],
    last: lastLine.chars[lastLine.chars.length - 1],
    weight: design.weight,
    family,
    accentFamily: FONT_FAMILY[design.accentFont ?? design.font],
    infinity,
    top: (x) => scanCol(x, 1),
    bottom: (x) => scanCol(x, -1),
    left: (y) => scanRow(y, 1),
    right: (y) => scanRow(y, -1),
    measure: (text, fam, size) => {
      ctx.font = `${size}px ${fam}`;
      const box = inkOf(text, 0, 0);
      ctx.font = `${px}px ${family}`;
      return box;
    },
  };
}

/** Measure the name(s), place the ornaments and rings, and frame the whole piece */
function buildDrawing(rawNames: string[], style: PendantDesign) {
  const names = style.uppercase ? rawNames.map((s) => s.toUpperCase()) : rawNames;
  const layout = measureLayout(names, style);
  const cursor: Cursor = {};
  const pieces = style.ornaments.map((spec) => {
    const [name, opts] = typeof spec === "string" ? [spec, {}] : spec;
    cursor.line = opts.line;
    return ORNAMENTS[name](layout, opts, cursor);
  });

  // Rings go on the outermost attachment points: charms at the ends win over the letters
  const band = [layout.ink.y0, layout.ink.y0 + height(layout.ink) * 0.62] as const;
  const outL = outermost(layout, "left", ...band) ?? [layout.ink.x0, -layout.xh];
  const outR = outermost(layout, "right", ...band) ?? [layout.ink.x1, -layout.xh];
  const lefts = pieces.flatMap((pc) => (pc.bails?.left ? [pc.bails.left] : []));
  const rights = pieces.flatMap((pc) => (pc.bails?.right ? [pc.bails.right] : []));
  const bailLeft: Pt = lefts.length ? lefts.reduce((a, b) => (b[0] < a[0] ? b : a)) : [outL[0] - RING + 1, outL[1]];
  const bailRight: Pt = rights.length ? rights.reduce((a, b) => (b[0] > a[0] ? b : a)) : [outR[0] + RING - 1, outR[1]];

  const box = union(layout.ink, ...pieces.map((pc) => pc.box), boxOf([bailLeft, bailRight], RING + 2));
  const pad = 14;
  const vb = { x: box.x0 - pad, y: box.y0 - pad, w: width(box) + pad * 2, h: height(box) + pad * 2 };
  return { layout, pieces, bailLeft, bailRight, box, vb };
}

// ---------- component ----------

interface PendantPreviewProps {
  /** Name pendant design number, or a bracelet slug */
  design: PreviewKey;
  /** One name, or two for couple designs; empty entries are skipped */
  names: string[];
  className?: string;
}

export function PendantPreview({ design, names, className }: PendantPreviewProps) {
  const style = getPendantDesign(design);
  const family = style ? FONT_FAMILY[style.font] : "";
  const accent = style?.accentFont ? FONT_FAMILY[style.accentFont] : "";
  const [fontReady, setFontReady] = useState(false);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    if (!family) return;
    let alive = true;
    Promise.all([loadFont(family), accent && loadFont(accent)]).then(() => alive && setFontReady(true));
    return () => {
      alive = false;
    };
  }, [family, accent]);

  const cleanNames = names.map((s) => s.trim()).filter(Boolean);

  const drawing = style && fontReady && cleanNames.length ? buildDrawing(cleanNames, style) : null;

  if (!style) return null;

  const gold = `gold-${uid}`;
  const metal = `metal-${uid}`;
  const glitter = style.texture === "glitter";

  return (
    <div
      className={className}
      style={{ background: "radial-gradient(ellipse at 50% 40%, #2a2118 0%, #0d0a07 70%)" }}
    >
      {drawing ? (
        <svg
          viewBox={`${n(drawing.vb.x)} ${n(drawing.vb.y)} ${n(drawing.vb.w)} ${n(drawing.vb.h)}`}
          className="mx-auto block h-auto max-h-56 w-full"
          role="img"
          aria-label={`Preview of ${cleanNames.join(" and ")}${typeof design === "number" ? ` in design ${design}` : ""}`}
          style={{ animation: "fade-blur-in 400ms var(--ease-out) both" }}
        >
          <defs>
            <linearGradient id={gold} gradientUnits="userSpaceOnUse" x1="0" y1={drawing.box.y0} x2="0" y2={drawing.box.y1}>
              <stop offset="0" stopColor="#fff4cf" />
              <stop offset="0.28" stopColor="#efcd78" />
              <stop offset="0.52" stopColor="#c4943a" />
              <stop offset="0.68" stopColor="#ecc96f" />
              <stop offset="0.86" stopColor="#fbe6a6" />
              <stop offset="1" stopColor="#b3842f" />
            </linearGradient>
            {/* Polished-metal bevel plus a soft shadow, applied to the whole piece at once */}
            <filter id={metal} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="blur" />
              <feSpecularLighting in="blur" surfaceScale="3.5" specularConstant="0.85" specularExponent="22" lightingColor="#fff7dc" result="spec">
                <feDistantLight azimuth="235" elevation="48" />
              </feSpecularLighting>
              <feComposite in="spec" in2="SourceAlpha" operator="in" result="shine" />
              <feComposite in="SourceGraphic" in2="shine" operator="arithmetic" k2="1" k3="0.55" result="lit" />
              {glitter && (
                <>
                  {/* Fine sparkles across the metal, for the glitter-finish designs */}
                  <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="noise" />
                  <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 0.97  0 0 0 0 0.86  7 0 0 0 -3.9" result="sparks" />
                  <feComposite in="sparks" in2="SourceAlpha" operator="in" result="sparksIn" />
                  <feMerge result="lit">
                    <feMergeNode in="lit" />
                    <feMergeNode in="sparksIn" />
                  </feMerge>
                </>
              )}
              <feDropShadow in="lit" dx="1.5" dy="2.5" stdDeviation="2" floodColor="#000" floodOpacity="0.7" />
            </filter>
          </defs>

          {drawing.pieces.some((pc) => pc.behind) && (
            <>
              <g fill={`url(#${gold})`} stroke={`url(#${gold})`} filter={`url(#${metal})`}>
                {drawing.pieces.map((pc, i) => pc.behind && <g key={i}>{pc.node}</g>)}
              </g>
              {/* Cut the name out of the piece behind it so it reads as raised lettering */}
              <g fill="#120d09" stroke="#120d09">
                {drawing.layout.lines.map((line) => (
                  <text key={line.y} x={line.x} y={line.y} fontSize={line.size} style={{ fontFamily: family }} strokeWidth={drawing.layout.weight + 9} strokeLinejoin="round">
                    {line.text}
                  </text>
                ))}
              </g>
            </>
          )}

          <g fill={`url(#${gold})`} stroke={`url(#${gold})`} filter={`url(#${metal})`}>
            {drawing.layout.lines.map((line) => (
              <text
                key={line.y}
                x={line.x}
                y={line.y}
                fontSize={line.size}
                style={{ fontFamily: family }}
                strokeWidth={drawing.layout.weight}
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {line.text}
              </text>
            ))}
            {drawing.pieces.map((pc, i) => !pc.behind && <g key={i}>{pc.node}</g>)}
            {[drawing.bailLeft, drawing.bailRight].map(([x, y], i) => (
              <circle key={i} cx={n(x)} cy={n(y)} r={RING} fill="none" strokeWidth={3.2} />
            ))}
          </g>
          {drawing.pieces.map((pc, i) => pc.overlay && <g key={i}>{pc.overlay}</g>)}
        </svg>
      ) : (
        <div className="h-24" aria-hidden />
      )}
    </div>
  );
}
