import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Quote,
  Plus,
  Minus,
  Music2,
} from "lucide-react";

export const metadata = {
  title: "Folkie — The right creators, real impact",
  description:
    "Connect your brand with nano TikTok creators (1K–10K followers). AI matching, secure payments, flash campaigns. 15% commission only on completed campaigns.",
  alternates: { canonical: "https://folkie.com.tr" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://folkie.com.tr/#organization",
      name: "Folkie",
      url: "https://folkie.com.tr",
      logo: "https://folkie.com.tr/logo.png",
      description:
        "Turkey-based B2B influencer marketing marketplace connecting brands with nano TikTok creators.",
      sameAs: ["https://www.tiktok.com/@folkie"],
      address: {
        "@type": "PostalAddress",
        addressCountry: "TR",
        addressLocality: "İstanbul",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "destek@folkie.com.tr",
          availableLanguage: ["Turkish", "English"],
        },
        {
          "@type": "ContactPoint",
          contactType: "press",
          email: "press@folkie.com.tr",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://folkie.com.tr/#website",
      url: "https://folkie.com.tr",
      name: "Folkie",
      publisher: { "@id": "https://folkie.com.tr/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "Service",
      "@id": "https://folkie.com.tr/#service",
      name: "Nano TikTok Influencer Marketing Platform",
      provider: { "@id": "https://folkie.com.tr/#organization" },
      areaServed: { "@type": "Country", name: "Türkiye" },
      audience: { "@type": "BusinessAudience", name: "Brands & SMEs" },
      offers: {
        "@type": "Offer",
        description:
          "15% commission only on completed campaigns. No monthly subscription.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <Hero />
      <SocialProof />
      <WhyFolkie />
      <HowItWorks />
      <CampaignShowcase />
      <Testimonials />
      <ForCreators />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* ─── Header ─────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container-folkie flex items-center justify-between py-4">
        <Link href="/" className="text-h3 font-bold tracking-tight text-primary">
          folkie<span className="text-accent">.</span>
        </Link>
        <nav className="hidden items-center gap-7 text-small md:flex">
          <a href="#nasil-calisir" className="text-muted-foreground hover:text-foreground">
            How it works
          </a>
          <a href="#ozellikler" className="text-muted-foreground hover:text-foreground">
            Features
          </a>
          <a href="#creator-olmak" className="text-muted-foreground hover:text-foreground">
            For Creators
          </a>
          <a href="#fiyat" className="text-muted-foreground hover:text-foreground">
            Pricing
          </a>
          <a href="#sss" className="text-muted-foreground hover:text-foreground">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link href="/login" className="hidden text-small text-muted-foreground hover:text-foreground sm:inline">
              Sign in
            </Link>
            <Link
              href="/register?role=brand"
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Start as a brand
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="text-small text-muted-foreground hover:text-foreground">
              Go to dashboard
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */

const CREATOR_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
];

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative violet blob */}
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 left-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="container-folkie relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-caption font-semibold text-accent-foreground">
            <Sparkles className="h-3 w-3" />
            Nano creator first
          </span>
          <h1 className="mt-5 text-[40px] font-bold leading-[1.05] tracking-tight sm:text-[56px] lg:text-[64px]">
            The right creators,
            <br />
            <span className="text-primary">real impact</span>
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-lg text-body text-muted-foreground sm:text-lg">
            Connect your brand with authentic TikTok creators (1K–10K followers).
            AI matching, secure payments, viral flash campaigns — all from one
            dashboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/register?role=brand"
              className="flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-body font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              Start as a brand
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register?role=influencer"
              className="flex items-center gap-2 rounded-full border-2 border-primary bg-card px-6 py-3.5 text-body font-semibold text-primary hover:bg-primary-light"
            >
              <Music2 className="h-4 w-4" />
              Join as a creator
            </Link>
          </div>
          <p className="mt-3 text-caption text-muted-foreground">
            💳 No subscription · 15% commission only on completed campaigns
          </p>

          {/* Creator avatar mosaic */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {CREATOR_AVATARS.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <div className="text-small text-muted-foreground">
              <span className="font-bold text-foreground">12,400+ creators</span>{" "}
              registered and ready
            </div>
          </div>
        </div>

        {/* Right side — phone mockup */}
        <div className="relative mx-auto lg:mx-0">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative">
      {/* Phone frame */}
      <div className="relative w-[280px] sm:w-[320px] mx-auto rounded-[44px] border-[8px] border-navy bg-navy p-1 shadow-2xl">
        <div className="overflow-hidden rounded-[36px] bg-background">
          {/* App "screen" */}
          <div className="bg-primary px-5 pb-8 pt-12 text-primary-foreground">
            <p className="text-caption text-primary-foreground/70">
              Hi, Selin 👋
            </p>
            <p className="mt-1 text-small font-semibold">
              3 new campaigns recommended for you
            </p>
          </div>

          <div className="space-y-3 -mt-4 px-3 pb-6">
            {[
              { brand: "Lokal Coffee", category: "Food & Beverage", price: "₺2,500" },
              { brand: "Mavi Jeans", category: "Fashion", price: "₺4,500" },
              { brand: "Nivea TR", category: "Beauty", price: "₺3,200" },
            ].map((c) => (
              <div key={c.brand} className="rounded-2xl border border-border bg-card p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-caption text-muted-foreground">{c.category}</div>
                    <div className="text-small font-semibold">{c.brand}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-small font-bold text-primary">{c.price}</div>
                    <div className="text-[10px] text-success">92% match</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute -left-6 top-32 hidden rotate-[-6deg] rounded-2xl bg-card p-3 shadow-xl sm:block">
        <div className="flex items-center gap-2 text-caption">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15 text-success">
            ✓
          </div>
          <div>
            <div className="font-semibold">Application approved!</div>
            <div className="text-muted-foreground">Summer Collection</div>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 bottom-20 hidden rotate-[4deg] rounded-2xl bg-accent p-3 shadow-xl sm:block">
        <div className="flex items-center gap-2 text-caption">
          <Zap className="h-4 w-4 text-accent-foreground" />
          <div className="font-semibold text-accent-foreground">
            ⚡ Flash campaign
            <div className="text-[10px] text-accent-foreground/70">Goes live at 20:00</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Social proof ──────────────────────────────────────────── */

function SocialProof() {
  return (
    <section className="border-y border-border bg-muted/40 py-12">
      <div className="container-folkie">
        <p className="text-center text-caption uppercase tracking-widest text-muted-foreground">
          Trusted by leading brands in Turkey
        </p>

        <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {["Mavi", "Lokal Coffee", "Nivea", "Kitapyurdu", "Hepsiburada", "Trendyol"].map((brand) => (
            <div key={brand} className="flex items-center justify-center text-h3 font-bold text-muted-foreground/60">
              {brand}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 text-center sm:grid-cols-3">
          <Stat value="12.4K+" label="Registered creators" />
          <Stat value="2.4M" label="Avg. monthly reach" />
          <Stat value="87%" label="Campaign completion" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-[44px] font-bold leading-none tracking-tight text-primary">
        {value}
      </div>
      <div className="mt-1 text-small text-muted-foreground">{label}</div>
    </div>
  );
}

/* ─── Why Folkie ────────────────────────────────────────────── */

function WhyFolkie() {
  const items = [
    {
      icon: Sparkles,
      bg: "bg-accent",
      fg: "text-accent-foreground",
      title: "Nano creator first",
      desc: "Real creators with 1K–10K followers. High engagement, low cost, zero fake followers.",
      stat: "7.4% avg. engagement",
    },
    {
      icon: TrendingUp,
      bg: "bg-primary",
      fg: "text-primary-foreground",
      title: "AI-powered matching",
      desc: "The algorithm finds the best-fit creators for your brand's category, audience, and budget. You just approve.",
      stat: "92% match accuracy",
    },
    {
      icon: Shield,
      bg: "bg-navy",
      fg: "text-navy-foreground",
      title: "Secure payment flow",
      desc: "You pay Folkie upfront. When the campaign completes, we transfer directly to each creator's account.",
      stat: "100% transfer guarantee",
    },
  ];

  return (
    <section id="ozellikler" className="py-24">
      <div className="container-folkie">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-primary-light px-4 py-1.5 text-caption font-semibold text-primary">
            Folkie for brands
          </span>
          <h2 className="mt-5">
            Influencer marketing that <span className="text-primary">actually</span> works
          </h2>
          <p className="mt-4 text-body text-muted-foreground">
            Not million-dollar deals with mega celebrities — a systematic approach
            connecting real people with real communities.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="card-folkie group relative overflow-hidden transition-all hover:shadow-xl"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}>
                <item.icon className={`h-7 w-7 ${item.fg}`} />
              </div>
              <h3 className="mt-5">{item.title}</h3>
              <p className="mt-3 text-small text-muted-foreground">{item.desc}</p>
              <div className="mt-5 inline-block rounded-full bg-muted px-3 py-1 text-caption font-semibold text-foreground">
                {item.stat}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How it works ──────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    { num: "01", title: "Write your brief", desc: "Product, audience, budget — create your campaign in 5 steps." },
    { num: "02", title: "AI matches creators", desc: "Profile, category, and engagement rate — the algorithm finds the best fit." },
    { num: "03", title: "Approve applications", desc: "Choose from applicants. If you need more, Folkie invites matched creators." },
    { num: "04", title: "Content goes live", desc: "Approved content is published on TikTok. Track everything from one dashboard." },
  ];

  return (
    <section id="nasil-calisir" className="bg-muted/40 py-24">
      <div className="container-folkie">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-caption font-semibold text-accent-foreground">
            Ready in 5 minutes
          </span>
          <h2 className="mt-5">Running a campaign has never been this simple</h2>
          <p className="mt-4 text-body text-muted-foreground">
            No agency, no back-and-forth emails, no price negotiation. Direct
            access to creators.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-full hidden h-px w-full bg-border lg:block" />
              )}
              <div className="card-folkie h-full">
                <div className="text-h2 font-bold text-primary/30">{step.num}</div>
                <h3 className="mt-3 text-h3">{step.title}</h3>
                <p className="mt-2 text-small text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Campaign showcase ─────────────────────────────────────── */

const SHOWCASE = [
  { brand: "Lokal Coffee", category: "Food & Beverage", reach: "1.2M", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=800&fit=crop" },
  { brand: "Mavi Jeans", category: "Fashion", reach: "2.4M", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop" },
  { brand: "Nivea TR", category: "Beauty", reach: "850K", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=800&fit=crop" },
  { brand: "Kitapyurdu", category: "Education", reach: "420K", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=800&fit=crop" },
  { brand: "Hızlı Kargo", category: "Tech", reach: "680K", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=800&fit=crop" },
  { brand: "Summer Collection", category: "Lifestyle", reach: "1.8M", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop" },
];

function CampaignShowcase() {
  return (
    <section className="py-24">
      <div className="container-folkie">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2>
              Real <span className="text-primary">campaigns</span> on Folkie
            </h2>
            <p className="mt-2 text-body text-muted-foreground">
              Examples of the impact brands have created with nano creators.
            </p>
          </div>
          <Link
            href="/register?role=brand"
            className="flex items-center gap-1.5 text-small font-semibold text-primary hover:underline"
          >
            Start a campaign
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHOWCASE.map((item) => (
            <article
              key={item.brand}
              className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.img}
                alt={item.brand}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-navy-foreground">
                <div className="text-caption text-navy-foreground/70">
                  {item.category}
                </div>
                <h3 className="mt-1 text-navy-foreground">{item.brand}</h3>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-accent px-3 py-1 text-caption font-semibold text-accent-foreground">
                    {item.reach} reach
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ──────────────────────────────────────────── */

function Testimonials() {
  return (
    <section className="bg-navy py-24 text-navy-foreground">
      <div className="container-folkie">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-navy-foreground">
            What brands say <span className="text-accent">about Folkie</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Testimonial
            quote="We used to work with agencies — expensive and inauthentic. Our campaign with 30 nano creators through Folkie generated 4x more engagement than a traditional ad campaign."
            author="Ayşe Yılmaz"
            role="Marketing Director, Lokal Coffee"
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face"
          />
          <Testimonial
            quote="The AI matching system actually works. We wrote 3 lines about our target audience and got 50 creators with 95%+ fit scores. The payment flow is secure — a first for Turkey."
            author="Mehmet Demir"
            role="Brand Manager, Mavi"
            avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
          />
        </div>
      </div>
    </section>
  );
}

function Testimonial({
  quote,
  author,
  role,
  avatar,
}: {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}) {
  return (
    <article className="rounded-3xl border border-navy-foreground/10 bg-navy-foreground/5 p-7">
      <Quote className="h-8 w-8 text-accent" />
      <p className="mt-4 text-body text-navy-foreground/90 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} alt={author} className="h-12 w-12 rounded-full object-cover" />
        <div>
          <div className="font-semibold text-navy-foreground">{author}</div>
          <div className="text-caption text-navy-foreground/60">{role}</div>
        </div>
      </div>
    </article>
  );
}

/* ─── For Creators ──────────────────────────────────────────── */

function ForCreators() {
  return (
    <section id="creator-olmak" className="bg-primary py-24 text-primary-foreground">
      <div className="container-folkie">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-caption font-semibold text-accent-foreground">
              <Music2 className="h-3 w-3" />
              For creators
            </span>
            <h2 className="mt-5 text-primary-foreground">
              Your small audience <br />
              <span className="text-accent">is real power.</span>
            </h2>
            <p className="mt-4 max-w-xl text-body text-primary-foreground/80">
              Have even 1,000 followers? Welcome. Folkie has campaigns from
              brands looking for exactly your kind of authentic creator. The AI
              puts you in front of the right campaigns. You talk about products
              you like. You get paid.
            </p>

            <ul className="mt-6 space-y-3 text-body">
              {[
                "✓ Connect your TikTok → your follower count syncs automatically",
                "✓ Pick your categories → matching campaigns are recommended to you",
                "✓ Apply & create content → brand reviews and approves",
                "✓ Publish → payment within 5 business days",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2 text-primary-foreground/90">
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register?role=influencer"
                className="flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-body font-semibold text-accent-foreground hover:bg-accent/90"
              >
                <Music2 className="h-4 w-4" />
                Join as a creator
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-3 text-caption text-primary-foreground/70">
              <Shield className="h-4 w-4 text-accent" />
              <span>
                Fake follower detection: every TikTok account is checked for bots at signup.
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {CREATOR_AVATARS.slice(0, 4).map((src, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-3xl ${i % 2 === 0 ? "aspect-[3/4]" : "aspect-square mt-8"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-card p-4 text-foreground shadow-2xl">
              <div className="text-caption text-muted-foreground">This month&apos;s earnings</div>
              <div className="text-h2 font-bold text-primary">₺12,450</div>
              <div className="text-caption text-success">↑ +32%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Commission Model ──────────────────────────────────────── */

function Pricing() {
  return (
    <section id="fiyat" className="py-24">
      <div className="container-folkie">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-caption font-semibold text-accent-foreground">
            Transparent pricing
          </span>
          <h2 className="mt-5">
            No subscription. <span className="text-primary">Just commission.</span>
          </h2>
          <p className="mt-4 text-body text-muted-foreground">
            Joining Folkie is free. Running a campaign is free. We only take a{" "}
            <span className="font-bold text-primary">15% commission</span> on{" "}
            <span className="font-bold text-foreground">completed</span> campaigns.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <ModelCard
              num="₺0"
              label="Sign up"
              detail="Free for brands and creators"
            />
            <ModelCard
              num="₺0"
              label="Campaigns"
              detail="No monthly subscription"
              featured
            />
            <ModelCard
              num="15%"
              label="Commission"
              detail="Only on completed campaigns"
            />
          </div>

          <div className="mt-10 rounded-3xl border border-border bg-card p-6">
            <h3>Example calculation</h3>
            <div className="mt-4 space-y-2 text-small">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Campaign: 10 creators × ₺2,500</span>
                <span className="font-semibold">₺25,000</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Folkie commission (15%)</span>
                <span className="font-semibold text-primary">₺3,750</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-bold">Total you pay</span>
                <span className="text-h3 font-bold text-primary">₺28,750</span>
              </div>
            </div>
            <p className="mt-4 text-caption text-muted-foreground">
              💡 You pay Folkie at campaign start. We manually transfer to each
              creator&apos;s account once the campaign completes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ModelCard({
  num,
  label,
  detail,
  featured,
}: {
  num: string;
  label: string;
  detail: string;
  featured?: boolean;
}) {
  return (
    <div
      className={
        featured
          ? "rounded-3xl bg-primary p-6 text-center text-primary-foreground shadow-lg shadow-primary/20"
          : "rounded-3xl border border-border bg-card p-6 text-center"
      }
    >
      <div className="text-h1 font-bold leading-none">{num}</div>
      <div
        className={
          featured
            ? "mt-2 text-small font-semibold"
            : "mt-2 text-small font-semibold text-primary"
        }
      >
        {label}
      </div>
      <p
        className={
          featured
            ? "mt-2 text-caption text-primary-foreground/80"
            : "mt-2 text-caption text-muted-foreground"
        }
      >
        {detail}
      </p>
    </div>
  );
}

/* ─── FAQ ───────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "What is a nano creator and why do you recommend them?",
    a: "A nano creator is a real influencer with 1,000–10,000 followers. They deliver 4–7x higher engagement rates than mega influencers, have closer relationships with their audience, and cost dramatically less. This is the core value of the Folkie ecosystem.",
  },
  {
    q: "How does payment work?",
    a: "We use a secure manual payment flow. You transfer the campaign budget to Folkie's account; once confirmed, your campaign goes live. When the campaign completes, our admin team manually transfers payment to each creator's bank account. All transfers are tracked and transparent.",
  },
  {
    q: "How does AI matching work?",
    a: "We compare your campaign brief (category, product, budget, target cities, follower range) with creator profiles (categories, follower count, engagement rate, city, content language). Each match gets a score from 0–100. We surface creators scoring 85+ as recommendations.",
  },
  {
    q: "What is a flash campaign?",
    a: "All approved creators publish at the exact same time (e.g., 20:00). This multiplies the viral effect — when TikTok's algorithm sees multiple videos with the same hashtag in a short window, the likelihood of trending increases significantly.",
  },
  {
    q: "How do we measure results?",
    a: "The Folkie dashboard shows reach, engagement, engagement rate, and a top creator list for every campaign. Live metrics per video are pulled via TikTok Business API integration (coming in Phase 2).",
  },
];

function FAQ() {
  return (
    <section id="sss" className="bg-muted/40 py-24">
      <div className="container-folkie">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2>
              Frequently asked <span className="text-primary">questions</span>
            </h2>
            <p className="mt-3 text-body text-muted-foreground">
              Can&apos;t find what you need? Email us at{" "}
              <a href="mailto:destek@folkie.com.tr" className="font-semibold text-primary hover:underline">
                destek@folkie.com.tr
              </a>
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="card-folkie group cursor-pointer"
              >
                <summary className="flex items-center justify-between gap-4 list-none">
                  <span className="text-body font-semibold">{faq.q}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary group-open:bg-primary group-open:text-primary-foreground">
                    <Plus className="h-4 w-4 group-open:hidden" />
                    <Minus className="hidden h-4 w-4 group-open:block" />
                  </span>
                </summary>
                <p className="mt-3 text-small text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section className="py-24">
      <div className="container-folkie">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground sm:p-16">
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-foreground/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <Sparkles className="mx-auto h-10 w-10 text-accent" />
            <h2 className="mt-4 text-primary-foreground">
              Start your first campaign <span className="text-accent">free today</span>
            </h2>
            <p className="mt-4 text-body text-primary-foreground/80">
              No credit card required. Write your brief, get AI matches in
              minutes, approve applicants. See results for yourself.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register?role=brand"
                className="flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-body font-semibold text-accent-foreground shadow-lg hover:bg-accent/90"
              >
                Try it free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:satis@folkie.com.tr"
                className="rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-7 py-3.5 text-body font-semibold hover:bg-primary-foreground/15"
              >
                Request a demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-folkie py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="text-h3 font-bold text-primary">
              folkie<span className="text-accent">.</span>
            </Link>
            <p className="mt-3 text-small text-muted-foreground max-w-xs">
              Turkey-based B2B marketplace connecting brands with nano TikTok creators.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "Features", href: "#ozellikler" },
              { label: "Pricing", href: "#fiyat" },
              { label: "FAQ", href: "#sss" },
              { label: "What's New", href: "/blog" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "About", href: "/about" },
              { label: "Careers", href: "/careers" },
              { label: "Blog", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { label: "Terms of Service", href: "/terms" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "KVKK", href: "/kvkk" },
              { label: "Cookie Policy", href: "/cookie-policy" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-caption text-muted-foreground">
            © {new Date().getFullYear()} Folkie. All rights reserved.
          </p>
          <p className="text-caption text-muted-foreground">
            🇹🇷 Designed and built in Turkey
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h4 className="text-small font-semibold">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-small text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
