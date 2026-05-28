"use client";

import { useTransition, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Loader2 } from "lucide-react";
import { verifyBrand, suspendBrand, reactivateBrand } from "./actions";

interface Props {
  brandId: string;
  isVerified: boolean;
  isActive: boolean;
}

export function BrandModerationActions({ brandId, isVerified, isActive }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(fn: (id: string) => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const r = await fn(brandId);
      if (!r.ok) setError(r.error ?? "Hata");
    });
  }

  if (!isActive) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={() => run(reactivateBrand)}
          disabled={pending}
          className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-caption font-semibold text-foreground hover:border-primary disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
          Yeniden Aktive Et
        </button>
        {error && <span className="text-caption text-destructive">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1.5">
        {!isVerified && (
          <button
            onClick={() => run(verifyBrand)}
            disabled={pending}
            className="flex items-center gap-1 rounded-full bg-success/15 px-3 py-1.5 text-caption font-semibold text-success hover:bg-success/25 disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
            Onayla
          </button>
        )}
        <button
          onClick={() => run(suspendBrand)}
          disabled={pending}
          className="flex items-center gap-1 rounded-full bg-destructive/15 px-3 py-1.5 text-caption font-semibold text-destructive hover:bg-destructive/25 disabled:opacity-50"
        >
          <XCircle className="h-3 w-3" />
          Askıya Al
        </button>
      </div>
      {error && <span className="text-caption text-destructive">{error}</span>}
    </div>
  );
}
