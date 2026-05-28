"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { approvePayment, markTransferred } from "./actions";

export function ApproveButton({ paymentId }: { paymentId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const r = await approvePayment(paymentId, null);
      if (!r.ok) setError(r.error ?? "Hata");
    });
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={pending}
        className="flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-caption font-semibold text-success disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <CheckCircle2 className="h-3 w-3" />
        )}
        Onayla
      </button>
      {error && (
        <p className="mt-1 text-caption text-destructive">{error}</p>
      )}
    </>
  );
}

export function TransferForm({ paymentId }: { paymentId: string }) {
  const [open, setOpen] = useState(false);
  const [ref, setRef] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <Send className="h-3 w-3" />
        Transfer Yap
      </button>
    );
  }

  function handleSubmit() {
    if (!ref.trim()) {
      setError("Transfer referansı gerekli.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const r = await markTransferred(paymentId, ref.trim(), null);
      if (r.ok) {
        setOpen(false);
        setRef("");
      } else {
        setError(r.error ?? "Hata");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          autoFocus
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Transfer ref"
          className="w-32 rounded-full border border-border bg-background px-3 py-1 text-caption focus:border-primary focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={pending}
          className="rounded-full bg-primary px-3 py-1 text-caption font-semibold text-primary-foreground disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Kaydet"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-full px-2 py-1 text-caption hover:bg-muted"
        >
          ×
        </button>
      </div>
      {error && (
        <p className="text-caption text-destructive">{error}</p>
      )}
    </div>
  );
}
