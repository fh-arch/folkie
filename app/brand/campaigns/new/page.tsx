"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Sparkles, Zap, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn, formatTRY } from "@/lib/utils";
import {
  KATEGORILER,
  ICERIK_TURLERI,
  TON_SECENEKLERI,
  URUN_TESLIM,
  SEHIRLER,
  PLATFORM_FEE_RATE,
} from "@/lib/constants";
import { createCampaign } from "./actions";

const STEPS = [
  { key: "basics",   label: "Campaign Info" },
  { key: "brief",    label: "Brief & Content" },
  { key: "audience", label: "Target Audience" },
  { key: "budget",   label: "Budget & Dates" },
  { key: "review",   label: "Review" },
];

export default function NewCampaignPage() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    productName: "",
    productCategory: "",
    brief: "",
    contentTypes: ["video"] as string[],
    tone: "",
    requiredHashtags: "",
    targetCategories: [] as string[],
    targetCities: [] as string[],
    minFollowers: 1000,
    maxFollowers: 10000,
    influencerCount: 10,
    budgetPerInfluencer: 2500,
    productDelivery: "physical",
    isFlashCampaign: false,
    flashTime: "20:00",
    applicationDeadline: "",
    publishStartDate: "",
    publishEndDate: "",
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const totalBudget = form.influencerCount * form.budgetPerInfluencer;
  const platformFee = totalBudget * (PLATFORM_FEE_RATE / 100);
  const grandTotal = totalBudget + platformFee;

  async function handleSave(submitForPayment: boolean) {
    setError(null);
    setSubmitting(true);
    const result = await createCampaign({
      title: form.title,
      productName: form.productName,
      productCategory: form.productCategory,
      brief: form.brief,
      contentTypes: form.contentTypes,
      tone: form.tone || null,
      requiredHashtags: form.requiredHashtags
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
      targetCategories: form.targetCategories,
      targetCities: form.targetCities,
      contentLanguage: ["tr"],
      minFollowers: form.minFollowers,
      maxFollowers: form.maxFollowers,
      influencerCount: form.influencerCount,
      budgetPerInfluencer: form.budgetPerInfluencer,
      productDelivery: form.productDelivery,
      applicationDeadline: form.applicationDeadline,
      publishStartDate: form.publishStartDate,
      publishEndDate: form.publishEndDate,
      isFlashCampaign: form.isFlashCampaign,
      flashPublishTime: form.isFlashCampaign ? form.flashTime : null,
      submitForPayment,
    });
    if (!result.ok) {
      const valErrors = result.validationErrors
        ?.map((e) => `${e.propertyName}: ${e.errorMessage}`)
        .join("; ");
      setError(valErrors || result.error || "An error occurred");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Create New Campaign"
        description="Set up your campaign in 5 steps and submit for review."
        breadcrumbs={[
          { href: "/brand/campaigns", label: "Campaigns" },
          { label: "New" },
        ]}
      />

      <ol className="mb-3 flex items-center gap-2 overflow-x-auto sm:mb-6">
        {STEPS.map((s, i) => (
          <li key={s.key} className="flex items-center gap-2 whitespace-nowrap text-small">
            <button
              onClick={() => setStep(i)}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold transition-colors",
                i < step && "bg-success text-success-foreground",
                i === step && "bg-primary text-primary-foreground",
                i > step && "bg-muted text-muted-foreground",
              )}
              aria-label={s.label}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </button>
            <span className={cn("hidden sm:inline", i === step ? "font-semibold" : "text-muted-foreground")}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 h-px w-4 bg-border sm:mx-2 sm:w-8" />
            )}
          </li>
        ))}
      </ol>
      <div className="mb-4 text-small font-semibold sm:hidden">
        Step {step + 1} / {STEPS.length}: {STEPS[step]?.label}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="card-folkie p-6">
          {step === 0 && <StepBasics form={form} update={update} />}
          {step === 1 && <StepBrief form={form} update={update} />}
          {step === 2 && <StepAudience form={form} update={update} />}
          {step === 3 && <StepBudget form={form} update={update} />}
          {step === 4 && <StepReview form={form} totalBudget={totalBudget} platformFee={platformFee} grandTotal={grandTotal} />}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-small disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-small font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                {error && (
                  <p className="text-caption text-destructive">{error}</p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSave(false)}
                    disabled={submitting}
                    className="rounded-full border border-border px-4 py-2 text-small disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Save as draft"}
                  </button>
                  <button
                    onClick={() => handleSave(true)}
                    disabled={submitting}
                    className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-small font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Submit for Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Summary sidebar */}
        <aside className="card-folkie h-fit p-5">
          <h3 className="text-body font-semibold">Summary</h3>
          <dl className="mt-4 space-y-3 text-small">
            <SummaryRow label="Title" value={form.title || "—"} />
            <SummaryRow label="Category" value={form.productCategory || "—"} />
            <SummaryRow label="Creators" value={`${form.influencerCount}`} />
            <SummaryRow label="Per creator" value={formatTRY(form.budgetPerInfluencer)} />
            <div className="border-t border-border pt-3">
              <SummaryRow label="Content total" value={formatTRY(totalBudget)} />
              <SummaryRow label={`Folkie fee (${PLATFORM_FEE_RATE}%)`} value={formatTRY(platformFee)} muted />
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-caption text-muted-foreground">Grand total</span>
                <span className="text-h3 font-bold text-primary">{formatTRY(grandTotal)}</span>
              </div>
            </div>
          </dl>
          {form.isFlashCampaign && (
            <div className="mt-4 rounded-xl bg-accent/20 p-3 text-caption">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Zap className="h-3 w-3" /> Flash Campaign
              </span>
              <p className="mt-1 text-muted-foreground">
                All approved creators go live simultaneously at {form.flashTime}.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-caption text-muted-foreground">{label}</span>
      <span className={cn("text-right font-medium", muted && "text-muted-foreground")}>
        {value}
      </span>
    </div>
  );
}

// ─── STEP COMPONENTS ─────────────────────────────────────────────

type Update = <K extends keyof FormState>(k: K, v: FormState[K]) => void;
type FormState = ReturnType<typeof useFormState>;
function useFormState() {
  return {
    title: "",
    productName: "",
    productCategory: "",
    brief: "",
    contentTypes: ["video"] as string[],
    tone: "",
    requiredHashtags: "",
    targetCategories: [] as string[],
    targetCities: [] as string[],
    minFollowers: 1000,
    maxFollowers: 10000,
    influencerCount: 10,
    budgetPerInfluencer: 2500,
    productDelivery: "physical",
    isFlashCampaign: false,
    flashTime: "20:00",
    applicationDeadline: "",
    publishStartDate: "",
    publishEndDate: "",
  };
}

function StepBasics({ form, update }: { form: FormState; update: Update }) {
  return (
    <div className="space-y-5">
      <h3>Campaign Info</h3>

      <Field label="Campaign Title" required>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Summer Collection Launch"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product Name" required>
          <input
            type="text"
            value={form.productName}
            onChange={(e) => update("productName", e.target.value)}
            placeholder="e.g. Blue Crop Jacket"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Field>

        <Field label="Product Category" required>
          <select
            value={form.productCategory}
            onChange={(e) => update("productCategory", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select...</option>
            {KATEGORILER.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Product Delivery">
        <div className="flex gap-3">
          {URUN_TESLIM.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("productDelivery", opt.value)}
              className={cn(
                "rounded-xl border-2 px-4 py-3 text-small font-medium transition-colors",
                form.productDelivery === opt.value
                  ? "border-primary bg-primary-light text-primary"
                  : "border-border hover:border-primary/40",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function StepBrief({ form, update }: { form: FormState; update: Update }) {
  return (
    <div className="space-y-5">
      <h3>Brief & Content</h3>

      <Field
        label="Brief for creators"
        required
        hint="What should they say? What to show or avoid? How long?"
      >
        <textarea
          value={form.brief}
          onChange={(e) => update("brief", e.target.value)}
          rows={6}
          placeholder="e.g. Film a 30-second video using the product. Show it in the first 3 seconds. Keep audio on, shoot in daylight..."
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </Field>

      <Field label="Content type" hint="Multiple selections allowed.">
        <div className="flex flex-wrap gap-2">
          {ICERIK_TURLERI.map((t) => {
            const selected = form.contentTypes.includes(t.value);
            return (
              <button
                key={t.value}
                onClick={() =>
                  update(
                    "contentTypes",
                    selected
                      ? form.contentTypes.filter((c) => c !== t.value)
                      : [...form.contentTypes, t.value],
                  )
                }
                className={cn(
                  "rounded-full px-4 py-2 text-small transition-colors",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:border-primary",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tone">
          <select
            value={form.tone}
            onChange={(e) => update("tone", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select...</option>
            {TON_SECENEKLERI.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Required hashtags" hint="Comma-separated. No # needed.">
          <input
            type="text"
            value={form.requiredHashtags}
            onChange={(e) => update("requiredHashtags", e.target.value)}
            placeholder="folkie, summercollection, sale"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Field>
      </div>
    </div>
  );
}

function StepAudience({ form, update }: { form: FormState; update: Update }) {
  const toggleCategory = (v: string) =>
    update(
      "targetCategories",
      form.targetCategories.includes(v)
        ? form.targetCategories.filter((c) => c !== v)
        : [...form.targetCategories, v],
    );
  const toggleCity = (v: string) =>
    update(
      "targetCities",
      form.targetCities.includes(v)
        ? form.targetCities.filter((c) => c !== v)
        : [...form.targetCities, v],
    );

  return (
    <div className="space-y-5">
      <h3>Target Audience</h3>

      <Field label="Creator categories" hint="Which niches should represent your brand? Multiple allowed.">
        <div className="flex flex-wrap gap-2">
          {KATEGORILER.slice(0, 12).map((k) => {
            const selected = form.targetCategories.includes(k.value);
            return (
              <button
                key={k.value}
                onClick={() => toggleCategory(k.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-caption transition-colors",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:border-primary",
                )}
              >
                {k.label}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Cities" hint="Leave empty for all of Turkey.">
        <div className="flex flex-wrap gap-2">
          {SEHIRLER.slice(0, 10).map((c) => {
            const selected = form.targetCities.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCity(c)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-caption transition-colors",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:border-primary",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Min followers">
          <input
            type="number"
            min={1000}
            value={form.minFollowers}
            onChange={(e) => update("minFollowers", parseInt(e.target.value) || 0)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Field>
        <Field label="Max followers">
          <input
            type="number"
            value={form.maxFollowers}
            onChange={(e) => update("maxFollowers", parseInt(e.target.value) || 0)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Field>
      </div>

      <div className="rounded-xl bg-primary-light p-4 text-small">
        <span className="font-semibold text-primary">⭐ Nano tip:</span>{" "}
        <span className="text-foreground/80">
          Creators with 1,000–10,000 followers deliver higher engagement and authentic
          trust — the core value of Folkie.
        </span>
      </div>
    </div>
  );
}

function StepBudget({ form, update }: { form: FormState; update: Update }) {
  const totalBudget = form.influencerCount * form.budgetPerInfluencer;
  return (
    <div className="space-y-5">
      <h3>Budget & Dates</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Number of creators" required>
          <input
            type="number"
            min={1}
            value={form.influencerCount}
            onChange={(e) => update("influencerCount", parseInt(e.target.value) || 1)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Field>
        <Field label="Fee per creator (TL)" required>
          <input
            type="number"
            min={500}
            step={100}
            value={form.budgetPerInfluencer}
            onChange={(e) => update("budgetPerInfluencer", parseInt(e.target.value) || 0)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Field>
      </div>

      <div className="rounded-xl bg-muted/50 p-4 text-small">
        Total content fee: <span className="font-bold text-primary">{formatTRY(totalBudget)}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Application deadline" required>
          <input
            type="date"
            value={form.applicationDeadline}
            onChange={(e) => update("applicationDeadline", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Field>
        <Field label="Publish start" required>
          <input
            type="date"
            value={form.publishStartDate}
            onChange={(e) => update("publishStartDate", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Field>
        <Field label="Publish end" required>
          <input
            type="date"
            value={form.publishEndDate}
            onChange={(e) => update("publishEndDate", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Field>
      </div>

      <Field label="">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary">
          <input
            type="checkbox"
            checked={form.isFlashCampaign}
            onChange={(e) => update("isFlashCampaign", e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-primary"
          />
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <Zap className="h-4 w-4 text-accent-foreground" />
              Flash Campaign
            </div>
            <p className="mt-1 text-caption text-muted-foreground">
              All approved creators publish simultaneously at the set time. Viral impact multiplied.
            </p>
            {form.isFlashCampaign && (
              <input
                type="time"
                value={form.flashTime}
                onChange={(e) => update("flashTime", e.target.value)}
                className="mt-3 w-32 rounded-xl border border-border bg-background px-3 py-1.5 text-small focus:border-primary focus:outline-none"
              />
            )}
          </div>
        </label>
      </Field>
    </div>
  );
}

function StepReview({
  form,
  totalBudget,
  platformFee,
  grandTotal,
}: {
  form: FormState;
  totalBudget: number;
  platformFee: number;
  grandTotal: number;
}) {
  return (
    <div className="space-y-5">
      <h3>Review</h3>
      <p className="text-small text-muted-foreground">
        Check your details. Once submitted, an admin will review and payment instructions will appear.
      </p>

      <div className="space-y-4">
        <ReviewSection
          title="Campaign"
          rows={[
            ["Title", form.title || "—"],
            ["Product", form.productName || "—"],
            ["Category", form.productCategory || "—"],
            ["Delivery", URUN_TESLIM.find((u) => u.value === form.productDelivery)?.label ?? "—"],
          ]}
        />
        <ReviewSection
          title="Brief"
          rows={[
            ["Content type", form.contentTypes.join(", ") || "—"],
            ["Tone", TON_SECENEKLERI.find((t) => t.value === form.tone)?.label ?? "—"],
            ["Hashtags", form.requiredHashtags || "—"],
            ["Brief", form.brief.slice(0, 100) + (form.brief.length > 100 ? "..." : "") || "—"],
          ]}
        />
        <ReviewSection
          title="Target Audience"
          rows={[
            ["Categories", form.targetCategories.join(", ") || "All"],
            ["Cities", form.targetCities.join(", ") || "All of Turkey"],
            ["Followers", `${form.minFollowers.toLocaleString()} – ${form.maxFollowers.toLocaleString()}`],
          ]}
        />
        <ReviewSection
          title="Budget & Dates"
          rows={[
            ["Creators", `${form.influencerCount}`],
            ["Per creator", formatTRY(form.budgetPerInfluencer)],
            ["Content total", formatTRY(totalBudget)],
            [`Folkie fee (${PLATFORM_FEE_RATE}%)`, formatTRY(platformFee)],
            ["Grand total", formatTRY(grandTotal), true],
            ["Application deadline", form.applicationDeadline || "—"],
            ["Publish window", `${form.publishStartDate || "—"} → ${form.publishEndDate || "—"}`],
          ]}
        />
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, string, boolean?]>;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <h4 className="text-small font-semibold">{title}</h4>
      <dl className="mt-2 space-y-1.5 text-small">
        {rows.map(([label, value, highlight]) => (
          <div key={label} className="flex items-baseline justify-between gap-3">
            <dt className="text-caption text-muted-foreground">{label}</dt>
            <dd
              className={cn(
                "text-right",
                highlight && "text-body font-bold text-primary",
              )}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 flex items-baseline justify-between text-small font-medium">
          <span>
            {label} {required && <span className="text-destructive">*</span>}
          </span>
          {hint && (
            <span className="text-caption font-normal text-muted-foreground">
              {hint}
            </span>
          )}
        </label>
      )}
      {children}
    </div>
  );
}
