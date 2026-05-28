import Link from "next/link";
import {
  Building2,
  ExternalLink,
  Mail,
  Phone,
  Hash,
  Globe,
  Calendar,
  CheckCircle2,
  Clock,
  Ban,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatTRY } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { BrandModerationActions } from "./ModerationActions";

interface AdminBrand {
  userId: string;
  brandProfileId: string;
  email: string;
  fullName: string | null;
  brandName: string;
  industry: string | null;
  website: string | null;
  taxId: string | null;
  contactName: string | null;
  contactPhone: string | null;
  isVerified: boolean;
  isActive: boolean;
  campaignCount: number;
  totalSpent: number;
  createdAt: string;
}

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function AdminBrandsPage({ searchParams }: PageProps) {
  const { filter } = await searchParams;
  const activeFilter = filter ?? "pending";

  let brands: AdminBrand[] = [];
  let fetchError: string | null = null;
  try {
    brands = await apiFetch<AdminBrand[]>(
      `${ENDPOINTS.admin.brands()}?filter=${activeFilter}`,
    );
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  // Always fetch all to get accurate filter counts (cheap; brands are small set)
  const [pendingList, verifiedList, suspendedList] = await Promise.all([
    apiFetch<AdminBrand[]>(`${ENDPOINTS.admin.brands()}?filter=pending`).catch(() => []),
    apiFetch<AdminBrand[]>(`${ENDPOINTS.admin.brands()}?filter=verified`).catch(() => []),
    apiFetch<AdminBrand[]>(`${ENDPOINTS.admin.brands()}?filter=suspended`).catch(() => []),
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
        title="Markalar"
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
                href={`/admin/brandlar?filter=${f.key}`}
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

        {brands.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={Building2}
              title={fetchError ? "Yüklenemedi" : "Bu kategoride marka yok"}
              description={
                fetchError ??
                (activeFilter === "pending"
                  ? "Yeni markalar kaydolduğunda burada onaya düşer."
                  : activeFilter === "verified"
                    ? "Henüz onaylanmış marka yok."
                    : "Askıya alınmış marka yok.")
              }
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {brands.map((b) => (
              <li
                key={b.brandProfileId}
                className="rounded-2xl border border-border bg-background p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/users/${b.userId}`}
                        className="text-body font-semibold hover:text-primary hover:underline"
                      >
                        {b.brandName}
                      </Link>
                      {b.isVerified && (
                        <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-caption font-semibold text-success">
                          <CheckCircle2 className="h-3 w-3" />
                          Onaylı
                        </span>
                      )}
                      {!b.isActive && (
                        <span className="flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-caption font-semibold text-destructive">
                          <Ban className="h-3 w-3" />
                          Askıda
                        </span>
                      )}
                      {b.industry && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-caption text-muted-foreground">
                          {b.industry}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 grid gap-2 text-caption text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
                      <Field icon={Mail} value={b.email} />
                      {b.contactName && <Field icon={Building2} value={b.contactName} />}
                      {b.contactPhone && <Field icon={Phone} value={b.contactPhone} />}
                      {b.taxId && <Field icon={Hash} value={`VKN: ${b.taxId}`} />}
                      {b.website && (
                        <Field
                          icon={Globe}
                          value={
                            <a
                              href={
                                b.website.startsWith("http")
                                  ? b.website
                                  : `https://${b.website}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              {b.website}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          }
                        />
                      )}
                      <Field
                        icon={Calendar}
                        value={`Kayıt: ${new Date(b.createdAt).toLocaleDateString("tr-TR")}`}
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-caption">
                      <span className="text-muted-foreground">
                        Kampanya:{" "}
                        <span className="font-semibold text-foreground">
                          {b.campaignCount}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Bütçe:{" "}
                        <span className="font-semibold text-primary">
                          {formatTRY(b.totalSpent)}
                        </span>
                      </span>
                    </div>
                  </div>

                  <BrandModerationActions
                    brandId={b.brandProfileId}
                    isVerified={b.isVerified}
                    isActive={b.isActive}
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
