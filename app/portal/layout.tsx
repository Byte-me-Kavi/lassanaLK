import type { Metadata } from "next";

// Private, per-visitor page: keep it out of search results
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Lassana LK Admin" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
