import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: React.ReactNode;
}

const POSTS: Post[] = [
  {
    slug: "why-nano-creators-outperform-mega-influencers",
    title: "Why Nano Creators Outperform Mega Influencers in 2025",
    excerpt:
      "Creators with 1,000–10,000 followers consistently deliver higher engagement rates, more authentic recommendations, and stronger conversion than mega influencers.",
    category: "Influencer Marketing",
    date: "May 2025",
    readTime: "5 min read",
    content: (
      <div className="prose-content">
        <p>
          When most brands think about influencer marketing, they picture celebrities and
          creators with millions of followers. But the data tells a different story: nano
          creators — those with 1,000 to 10,000 followers — consistently outperform their
          larger counterparts on the metrics that actually matter.
        </p>

        <h2>The Engagement Rate Gap</h2>
        <p>
          Nano creators on TikTok average engagement rates of 5–8%, compared to 1–2% for
          mega influencers with over 1 million followers. The reason is simple: smaller
          audiences are tighter communities. A creator with 5,000 followers in a specific
          niche has built a genuine relationship with their audience. When they recommend a
          product, it feels like advice from a friend, not an ad.
        </p>

        <h2>Authenticity Converts</h2>
        <p>
          Nielsen research shows that 92% of consumers trust recommendations from people
          they know over branded advertising. Nano creators sit closer to the "person I
          know" end of the spectrum. Their content feels organic, their recommendations
          feel earned, and their audiences are highly responsive.
        </p>
        <p>
          Brands working with nano creators often report conversion rates 3–5x higher than
          traditional influencer campaigns. Lower cost-per-creator multiplied by higher
          conversion rate means the economics are dramatically better.
        </p>

        <h2>The Cost Advantage</h2>
        <p>
          A single post from a mega influencer might cost ₺50,000–₺200,000. For the same
          budget, a brand can work with 20–30 nano creators, reaching diverse micro-communities
          with authentic, varied content. The risk is also spread: if one creator
          underperforms, others pick up the slack.
        </p>

        <h2>Category Fit Matters More Than Raw Reach</h2>
        <p>
          A nano creator with 3,000 followers in the skincare category will outperform a
          general lifestyle influencer with 500,000 followers for a beauty brand. The
          audience alignment drives relevance, and relevance drives results.
        </p>
        <p>
          At Folkie, we match brands with nano creators based on category fit, audience
          location, engagement rate, and content style — not just follower count.
        </p>

        <h2>The Bottom Line</h2>
        <p>
          Nano creators are not a compromise for brands with small budgets. They are a
          strategic choice for brands that want real results. The shift toward authentic,
          community-driven marketing is not a trend — it is where influencer marketing is
          heading.
        </p>
      </div>
    ),
  },
  {
    slug: "how-to-write-a-tiktok-campaign-brief",
    title: "How to Write a TikTok Campaign Brief Creators Will Love",
    excerpt:
      "A vague brief is the #1 reason campaigns underperform. Learn how to write a brief that gives creators clear direction while leaving room for their creative voice.",
    category: "Brand Guides",
    date: "April 2025",
    readTime: "8 min read",
    content: (
      <div className="prose-content">
        <p>
          The campaign brief is the most important document in any influencer partnership.
          Done well, it sets clear expectations while preserving the creator's authentic
          voice. Done poorly, it either stifles creativity or leaves creators guessing —
          both of which kill results.
        </p>

        <h2>What Every Brief Needs</h2>
        <p>A strong TikTok campaign brief covers six things:</p>

        <h3>1. Product Overview (2–3 sentences)</h3>
        <p>
          What is the product, what does it do, and who is it for? Keep it simple. Creators
          are not product managers — they need to understand the product quickly so they can
          explain it naturally.
        </p>

        <h3>2. The Key Message</h3>
        <p>
          What is the one thing you want viewers to take away? Not three things, not five —
          one. "This moisturizer doesn't feel greasy" is a key message. "Natural, affordable,
          effective, dermatologist-tested" is not.
        </p>

        <h3>3. Required Elements</h3>
        <p>
          List the non-negotiables: required hashtags, a specific product mention, a
          call-to-action. Be explicit. If the creator must include a swipe-up link or a
          discount code, say so.
        </p>

        <h3>4. Tone and Style Direction</h3>
        <p>
          Share 2–3 examples of content styles that resonate with your brand. Reference
          existing TikTok videos or creators whose style fits your brand. Do not say
          "make it fun" — show what "fun" looks like for you.
        </p>

        <h3>5. Content Restrictions</h3>
        <p>
          What should the creator avoid? Competitor mentions, certain claims, specific
          aesthetics that clash with brand guidelines. Keep this list short — the longer
          the restriction list, the more constrained and stilted the content becomes.
        </p>

        <h3>6. Technical Specs</h3>
        <p>
          Video length (15s, 30s, 60s), aspect ratio (9:16 for TikTok), whether a
          voiceover or on-camera appearance is required, and the publish window.
        </p>

        <h2>What to Avoid</h2>
        <p>
          The most common brief mistake is scripting. Providing a word-for-word script
          kills the authenticity that makes nano creators valuable. Give creators a
          framework, not a teleprompter. Their audience follows them for their voice — let
          them use it.
        </p>
        <p>
          Another common mistake: requiring creators to post at a specific time. Creators
          know when their audience is active. Trust them on timing.
        </p>

        <h2>The Review Process</h2>
        <p>
          Build one round of revision into your timeline, not three. Multiple revision
          rounds erode creator enthusiasm and slow down the campaign. If your brief is
          clear, one round of feedback is almost always enough.
        </p>
        <p>
          On Folkie, brands review submitted content directly on the platform — approve,
          request one revision, or approve with notes for the creator's next submission.
        </p>
      </div>
    ),
  },
  {
    slug: "nano-creator-economy-turkey-2025",
    title: "The Nano Creator Economy in Turkey: 2025 Trends",
    excerpt:
      "Turkish TikTok is maturing fast. We look at engagement benchmarks, category breakdowns, and what brands need to know about working with Turkey's nano creator community.",
    category: "Industry Trends",
    date: "March 2025",
    readTime: "6 min read",
    content: (
      <div className="prose-content">
        <p>
          Turkey's TikTok landscape is evolving rapidly. With over 30 million active users,
          the platform has moved far beyond dance trends and into a serious content ecosystem
          spanning lifestyle, food, fashion, tech, and local entertainment.
        </p>

        <h2>The Turkish Nano Creator Landscape</h2>
        <p>
          Turkish nano creators — those with 1,000–10,000 followers — are a distinct segment.
          Many are domain experts: a pastry chef in Ankara sharing recipes, a sneaker
          collector in Istanbul reviewing drops, a fitness coach in İzmir posting workout
          routines. Their audiences are local, loyal, and highly engaged.
        </p>
        <p>
          Average engagement rates among Turkish nano creators on TikTok currently sit at
          6.2%, well above the global TikTok average of 4.1%. Smaller communities, higher
          trust.
        </p>

        <h2>Top-Performing Categories</h2>
        <p>Based on campaign data from early 2025, the highest-engagement categories are:</p>
        <ul>
          <li><strong>Food & Beverage</strong> — 8.1% average engagement</li>
          <li><strong>Beauty & Skincare</strong> — 7.4%</li>
          <li><strong>Fashion & Style</strong> — 6.8%</li>
          <li><strong>Home & Living</strong> — 6.3%</li>
          <li><strong>Tech & Gadgets</strong> — 5.9%</li>
        </ul>

        <h2>What Brands Are Getting Wrong</h2>
        <p>
          The biggest mistake Turkish brands make with nano creators is treating them like
          ad placements rather than creative partners. A nano creator's value comes from
          their authentic connection to their audience — scripted, over-produced content
          breaks that connection and tanks performance.
        </p>
        <p>
          The second most common mistake: working with creators in the wrong cities. Turkey's
          regional diversity is significant. A lifestyle creator based in Gaziantep speaks
          to a very different audience than one in İstanbul. For brands with national reach,
          working with creators across multiple cities dramatically improves campaign spread.
        </p>

        <h2>The Economics for Brands</h2>
        <p>
          Turkish nano creator rates are considerably lower than Western markets, making
          the cost-per-engagement economics particularly attractive. Brands currently
          spending on traditional digital ads are finding that nano creator campaigns deliver
          comparable reach with significantly higher engagement and conversion.
        </p>

        <h2>What's Coming in 2025</h2>
        <p>
          We expect three trends to define the Turkish nano creator space this year:
        </p>
        <ol>
          <li>
            <strong>Category specialization</strong> — creators doubling down on niches
            rather than broad lifestyle content
          </li>
          <li>
            <strong>Long-term brand partnerships</strong> — replacing one-off campaigns
            with ongoing creator relationships
          </li>
          <li>
            <strong>Performance-linked compensation</strong> — brands moving toward
            models where creators earn more when campaigns perform
          </li>
        </ol>
        <p>
          Folkie is building infrastructure to support all three of these trends for
          Turkish brands and creators.
        </p>
      </div>
    ),
  },
  {
    slug: "folkie-is-live",
    title: "Folkie Is Live: Building a Commission-Only Creator Platform",
    excerpt:
      "No subscriptions, no upfront fees — just a 15% commission on completed campaigns. Here's why we built Folkie this way, and what's coming next.",
    category: "Folkie News",
    date: "February 2025",
    readTime: "4 min read",
    content: (
      <div className="prose-content">
        <p>
          Folkie is now live. We built a platform that connects Turkish brands with nano
          TikTok creators — and we built it around one principle: brands and creators
          should only pay when they get results.
        </p>

        <h2>Why Commission-Only?</h2>
        <p>
          Most influencer marketing platforms charge monthly subscriptions before a brand
          has run a single campaign. We think that's backwards. A platform should earn
          money when its users earn money.
        </p>
        <p>
          Folkie takes a 15% commission on completed campaigns, charged at the time of
          payment. No subscription. No setup fee. No risk for brands testing the platform
          for the first time.
        </p>

        <h2>What's in the First Version</h2>
        <p>Folkie's first release includes:</p>
        <ul>
          <li>
            <strong>Campaign creation</strong> — brands set brief, budget, target
            categories, cities, and follower range
          </li>
          <li>
            <strong>Creator applications</strong> — nano creators browse and apply to
            open campaigns
          </li>
          <li>
            <strong>Brand review tools</strong> — approve, reject, or message applicants
          </li>
          <li>
            <strong>Content submission flow</strong> — approved creators upload their
            content for brand review before publishing
          </li>
          <li>
            <strong>Revision workflow</strong> — brands can request one round of revisions
            with specific notes
          </li>
          <li>
            <strong>Earnings tracking</strong> — creators see their payment status in
            real time
          </li>
        </ul>

        <h2>What's Coming Next</h2>
        <p>
          We're actively building flash campaigns (publish within a fixed time window),
          AI-powered creator matching, and deeper analytics. We're also expanding the
          creator verification process to ensure every creator on Folkie has a real,
          active TikTok presence.
        </p>

        <h2>A Note to Creators</h2>
        <p>
          We built Folkie for creators too. You get paid for completed work — no unpaid
          "awareness" deals, no brands ghosting you after content submission. Every
          campaign on Folkie has a real budget, and payment goes out when your content is
          approved and published.
        </p>
        <p>
          We're building the creator economy we'd want to work in. Join us.
        </p>
      </div>
    ),
  },
];

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} — Folkie Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://folkie.com.tr/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://folkie.com.tr/blog/${slug}`,
      siteName: "Folkie",
      locale: "en_US",
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-background">
      <article className="container-folkie py-16 lg:py-24">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-small text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Blog
          </Link>

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-caption font-medium text-primary">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
              <span>·</span>
              <span>{post.date}</span>
            </div>
            <h1 className="mt-4 text-h1 leading-tight">{post.title}</h1>
            <p className="mt-4 text-body text-foreground/70">{post.excerpt}</p>
          </div>

          <div className="mt-10 border-t border-border pt-10 text-small leading-relaxed text-foreground/80 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-h3 [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-body [&_h3]:font-semibold [&_ol]:my-4 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_p]:my-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
            {post.content}
          </div>

          <div className="mt-12 rounded-3xl bg-primary-light p-8 text-center">
            <h3 className="text-h3 text-primary">Ready to run your first nano campaign?</h3>
            <p className="mt-2 text-small text-foreground/70">
              No subscription. 15% commission only on completed campaigns.
            </p>
            <Link
              href="/register"
              className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-small font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Get Started — Free
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
