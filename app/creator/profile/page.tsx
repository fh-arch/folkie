"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  MapPin,
  Tag,
  Globe,
  CreditCard,
  CheckCircle2,
  Trophy,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { KATEGORILER, SEHIRLER } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";
import {
  getCreatorProfile,
  saveCreatorProfile,
  type CreatorProfileRead,
} from "./actions";

export default function CreatorProfilePage() {
  const searchParams = useSearchParams();
  const [showIban, setShowIban] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tiktokMsg, setTiktokMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profile, setProfile] = useState<CreatorProfileRead | null>(null);

  const [form, setForm] = useState({
    bio: "",
    city: "",
    categories: [] as string[],
    languages: ["tr"] as string[],
    iban: "",
    ibanName: "",
  });

  useEffect(() => {
    const tiktok = searchParams.get("tiktok");
    if (tiktok === "connected") {
      setTiktokMsg({ type: "success", text: "TikTok account connected successfully!" });
    } else if (tiktok === "error") {
      const msg = searchParams.get("msg") ?? "TikTok connection failed.";
      setTiktokMsg({ type: "error", text: msg });
    }
  }, [searchParams]);

  useEffect(() => {
    getCreatorProfile()
      .then((p) => {
        setProfile(p);
        if (p) {
          setForm({
            bio: p.bio ?? "",
            city: p.city ?? "",
            categories: p.categories,
            languages: p.contentLanguage.length ? p.contentLanguage : ["tr"],
            iban: "",
            ibanName: p.ibanName ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const result = await saveCreatorProfile({
      bio: form.bio || null,
      city: form.city || null,
      categories: form.categories,
      subcategories: [],
      contentLanguage: form.languages,
      iban: form.iban || null,
      ibanName: form.ibanName || null,
    });
    setSaving(false);
    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      const fresh = await getCreatorProfile();
      if (fresh) setProfile(fresh);
    } else {
      setError(result.error ?? "Unknown error");
    }
  }

  function toggleCategory(value: string) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(value)
        ? f.categories.filter((c) => c !== value)
        : f.categories.length < 5
          ? [...f.categories, value]
          : f.categories,
    }));
  }

  function toggleLanguage(value: string) {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(value)
        ? f.languages.filter((l) => l !== value)
        : [...f.languages, value],
    }));
  }

  const completion = computeCompletion(form, profile);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="The information brands use to find you. Complete it to improve your match rate."
        breadcrumbs={[{ label: "My Profile" }]}
      />

      {completion < 100 && (
        <section className="mb-5 flex items-center gap-4 rounded-2xl border border-warning/30 bg-warning/10 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warning/20 text-warning">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="text-small font-semibold">
                Profile {completion}% complete
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-warning"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="card-folkie p-6">
            <h3>Identity</h3>
            <div className="mt-4">
              <AvatarUpload fallbackInitial="C" size={80} />
            </div>

            <Field label="Bio" hint={`${form.bio.length}/200`}>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bio: e.target.value }))
                }
                maxLength={200}
                placeholder="I create lifestyle & travel content. Based in Istanbul. Authentic, real storytelling."
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </Field>
          </section>

          <section className="card-folkie p-6">
            <h3>Categories &amp; Location</h3>
            <p className="mt-1 text-small text-muted-foreground">
              Brands use this information to find you.
            </p>

            <Field label="City">
              <select
                value={form.city}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select city...</option>
                {SEHIRLER.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label={`Kategoriler (${form.categories.length}/5)`}
              hint="Pick up to 5."
            >
              <div className="flex flex-wrap gap-2">
                {KATEGORILER.slice(0, 14).map((k) => {
                  const selected = form.categories.includes(k.value);
                  return (
                    <button
                      key={k.value}
                      type="button"
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

            <Field label="Content language">
              <div className="flex gap-2">
                {[
                  { value: "tr", label: "Turkish" },
                  { value: "en", label: "English" },
                  { value: "ar", label: "Arabic" },
                ].map((l) => {
                  const selected = form.languages.includes(l.value);
                  return (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => toggleLanguage(l.value)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-small transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "border border-border hover:border-primary",
                      )}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </Field>
          </section>

          <section className="card-folkie p-6">
            <h3>TikTok Account</h3>
            {profile?.tiktokHandle ? (
              <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-success/30 bg-success/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-small font-semibold">
                      Connected: {profile.tiktokHandle}
                    </div>
                    <div className="text-caption text-muted-foreground">
                      Last sync:{" "}
                      {profile.lastTiktokSync
                        ? new Date(profile.lastTiktokSync).toLocaleString(
                            "en-GB",
                          )
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {tiktokMsg && (
                  <div className={`rounded-2xl p-3 text-small ${tiktokMsg.type === "success" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {tiktokMsg.text}
                  </div>
                )}
                <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4 text-small">
                  <p className="font-semibold text-warning">TikTok not connected</p>
                  <p className="mt-1 text-foreground/70">
                    When you connect, your follower count, engagement rate, and last 20
                    video metrics sync automatically. Your campaign match rate doubles.
                  </p>
                  <button
                    onClick={() => {
                      const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
                      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://folkie.com.tr";
                      const redirectUri = `${appUrl}/creator/tiktok-callback`;
                      const state = Math.random().toString(36).slice(2);
                      sessionStorage.setItem("tiktok_state", state);

                      if (!clientKey) {
                        // Sandbox / demo mode — use mock TikTok auth page
                        window.location.href =
                          `/mock-tiktok-auth?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
                        return;
                      }

                      window.location.href =
                        `https://www.tiktok.com/v2/auth/authorize/` +
                        `?client_key=${clientKey}` +
                        `&scope=user.info.basic,user.info.stats` +
                        `&response_type=code` +
                        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                        `&state=${state}`;
                    }}
                    className="mt-3 rounded-full bg-primary px-4 py-2 text-caption font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Connect TikTok
                  </button>
                </div>

                {/* Bot / fake-follower analizi açıklaması */}
                <div className="rounded-2xl border border-primary/20 bg-primary-light p-4 text-small">
                  <p className="font-semibold text-primary">
                    🔍 What is fake follower analysis?
                  </p>
                  <p className="mt-1 text-foreground/70">
                    When you connect your TikTok, we automatically run these checks:
                  </p>
                  <ul className="mt-2 space-y-1 text-caption text-foreground/70">
                    <li>• Follower-engagement ratio (real accounts: 5–10%)</li>
                    <li>• Follower growth curve (sudden spikes = bought followers)</li>
                    <li>• Comment quality (AI analysis: spam or genuine?)</li>
                    <li>• Account age vs. follower count ratio</li>
                  </ul>
                  <p className="mt-2 text-caption text-foreground/70">
                    Score 0–100: <strong>≤30 = clean</strong>, 31–60 = suspicious,
                    &gt;60 = not approved. Hidden on your profile; used only for
                    brand matching.
                  </p>
                </div>
              </div>
            )}

            {profile?.tiktokHandle && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-muted/50 p-4 text-center">
                  <div className="text-h3 font-bold">
                    {formatNumber(profile.followerCount)}
                  </div>
                  <div className="text-caption text-muted-foreground">
                    Followers
                  </div>
                </div>
                <div className="rounded-2xl bg-muted/50 p-4 text-center">
                  <div className="text-h3 font-bold text-success">
                    {profile.engagementRate}%
                  </div>
                  <div className="text-caption text-muted-foreground">
                    Engagement rate
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="card-folkie p-6">
            <h3>Payment Details</h3>
            <p className="mt-1 text-small text-muted-foreground">
              Campaign payments are sent to this IBAN. Folkie admin transfers
              manually. Your details are encrypted.
              {profile?.hasIban && (
                <span className="ml-1 font-semibold text-success">
                  ✓ IBAN on file.
                </span>
              )}
            </p>

            <Field label="Account holder name">
              <Input
                value={form.ibanName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ibanName: e.target.value }))
                }
                placeholder="Ad Soyad"
              />
            </Field>

            <Field
              label={profile?.hasIban ? "New IBAN (replaces current)" : "IBAN"}
              hint="TR + 24 digits = 26 characters"
            >
              <div className="relative">
                <Input
                  type={showIban ? "text" : "password"}
                  value={form.iban}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, iban: e.target.value.toUpperCase().replace(/\s/g, "") }))
                  }
                  placeholder={
                    profile?.hasIban
                      ? "•••••••••••••••••••••••••"
                      : "TR000000000000000000000000"
                  }
                  maxLength={26}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowIban((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showIban ? "Hide" : "Show"}
                >
                  {showIban ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.iban.length > 0 && !/^TR\d{24}$/.test(form.iban) && (
                <p className="mt-1 text-caption text-destructive">
                  Invalid format. Must be 26 characters starting with TR (e.g. TR330006100519786457841326)
                </p>
              )}
            </Field>
          </section>

          {error && (
            <div className="rounded-xl bg-destructive/10 p-3 text-small text-destructive">
              {error}
            </div>
          )}
          {saved && (
            <div className="rounded-xl bg-success/10 p-3 text-small text-success">
              ✓ Profile saved
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || form.categories.length === 0}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-small font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>

        <aside className="space-y-5">
          <section className="card-navy">
            <div className="flex items-center gap-2 text-caption text-navy-foreground/70">
              <Trophy className="h-3.5 w-3.5 text-accent" />
              Folkie Stars
            </div>
            <div className="mt-2 text-h2 font-bold text-navy-foreground">
              Rising ⭐
            </div>
            <div className="mt-1 text-caption text-navy-foreground/60">
              Complete your first campaign and earn a badge
            </div>
          </section>

          <section className="card-folkie p-5">
            <h4 className="text-body font-semibold">My Stats</h4>
            <dl className="mt-3 space-y-2.5 text-small">
              <Stat icon={Users} label="Completed campaigns" value="0" />
              <Stat icon={Trophy} label="Avg. rating" value="—" />
              <Stat
                icon={Tag}
                label="Active categories"
                value={`${form.categories.length}`}
              />
              <Stat
                icon={Globe}
                label="Content languages"
                value={`${form.languages.length}`}
              />
              <Stat icon={MapPin} label="City" value={form.city || "—"} />
              <Stat
                icon={CreditCard}
                label="Payment info"
                value={profile?.hasIban ? "✓ Added" : "Missing"}
              />
            </dl>
          </section>

          <section className="rounded-2xl bg-primary-light p-4 text-caption">
            💡{" "}
            <span className="font-semibold text-primary">Tip:</span>{" "}
            <span className="text-foreground/70">
              The clearer your bio, the better your brand matches. Talk about
              your audience and content style.
            </span>
          </section>
        </aside>
      </div>
    </div>
  );
}

function computeCompletion(
  form: {
    bio: string;
    city: string;
    categories: string[];
    languages: string[];
    iban: string;
    ibanName: string;
  },
  profile: CreatorProfileRead | null,
): number {
  let done = 0;
  const total = 6;
  if (form.bio.length >= 10) done++;
  if (form.city) done++;
  if (form.categories.length > 0) done++;
  if (form.languages.length > 0) done++;
  if (profile?.hasIban || form.iban.length > 0) done++;
  if (profile?.tiktokHandle) done++;
  return Math.round((done / total) * 100);
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 first:mt-0">
      <label className="mb-1.5 flex items-baseline justify-between text-small font-medium">
        <span>{label}</span>
        {hint && (
          <span className="text-caption font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
        className,
      )}
    />
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
