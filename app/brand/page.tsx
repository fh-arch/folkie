import Link from "next/link";
import { Plus, Compass, Rocket } from "lucide-react";
import { BrandHeroCard } from "@/components/brand/HeroCard";
import { BrandStatsRow } from "@/components/brand/StatsRow";
import { MatchCallout } from "@/components/brand/MatchCallout";
import { EmptyState } from "@/components/shared/EmptyState";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface BrandCampaignSummary {
  id: string;
  title: string;
  status: string;
  applicationCount: number;
}

export default async function BrandDashboardPage() {
  // Fetch campaigns to detect "first run" state
  let campaigns: BrandCampaignSummary[] = [];
  try {
    campaigns = await apiFetch<BrandCampaignSummary[]>(ENDPOINTS.brand.campaigns());
  } catch {
    /* gracefully degrade */
  }

  const hasCampaigns = campaigns.length > 0;

  // First-run onboarding view
  if (!hasCampaigns) {
    return (
      <div className="space-y-5">
        <section className="card-folkie overflow-hidden bg-gradient-to-br from-primary-light via-card to-accent/10 p-8 lg:p-12">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-caption font-semibold text-accent-foreground">
              🎉 Welcome to Folkie
            </span>
            <h1 className="mt-4">
              Launch your first campaign and{" "}
              <span className="text-primary">drive real impact</span>
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              Write a brief in 5 minutes and let AI match you with the right creators.
              Nano creators (1K–10K followers) deliver high engagement and authentic trust.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/brand/campaigns/new"
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-small font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Create First Campaign
              </Link>
              <Link
                href="/brand/discover"
                className="flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-small font-semibold text-primary hover:bg-primary-light"
              >
                <Compass className="h-4 w-4" />
                Browse Creator Pool
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-5 md:grid-cols-3">
          <StepCard
            num={1}
            title="Write a brief"
            desc="Product, audience, budget — create your campaign in 5 steps."
          />
          <StepCard
            num={2}
            title="AI matches creators"
            desc="Review matched nano creators and accept applications or invite directly."
          />
          <StepCard
            num={3}
            title="Approve content"
            desc="Creator submits → you approve → they publish → admin handles payment."
          />
        </div>

        <section className="rounded-2xl bg-navy p-6 text-navy-foreground">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Rocket className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-navy-foreground">Tip</h3>
              <p className="mt-1 text-small text-navy-foreground/70">
                First complete your <Link href="/brand/settings" className="text-accent underline">brand profile</Link>.
                {" "}Your industry and contact info helps creators learn who you are.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <BrandHeroCard />
      <BrandStatsRow />
      <section className="card-folkie p-5">
        <div className="flex items-center justify-between">
          <h3>My Campaigns</h3>
          <Link href="/brand/campaigns" className="text-small text-primary hover:underline">
            See all →
          </Link>
        </div>
        {campaigns.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="No campaigns yet"
            primaryAction={{ href: "/brand/campaigns/new", label: "Create one" }}
            size="sm"
          />
        ) : (
          <ul className="mt-4 space-y-3">
            {campaigns.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/brand/campaigns/${c.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-3 hover:border-primary"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{c.title}</div>
                    <div className="text-caption text-muted-foreground capitalize">
                      {c.status.replace("_", " ")}
                    </div>
                  </div>
                  <span className="text-caption text-muted-foreground">
                    {c.applicationCount} applications
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <MatchCallout />
    </div>
  );
}

function StepCard({
  num,
  title,
  desc,
}: {
  num: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="card-folkie">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-h3 font-bold text-primary">
        {num}
      </div>
      <h3 className="mt-3">{title}</h3>
      <p className="mt-1 text-small text-muted-foreground">{desc}</p>
    </div>
  );
}
