"use client";

import { useEffect, useId, useState } from "react";

import { WALLET_DESIGNS } from "@/lib/wallet-designs";
import { CROWN, CROWN_BALLS, lemniscate } from "@/components/product/pendant-ornaments";
import { WALLET_FONTS, fontCss, loadFont, type FontSpec } from "@/components/product/preview-fonts";

// Layout in SVG units: the wallet front, with the nameplate in the lower right like the catalogue photos
const W = { x: 40, y: 34, w: 400, h: 292, r: 26 };
const PLATE = { cx: 296, cy: 258, w: 270, h: 58 };
const PLATE_TEXT_MAX = PLATE.w - 92; // clear of the rivets
const HEART = "♥";

function shade(hex: string, amount: number) {
  const v = parseInt(hex.slice(1), 16);
  const c = [v >> 16, (v >> 8) & 255, v & 255].map((x) =>
    Math.round(amount >= 0 ? x + (255 - x) * amount : x * (1 + amount))
  );
  return `rgb(${c.join(",")})`;
}

/** Largest font size (up to max) that fits the text into the given width */
function fitSize(text: string, font: FontSpec, maxWidth: number, max: number) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = fontCss(font, 100);
  const w = ctx.measureText(text).width;
  return w > 0 ? Math.min(max, (100 * maxWidth) / w) : max;
}

interface WalletPreviewProps {
  /** Wallet product slug */
  design: string;
  /** One name, or two for the couple design; empty entries are skipped */
  names: string[];
  className?: string;
}

export function WalletPreview({ design, names, className }: WalletPreviewProps) {
  const style = WALLET_DESIGNS[design];
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [fontReady, setFontReady] = useState(false);
  const plateFont = style ? WALLET_FONTS[style.plate] : WALLET_FONTS.serifItalic;

  useEffect(() => {
    let alive = true;
    Promise.all([loadFont(plateFont), loadFont(WALLET_FONTS.script), loadFont(WALLET_FONTS.serifItalic)]).then(
      () => alive && setFontReady(true)
    );
    return () => {
      alive = false;
    };
  }, [plateFont]);

  if (!style) return null;
  const clean = names.map((s) => s.trim()).filter(Boolean);
  if (!fontReady || clean.length === 0) {
    return <div className={className} style={{ background: "#e9e2da" }}><div className="h-40" aria-hidden /></div>;
  }

  const plateText =
    style.plate === "sansCaps"
      ? clean[0].toUpperCase()
      : style.joinWithHeart && clean.length > 1
        ? `${clean[0]} ${HEART} ${clean[1]}`
        : clean[0];
  const plateSize = fitSize(plateText, plateFont, PLATE_TEXT_MAX, style.plate === "sansCaps" ? 26 : 32);
  const keyName = clean[0];
  const keySize = fitSize(keyName, WALLET_FONTS.serifItalic, 118, 28);

  const id = (k: string) => `${k}-${uid}`;
  const brass = `url(#${id("brass")})`;
  const textY = PLATE.cy + plateSize * 0.34;
  const heartParts = plateText.split(` ${HEART} `);

  const plateLabel = (fill: string, dy = 0) => (
    <text
      x={PLATE.cx}
      y={textY + dy}
      textAnchor="middle"
      fontSize={plateSize}
      fill={fill}
      style={{ fontFamily: plateFont.family, fontWeight: plateFont.weight, fontStyle: plateFont.style, letterSpacing: style.plate === "sansCaps" ? "0.06em" : undefined }}
    >
      {heartParts.length === 2 ? (
        <>
          {heartParts[0]}
          <tspan fill={dy ? fill : "#c4252c"} style={{ fontStyle: "normal" }}>{` ${HEART} `}</tspan>
          {heartParts[1]}
        </>
      ) : (
        plateText
      )}
    </text>
  );

  // Charm sits above the nameplate
  const charmCx = PLATE.cx + (style.charm === "infinityLove" ? 40 : 0);
  const charmY = PLATE.cy - PLATE.h / 2 - 12;

  return (
    <div className={className} style={{ background: "radial-gradient(ellipse at 50% 35%, #f5f0ea 0%, #ddd3c7 80%)" }}>
      <svg
        viewBox="0 0 480 372"
        className="mx-auto block h-auto max-h-72 w-full"
        role="img"
        aria-label={`Wallet preview with ${clean.join(" and ")}`}
        style={{ animation: "fade-blur-in 400ms var(--ease-out) both" }}
      >
        <defs>
          <linearGradient id={id("leather")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={shade(style.leather, 0.14)} />
            <stop offset="0.55" stopColor={style.leather} />
            <stop offset="1" stopColor={shade(style.leather, -0.3)} />
          </linearGradient>
          <linearGradient id={id("fold")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.45" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={id("brass")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f1dc9e" />
            <stop offset="0.45" stopColor="#c9a65c" />
            <stop offset="0.75" stopColor="#e2c47f" />
            <stop offset="1" stopColor="#8f6c33" />
          </linearGradient>
          <radialGradient id={id("rivet")} cx="0.35" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#f6e6b6" />
            <stop offset="0.6" stopColor="#b48d45" />
            <stop offset="1" stopColor="#6d5021" />
          </radialGradient>
          <linearGradient id={id("silver")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f2f2f2" />
            <stop offset="0.5" stopColor="#9a9a9a" />
            <stop offset="1" stopColor="#dcdcdc" />
          </linearGradient>
          {/* Leather grain */}
          <filter id={id("grain")} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.22 0" result="dots" />
            <feComposite in="dots" in2="SourceAlpha" operator="in" result="grain" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="grain" />
            </feMerge>
          </filter>
          {/* Brushed metal streaks */}
          <filter id={id("brushed")} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.8" numOctaves="1" seed="2" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.1  0 0 0 0.35 0" result="streaks" />
            <feComposite in="streaks" in2="SourceAlpha" operator="in" result="s" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="s" />
            </feMerge>
          </filter>
          <filter id={id("shadow")} x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
          </filter>
          <filter id={id("lift")} x="-20%" y="-30%" width="140%" height="170%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.4" floodColor="#000" floodOpacity="0.55" />
          </filter>
        </defs>

        {/* Wallet */}
        <g filter={`url(#${id("shadow")})`}>
          <rect x={W.x} y={W.y} width={W.w} height={W.h} rx={W.r} fill={`url(#${id("leather")})`} filter={`url(#${id("grain")})`} />
        </g>
        <rect x={W.x} y={W.y} width={22} height={W.h} rx={W.r * 0.6} fill={`url(#${id("fold")})`} />
        <rect
          x={W.x + 14}
          y={W.y + 14}
          width={W.w - 28}
          height={W.h - 28}
          rx={W.r - 10}
          fill="none"
          stroke={style.thread}
          strokeWidth={2.4}
          strokeDasharray="8 5"
          strokeLinecap="round"
        />

        {/* Charm */}
        <g filter={`url(#${id("lift")})`}>
          {style.charm === "crown" && (
            <g transform={`translate(${charmCx} ${charmY}) scale(1.08)`}>
              <path d={CROWN} fill={brass} stroke="#6d5021" strokeWidth={1.4} strokeLinejoin="round" />
              {CROWN_BALLS.map(([x, y]) => (
                <g key={x}>
                  <circle cx={x} cy={y} r={8} fill={brass} stroke="#6d5021" strokeWidth={1.2} />
                  <circle cx={x} cy={y} r={4.6} fill="#7a4a1c" />
                </g>
              ))}
              {/* Stones across the band */}
              {[-27, -15, -3, 9, 21].flatMap((x, i) => [
                <circle key={`a${i}`} cx={x + 3} cy={-24} r={4} fill="#7a4a1c" />,
                <circle key={`b${i}`} cx={x + (i < 4 ? 9 : -21)} cy={-12} r={4} fill="#7a4a1c" />,
              ])}
            </g>
          )}
          {style.charm === "mr" && (
            <text
              x={charmCx}
              y={charmY - 4}
              textAnchor="middle"
              fontSize={74}
              fill={brass}
              stroke="#6d5021"
              strokeWidth={1}
              style={{ fontFamily: WALLET_FONTS.script.family }}
            >
              Mr.
            </text>
          )}
          {style.charm === "infinityLove" && (
            <g>
              <path d={lemniscate(charmCx, charmY - 34, 66)} fill="none" stroke={brass} strokeWidth={10} />
              <path d={lemniscate(charmCx, charmY - 34, 66)} fill="none" stroke="#6d5021" strokeWidth={10} strokeOpacity={0.25} strokeDasharray="1 3" />
              <text
                x={charmCx + 36}
                y={charmY - 16}
                textAnchor="middle"
                fontSize={48}
                fill={brass}
                stroke="#6d5021"
                strokeWidth={0.8}
                style={{ fontFamily: WALLET_FONTS.script.family }}
              >
                love
              </text>
            </g>
          )}
        </g>

        {/* Nameplate */}
        <g filter={`url(#${id("lift")})`}>
          <rect
            x={PLATE.cx - PLATE.w / 2}
            y={PLATE.cy - PLATE.h / 2}
            width={PLATE.w}
            height={PLATE.h}
            rx={PLATE.h / 2}
            fill={brass}
            filter={`url(#${id("brushed")})`}
          />
        </g>
        {[-1, 1].map((s) => (
          <circle key={s} cx={PLATE.cx + s * (PLATE.w / 2 - 26)} cy={PLATE.cy} r={11} fill={`url(#${id("rivet")})`} stroke="#5d431b" strokeWidth={1} />
        ))}
        {/* Engraved lettering: a light edge under dark cut-in letters */}
        {plateLabel("rgba(255,244,210,0.7)", 1)}
        {plateLabel("#3a2810")}

        {/* Matching keychain */}
        {style.keychain && (
          <g transform="rotate(-14 118 190)">
            <circle cx={104} cy={300} r={30} fill="none" stroke={`url(#${id("silver")})`} strokeWidth={6} />
            <rect x={98} y={252} width={12} height={22} rx={4} fill={`url(#${id("silver")})`} />
            <g filter={`url(#${id("lift")})`}>
              <rect x={70} y={112} width={76} height={146} rx={12} fill="#141414" stroke={`url(#${id("silver")})`} strokeWidth={5} />
            </g>
            <text
              x={0}
              y={0}
              transform={`translate(${108 + keySize * 0.32} 185) rotate(-90)`}
              textAnchor="middle"
              fontSize={keySize}
              fill="#f4f4f4"
              style={{ fontFamily: WALLET_FONTS.serifItalic.family, fontStyle: "italic", fontWeight: 500 }}
            >
              {keyName}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
