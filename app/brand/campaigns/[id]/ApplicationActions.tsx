"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { approveApplication, rejectApplication } from "./actions";

export function ApplicationActions({
  campaignId,
  applicationId,
  status,
  compact = false,
}: {
  campaignId: string;
  applicationId: string;
  status: string;
  compact?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (status !== "pending") return null;

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      const r = await approveApplication(campaignId, applicationId);
      if (!r.ok) setError(r.error ?? "Error");
    });
  }

  function handleReject() {
    if (!reason.trim()) {
      setError("Rejection reason is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const r = await rejectApplication(campaignId, applicationId, reason.trim());
      if (!r.ok) setError(r.error ?? "Error");
      else setShowReject(false);
    });
  }

  if (showReject) {
    return (
      <div className={compact ? "mt-3 space-y-2" : "flex items-center gap-2"}>
        <input
          type="text"
          autoFocus
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Rejection reason (creator will see this)"
          className="flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-caption focus:border-primary focus:outline-none"
        />
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowReject(false)}
            disabled={pending}
            className="rounded-full px-3 py-1.5 text-caption hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={pending || !reason.trim()}
            className="rounded-full bg-destructive px-3 py-1.5 text-caption font-semibold text-destructive-foreground disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Reject"}
          </button>
        </div>
        {error && <p className="text-caption text-destructive">{error}</p>}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleApprove}
          disabled={pending}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-success/15 py-2 text-caption font-semibold text-success disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3 w-3" />
          )}
          Approve
        </button>
        <button
          onClick={() => setShowReject(true)}
          disabled={pending}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-destructive/15 py-2 text-caption font-semibold text-destructive disabled:opacity-50"
        >
          <XCircle className="h-3 w-3" />
          Reject
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleApprove}
        disabled={pending}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15 text-success hover:bg-success/25 disabled:opacity-50"
        aria-label="Approve"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
      </button>
      <button
        onClick={() => setShowReject(true)}
        disabled={pending}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15 text-destructive hover:bg-destructive/25 disabled:opacity-50"
        aria-label="Reject"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
}
