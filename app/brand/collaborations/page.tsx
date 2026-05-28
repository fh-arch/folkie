import Link from "next/link";
import {
  Handshake,
  Plus,
  Eye,
  Users,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatTRY, formatNumber } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface CampaignSummary {
  id: string;
  title: string;
  productCategory: string;
  status: string;
  budget: number;
  applicationDeadline: string;
}

interface ApplicationRow {
  id: string;
  creatorProfileId: string;
  handle: string | null;
  followerCount: number;
  engagementRate: number;
  tier: string;
  city: string | null;
  categories: string[];
  status: "pending" | "approved" | "rejected" | "withdrawn";
  rejectionReason: string | null;
  appliedAt: string;
  reviewedAt: string | null;
}

interface Collaboration {
  application: ApplicationRow;
  campaignId: string;
  campaignTitle: string;
  budget: number;
}

export default async function BrandCollaborationsPage() {
  let campaigns: CampaignSummary[] = [];
  try {
    campaigns = await apiFetch<CampaignSummary[]>(ENDPOINTS.brand.campaigns());
  } catch {
    /* gracefully degrade */
  }

  // Fan-out: fetch applications for every campaign in parallel
  const collabsNested = await Promise.all(
    campaigns.map(async (c) => {
      try {
        const apps = await apiFetch<ApplicationRow[]>(
          ENDPOINTS.brand.campaignApplications(c.id),
        );
        return apps.map<Collaboration>((a) => ({
          application: a,
          campaignId: c.id,
          campaignTitle: c.title,
          budget: c.budget,
        }));
      } catch {
        return [] as Collaboration[];
      }
    }),
  );
  const all = collabsNested.flat();

  const active = all.filter((c) => c.application.status === "approved");
  const pending = all.filter((c) => c.application.status === "pending");

  if (campaigns.length === 0) {
    return (
      <div>
        <PageHeader
          title="Collaborations"
          description="Applications and active collaborations across all your campaigns."
          breadcrumbs={[{ label: "Collaborations" }]}
        />
        <section className="card-folkie">
          <EmptyState
            icon={Handshake}
            title="No collaborations yet"
            description="Create your first campaign and creators will start applying."
            primaryAction={{
              href: "/brand/campaigns/new",
              label: "Create Campaign",
              icon: Plus,
            }}
            size="lg"
          />
        </section>
      </div>
    );
  }

  if (all.length === 0) {
    return (
      <div>
        <PageHeader
          title="Collaborations"
          description="Applications and active collaborations across all your campaigns."
          breadcrumbs={[{ label: "Collaborations" }]}
        />
        <section className="card-folkie">
          <EmptyState
            icon={Handshake}
            title="No applications yet"
            description="Applications from creators will appear here — usually within 2–7 days of publishing a campaign."
            primaryAction={{
              href: "/brand/campaigns",
              label: "My Campaigns",
            }}
            size="lg"
          />
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Collaborations"
        description="Applications and active collaborations across all your campaigns."
        breadcrumbs={[{ label: "Collaborations" }]}
      />

      <section className="mb-5 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Users}
          label="Active Collaborations"
          value={`${active.length}`}
          sub="approved"
          accent
        />
        <SummaryCard
          icon={Calendar}
          label="Pending Applications"
          value={`${pending.length}`}
          sub="awaiting review"
        />
        <SummaryCard
          icon={Handshake}
          label="Total"
          value={`${all.length}`}
          sub={`across ${campaigns.length} campaign${campaigns.length !== 1 ? "s" : ""}`}
        />
      </section>

      {pending.length > 0 && (
        <section className="card-folkie mb-5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-body font-semibold">Pending Applications</h3>
            <span className="text-caption text-muted-foreground">{pending.length}</span>
          </div>
          <ul className="mt-4 space-y-3">
            {pending.map((c) => (
              <CollabRow key={c.application.id} collab={c} />
            ))}
          </ul>
        </section>
      )}

      <section className="card-folkie p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-body font-semibold">Active Collaborations</h3>
          <span className="text-caption text-muted-foreground">{active.length}</span>
        </div>

        {active.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
            <Handshake className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-small font-semibold">No approved creators yet</p>
            <p className="mt-1 text-caption text-muted-foreground">
              Review pending applications and approve creators — active collaborations appear here.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {active.map((c) => (
              <CollabRow key={c.application.id} collab={c} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function CollabRow({ collab }: { collab: Collaboration }) {
  const a = collab.application;
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background p-3 sm:flex-nowrap">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-small font-semibold text-primary-foreground">
        {(a.handle ?? "@").replace("@", "").charAt(0).toUpperCase() || "?"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-small font-semibold">
            {a.handle ?? "(TikTok not connected)"}
          </span>
          <StatusBadge variant={a.status} />
        </div>
        <div className="mt-0.5 truncate text-caption text-muted-foreground">
          <Link
            href={`/brand/campaigns/${collab.campaignId}`}
            className="hover:text-primary hover:underline"
          >
            {collab.campaignTitle}
          </Link>
          {" · "}
          {formatNumber(a.followerCount)} followers
          {a.city && ` · ${a.city}`}
        </div>
      </div>

      <div className="flex items-center gap-3 text-right">
        <div className="text-body font-bold text-primary">
          {formatTRY(collab.budget)}
        </div>
        <Link
          href={`/brand/campaigns/${collab.campaignId}`}
          className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-caption hover:border-primary"
        >
          <Eye className="h-3 w-3" />
          <span className="hidden sm:inline">View</span>
        </Link>
      </div>
    </li>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  const bg = accent
    ? "bg-primary text-primary-foreground"
    : "bg-card border border-border";
  const subColor = accent ? "text-primary-foreground/70" : "text-muted-foreground";
  return (
    <div className={`rounded-2xl p-5 ${bg}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${subColor}`} />
        <span className={`text-caption ${subColor}`}>{label}</span>
      </div>
      <div className={`mt-2 text-h2 font-bold ${accent ? "text-primary-foreground" : "text-foreground"}`}>
        {value}
      </div>
      <div className={`mt-1 text-caption ${subColor}`}>{sub}</div>
    </div>
  );
}
