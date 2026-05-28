import {
  BarChart3,
  Users,
  Wallet,
  Target,
  CheckCircle2,
  Activity,
  Info,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatTRY, formatNumber } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface CampaignRow {
  id: string;
  title: string;
  productCategory: string;
  status:
    | "draft"
    | "pending_payment"
    | "active"
    | "applications_closed"
    | "in_progress"
    | "completed"
    | "cancelled";
  budget: number; // total (BudgetPerInfluencer * InfluencerCount)
  influencerCount: number;
  applicationCount: number;
  approvedCount: number;
  applicationDeadline: string;
  createdAt: string;
}

const STATUS_FOR_BADGE: Record<
  CampaignRow["status"],
  "draft" | "pending" | "active" | "in_progress" | "completed" | "cancelled"
> = {
  draft: "draft",
  pending_payment: "pending",
  active: "active",
  applications_closed: "in_progress",
  in_progress: "in_progress",
  completed: "completed",
  cancelled: "cancelled",
};

export default async function BrandReportsPage() {
  let campaigns: CampaignRow[] = [];
  try {
    campaigns = await apiFetch<CampaignRow[]>(ENDPOINTS.brand.campaigns());
  } catch {
    /* gracefully degrade — show empty state */
  }

  if (campaigns.length === 0) {
    return (
      <div>
        <PageHeader
          title="Reports"
          description="Performance analytics for all your campaigns."
          breadcrumbs={[{ label: "Reports" }]}
        />
        <section className="card-folkie">
          <EmptyState
            icon={BarChart3}
            title="No reports yet"
            description="Once you launch your first campaign, you'll see applications, approvals, budget, and performance data here."
            primaryAction={{
              href: "/brand/campaigns/new",
              label: "Create Campaign",
            }}
            size="lg"
          />
        </section>
      </div>
    );
  }

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "active" || c.status === "in_progress",
  ).length;
  const completedCampaigns = campaigns.filter(
    (c) => c.status === "completed",
  ).length;
  // budget is already total (BudgetPerInfluencer * InfluencerCount) from backend
  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalApplications = campaigns.reduce(
    (s, c) => s + c.applicationCount,
    0,
  );
  const totalApproved = campaigns.reduce((s, c) => s + c.approvedCount, 0);
  const approvalRate =
    totalApplications > 0
      ? ((totalApproved / totalApplications) * 100).toFixed(1)
      : "0.0";

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Performance analytics for all your campaigns."
        breadcrumbs={[{ label: "Reports" }]}
      />

      <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Activity}
          label="Active Campaigns"
          value={`${activeCampaigns}`}
          sub={`${totalCampaigns} total`}
          iconBg="bg-primary-light"
          iconFg="text-primary"
        />
        <MetricCard
          icon={Wallet}
          label="Total Budget"
          value={formatTRY(totalBudget)}
          sub={`${completedCampaigns} campaign${completedCampaigns !== 1 ? "s" : ""} completed`}
          iconBg="bg-warning/15"
          iconFg="text-warning"
        />
        <MetricCard
          icon={Users}
          label="Total Applications"
          value={formatNumber(totalApplications)}
          sub={`${totalApproved} approved`}
          iconBg="bg-accent/25"
          iconFg="text-foreground"
        />
        <MetricCard
          icon={Target}
          label="Approval Rate"
          value={`${approvalRate}%`}
          sub={`${totalApproved}/${totalApplications}`}
          iconBg="bg-success/15"
          iconFg="text-success"
        />
      </section>

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-small">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <strong>Reach, engagement, and view metrics</strong> will appear here
          once the TikTok Business API integration is live. You&apos;re currently
          seeing application and approval data.
        </div>
      </div>

      <section className="card-folkie p-5">
        <h3 className="text-body font-semibold">Campaign Performance</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-small">
            <thead>
              <tr className="border-b border-border text-left text-caption text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Campaign</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Applications</th>
                <th className="py-3 pr-4 font-medium">Approved</th>
                <th className="py-3 pr-4 font-medium">Fill rate</th>
                <th className="py-3 pr-4 font-medium">Per creator</th>
                <th className="py-3 font-medium">Total budget</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const fill =
                  c.influencerCount > 0
                    ? Math.round((c.approvedCount / c.influencerCount) * 100)
                    : 0;
                const perCreator =
                  c.influencerCount > 0 ? c.budget / c.influencerCount : 0;
                return (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="py-3 pr-4">
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-caption text-muted-foreground">
                        {c.productCategory}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge variant={STATUS_FOR_BADGE[c.status]} />
                    </td>
                    <td className="py-3 pr-4">{c.applicationCount}</td>
                    <td className="py-3 pr-4 font-semibold text-success">
                      {c.approvedCount}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-muted">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${Math.min(fill, 100)}%` }}
                          />
                        </div>
                        <span className="text-caption text-muted-foreground">
                          {fill}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">{formatTRY(perCreator)}</td>
                    <td className="py-3 font-semibold text-primary">
                      {formatTRY(c.budget)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-folkie mt-5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
        <h3 className="mt-3 text-body font-semibold">
          Detailed content analytics coming soon
        </h3>
        <p className="mx-auto mt-2 max-w-md text-caption text-muted-foreground">
          Reach, engagement, top creators, and CPE (Cost-Per-Engagement) reports
          for published videos will activate automatically once the TikTok
          Business API integration is complete.
        </p>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  iconBg,
  iconFg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  iconBg: string;
  iconFg: string;
}) {
  return (
    <div className="card-folkie flex items-center gap-3 p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon className={`h-5 w-5 ${iconFg}`} />
      </div>
      <div>
        <div className="text-caption text-muted-foreground">{label}</div>
        <div className="text-h3 leading-tight">{value}</div>
        <div className="text-caption text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
