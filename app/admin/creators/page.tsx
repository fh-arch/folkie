import Link from "next/link";
import {
  Music,
  Mail,
  MapPin,
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  Ban,
  Users,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatNumber } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { CreatorModerationActions } from "./ModerationActions";

interface AdminCreator {
  userId: string;
  influencerProfileId: string;
  email: string;
  fullName: string | null;
  tiktokHandle: string | null;
  followerCount: number;
  engagementRate: number;
  tier: string;
  city: string | null;
  categories: string[];
  hasIban: boolean;
  isVerified: boolean;
  isActive: boolean;
  applicationCount: number;
  approvedApplicationCount: number;
  createdAt: string;
}

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

const TIER_LABEL: Record<string, string> = {
  micro: "Micro",
  nano: "Nano",
  mid_tier: "Mid-Tier",
  macro: "Macro",
};

export default async function AdminCreatorsPage({ searchParams }: PageProps) {
  const { filter } = await searchParams;
  const activeFilter = filter ?? "pending";

  let creators: AdminCreator[] = [];
  let fetchError: string | null = null;
  try {
    creators = await apiFetch<AdminCreator[]>(
      `${ENDPOINTS.admin.creators()}?filter=${activeFilter}`,
    );
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  const [pendingList, verifiedList, suspendedList] = await Promise.all([
    apiFetch<AdminCreator[]>(`${ENDPOINTS.admin.creators()}?filter=pending`).catch(() => []),
    apiFetch<AdminCreator[]>(`${ENDPOINTS.admin.creators()}?filter=verified`).catch(() => []),
    apiFetch<AdminCreator[]>(`${ENDPOINTS.admin.creators()}?filter=suspended`).catch(() => []),
  ]);

  const counts = {
    pending: pendingList.length,
    verified: verifiedList.length,
    suspended: suspendedList.length,
  };

  const filters = [
    {
      key: "pending",
      label: "Onay Bekleyen",
      count: counts.pending,
      icon: Clock,
    },
    {
      key: "verified",
      label: "Onaylı",
      count: counts.verified,
      icon: CheckCircle2,
    },
    {
      key: "suspended",
      label: "Askıda",
      count: counts.suspended,
      icon: Ban,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Creator'lar"
        description={`${counts.pending} onay bekliyor, ${counts.verified} onaylı, ${counts.suspended} askıda`}
      />

      <section className="card-folkie p-4 sm:p-5">
        <nav className="-mx-1 flex items-center gap-1 overflow-x-auto border-b border-border pb-4">
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = activeFilter === f.key;
            return (
              <Link
                key={f.key}
                href={`/admin/creators?filter=${f.key}`}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-small font-medium ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {f.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {f.count}
                </span>
              </Link>
            );
          })}
        </nav>

        {creators.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={Music}
              title={fetchError ? "Yüklenemedi" : "Bu kategoride creator yok"}
              description={
                fetchError ??
                (activeFilter === "pending"
                  ? "Yeni creator'lar profilini tamamladığında burada onaya düşer."
                  : activeFilter === "verified"
                    ? "Henüz onaylanmış creator yok."
                    : "Askıya alınmış creator yok.")
              }
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {creators.map((c) => (
              <li
                key={c.influencerProfileId}
                className="rounded-2xl border border-border bg-background p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/users/${c.userId}`}
                        className="text-body font-semibold hover:text-primary hover:underline"
                      >
                        {c.fullName ?? c.email}
                      </Link>
                      {c.tiktokHandle ? (
                        <a
                          href={`https://www.tiktok.com/${c.tiktokHandle}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-accent/30 px-2 py-0.5 text-caption font-medium text-foreground hover:bg-accent/40"
                        >
                          {c.tiktokHandle}
                        </a>
                      ) : (
                        <span className="rounded-full bg-warning/15 px-2 py-0.5 text-caption font-semibold text-warning">
                          TikTok bağlı değil
                        </span>
                      )}
                      <span className="rounded-full bg-muted px-2 py-0.5 text-caption text-muted-foreground capitalize">
                        {TIER_LABEL[c.tier] ?? c.tier}
                      </span>
                      {c.isVerified && (
                        <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-caption font-semibold text-success">
                          <CheckCircle2 className="h-3 w-3" />
                          Onaylı
                        </span>
                      )}
                      {!c.isActive && (
                        <span className="flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-caption font-semibold text-destructive">
                          <Ban className="h-3 w-3" />
                          Askıda
                        </span>
                      )}
                    </div>

                    <div className="mt-3 grid gap-2 text-caption text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
                      <Field icon={Mail} value={c.email} />
                      {c.city && <Field icon={MapPin} value={c.city} />}
                      <Field
                        icon={Users}
                        value={`${formatNumber(c.followerCount)} takipçi`}
                      />
                      <Field
                        icon={TrendingUp}
                        value={`%${c.engagementRate.toFixed(1)} etkileşim`}
                      />
                      <Field
                        icon={Wallet}
                        value={c.hasIban ? "IBAN tanımlı" : "IBAN yok"}
                      />
                      <Field
                        icon={Calendar}
                        value={`Kayıt: ${new Date(c.createdAt).toLocaleDateString("tr-TR")}`}
                      />
                    </div>

                    {c.categories.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {c.categories.map((cat) => (
                          <span
                            key={cat}
                            className="rounded-full bg-muted px-2 py-0.5 text-caption text-foreground/70"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-4 text-caption">
                      <span className="text-muted-foreground">
                        Başvuru:{" "}
                        <span className="font-semibold text-foreground">
                          {c.applicationCount}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Onaylı:{" "}
                        <span className="font-semibold text-success">
                          {c.approvedApplicationCount}
                        </span>
                      </span>
                    </div>
                  </div>

                  <CreatorModerationActions
                    creatorId={c.influencerProfileId}
                    isVerified={c.isVerified}
                    isActive={c.isActive}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Field({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate">{value}</span>
    </div>
  );
}
