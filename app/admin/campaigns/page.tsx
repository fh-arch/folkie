import Link from "next/link";
import { Megaphone, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatTRY, formatNumber } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface AdminCampaign {
  id: string;
  title: string;
  productCategory: string;
  status: string;
  brandProfileId: string;
  brandCompanyName: string;
  brandEmail: string;
  influencerCount: number;
  budgetPerInfluencer: number;
  totalBudget: number;
  applicationCount: number;
  approvedCount: number;
  isFlashCampaign: boolean;
  applicationDeadline: string;
  createdAt: string;
}

const STATUS_FOR_BADGE: Record<
  string,
  "draft" | "pending" | "active" | "in_progress" | "completed" | "cancelled"
> = {
  draft: "draft",
  pendingpayment: "pending",
  active: "active",
  applicationsclosed: "in_progress",
  inprogress: "in_progress",
  completed: "completed",
  cancelled: "cancelled",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminCampaignsPage({ searchParams }: PageProps) {
  const { status } = await searchParams;

  let campaigns: AdminCampaign[] = [];
  let fetchError: string | null = null;
  try {
    const qs = status ? `?status=${status}` : "";
    campaigns = await apiFetch<AdminCampaign[]>(
      `${ENDPOINTS.admin.campaigns()}${qs}`,
    );
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  if (campaigns.length === 0) {
    return (
      <div>
        <PageHeader
          title="Tüm Kampanyalar"
          description="Platform genelindeki bütün kampanyalar."
        />
        <section className="card-folkie">
          <EmptyState
            icon={Megaphone}
            title={fetchError ? "Yüklenemedi" : "Henüz kampanya yok"}
            description={
              fetchError ?? "Bir marka kampanya oluşturduğunda burada görünecek."
            }
            size="lg"
          />
        </section>
      </div>
    );
  }

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(
      (c) => c.status === "active" || c.status === "inprogress",
    ).length,
    draft: campaigns.filter((c) => c.status === "draft").length,
    completed: campaigns.filter((c) => c.status === "completed").length,
    totalBudget: campaigns.reduce((s, c) => s + c.totalBudget, 0),
  };

  const filters = [
    { key: "all", label: "Tümü", count: stats.total, href: "/admin/campaigns" },
    {
      key: "active",
      label: "Aktif",
      count: stats.active,
      href: "/admin/campaigns?status=active",
    },
    {
      key: "draft",
      label: "Taslak",
      count: stats.draft,
      href: "/admin/campaigns?status=draft",
    },
    {
      key: "completed",
      label: "Tamamlanan",
      count: stats.completed,
      href: "/admin/campaigns?status=completed",
    },
  ];
  const activeFilter = status ?? "all";

  return (
    <div>
      <PageHeader
        title="Tüm Kampanyalar"
        description={`${stats.total} kampanya — toplam ${formatTRY(stats.totalBudget)} bütçe`}
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
                <th className="py-3 pr-4 font-medium">Kampanya</th>
                <th className="py-3 pr-4 font-medium">Marka</th>
                <th className="py-3 pr-4 font-medium">Durum</th>
                <th className="py-3 pr-4 font-medium">Bütçe</th>
                <th className="py-3 pr-4 font-medium">Doluluk</th>
                <th className="py-3 pr-4 font-medium">Başvuru</th>
                <th className="py-3 pr-4 font-medium">Oluşturma</th>
                <th className="py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const fill =
                  c.influencerCount > 0
                    ? Math.round((c.approvedCount / c.influencerCount) * 100)
                    : 0;
                return (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {c.isFlashCampaign && (
                          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                            ⚡
                          </span>
                        )}
                        <div>
                          <div className="font-semibold">{c.title}</div>
                          <div className="text-caption text-muted-foreground">
                            {c.productCategory}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="text-small">{c.brandCompanyName}</div>
                      <div className="text-caption text-muted-foreground">
                        {c.brandEmail}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge
                        variant={STATUS_FOR_BADGE[c.status] ?? "draft"}
                      />
                    </td>
                    <td className="py-3 pr-4 font-semibold text-primary">
                      {formatTRY(c.totalBudget)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${Math.min(fill, 100)}%` }}
                          />
                        </div>
                        <span className="text-caption text-muted-foreground">
                          {c.approvedCount}/{c.influencerCount}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-caption text-muted-foreground">
                      {formatNumber(c.applicationCount)}
                    </td>
                    <td className="py-3 pr-4 text-caption text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-3"></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
