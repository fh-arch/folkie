"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Loader2, X } from "lucide-react";
import { publishSubmission } from "./actions";

export function PublishForm({ submissionId }: { submissionId: string }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2 text-caption font-semibold text-accent-foreground hover:bg-accent/90"
      >
        <ExternalLink className="h-3 w-3" />
        Enter TikTok Link
      </button>
    );
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const r = await publishSubmission(submissionId, url.trim());
      if (r.ok) {
        setOpen(false);
        setUrl("");
      } else {
        setError(r.error ?? "Hata");
      }
    });
  }

  return (
    <div className="flex-1 rounded-xl bg-muted/40 p-2">
      <div className="flex items-center gap-2">
        <input
          type="url"
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://tiktok.com/@user/video/..."
          className="flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-caption focus:border-primary focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={pending || !url.trim()}
          className="rounded-full bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      {error && (
        <p className="mt-1 text-caption text-destructive">{error}</p>
      )}
    </div>
  );
}
