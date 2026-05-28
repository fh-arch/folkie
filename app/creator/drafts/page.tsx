import Link from "next/link";
import {
  FileEdit,
  Play,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { PublishForm } from "./PublishForm";

interface SubmissionRow {
  id: string;
  applicationId: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  brandLogoUrl: string | null;
  status: "submitted" | "revision" | "approved" | "published";
  videoUrl: string | null;
  externalVideoUrl: string | null;
  script: string | null;
  revisionNote: string | null;
  hashtags: string[];
  submittedAt: string;
  reviewedAt: string | null;
  publishedAt: string | null;
  publishDeadline: string | null;
}

export default async function CreatorDraftsPage() {
  let submissions: SubmissionRow[] = [];
  let fetchError: string | null = null;
  try {
    submissions = await apiFetch<SubmissionRow[]>(ENDPOINTS.creator.submissions());
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Unknown error";
  }

  if (submissions.length === 0) {
    return (
      <div>
        <PageHeader
          title="Drafts"
          description="Track your content submissions and revision requests."
          breadcrumbs={[{ label: "Drafts" }]}
        />
        <section className="card-folkie">
          <EmptyState
            icon={FileEdit}
            title={fetchError ? "Failed to load" : "No drafts yet"}
            description={
              fetchError
                ? `Error: ${fetchError}`
                : "Once your application is approved and you submit content, it appears here. The brand reviews it, may request revisions, then you publish to TikTok."
            }
            primaryAction={{
              href: "/creator/collaborations",
              label: "My Collaborations",
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
        title="Drafts"
        description="Track your content submissions and revision requests."
        breadcrumbs={[{ label: "Drafts" }]}
      />

      <section className="card-folkie p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {submissions.map((s) => (
            <DraftCard key={s.id} submission={s} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DraftCard({ submission: s }: { submission: SubmissionRow }) {
  const daysLeft = s.publishDeadline
    ? Math.max(
        0,
        Math.ceil(
          (new Date(s.publishDeadline).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-background ${
        s.status === "revision" ? "border-warning/40" : "border-border"
      }`}
    >
      {s.videoUrl ? (
        <div className="relative aspect-video overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.videoUrl}
            alt={s.campaignTitle}
            className="h-full w-full object-cover"
          />
          <a
            href={s.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-foreground/30 opacity-0 transition-opacity hover:opacity-100"
            aria-label="Open video"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card/95">
              <Play className="ml-0.5 h-6 w-6 fill-current" />
            </div>
          </a>
          <span className="absolute right-3 top-3">
            <StatusBadge variant={s.status} />
          </span>
          {daysLeft !== null && s.status === "approved" && (
            <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-card/95 px-2 py-0.5 text-caption font-semibold backdrop-blur">
              <Clock className="h-3 w-3" />
              {daysLeft}d left
            </span>
          )}
        </div>
      ) : (
        <div className="relative flex aspect-video items-center justify-center bg-muted">
          <FileEdit className="h-12 w-12 text-muted-foreground" />
          <span className="absolute right-3 top-3">
            <StatusBadge variant={s.status} />
          </span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2">
          {s.brandLogoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.brandLogoUrl}
              alt={s.brandName}
              className="h-6 w-6 rounded-full object-cover"
            />
          )}
          <span className="text-caption text-muted-foreground">
            {s.brandName}
          </span>
        </div>
        <Link
          href={`/creator/campaigns/${s.campaignId}`}
          className="mt-1 block truncate text-body font-semibold hover:text-primary"
        >
          {s.campaignTitle}
        </Link>
        {s.script && (
          <p className="mt-1 line-clamp-2 text-caption text-muted-foreground">
            {s.script}
          </p>
        )}
        <div className="mt-2 text-caption text-muted-foreground">
          Submitted: {new Date(s.submittedAt).toLocaleDateString("en-GB")}
        </div>

        {s.status === "revision" && s.revisionNote && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-warning/10 p-3 text-caption">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
            <div>
              <span className="font-semibold text-warning">Revision requested:</span>
              <p className="mt-0.5 text-foreground/70">{s.revisionNote}</p>
            </div>
          </div>
        )}

        {s.status === "approved" && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-success/10 p-3 text-caption">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            <div>
              <span className="font-semibold text-success">Approved!</span>
              <p className="mt-0.5 text-foreground/70">
                Publish on TikTok{s.publishDeadline ? ` before ${new Date(s.publishDeadline).toLocaleDateString("en-GB")}` : ""} and paste the link below.
              </p>
            </div>
          </div>
        )}

        {s.externalVideoUrl && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-primary-light p-3 text-caption">
            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <a
              href={s.externalVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              View on TikTok
            </a>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          {s.status === "approved" && !s.externalVideoUrl && (
            <PublishForm submissionId={s.id} />
          )}
          {s.status === "published" && s.externalVideoUrl && (
            <a
              href={s.externalVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border py-2 text-caption hover:border-primary"
            >
              <ExternalLink className="h-3 w-3" />
              Open on TikTok
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
