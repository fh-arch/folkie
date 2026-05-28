import Link from "next/link";
import type { Metadata } from "next";
import { Newspaper, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Folkie",
  description:
    "Nano TikTok creator marketing, influencer campaign guides, brand tips, and Folkie product updates.",
  alternates: { canonical: "https://folkie.com.tr/blog" },
  openGraph: {
    title: "Folkie Blog",
    description:
      "Nano creator marketing, brand campaign guides, and TikTok influencer trends.",
    url: "https://folkie.com.tr/blog",
    siteName: "Folkie",
    locale: "en_US",
    type: "website",
  },
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
}

const POSTS: BlogPost[] = [
  {
    slug: "why-nano-creators-outperform-mega-influencers",
    title: "Why Nano Creators Outperform Mega Influencers in 2025",
    excerpt:
      "Creators with 1,000–10,000 followers consistently deliver higher engagement rates, more authentic recommendations, and stronger conversion than mega influencers. Here's the data behind the trend.",
    category: "Influencer Marketing",
    date: "May 2025",
    readTime: "5 min read",
  },
  {
    slug: "how-to-write-a-tiktok-campaign-brief",
    title: "How to Write a TikTok Campaign Brief Creators Will Love",
    excerpt:
      "A vague brief is the #1 reason campaigns underperform. Learn how to write a brief that gives creators clear direction while leaving room for their creative voice.",
    category: "Brand Guides",
    date: "April 2025",
    readTime: "8 min read",
  },
  {
    slug: "nano-creator-economy-turkey-2025",
    title: "The Nano Creator Economy in Turkey: 2025 Trends",
    excerpt:
      "Turkish TikTok is maturing fast. We look at engagement benchmarks, category breakdowns, and what brands need to know about working with Turkey's nano creator community.",
    category: "Industry Trends",
    date: "March 2025",
    readTime: "6 min read",
  },
  {
    slug: "folkie-is-live",
    title: "Folkie Is Live: Building a Commission-Only Creator Platform",
    excerpt:
      "No subscriptions, no upfront fees — just a 15% commission on completed campaigns. Here's why we built Folkie this way, and what's coming next.",
    category: "Folkie News",
    date: "February 2025",
    readTime: "4 min read",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Influencer Marketing": "bg-primary/10 text-primary",
  "Brand Guides": "bg-warning/15 text-warning",
  "Industry Trends": "bg-success/15 text-success",
  "Folkie News": "bg-accent/30 text-foreground",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container-folkie py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="text-small text-muted-foreground hover:text-primary">
            ← Home
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
              <Newspaper className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-h1">Folkie Blog</h1>
              <p className="text-small text-muted-foreground">
                Nano creator marketing, brand guides, and industry trends.
              </p>
            </div>
          </div>

          <ul className="mt-12 space-y-6">
            {POSTS.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="card-folkie group block p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-caption font-medium ${
                        CATEGORY_COLORS[post.category] ?? "bg-accent/30 text-foreground"
                      }`}
                    >
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="mt-3 text-body font-semibold group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-small text-foreground/70">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1 text-small font-semibold text-primary">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
