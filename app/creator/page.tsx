import Link from "next/link";
import { Compass, Send, AlertTriangle, Sparkles } from "lucide-react";
import { CreatorHeroCard } from "@/components/creator/HeroCard";
import { CreatorStatsRow } from "@/components/creator/StatsRow";
import { GrowthSnapshot } from "@/components/creator/GrowthSnapshot";
import { EmptyState } from "@/components/shared/EmptyState";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { currentUser } from "@clerk/nextjs/server";

interface ProfileBrief {
  id: string;
  tiktokHandle: string | null;
  followerCount: number;
  categories: string[];
  hasIban: boolean;
}

interface ApplicationRow {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  amount: number;
  status: string;
}

interface DiscoverResult {
  total: number;
  items: Array<{
    id: string;
    title: string;
    brandName: string;
    budgetPerInfluencer: number;
  }>;
}

export default async function CreatorDashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "Creator";

  // Fetch in parallel: profile + applications + available campaigns
  const [profile, applications, discover] = await Promise.all([
    apiFetch<ProfileBrief>(ENDPOINTS.creator.profile()).catch(() => null),
    apiFetch<ApplicationRow[]>(ENDPOINTS.creator.applications()).catch(() => []),
    apiFetch<DiscoverResult>(`${ENDPOINTS.creator.campaigns()}?page=1&pageSize=4`).catch(
      () => ({ total: 0, items: [] }) as DiscoverResult,
    ),
  ]);

  const profileIncomplete =
    !profile || profile.categories.length === 0 || !profile.tiktokHandle;
  const hasActivity = applications.length > 0;
  const newCampaigns = discover.total;

  // First-run / empty state: no applications + incomplete profile
  if (!hasActivity && profileIncomplete) {
    return (
      <div className="space-y-5">
        <section className="card-folkie overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 p-8 text-primary-foreground lg:p-12">
          <p className="text-small text-primary-foreground/80">
            Hey, {firstName} 👋
          </p>
          <h1 className="mt-2 text-h1 leading-tight">
            Welcome! Complete your profile and{" "}
            <span className="text-accent">apply to your first campaign</span>
          </h1>
          <p className="mt-3 max-w-xl text-body text-primary-foreground/80">
            Add your categories and connect your TikTok so brands can find you.
            Then campaigns matched to your profile will appear here.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/creator/profile"
              className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-small font-semibold text-accent-foreground hover:bg-accent/90"
            >
              <Sparkles className="h-4 w-4" />
              Complete My Profile
            </Link>
            <Link
              href="/creator/campaigns"
              className="flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3 text-small font-medium hover:bg-primary-foreground/15"
            >
              <Compass className="h-4 w-4" />
              Browse Campaigns ({newCampaigns})
            </Link>
          </div>
        </section>

        <div className="grid gap-5 md:grid-cols-3">
          <ChecklistCard
            icon={AlertTriangle}
            done={!profileIncomplete}
            title="Complete your profile"
            desc="Categories, city, language, bio"
            href="/creator/profile"
          />
          <ChecklistCard
            icon={AlertTriangle}
            done={Boolean(profile?.tiktokHandle)}
            title="Connect TikTok"
            desc="Follower count and engagement rate sync automatically"
            href="/creator/profile"
          />
          <ChecklistCard
            icon={AlertTriangle}
            done={Boolean(profile?.hasIban)}
            title="Add IBAN"
            desc="Required to receive payments"
            href="/creator/profile"
          />
        </div>

        {discover.items.length > 0 && (
          <section className="card-folkie p-5">
            <div className="flex items-center justify-between">
              <h3>Active Campaigns</h3>
              <Link
                href="/creator/campaigns"
                className="text-small text-primary hover:underline"
              >
                See all →
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {discover.items.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/creator/campaigns/${c.id}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-background p-3 hover:border-primary"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{c.title}</div>
                      <div className="text-caption text-muted-foreground">
                        {c.brandName}
                      </div>
                    </div>
                    <span className="text-small font-bold text-primary">
                      ₺{c.budgetPerInfluencer.toLocaleString("tr-TR")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  // Normal dashboard
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <CreatorHeroCard creatorName={firstName} newCampaigns={newCampaigns} />
        <CreatorStatsRow />

        <section className="card-folkie p-5">
          <div className="flex items-center justify-between">
            <h3>My Active Collaborations</h3>
            <Link
              href="/creator/collaborations"
              className="text-small text-primary hover:underline"
            >
              See all →
            </Link>
          </div>
          {applications.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No applications yet"
              primaryAction={{
                href: "/creator/campaigns",
                label: "Browse Campaigns",
              }}
              size="sm"
            />
          ) : (
            <ul className="mt-4 space-y-2">
              {applications.slice(0, 5).map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/creator/campaigns/${a.campaignId}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-background p-3 hover:border-primary"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold">
                        {a.campaignTitle}
                      </div>
                      <div className="text-caption text-muted-foreground capitalize">
                        {a.brandName} • {a.status}
                      </div>
                    </div>
                    <span className="text-small font-bold text-primary">
                      ₺{a.amount.toLocaleString("tr-TR")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="space-y-5">
        <GrowthSnapshot />
      </div>
    </div>
  );
}

function ChecklistCard({
  icon: Icon,
  done,
  title,
  desc,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  done: boolean;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`card-folkie group flex items-start gap-3 transition-colors ${
        done ? "border-success/40 bg-success/5" : "hover:border-primary"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          done ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
        }`}
      >
        {done ? "✓" : <Icon className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <h3 className="text-body">{title}</h3>
        <p className="mt-1 text-caption text-muted-foreground">{desc}</p>
        <span
          className={`mt-2 inline-block text-caption font-semibold ${
            done ? "text-success" : "text-primary"
          }`}
        >
          {done ? "✓ Done" : "Complete →"}
        </span>
      </div>
    </Link>
  );
}
