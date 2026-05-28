import Link from "next/link";
import { Video, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface AdminSubmission {
  id: string;
  status: "submitted" | "revisionrequested" | "approved" | "published";
  applicationId: string;
  campaignId: string;
  campaignTitle: string;
  brandCompanyName: string;
  creatorHandle: string | null;
  creatorEmail: string;
  videoUrl: string | null;
  externalVideoUrl: string | null;
  revisionNote: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  publishedAt: string | null;
}

const STATUS_VARIANT: Record<
  string,
  "pending" | "in_progress" | "approved" | "published" | "revision"
> = {
  submitted: "pending",
  revisionrequested: "revision",
  approved: "approved",
  published: "published",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminSubmissionsPage({ searchParams }: PageProps) {
  const { status } = await searchParams;

  let subs: AdminSubmission[] = [];
  let fetchError: string | null = null;
  try {
    const qs = status ? `?status=${status}` : "";
    subs = await apiFetch<AdminSubmission[]>(
      `${ENDPOINTS.admin.submissions()}${qs}`,
    );
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  if (subs.length === 0) {
    return (
      <div>
        <PageHeader
          title="Tüm İçerikler"
          description="Creator'ların teslim ettiği tüm UGC içerikleri."
        />
        <section className="card-folkie">
          <EmptyState
            icon={Video}
            title={fetchError ? "Yüklenemedi" : "Henüz içerik teslimi yok"}
            description={
              fetchError ?? "Onaylanan creator'lar içerik yüklediğinde burada görünecek."
            }
            size="lg"
          />
        </section>
      </div>
    );
  }

  const counts = {
    total: subs.length,
    submitted: subs.filter((s) => s.status === "submitted").length,
    revision: subs.filter((s) => s.status === "revisionrequested").length,
    approved: subs.filter((s) => s.status === "approved").length,
    published: subs.filter((s) => s.status === "published").length,
  };

  const filters = [
    { key: "all", label: "Tümü", count: counts.total, href: "/admin/content" },
    {
      key: "submitted",
      label: "İnceleme Bekliyor",
      count: counts.submitted,
      href: "/admin/content?status=submitted",
    },
    {
      key: "revisionrequested",
      label: "Revizyon İstendi",
      count: counts.revision,
      href: "/admin/content?status=revisionrequested",
    },
    {
      key: "approved",
      label: "Onaylı",
      count: counts.approved,
      href: "/admin/content?status=approved",
    },
    {
      key: "published",
      label: "Yayında",
      count: counts.published,
      href: "/admin/content?status=published",
    },
  ];
  const activeFilter = status ?? "all";

  return (
    <div>
      <PageHeader
        title="Tüm İçerikler"
        description={`${counts.total} teslim — ${counts.submitted} inceleme bekliyor, ${counts.published} yayında`}
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
                <th className="py-3 pr-4 font-medium">İçerik</th>
                <th className="py-3 pr-4 font-medium">Creator</th>
                <th className="py-3 pr-4 font-medium">Kampanya</th>
                <th className="py-3 pr-4 font-medium">Marka</th>
                <th className="py-3 pr-4 font-medium">Durum</th>
                <th className="py-3 pr-4 font-medium">Tarih</th>
                <th className="py-3 font-medium">Link</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="py-3 pr-4">
                    {s.videoUrl ? (
                      <a
                        href={s.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-caption text-primary hover:underline"
                      >
                        Video
                      </a>
                    ) : (
                      <span className="text-caption text-muted-foreground">
                        (video yok)
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-semibold">
                      {s.creatorHandle ?? "(TikTok yok)"}
                    </div>
                    <div className="text-caption text-muted-foreground">
                      {s.creatorEmail}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-small">{s.campaignTitle}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {s.brandCompanyName}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge
                      variant={STATUS_VARIANT[s.status] ?? "pending"}
                    />
                    {s.revisionNote && (
                      <div className="mt-1 text-caption text-warning">
                        {s.revisionNote}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-caption text-muted-foreground">
                    {s.publishedAt
                      ? `Yay: ${new Date(s.publishedAt).toLocaleDateString("tr-TR")}`
                      : new Date(s.submittedAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="py-3">
                    {s.externalVideoUrl ? (
                      <a
                        href={s.externalVideoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-caption text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        TikTok
                      </a>
                    ) : (
                      <span className="text-caption text-muted-foreground">—</span>
                    )}
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
