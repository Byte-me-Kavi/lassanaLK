import type { Metadata } from "next";

// Private, per-visitor page: keep it out of search results
export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
