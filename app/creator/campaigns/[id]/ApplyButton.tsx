"use client";

import { useState, useTransition } from "react";
import { Clapperboard, Loader2, CheckCircle2, X, ArrowRight } from "lucide-react";
import { applyToCampaign } from "./actions";

export function ApplyButton({
  campaignId,
  alreadyApplied,
  fee,
  daysLeft,
}: {
  campaignId: string;
  alreadyApplied: boolean;
  fee?: number;
  daysLeft?: number;
}) {
  const [applied, setApplied] = useState(alreadyApplied);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (applied) {
    return (
      <button
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-full bg-success/15 py-3 text-body font-bold text-success"
      >
        <CheckCircle2 className="h-5 w-5" />
        Application Sent
      </button>
    );
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-body font-bold text-accent-foreground hover:bg-accent/90"
      >
        <Clapperboard className="h-5 w-5" />
        I Want to Create Content
      </button>
    );
  }

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await applyToCampaign(campaignId);
      if (result.ok) {
        setApplied(true);
        setConfirming(false);
      } else {
        setError(result.error ?? "Application failed");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-small font-semibold text-primary">Confirm your application</p>
          <p className="mt-1 text-caption text-muted-foreground">
            By applying, you commit to creating content per the campaign brief.
            The brand will review your profile and notify you within 2–3 days.
          </p>
        </div>
        <button onClick={() => setConfirming(false)} className="shrink-0 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 rounded-xl bg-background px-4 py-2 text-caption">
        {fee !== undefined && (
          <span>
            <span className="text-muted-foreground">Your fee · </span>
            <span className="font-bold text-primary">
              {fee.toLocaleString("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 })}
            </span>
          </span>
        )}
        {daysLeft !== undefined && (
          <span>
            <span className="text-muted-foreground">Deadline · </span>
            <span className="font-semibold">{daysLeft} days left</span>
          </span>
        )}
      </div>

      {error && <p className="text-caption text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={() => setConfirming(false)}
          className="flex-1 rounded-full border border-border py-2 text-small hover:bg-muted"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={pending}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-small font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ArrowRight className="h-4 w-4" />
              Confirm
            </>
          )}
        </button>
      </div>
    </div>
  );
}
