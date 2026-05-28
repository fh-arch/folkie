import { notFound } from "next/navigation";
import {
  Calendar,
  Users,
  Wallet,
  Target,
  Eye,
  Clock,
  Video,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatTRY, formatNumber } from "@/lib/utils";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { ApplicationActions } from "./ApplicationActions";
import { BrandSubmissionsSection } from "./BrandSubmissionsSection";

interface Props {
  params: Promise<{ id: string }>;
}

interface CampaignDetail {
  id: string;
  title: string;
  productName: string;
  productCategory: string;
  brief: string;
  requiredHashtags: string[];
  contentTypes: string[];
  tone: string | null;
  targetCategories: string[];
  targetCities: string[];
  contentLanguage: string[];
  minFollowers: number;
  maxFollowers: number;
  influencerCount: number;
  budgetPerInfluencer: number;
  totalBudget: number;
  platformFeeRate: number;
  productDelivery: string;
  approvalMode: string;
  applicationDeadline: string;
  publishStartDate: string;
  publishEndDate: string;
  isFlashCampaign: boolean;
  flashPublishTime: string | null;
  status: string;
  applicationCount: number;
  approvedCount: number;
  createdAt: string;
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

const STATUS_FOR_BADGE: Record<string, "draft" | "pending" | "active" | "in_progress" | "completed" | "cancelled"> = {
  draft: "draft",
  pending_payment: "pending",
  active: "active",
  applications_closed: "in_progress",
  in_progress: "in_progress",
  completed: "completed",
  cancelled: "cancelled",
};

export default async function BrandCampaignDetailPage({ params }: Props) {
  const { id } = await params;

  let campaign: CampaignDetail;
  try {
    campaign = await apiFetch<CampaignDetail>(ENDPOINTS.brand.campaign(id));
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  // Applications + submissions fetched in parallel
  let applications: ApplicationRow[] = [];
  let submissions: { id: string; applicationId: string; creatorProfileId: string; handle: string | null; avatarUrl: string | null; followerCount: number; engagementRate: number; submissionStatus: string; videoUrl: string | null; script: string | null; revisionNote: string | null; hashtags: string[]; submittedAt: string; reviewedAt: string | null }[] = [];
  try {
    [applications, submissions] = await Promise.all([
      apiFetch<ApplicationRow[]>(ENDPOINTS.brand.campaignApplications(id)),
      apiFetch<typeof submissions>(ENDPOINTS.brand.campaignSubmissions(id)),
    ]);
  } catch {
    try {
      applications = await apiFetch<ApplicationRow[]>(ENDPOINTS.brand.campaignApplications(id));
    } catch { /* gracefully degrade */ }
  }

  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const pendingSubmissionsCount = submissions.filter((s) => s.submissionStatus === "submitted").length;
  const totalWithFee =
    campaign.totalBudget * (1 + campaign.platformFeeRate / 100);

  return (
    <div>
      <PageHeader
        title={campaign.title}
        description={`${campaign.productName} • ${campaign.productCategory}`}
        breadcrumbs={[
          { href: "/brand/campaigns", label: "Campaigns" },
          { label: campaign.title },
        ]}
        actions={<StatusBadge variant={STATUS_FOR_BADGE[campaign.status] ?? "draft"} className="text-small" />}
      />

      {/* Quick stats */}
      <section className="card-folkie mb-5 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
        <Stat
          icon={Wallet}
          bg="bg-primary-light"
          fg="text-primary"
          label="Total Budget"
          value={formatTRY(campaign.totalBudget)}
          sub={`+${formatTRY(totalWithFee - campaign.totalBudget)} commission`}
        />
        <Stat
          icon={Users}
          bg="bg-accent/25"
          fg="text-foreground"
          label="Fill rate"
          value={`${campaign.approvedCount}/${campaign.influencerCount}`}
          sub={
            campaign.influencerCount > 0
              ? `${Math.round((campaign.approvedCount / campaign.influencerCount) * 100)}% filled`
              : ""
          }
        />
        <Stat
          icon={Target}
          bg="bg-warning/15"
          fg="text-warning"
          label="Pending Applications"
          value={`${pendingCount}`}
          sub={`${campaign.applicationCount} total`}
        />
        <Stat
          icon={Video}
          bg="bg-primary-light"
          fg="text-primary"
          label="Content Submitted"
          value="0"
          sub="Active in Sprint 4"
        />
        <Stat
          icon={Eye}
          bg="bg-success/15"
          fg="text-success"
          label="Published"
          value="0"
          sub="Live on TikTok"
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="card-folkie p-5">
            <h3 className="text-h3">Applications</h3>

            {applications.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-small font-semibold">
                  No applications yet
                </p>
                <p className="mt-1 text-caption text-muted-foreground">
                  Once your campaign is active, creators will start applying.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="mt-4 hidden overflow-x-auto md:block">
                  <table className="w-full text-small">
                    <thead>
                      <tr className="text-left text-caption text-muted-foreground">
                        <th className="py-3 pr-4 font-medium">Creator</th>
                        <th className="py-3 pr-4 font-medium">Followers</th>
                        <th className="py-3 pr-4 font-medium">Engagement</th>
                        <th className="py-3 pr-4 font-medium">City</th>
                        <th className="py-3 pr-4 font-medium">Status</th>
                        <th className="py-3 pr-4 font-medium">Applied</th>
                        <th className="py-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((a) => (
                        <tr
                          key={a.id}
                          className="border-t border-border hover:bg-muted/30"
                        >
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                              <div>
                                <span className="font-semibold">
                                  {a.handle ?? "(TikTok not connected)"}
                                </span>
                                <div className="text-caption text-muted-foreground capitalize">
                                  {a.tier === "mid_tier" ? "Mid-tier" : a.tier}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            {formatNumber(a.followerCount)}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-success">
                            {a.engagementRate.toFixed(1)}%
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {a.city ?? "—"}
                          </td>
                          <td className="py-3 pr-4">
                            <StatusBadge variant={a.status} />
                          </td>
                          <td className="py-3 pr-4 text-caption text-muted-foreground">
                            {new Date(a.appliedAt).toLocaleDateString("en-GB")}
                          </td>
                          <td className="py-3">
                            {a.status === "pending" ? (
                              <ApplicationActions
                                campaignId={campaign.id}
                                applicationId={a.id}
                                status={a.status}
                              />
                            ) : (
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                                aria-label="View"
                              >
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="mt-4 space-y-3 md:hidden">
                  {applications.map((a) => (
                    <article
                      key={a.id}
                      className="rounded-2xl border border-border bg-background p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {a.handle ?? "(TikTok not connected)"}
                            </span>
                            <StatusBadge variant={a.status} />
                          </div>
                          <div className="mt-0.5 text-caption text-muted-foreground">
                            {formatNumber(a.followerCount)} followers • {a.city ?? "—"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-caption">
                        <div>
                          <div className="text-muted-foreground">Engagement</div>
                          <div className="font-semibold text-success">
                            {a.engagementRate.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Applied</div>
                          <div className="font-semibold">
                            {new Date(a.appliedAt).toLocaleDateString("en-GB")}
                          </div>
                        </div>
                      </div>
                      {a.rejectionReason && (
                        <div className="mt-2 text-caption text-destructive/80">
                          Rejection reason: {a.rejectionReason}
                        </div>
                      )}
                      <ApplicationActions
                        campaignId={campaign.id}
                        applicationId={a.id}
                        status={a.status}
                        compact
                      />
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Content Submissions */}
          <section className="card-folkie p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-h3">Content Submissions</h3>
              {pendingSubmissionsCount > 0 && (
                <span className="rounded-full bg-warning/15 px-2.5 py-0.5 text-caption font-semibold text-warning">
                  {pendingSubmissionsCount} pending review
                </span>
              )}
            </div>
            <BrandSubmissionsSection
              initialSubmissions={submissions}
              campaignId={campaign.id}
            />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <section className="card-folkie p-5">
            <h3 className="text-body font-semibold">Brief</h3>
            <p className="mt-2 whitespace-pre-line text-small text-muted-foreground">
              {campaign.brief}
            </p>
          </section>

          <section className="card-folkie p-5">
            <h3 className="text-body font-semibold">Dates</h3>
            <ul className="mt-3 space-y-2.5 text-small">
              <DateRow icon={Clock} label="Application deadline" value={campaign.applicationDeadline} />
              <DateRow icon={Calendar} label="Publish start" value={campaign.publishStartDate} />
              <DateRow icon={Calendar} label="Publish end" value={campaign.publishEndDate} />
            </ul>
          </section>

          <section className="card-folkie p-5">
            <h3 className="text-body font-semibold">Details</h3>
            <dl className="mt-3 space-y-2.5 text-small">
              <InfoRow label="Min followers" value={formatNumber(campaign.minFollowers)} />
              <InfoRow label="Max followers" value={formatNumber(campaign.maxFollowers)} />
              <InfoRow label="Per creator" value={formatTRY(campaign.budgetPerInfluencer)} />
              <InfoRow label="Content type" value={campaign.contentTypes.join(", ")} />
              {campaign.isFlashCampaign && (
                <InfoRow label="Flash time" value={campaign.flashPublishTime ?? "—"} />
              )}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  bg,
  fg,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
  fg: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}>
        <Icon className={`h-5 w-5 ${fg}`} />
      </div>
      <div>
        <div className="text-caption text-muted-foreground">{label}</div>
        <div className="text-h3 leading-tight">{value}</div>
        {sub && <div className="text-caption text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

function DateRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="font-medium">
        {new Date(value).toLocaleDateString("en-GB")}
      </span>
    </li>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
