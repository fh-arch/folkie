import Link from "next/link";
import type { Metadata } from "next";
import { Briefcase, Rocket, MapPin, Heart, Code, Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers — Folkie",
  description:
    "Join Folkie: help us build Turkey's leading nano TikTok creator marketplace. Open positions, culture, and how to apply.",
  alternates: { canonical: "https://folkie.com.tr/careers" },
  openGraph: {
    title: "Careers — Folkie",
    description: "Join Folkie: build the nano creator economy with us.",
    url: "https://folkie.com.tr/careers",
    siteName: "Folkie",
    locale: "en_US",
    type: "website",
  },
};

interface JobPosting {
  title: string;
  team: string;
  location: string;
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const POSTINGS: JobPosting[] = [
  {
    title: "Full-Stack Engineer",
    team: "Engineering",
    location: "Remote · Istanbul",
    type: "Full-time",
    icon: Code,
    description:
      "Build new features on our Next.js + .NET stack. We're looking for someone with React, TypeScript, and C# experience who loves shipping fast and thinking about product.",
  },
  {
    title: "Growth Marketing Lead",
    team: "Marketing",
    location: "Istanbul",
    type: "Full-time",
    icon: Megaphone,
    description:
      "Own brand acquisition growth. You'll manage performance marketing and content marketing, turning Folkie into the go-to name for nano creator campaigns in Turkey.",
  },
];

export default function CareerPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container-folkie py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-small text-muted-foreground hover:text-primary">
            ← Home
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-h1">Careers</h1>
          </div>

          <p className="mt-6 text-body text-foreground/80">
            We&apos;re changing how brands and creators work together in Turkey. If you
            want to build something that matters — and have real ownership over the
            product — we&apos;d love to meet you.
          </p>

          <section className="mt-12 grid gap-4 sm:grid-cols-3">
            <Perk
              icon={Rocket}
              title="Early-stage energy"
              body="You'll shape the product, not just implement specs."
            />
            <Perk
              icon={Heart}
              title="Sustainable pace"
              body="We're against burnout. Healthy work culture is non-negotiable."
            />
            <Perk
              icon={MapPin}
              title="Flexible location"
              body="Most roles are remote-friendly with an Istanbul office option."
            />
          </section>

          <section className="mt-16">
            <h2 className="text-h2">Open Positions</h2>
            <ul className="mt-6 space-y-4">
              {POSTINGS.map((job) => (
                <li
                  key={job.title}
                  className="card-folkie flex flex-wrap items-start gap-4 p-5 sm:flex-nowrap"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/30">
                    <job.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-body font-semibold">{job.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
                      <span>{job.team}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{job.type}</span>
                    </div>
                    <p className="mt-2 text-small text-foreground/70">
                      {job.description}
                    </p>
                  </div>
                  <a
                    href={`mailto:kariyer@folkie.com.tr?subject=${encodeURIComponent(
                      `Application: ${job.title}`,
                    )}`}
                    className="shrink-0 rounded-full bg-primary px-5 py-2 text-small font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Apply
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 rounded-3xl bg-primary-light p-8 text-center">
            <h3 className="text-h3 text-primary">Don&apos;t see the right role?</h3>
            <p className="mt-2 text-small text-foreground/70">
              Send us your CV and we&apos;ll reach out when the right opportunity opens up.
            </p>
            <a
              href="mailto:kariyer@folkie.com.tr?subject=General%20Application"
              className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-small font-semibold text-primary-foreground hover:bg-primary/90"
            >
              kariyer@folkie.com.tr
            </a>
          </section>
        </div>
      </section>
    </main>
  );
}

function Perk({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="card-folkie p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/30">
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <h3 className="mt-3 text-small font-semibold">{title}</h3>
      <p className="mt-1 text-caption text-muted-foreground">{body}</p>
    </div>
  );
}
