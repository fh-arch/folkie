import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://folkie.com.tr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/about", priority: 0.8, freq: "monthly" },
    { path: "/careers", priority: 0.7, freq: "weekly" },
    { path: "/blog", priority: 0.8, freq: "weekly" },
    { path: "/contact", priority: 0.6, freq: "monthly" },
    { path: "/privacy", priority: 0.5, freq: "yearly" },
    { path: "/terms", priority: 0.5, freq: "yearly" },
    { path: "/kvkk", priority: 0.5, freq: "yearly" },
    { path: "/cookie-policy", priority: 0.5, freq: "yearly" },
    { path: "/login", priority: 0.7, freq: "monthly" },
    { path: "/register", priority: 0.9, freq: "monthly" },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
