"use client";

import { useState } from "react";
import { selectRole } from "./actions";
import { Sparkles, Building2, Loader2 } from "lucide-react";

export function OnboardingClient() {
  const [picked, setPicked] = useState<"influencer" | "brand" | null>(null);
  const [brandName, setBrandName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!picked) return;
    if (picked === "brand" && brandName.trim().length < 2) {
      setError("Marka adı en az 2 karakter olmalı.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await selectRole(picked, picked === "brand" ? brandName.trim() : undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bilinmeyen hata");
      setSubmitting(false);
    }
  }

  if (picked === "brand") {
    return (
      <div className="container-folkie min-h-screen py-16">
        <div className="mx-auto max-w-xl text-center">
          <Building2 className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4">What is your brand name?</h1>
          <p className="mt-2 text-body text-muted-foreground">
            Creators will see this name when applying. You can change it later in settings.
          </p>
          <input
            type="text"
            autoFocus
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g. Brand Studio"
            className="mt-8 w-full rounded-2xl border-2 border-border bg-card px-5 py-3 text-body focus:border-primary focus:outline-none"
          />
          {error && <p className="mt-3 text-small text-destructive">{error}</p>}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setPicked(null)}
              disabled={submitting}
              className="rounded-full border border-border px-5 py-2.5 text-small disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || brandName.trim().length < 2}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-small font-semibold text-primary-foreground disabled:opacity-50"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
              ) : "Continue"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-folkie min-h-screen py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1>Welcome to Folkie! 👋</h1>
        <p className="mt-4 text-body text-muted-foreground">
          Before continuing, tell us which side you are on.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <RoleCard
            onClick={() => { setPicked("influencer"); handleSubmit(); }}
            disabled={submitting}
            badge="⭐ Nano priority"
            badgeClass="bg-accent text-accent-foreground"
            title="I'm a creator"
            description="I create content on TikTok. I want to apply to brand campaigns and earn money."
            submitting={submitting && picked === "influencer"}
          />
          <RoleCard
            onClick={() => setPicked("brand")}
            disabled={submitting}
            badge="Campaign management"
            badgeClass="bg-primary-light text-primary"
            title="I'm a brand"
            description="I want to run creator campaigns to promote my product or service."
            submitting={false}
          />
        </div>
        {error && <p className="mt-6 text-small text-destructive">{error}</p>}
        <p className="mt-10 text-caption text-muted-foreground">
          You cannot change this selection later. If you choose wrong, you will need a separate account.
        </p>
      </div>
    </div>
  );
}

function RoleCard({
  onClick, disabled, badge, badgeClass, title, description, submitting,
}: {
  onClick: () => void;
  disabled: boolean;
  badge: string;
  badgeClass: string;
  title: string;
  description: string;
  submitting: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="card-folkie w-full p-8 text-left transition-all hover:border-primary hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className={`inline-block rounded-full px-3 py-1 text-caption font-medium ${badgeClass}`}>
        {badge}
      </span>
      <h3 className="mt-4">{title}</h3>
      <p className="mt-2 text-small text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-small font-semibold text-primary">
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Setting up...</>
        ) : (
          <>Select <Sparkles className="h-3.5 w-3.5" /></>
        )}
      </span>
    </button>
  );
}
