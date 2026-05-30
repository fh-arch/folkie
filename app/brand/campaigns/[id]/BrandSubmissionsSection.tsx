"use client";

import { useState, useTransition } from "react";
import {
  FileVideo,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Loader2,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatNumber } from "@/lib/utils";

interface Submission {
  id: string;
  applicationId: string;
  creatorProfileId: string;
  handle: string | null;
  avatarUrl: string | null;
  followerCount: number;
  engagementRate: number;
  submissionStatus: string;
  videoUrl: string | null;
  externalVideoUrl: string | null;
  script: string | null;
  revisionNote: string | null;
  hashtags: string[];
  submittedAt: string;
  reviewedAt: string | null;
}

export function BrandSubmissionsSection({
  initialSubmissions,
  campaignId,
}: {
  initialSubmissions: Submission[];
  campaignId: string;
}) {
  const [submissions, setSubmissions] = useState(initialSubmissions);

  if (submissions.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
        <FileVideo className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-3 text-small font-semibold">No content submitted yet</p>
        <p className="mt-1 text-caption text-muted-foreground">
          Approved creators will submit their content here for your review.
        </p>
      </div>
    );
  }

  function updateStatus(id: string, newStatus: string, revisionNote?: string) {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, submissionStatus: newStatus, revisionNote: revisionNote ?? s.revisionNote }
          : s,
      ),
    );
  }

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {submissions.map((s) => (
        <SubmissionCard
          key={s.id}
          submission={s}
          onStatusChange={updateStatus}
        />
      ))}
    </div>
  );
}

function SubmissionCard({
  submission: s,
  onStatusChange,
}: {
  submission: Submission;
  onStatusChange: (id: string, status: string, note?: string) => void;
}) {
  const [showRevision, setShowRevision] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const [showScript, setShowScript] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/proxy/brand/submissions/${s.id}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        onStatusChange(s.id, "approved");
      } else {
        const e = await res.json().catch(() => ({}));
        setError(e.error ?? "Failed to approve");
      }
    });
  }

  function handleRequestRevision() {
    if (!revisionNote.trim()) {
      setError("Revision note is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/proxy/brand/submissions/${s.id}/revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: revisionNote.trim() }),
      });
      if (res.ok) {
        onStatusChange(s.id, "revision", revisionNote.trim());
        setShowRevision(false);
      } else {
        const e = await res.json().catch(() => ({}));
        setError(e.error ?? "Failed to request revision");
      }
    });
  }

  const statusVariant = s.submissionStatus as "submitted" | "revision" | "approved" | "published";

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-background ${
        s.submissionStatus === "revision" ? "border-warning/40" : "border-border"
      }`}
    >
      {/* Video preview */}
      {s.videoUrl ? (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <a
            href={s.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-full w-full items-center justify-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card/95 shadow">
              <Play className="ml-0.5 h-6 w-6 fill-current text-primary" />
            </div>
          </a>
          <span className="absolute right-3 top-3">
            <StatusBadge variant={statusVariant} />
          </span>
        </div>
      ) : (
        <div className="relative flex aspect-video items-center justify-center bg-muted">
          <FileVideo className="h-12 w-12 text-muted-foreground" />
          <span className="absolute right-3 top-3">
            <StatusBadge variant={statusVariant} />
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Creator info */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-small font-semibold">{s.handle ?? "(No TikTok)"}</div>
            <div className="text-caption text-muted-foreground">
              {formatNumber(s.followerCount)} followers · {s.engagementRate.toFixed(1)}% engagement
            </div>
          </div>
          {s.videoUrl && (
            <a
              href={s.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-caption text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              View
            </a>
          )}
        </div>

        {/* Script toggle */}
        {s.script && (
          <button
            onClick={() => setShowScript((v) => !v)}
            className="mt-2 flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-caption hover:bg-muted"
          >
            <span className="font-medium">Script / Plan</span>
            {showScript ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
        {showScript && s.script && (
          <p className="mt-2 rounded-xl bg-muted/30 p-3 text-caption leading-relaxed text-foreground/80">
            {s.script}
          </p>
        )}

        {/* Hashtags */}
        {s.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {s.hashtags.map((h) => (
              <span
                key={h}
                className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
              >
                #{h}
              </span>
            ))}
          </div>
        )}

        <div className="mt-2 text-caption text-muted-foreground">
          Submitted: {new Date(s.submittedAt).toLocaleDateString("en-GB")}
        </div>

        {/* Revision note */}
        {s.revisionNote && (
          <div className="mt-3 rounded-xl bg-warning/10 p-3 text-caption text-warning">
            <span className="font-semibold">Revision note:</span> {s.revisionNote}
          </div>
        )}

        {/* Actions */}
        {(s.submissionStatus === "submitted" || s.submissionStatus === "revision") && (
          <div className="mt-3 space-y-2">
            {!showRevision ? (
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={pending}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-success/15 py-2 text-caption font-semibold text-success hover:bg-success/25 disabled:opacity-50"
                >
                  {pending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => setShowRevision(true)}
                  disabled={pending}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-warning/15 py-2 text-caption font-semibold text-warning hover:bg-warning/25 disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Request Revision
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  autoFocus
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Describe what needs to be changed..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-caption focus:border-warning focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRevision(false)}
                    className="flex-1 rounded-full border border-border py-2 text-caption hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestRevision}
                    disabled={pending || !revisionNote.trim()}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-warning py-2 text-caption font-semibold text-white disabled:opacity-50"
                  >
                    {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Send"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {s.submissionStatus === "approved" && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-success/10 p-3 text-caption text-success">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span className="font-semibold">Approved — waiting for creator to publish on TikTok</span>
          </div>
        )}

        {s.submissionStatus === "published" && (
          <div className="mt-3 rounded-xl border border-success/30 bg-success/5 p-3 text-caption">
            <div className="flex items-center gap-2 font-semibold text-success">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              Published on TikTok
            </div>
            {s.externalVideoUrl ? (
              <a
                href={s.externalVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                View on TikTok
              </a>
            ) : (
              <p className="mt-1 text-muted-foreground">TikTok link not provided yet.</p>
            )}
          </div>
        )}

        {error && (
          <p className="mt-2 text-caption text-destructive">{error}</p>
        )}
      </div>
    </article>
  );
}
