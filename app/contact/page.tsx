import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MessageCircle, Briefcase, ShieldCheck, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Folkie",
  description:
    "Contact Folkie: support, brand partnerships, press, careers, and legal inquiries. Find the right channel for your question.",
  alternates: { canonical: "https://folkie.com.tr/contact" },
  openGraph: {
    title: "Contact — Folkie",
    description:
      "Contact Folkie: support, partnerships, press, careers, and legal questions.",
    url: "https://folkie.com.tr/contact",
    siteName: "Folkie",
    locale: "en_US",
    type: "website",
  },
};

interface Channel {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  email: string;
  description: string;
}

const CHANNELS: Channel[] = [
  {
    icon: MessageCircle,
    title: "Support",
    email: "destek@folkie.com.tr",
    description:
      "Account, campaign, payment, or technical questions. We respond within 24 hours — usually faster.",
  },
  {
    icon: Briefcase,
    title: "Partnerships & Brand Deals",
    email: "hello@folkie.com.tr",
    description:
      "Brand partnerships, enterprise agreements, and product integrations.",
  },
  {
    icon: MessageCircle,
    title: "Press & Media",
    email: "press@folkie.com.tr",
    description:
      "Press requests, interviews, and news coverage.",
  },
  {
    icon: Briefcase,
    title: "Careers",
    email: "kariyer@folkie.com.tr",
    description: "Open position applications and general career inquiries.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy & Legal",
    email: "kvkk@folkie.com.tr",
    description:
      "Personal data requests, data subject rights (GDPR / KVKK Article 11), and legal notices.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container-folkie py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-small text-muted-foreground hover:text-primary">
            ← Home
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-h1">Contact</h1>
          </div>

          <p className="mt-6 text-body text-foreground/80">
            Pick the right channel for the fastest response. We generally reply within
            one business day; technical support averages 4 hours.
          </p>

          <section className="mt-12 space-y-4">
            {CHANNELS.map((c) => (
              <article key={c.email} className="card-folkie p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-body font-semibold">{c.title}</h3>
                    <p className="mt-1 text-small text-foreground/70">
                      {c.description}
                    </p>
                    <a
                      href={`mailto:${c.email}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {c.email}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-12 card-folkie p-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-body font-semibold">Location</h3>
                <p className="mt-1 text-small text-foreground/70">
                  Folkie is a Turkey-based B2B platform. Operations are run from
                  Istanbul. All operational communication happens via email.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-12 rounded-3xl bg-primary-light p-8">
            <h3 className="text-h3 text-primary">Common questions</h3>
            <p className="mt-2 text-small text-foreground/70">
              Most answers are in our FAQ — check there before opening a support
              request.
            </p>
            <Link
              href="/#faq"
              className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-small font-semibold text-primary-foreground hover:bg-primary/90"
            >
              View FAQ
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
