import Link from "next/link";
import { Plus, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { CampaignsTable, type CampaignRow } from "./CampaignsTable";

interface PageProps {
  searchParams: Promise<{ status?: string; tab?: string }>;
}

const STATUS_MAP: Record<string, string> = {
  active: "active",
  pending: "pending_payment",
  draft: "draft",
  completed: "completed",
};

export default async function BrandCampaignsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeTab = params.status ?? "all";

  // Always fetch all to compute accurate tab counts; filter client-side
  let allCampaigns: CampaignRow[] = [];
  let fetchError: string | null = null;
  try {
    allCampaigns = await apiFetch<CampaignRow[]>(ENDPOINTS.brand.campaigns());
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  const filterStatus = params.status ? STATUS_MAP[params.status] : undefined;
  const campaigns = filterStatus
    ? allCampaigns.filter((c) => c.status === filterStatus)
    : allCampaigns;

  // Show empty-state only when there are no campaigns at all (not just filtered out)
  if (allCampaigns.length === 0) {
    return (
      <div>
        <PageHeader
          title="Campaigns"
          description="Track all your campaigns in one list."
          breadcrumbs={[{ label: "Campaigns" }]}
        />
        <section className="card-folkie">
          <EmptyState
            icon={Megaphone}
            title={fetchError ? "Could not load campaigns" : "No campaigns yet"}
            description={
              fetchError
                ? `Backend error: ${fetchError}. Check if the backend is running.`
                : "Create your first campaign — ready in 5 steps. Creators will start applying."
            }
            primaryAction={{
              href: "/brand/campaigns/new",
              label: "Create First Campaign",
              icon: Plus,
            }}
            size="lg"
          />
        </section>
      </div>
    );
  }

  // Counts computed from ALL campaigns (not filtered view)
  const counts = {
    all: allCampaigns.length,
    active: allCampaigns.filter((c) => c.status === "active").length,
    pending: allCampaigns.filter((c) => c.status === "pending_payment").length,
    draft: allCampaigns.filter((c) => c.status === "draft").length,
    completed: allCampaigns.filter((c) => c.status === "completed").length,
  };

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Track all campaigns in one list — applications, content, payments."
        breadcrumbs={[{ label: "Campaigns" }]}
        actions={
          <Link
            href="/brand/campaigns/new"
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hover:bg-primary/90 sm:px-5 sm:py-2.5"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Campaign</span>
            <span className="sm:hidden">New</span>
          </Link>
        }
      />

      <section className="card-folkie p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4 sm:gap-4">
          <nav className="-mx-1 flex w-full items-center gap-1 overflow-x-auto pb-1 sm:w-auto sm:overflow-visible sm:pb-0">
            {[
              { key: "all", label: "All", count: counts.all, href: "/brand/campaigns" },
              { key: "active", label: "Active", count: counts.active, href: "/brand/campaigns?status=active" },
              { key: "pending", label: "Pending Payment", count: counts.pending, href: "/brand/campaigns?status=pending" },
              { key: "draft", label: "Draft", count: counts.draft, href: "/brand/campaigns?status=draft" },
              { key: "completed", label: "Completed", count: counts.completed, href: "/brand/campaigns?status=completed" },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-small font-medium ${
                    isActive
                      ? "bg-primary-light text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </Link>
              );
            })}
          </nav>

        </div>

        <CampaignsTable campaigns={campaigns} />
      </section>
    </div>
  );
}
