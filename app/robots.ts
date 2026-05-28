import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://folkie.com.tr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin-login",
          "/api/",
          "/creator/",
          "/brand/",
          "/onboarding",
          "/dashboard",
          "/hangfire",
        ],
      },
      // Allow major AI crawlers explicitly for content discovery
      {
        userAgent: ["GPTBot", "ClaudeBot", "anthropic-ai", "Google-Extended", "PerplexityBot"],
        allow: "/",
        disallow: [
          "/admin/",
          "/admin-login",
          "/api/",
          "/creator/",
          "/brand/",
          "/onboarding",
          "/dashboard",
          "/hangfire",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
