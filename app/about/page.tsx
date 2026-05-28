import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles, Heart, Target, Shield, Users, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Folkie",
  description:
    "Folkie is a Turkey-based B2B influencer marketing platform connecting brands with nano TikTok creators. Real impact, fair pay, transparent process.",
  alternates: { canonical: "https://folkie.com.tr/about" },
  openGraph: {
    title: "About — Folkie",
    description:
      "Connecting brands with nano TikTok creators in Turkey. Real impact, fair pay.",
    url: "https://folkie.com.tr/about",
    siteName: "Folkie",
    locale: "en_US",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container-folkie py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-small text-muted-foreground hover:text-primary">
            ← Home
          </Link>

          <h1 className="mt-6 text-h1">
            <span className="text-primary">Folkie</span> —
            <br />
            Real creators, real impact.
          </h1>

          <p className="mt-6 text-body text-foreground/80">
            Folkie is a Turkey-based B2B influencer marketing marketplace connecting
            brands with{" "}
            <strong>nano TikTok creators (1,000–10,000 followers)</strong>. We operate
            on a simple principle: micro influence, micro cost, macro results. Small
            but genuine communities have more persuasive power than large, passive
            audiences.
          </p>

          <section className="mt-12 grid gap-6 sm:grid-cols-2">
            <ValueCard
              icon={Target}
              title="Our Mission"
              body="Give every brand access to authentic TikTok community influence — without a large agency budget."
            />
            <ValueCard
              icon={Heart}
              title="Our Vision"
              body="Build Turkey's sustainable nano-creator economy: fair pay, transparent process, real metrics."
            />
            <ValueCard
              icon={Shield}
              title="Our Values"
              body="Transparency (no hidden costs beyond commission), security (encrypted IBAN, GDPR-aligned), authenticity (fake follower detection)."
            />
            <ValueCard
              icon={Sparkles}
              title="Our Edge"
              body="AI matching algorithm pairs each brand with the right nano creators. Manual payment + admin moderation keeps the process safe."
            />
          </section>

          <section className="mt-16">
            <h2 className="text-h2">How It Works</h2>
            <ol className="mt-6 space-y-4">
              <Step
                num={1}
                title="Brand creates a campaign"
                body="Product, target audience, brief, budget — ready in 5 minutes."
              />
              <Step
                num={2}
                title="Nano creators apply"
                body="Creators matched by category, city, and engagement rate apply to your campaign."
              />
              <Step
                num={3}
                title="You choose, content is produced"
                body="Approve the creators you like. They submit content for your review before publishing."
              />
              <Step
                num={4}
                title="Publish + payment"
                body="Creator publishes on TikTok. Folkie transfers payment to their account."
              />
            </ol>
          </section>

          <section className="mt-16 grid gap-6 sm:grid-cols-3">
            <Stat icon={Users} label="Creator tier" value="Nano (1K–10K)" />
            <Stat icon={TrendingUp} label="Platform fee" value="15%" />
            <Stat icon={Heart} label="Based in" value="🇹🇷 Turkey" />
          </section>

          <section className="mt-16 rounded-3xl bg-primary-light p-8 text-center">
            <h3 className="text-h3 text-primary">Have questions?</h3>
            <p className="mt-2 text-small text-foreground/70">
              Our team is here to help.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-small font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Contact Us
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}

function ValueCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="card-folkie p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="mt-4 text-body font-semibold">{title}</h3>
      <p className="mt-2 text-small text-foreground/70">{body}</p>
    </div>
  );
}

function Step({
  num,
  title,
  body,
}: {
  num: number;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-small font-bold text-primary-foreground">
        {num}
      </span>
      <div>
        <h4 className="text-body font-semibold">{title}</h4>
        <p className="mt-1 text-small text-foreground/70">{body}</p>
      </div>
    </li>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="card-folkie p-5 text-center">
      <Icon className="mx-auto h-6 w-6 text-primary" />
      <div className="mt-2 text-caption text-muted-foreground">{label}</div>
      <div className="mt-1 text-h3 font-bold">{value}</div>
    </div>
  );
}
