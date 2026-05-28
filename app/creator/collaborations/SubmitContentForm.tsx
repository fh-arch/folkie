"use client";

import { useState, useTransition } from "react";
import { Upload, Loader2, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

export function SubmitContentForm({
  applicationId,
  campaignTitle,
}: {
  applicationId: string;
  campaignTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [script, setScript] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-small text-success">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span className="font-semibold">Content submitted!</span>
        <span className="text-success/70">The brand will review it and notify you.</span>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-xl bg-primary/10 px-4 py-3 text-small font-semibold text-primary hover:bg-primary/15"
      >
        <span className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Submit Your Content
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>
    );
  }

  function handleSubmit() {
    if (!videoUrl.trim() && !script.trim()) {
      setError("Provide a video URL or a script — at least one is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/proxy/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          videoUrl: videoUrl.trim() || null,
          script: script.trim() || null,
          hashtags: hashtags
            .split(",")
            .map((h) => h.trim().replace(/^#/, ""))
            .filter(Boolean),
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        const detail =
          e.details &&
          typeof e.details === "object" &&
          "errors" in (e.details as object)
            ? Object.values((e.details as { errors: Record<string, string[]> }).errors)
                .flat()
                .join(". ")
            : null;
        setError(detail ?? e.error ?? "Failed to submit. Please try again.");
        return;
      }
      setSubmitted(true);
    });
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-small font-semibold text-primary flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Submit Content for &quot;{campaignTitle}&quot;
        </h4>
        <button
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-caption font-medium">
            Video URL <span className="text-muted-foreground">(optional if you provide a script)</span>
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://drive.google.com/... or https://dropbox.com/..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-small focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-caption font-medium">
            Script / Content Plan <span className="text-muted-foreground">(optional if you provide a video)</span>
          </label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={4}
            placeholder="Describe what you plan to say and show in the video..."
            className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-small focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-caption font-medium">
            Hashtags <span className="text-muted-foreground">comma-separated</span>
          </label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="folkie, brand, campaign"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-small focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-caption text-destructive">{error}</p>
      )}

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setOpen(false)}
          className="rounded-full border border-border px-4 py-2 text-caption hover:bg-muted"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={pending}
          className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-caption font-semibold text-primary-foreground disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          Submit
        </button>
      </div>
    </div>
  );
}
