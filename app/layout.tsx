import type { Metadata, Viewport } from "next";
import { SEO_COPY, SITE_URL } from "@/lib/seo";
import { Bodoni_Moda, Hanken_Grotesk, Great_Vibes, Geist_Mono } from "next/font/google";
import "./globals.css";

// Display font — high-contrast serif that echoes the Lassana wordmark
const bodoni = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

// Body font — open, highly readable grotesque
const hanken = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Script font — only used to preview engraved names in gold
const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

// Mono font — for admin code/data display
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_COPY.defaultTitle,
    template: "%s | Lassana LK",
  },
  description: SEO_COPY.description,
  applicationName: "Lassana LK",
  keywords: SEO_COPY.keywords,
  authors: [{ name: "Lassana LK" }],
  creator: "Lassana LK",
  publisher: "Lassana LK",
  category: "shopping",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "Lassana LK",
    url: "/",
    title: SEO_COPY.defaultTitle,
    description: SEO_COPY.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_COPY.defaultTitle,
    description: SEO_COPY.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#200030",
  width: "device-width",
  initialScale: 1,
};

import { Toaster } from "@/components/ui/toast";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-LK"
      className={`${bodoni.variable} ${hanken.variable} ${greatVibes.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Hide the home intro before first paint if it already played this session */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("llk-splash-seen")==="1")document.documentElement.dataset.splash="seen"}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
