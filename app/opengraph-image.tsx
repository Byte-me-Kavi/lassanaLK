import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const alt = "Lassana LK — personalized name pendants and jewelry, cash on delivery in Sri Lanka";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const pendant = await readFile(join(process.cwd(), "public/logo/only logo.png"), "base64");
const pendantSrc = `data:image/png;base64,${pendant}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 96px",
          background: "radial-gradient(circle at 78% 50%, #4a1466 0%, #200030 55%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>
            Lassana<span style={{ color: "#EBB668", marginLeft: 20 }}>LK</span>
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 40, lineHeight: 1.25, color: "rgba(255,255,255,0.92)" }}>
            Personalized name pendants and jewelry, made to order
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 40,
              padding: "14px 28px",
              borderRadius: 999,
              background: "#EBB668",
              color: "#200030",
              fontSize: 28,
              fontWeight: 700,
              alignSelf: "flex-start",
            }}
          >
            Cash on delivery anywhere in Sri Lanka
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pendantSrc} height={460} alt="" />
      </div>
    ),
    size
  );
}
