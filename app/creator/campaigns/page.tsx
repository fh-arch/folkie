import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  Bookmark,
  Sparkles,
  Send,
  Calendar,
  Users,
  Compass,
  Lock,
  Music,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatTRY } from "@/lib/utils";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { CampaignFilters } from "./CampaignFilters";

interface ProfileBrief {
  id: string;
  tiktokHandle: string | null;
  followerCount: number;
  categories: string[];
  hasIban: boolean;
}

interface DiscoverCard {
  id: string;
  brandId: string;
  brandName: string;
  brandLogoUrl: string | null;
  title: string;
  productCategory: string;
  budgetPerInfluencer: number;
  influencerCount: number;
  approvedCount: number;
  applicationDeadline: string;
  isFlashCampaign: boolean;
  isNanoOnly: boolean;
  matchScore: number;
}

interface DiscoverResult {
  items: DiscoverCard[];
  total: number;
  page: number;
  pageSize: number;
}

interface PageProps {
  searchParams: Promise<{ category?: string; city?: string; nanoOnly?: string; page?: string }>;
}

export default async function CreatorCampaignsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const category = sp.category ?? "";
  const city = sp.city ?? "";
  const nanoOnly = sp.nanoOnly === "true";
  const page = parseInt(sp.page ?? "1", 10);
  // Profile gate: creators must have TikTok connected + categories filled
  // before they can apply to campaigns.
  let profile: ProfileBrief | null = null;
  try {
    profile = await apiFetch<ProfileBrief>(ENDPOINTS.creator.profile());
  } catch (e) {
    // 404 = no profile yet — block + redirect to /creator/profile
    if (e instanceof ApiError && e.status === 404) {
      redirect("/creator/profile?gate=incomplete");
    }
  }

  const hasTiktok = !!profile?.tiktokHandle;
  const hasCategories = (profile?.categories?.length ?? 0) > 0;
  const profileComplete = hasTiktok && hasCategories;

  if (!profileComplete) {
    return (
      <div>
        <PageHeader
          title="Discover Campaigns"
          description="Complete your profile first, then start applying."
          breadcrumbs={[{ label: "Campaigns" }]}
        />
        <section className="card-folkie p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/15">
            <Lock className="h-8 w-8 text-warning" />
          </div>
          <h2 className="mt-4 text-h2">Complete your profile</h2>
          <p className="mx-auto mt-2 max-w-md text-small text-muted-foreground">
            To apply to campaigns you need to connect your TikTok account and
            select your content categories. Brands use this to evaluate you.
          </p>

          <div className="mx-auto mt-6 max-w-md space-y-3 text-left">
            <Checklist
              done={hasTiktok}
              label="Connect TikTok"
              detail={
                hasTiktok
                  ? `${profile?.tiktokHandle} connected`
                  : "Connect via your profile page"
              }
            />
            <Checklist
              done={hasCategories}
              label="Select content categories"
              detail={
                hasCategories
                  ? `${profile?.categories.length} categories selected`
                  : "Choose 1 to 5 categories"
              }
            />
          </div>

          <Link
            href="/creator/profile"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-body font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Music className="h-4 w-4" />
            Go to Profile
          </Link>
        </section>
      </div>
    );
  }

  let result: DiscoverResult = { items: [], total: 0, page: 1, pageSize: 20 };
  let fetchError: string | null = null;

  try {
    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("pageSize", "24");
    if (category) qs.set("category", category);
    if (city) qs.set("city", city);
    if (nanoOnly) qs.set("nanoOnly", "true");
    result = await apiFetch<DiscoverResult>(`${ENDPOINTS.creator.campaigns()}?${qs.toString()}`);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  if (result.items.length === 0) {
    return (
      <div>
        <PageHeader
          title="Discover Campaigns"
          description="All open campaigns matched to your profile."
          breadcrumbs={[{ label: "Campaigns" }]}
        />
        <section className="card-folkie">
          <EmptyState
            icon={Compass}
            title={fetchError ? "Could not load campaigns" : "No active campaigns yet"}
            description={
              fetchError
                ? `Backend error: ${fetchError}`
                : "No campaigns matching your profile right now. Keep your profile up to date — new campaigns will appear here."
            }
            primaryAction={{ href: "/creator/profile", label: "Complete My Profile" }}
            size="lg"
          />
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Discover Campaigns"
        description="All open campaigns matched to your profile. Apply, create content, earn."
        breadcrumbs={[{ label: "Campaigns" }]}
        actions={
          <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-caption font-semibold text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            {result.total} campaigns
          </span>
        }
      />

      {/* Filters */}
      <Suspense>
        <CampaignFilters />
      </Suspense>

      {/* AI explainer */}
      <section className="mb-5 rounded-2xl border border-primary/20 bg-primary-light p-4">
        <details className="group">
          <summary className="flex cursor-pointer items-center justify-between gap-3 list-none">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-small font-semibold text-primary">
                How is your match score calculated?
              </span>
            </div>
            <span className="text-caption text-primary transition-transform group-open:rotate-180">▼</span>
          </summary>
          <div className="mt-3 grid gap-2 text-caption text-foreground/80 sm:grid-cols-2 lg:grid-cols-3">
            <ScoreFactor label="Category match" max="30" />
            <ScoreFactor label="Location" max="15" />
            <ScoreFactor label="Follower range" max="25" />
            <ScoreFactor label="Engagement rate" max="15" />
            <ScoreFactor label="Content language" max="5" />
            <ScoreFactor label="Trust score" max="10" />
          </div>
          <p className="mt-3 text-caption text-foreground/60">
            Max 100. For a better score keep your profile up to date: bio, categories, city, TikTok. Phase 2 will add AI semantic matching.
          </p>
        </details>
      </section>

      <section className="card-folkie p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((c) => (
            <CampaignCardItem key={c.id} campaign={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ScoreFactor({ label, max }: { label: string; max: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-card px-3 py-2">
      <span>{label}</span>
      <span className="font-mono text-primary">/{max}</span>
    </div>
  );
}

function CampaignCardItem({ campaign }: { campaign: DiscoverCard }) {
  const fallbackLogo =
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120";
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-background transition-all hover:shadow-lg">
      <div className="relative h-24 bg-gradient-to-br from-primary-light to-muted px-4 py-3">
        <div className="flex items-start justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={campaign.brandLogoUrl ?? fallbackLogo}
            alt={campaign.brandName}
            className="h-12 w-12 rounded-full border-2 border-card bg-card object-cover"
          />
          <div className="flex items-center gap-2">
            {campaign.isNanoOnly && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-caption font-semibold text-accent-foreground">
                Nano
              </span>
            )}
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-card hover:bg-card/80"
              aria-label="Kaydet"
            >
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <span className="absolute bottom-2 right-3 flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-caption">
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="font-semibold text-primary">{campaign.matchScore}%</span>
          <span className="text-muted-foreground">match</span>
        </span>
      </div>

      <div className="p-4">
        <div className="text-caption text-muted-foreground">{campaign.brandName}</div>
        <Link
          href={`/creator/campaigns/${campaign.id}`}
          className="mt-0.5 line-clamp-2 block text-body font-semibold hover:text-primary"
        >
          {campaign.title}
        </Link>
        <div className="mt-1 text-caption text-muted-foreground">
          {campaign.productCategory}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div>
            <div className="flex items-center gap-1 text-caption text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Deadline
            </div>
            <div className="text-small font-semibold">
              {new Date(campaign.applicationDeadline).toLocaleDateString("en-GB")}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-caption text-muted-foreground">
              <Users className="h-3 w-3" />
              Slots
            </div>
            <div className="text-small font-semibold">
              {campaign.approvedCount}/{campaign.influencerCount}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-caption text-muted-foreground">Fee</div>
            <div className="text-body font-bold text-primary">
              {formatTRY(campaign.budgetPerInfluencer)}
            </div>
          </div>
          <Link
            href={`/creator/campaigns/${campaign.id}`}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-3.5 w-3.5" />
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

function Checklist({
  done,
  label,
  detail,
}: {
  done: boolean;
  label: string;
  detail: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        done
          ? "border-success/40 bg-success/5"
          : "border-warning/40 bg-warning/5"
      }`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption font-bold ${
          done
            ? "bg-success text-success-foreground"
            : "bg-warning text-warning-foreground"
        }`}
      >
        {done ? "✓" : "!"}
      </div>
      <div>
        <div className="text-small font-semibold">{label}</div>
        <div className="text-caption text-muted-foreground">{detail}</div>
      </div>
    </div>
  );
}
