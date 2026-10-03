import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";

// Body font — rounded, clean, modern, highly readable
const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Mono font — for admin code/data display
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lassana LK | Personalized Jewelry & Elegant Designs in Sri Lanka",
    template: "%s | Lassana LK",
  },
  description:
    "Discover elegant jewelry and personalized name pendants from Lassana LK. Shop beautiful designs with convenient Cash on Delivery ordering in Sri Lanka.",
  keywords: [
    "jewelry",
    "Sri Lanka",
    "personalized jewelry",
    "name pendants",
    "custom jewelry",
    "Lassana LK",
    "gold jewelry",
    "silver jewelry",
    "COD",
    "cash on delivery",
  ],
  authors: [{ name: "Lassana LK" }],
  creator: "Lassana LK",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "Lassana LK",
    title: "Lassana LK | Personalized Jewelry & Elegant Designs in Sri Lanka",
    description:
      "Discover elegant jewelry and personalized name pendants from Lassana LK. Shop beautiful designs with convenient Cash on Delivery ordering in Sri Lanka.",
    images: [
      {
        url: "/logo/full logo.png",
        width: 1200,
        height: 630,
        alt: "Lassana LK — Personalized Jewelry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lassana LK | Personalized Jewelry",
    description:
      "Discover elegant jewelry and personalized name pendants from Lassana LK.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
