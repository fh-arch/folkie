import Link from "next/link";
import { Calendar, Eye, Handshake, CheckCircle2, Clock, RefreshCw, DollarSign, Banknote } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatTRY } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { SubmitContentForm } from "./SubmitContentForm";

interface ApplicationRow {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandId: string;
  brandName: string;
  brandLogoUrl: string | null;
  amount: number;
  status: "pending" | "approved" | "rejected" | "withdrawn";
  rejectionReason: string | null;
  appliedAt: string;
  reviewedAt: string | null;
  publishEndDate: string;
}

interface SubmissionRow {
  id: string;
  applicationId: string;
  status: "submitted" | "revision_requested" | "approved" | "published";
  videoUrl: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

const FALLBACK_LOGO =
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200";

export default async function CreatorCollaborationsPage() {
  let apps: ApplicationRow[] = [];
  let submissions: SubmissionRow[] = [];
  let fetchError: string | null = null;

  try {
    [apps, submissions] = await Promise.all([
      apiFetch<ApplicationRow[]>(ENDPOINTS.creator.applications()),
      apiFetch<SubmissionRow[]>(ENDPOINTS.creator.submissions()).catch(() => []),
    ]);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Unknown error";
  }

  // Map submissions by applicationId for quick lookup
  const submissionByApp = new Map<string, SubmissionRow>();
  for (const s of submissions) {
    submissionByApp.set(s.applicationId, s);
  }

  if (apps.length === 0) {
    return (
      <div>
        <PageHeader
          title="My Collaborations"
          description="Track your applications and active collaborations."
          breadcrumbs={[{ label: "My Collaborations" }]}
        />
        <section className="card-folkie">
          <EmptyState
            icon={Handshake}
            title={fetchError ? "Failed to load" : "No applications yet"}
            description={
              fetchError
                ? `Error: ${fetchError}`
                : "Browse campaigns and apply to ones that match your profile. Your applications will appear here."
            }
            primaryAction={{
              href: "/creator/campaigns",
              label: "Discover Campaigns",
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
        title="My Collaborations"
        description="Track your applications and active collaborations."
        breadcrumbs={[{ label: "My Collaborations" }]}
      />

      <section className="card-folkie p-4 sm:p-5">
        <div className="space-y-3">
          {apps.map((a) => (
            <ApplicationCard
              key={a.id}
              app={a}
              submission={submissionByApp.get(a.id) ?? null}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ApplicationCard({
  app,
  submission,
}: {
  app: ApplicationRow;
  submission: SubmissionRow | null;
}) {
  const nextAction = nextActionFor(app, submission);
  const paymentBanner = paymentBannerFor(app, submission);

  return (
    <article className="rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/40">
      <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={app.brandLogoUrl ?? FALLBACK_LOGO}
          alt={app.brandName}
          className="h-14 w-14 shrink-0 rounded-2xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-caption text-muted-foreground">{app.brandName}</span>
            <StatusBadge variant={app.status} />
            {submission && (
              <StatusBadge
                variant={
                  submission.status === "revision_requested" ? "revision" : submission.status
                }
              />
            )}
          </div>
          <Link
            href={`/creator/campaigns/${app.campaignId}`}
            className="mt-0.5 block truncate text-body font-semibold hover:text-primary"
          >
            {app.campaignTitle}
          </Link>
          <div className="mt-1 flex items-center gap-3 text-caption text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Applied: {new Date(app.appliedAt).toLocaleDateString("en-GB")}
            </span>
          </div>
          {nextAction && (
            <div className="mt-2 text-caption text-foreground/70">
              <span className="font-semibold">Next:</span> {nextAction}
            </div>
          )}
          {app.status === "approved" && app.publishEndDate && (
            <div className="mt-1 flex items-center gap-1 text-caption font-semibold text-warning">
              <Calendar className="h-3 w-3" />
              Publish by {new Date(app.publishEndDate).toLocaleDateString("en-GB")}
            </div>
          )}
          {app.rejectionReason && (
            <div className="mt-2 text-caption text-destructive/80">
              Rejection reason: {app.rejectionReason}
            </div>
          )}
        </div>

        <div className="flex w-full items-center justify-between gap-3 border-t border-border pt-3 sm:w-auto sm:border-t-0 sm:pt-0">
          <div className="text-right">
            <div className="text-h3 font-bold text-primary">{formatTRY(app.amount)}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/creator/campaigns/${app.campaignId}`}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
              aria-label="View campaign"
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>

      {/* Payment banner — shown after content is approved */}
      {paymentBanner && (
        <div className="mt-4 border-t border-border pt-4">
          {paymentBanner}
        </div>
      )}

      {/* Submit content — only if approved and no submission yet */}
      {app.status === "approved" && !submission && (
        <div className="mt-4 border-t border-border pt-4">
          <SubmitContentForm applicationId={app.id} campaignTitle={app.campaignTitle} />
        </div>
      )}

      {/* Revision requested — allow re-submit */}
      {submission?.status === "revision_requested" && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-warning/10 px-4 py-2.5 text-small text-warning">
            <RefreshCw className="h-4 w-4 shrink-0" />
            <span className="font-semibold">Brand requested a revision.</span>
            <span className="text-warning/80">Please update your content and resubmit.</span>
          </div>
          <SubmitContentForm applicationId={app.id} campaignTitle={app.campaignTitle} />
        </div>
      )}
    </article>
  );
}

function paymentBannerFor(
  app: ApplicationRow,
  submission: SubmissionRow | null,
): React.ReactNode | null {
  if (!submission) return null;

  if (submission.status === "submitted") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3 text-small">
        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span>Content submitted — waiting for brand review.</span>
      </div>
    );
  }

  if (submission.status === "approved" || submission.status === "published") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3 text-small">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/20">
          <CheckCircle2 className="h-4 w-4 text-success" />
        </div>
        <div>
          <p className="font-semibold text-success">
            {submission.status === "published" ? "Content published" : "Content approved"}
          </p>
          <p className="mt-0.5 text-success/80">
            Your payment of <strong>{formatTRY(app.amount)}</strong> is being processed.
            It will be transferred to your IBAN within 5 business days.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-caption font-semibold text-success">
          <Banknote className="h-3.5 w-3.5" />
          Payment pending
        </div>
      </div>
    );
  }

  return null;
}

function nextActionFor(
  app: ApplicationRow,
  submission: SubmissionRow | null,
): string | null {
  if (app.status === "pending") return "Waiting for brand review";
  if (app.status === "rejected") return null;
  if (app.status === "withdrawn") return "Withdrawn";
  if (app.status === "approved") {
    if (!submission) return "Submit your content below";
    if (submission.status === "submitted") return "Content under brand review";
    if (submission.status === "revision_requested") return "Update your content and resubmit";
    if (submission.status === "approved") return "Payment being processed";
    if (submission.status === "published") return "Payment being processed";
  }
  return null;
}
