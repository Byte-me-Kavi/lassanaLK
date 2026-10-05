import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { absoluteUrl } from "@/lib/seo";

// Rebuild hourly so new products appear without a redeploy
export const revalidate = 3600;

const STATIC_PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/delivery", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at, images:product_images(url, is_primary)")
    .eq("is_active", true);

  const productEntries: MetadataRoute.Sitemap = (products || []).map((p) => {
    const images = (p.images || []) as { url: string; is_primary: boolean }[];
    const primary = images.find((i) => i.is_primary) || images[0];
    return {
      url: absoluteUrl(`/products/${p.slug}`),
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
      images: primary?.url ? [primary.url] : undefined,
    };
  });

  return [
    ...STATIC_PAGES.map((page) => ({
      url: absoluteUrl(page.path),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...productEntries,
  ];
}
