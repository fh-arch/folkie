import Link from "next/link";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatTRY, formatNumber } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface AdminApplication {
  id: string;
  status: "pending" | "approved" | "rejected" | "withdrawn";
  campaignId: string;
  campaignTitle: string;
  brandCompanyName: string;
  influencerProfileId: string;
  creatorHandle: string | null;
  creatorEmail: string;
  followerCount: number;
  amount: number;
  rejectionReason: string | null;
  appliedAt: string;
  reviewedAt: string | null;
}

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminApplicationsPage({ searchParams }: PageProps) {
  const { status } = await searchParams;

  let apps: AdminApplication[] = [];
  let fetchError: string | null = null;
  try {
    const qs = status ? `?status=${status}` : "";
    apps = await apiFetch<AdminApplication[]>(
      `${ENDPOINTS.admin.applications()}${qs}`,
    );
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  if (apps.length === 0) {
    return (
      <div>
        <PageHeader
          title="Tüm Başvurular"
          description="Platform genelindeki her başvuru — marka × creator eşleşmeleri."
        />
        <section className="card-folkie">
          <EmptyState
            icon={FileText}
            title={fetchError ? "Yüklenemedi" : "Henüz başvuru yok"}
            description={
              fetchError ?? "Bir creator kampanyaya başvurduğunda burada görünecek."
            }
            size="lg"
          />
        </section>
      </div>
    );
  }

  const counts = {
    total: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  const filters = [
    { key: "all", label: "Tümü", count: counts.total, href: "/admin/applications" },
    {
      key: "pending",
      label: "Bekliyor",
      count: counts.pending,
      href: "/admin/applications?status=pending",
    },
    {
      key: "approved",
      label: "Onaylanmış",
      count: counts.approved,
      href: "/admin/applications?status=approved",
    },
    {
      key: "rejected",
      label: "Reddedilmiş",
      count: counts.rejected,
      href: "/admin/applications?status=rejected",
    },
  ];
  const activeFilter = status ?? "all";

  return (
    <div>
      <PageHeader
        title="Tüm Başvurular"
        description={`${counts.total} başvuru — ${counts.pending} inceleme bekliyor`}
      />

      <section className="card-folkie p-4 sm:p-5">
        <nav className="-mx-1 flex items-center gap-1 overflow-x-auto border-b border-border pb-4">
          {filters.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <Link
                key={f.key}
                href={f.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-small font-medium ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
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

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-small">
            <thead>
              <tr className="border-b border-border text-left text-caption text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Creator</th>
                <th className="py-3 pr-4 font-medium">Kampanya</th>
                <th className="py-3 pr-4 font-medium">Marka</th>
                <th className="py-3 pr-4 font-medium">Tutar</th>
                <th className="py-3 pr-4 font-medium">Durum</th>
                <th className="py-3 pr-4 font-medium">Başvuru</th>
                <th className="py-3 font-medium">İnceleme</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="py-3 pr-4">
                    <div className="font-semibold">
                      {a.creatorHandle ?? "(TikTok yok)"}
                    </div>
                    <div className="text-caption text-muted-foreground">
                      {a.creatorEmail} • {formatNumber(a.followerCount)} takipçi
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/campaigns?status=${a.status === "approved" || a.status === "pending" ? "active" : "all"}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {a.campaignTitle}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {a.brandCompanyName}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-primary">
                    {formatTRY(a.amount)}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge variant={a.status} />
                    {a.rejectionReason && (
                      <div className="mt-1 text-caption text-destructive/80">
                        {a.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-caption text-muted-foreground">
                    {new Date(a.appliedAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="py-3 text-caption text-muted-foreground">
                    {a.reviewedAt
                      ? new Date(a.reviewedAt).toLocaleDateString("tr-TR")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
