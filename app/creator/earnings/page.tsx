import { Wallet, Info, Handshake, Clock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatTRY } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface ApplicationRow {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandId: string;
  brandName: string;
  brandLogoUrl: string | null;
  amount: number;
  status: "pending" | "approved" | "rejected" | "withdrawn";
  rejectionReason: string | null;
  appliedAt: string;
  reviewedAt: string | null;
}

export default async function CreatorEarningsPage() {
  let apps: ApplicationRow[] = [];
  try {
    apps = await apiFetch<ApplicationRow[]>(ENDPOINTS.creator.applications());
  } catch {
    /* gracefully degrade */
  }

  if (apps.length === 0) {
    return (
      <div>
        <PageHeader
          title="Earnings"
          description="All your campaign income and payment statuses."
          breadcrumbs={[{ label: "Earnings" }]}
        />
        <section className="card-folkie">
          <EmptyState
            icon={Wallet}
            title="No earnings yet"
            description="Apply to campaigns and once approved, your earnings will appear here. Payments are manually transferred to your IBAN after the campaign completes."
            primaryAction={{
              href: "/creator/campaigns",
              label: "Discover Campaigns",
            }}
            size="lg"
          />
        </section>
      </div>
    );
  }

  const approvedApps = apps.filter((a) => a.status === "approved");
  const pendingApps = apps.filter((a) => a.status === "pending");

  const earnedTotal = approvedApps.reduce((s, a) => s + a.amount, 0);
  const pendingTotal = pendingApps.reduce((s, a) => s + a.amount, 0);
  const lifetimeTotal = earnedTotal + pendingTotal;

  const statusPriority: Record<ApplicationRow["status"], number> = {
    approved: 0,
    pending: 1,
    rejected: 2,
    withdrawn: 3,
  };
  const sorted = [...apps].sort((a, b) => {
    const p = statusPriority[a.status] - statusPriority[b.status];
    if (p !== 0) return p;
    return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
  });

  return (
    <div>
      <PageHeader
        title="Earnings"
        description="All your campaign income and payment statuses."
        breadcrumbs={[{ label: "Earnings" }]}
      />

      <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          icon={Wallet}
          label="Total Potential"
          value={formatTRY(lifetimeTotal)}
          delta={`${apps.length} application${apps.length !== 1 ? "s" : ""}`}
          accent
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Earned"
          value={formatTRY(earnedTotal)}
          delta={`${approvedApps.length} approved collaboration${approvedApps.length !== 1 ? "s" : ""}`}
          success
        />
        <SummaryCard
          icon={Clock}
          label="Pending"
          value={formatTRY(pendingTotal)}
          delta={`${pendingApps.length} under review`}
          warning
        />
      </section>

      <section className="mb-5 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary-light p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="text-small">
          <p className="font-semibold text-primary">Manual Payment System</p>
          <p className="mt-1 text-foreground/70">
            After your collaboration is approved and content is delivered, the Folkie
            admin team manually transfers your payment to your IBAN — typically within
            5 business days. You&apos;ll receive an email and in-app notification when it&apos;s sent.
          </p>
        </div>
      </section>

      <section className="card-folkie p-4 sm:p-5">
        <h3 className="text-body font-semibold">Collaboration History</h3>

        {/* Desktop table */}
        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="w-full text-small">
            <thead>
              <tr className="border-b border-border text-left text-caption text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Campaign</th>
                <th className="py-3 pr-4 font-medium">Brand</th>
                <th className="py-3 pr-4 font-medium">Amount</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Applied</th>
                <th className="py-3 font-medium">Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="py-4 pr-4">
                    <div className="font-semibold">{a.campaignTitle}</div>
                    {a.rejectionReason && (
                      <div className="mt-0.5 text-caption text-destructive/80">
                        Reason: {a.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-muted-foreground">
                    {a.brandName}
                  </td>
                  <td className="py-4 pr-4 font-bold text-primary">
                    {formatTRY(a.amount)}
                  </td>
                  <td className="py-4 pr-4">
                    <StatusBadge variant={a.status} />
                  </td>
                  <td className="py-4 pr-4 text-caption text-muted-foreground">
                    {new Date(a.appliedAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-4 text-caption text-muted-foreground">
                    {a.reviewedAt
                      ? new Date(a.reviewedAt).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-4 space-y-3 md:hidden">
          {sorted.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl border border-border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{a.campaignTitle}</div>
                  <div className="text-caption text-muted-foreground">{a.brandName}</div>
                </div>
                <div className="text-right">
                  <div className="text-body font-bold text-primary">{formatTRY(a.amount)}</div>
                  <StatusBadge variant={a.status} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-caption text-muted-foreground">
                <span>
                  Applied:{" "}
                  <span className="font-medium text-foreground">
                    {new Date(a.appliedAt).toLocaleDateString("en-GB")}
                  </span>
                </span>
                {a.reviewedAt && (
                  <span>
                    Reviewed:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(a.reviewedAt).toLocaleDateString("en-GB")}
                    </span>
                  </span>
                )}
              </div>

              {a.rejectionReason && (
                <div className="mt-2 text-caption text-destructive/80">
                  Reason: {a.rejectionReason}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="card-folkie mt-5 p-6 text-center">
        <Handshake className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-3 text-small text-muted-foreground">
          Apply to more campaigns and grow your income.
        </p>
        <a
          href="/creator/campaigns"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-small font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Discover Campaigns
        </a>
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  delta,
  accent,
  warning,
  success,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  accent?: boolean;
  warning?: boolean;
  success?: boolean;
}) {
  const bg = accent
    ? "bg-primary text-primary-foreground"
    : warning
      ? "bg-card border border-warning/30"
      : success
        ? "bg-card border border-success/30"
        : "bg-card border border-border";
  const sub = accent ? "text-primary-foreground/70" : "text-muted-foreground";
  const valueClass = accent ? "text-primary-foreground" : "text-foreground";

  return (
    <div className={`rounded-2xl p-5 ${bg}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${sub}`} />
        <span className={`text-caption ${sub}`}>{label}</span>
      </div>
      <div className={`mt-2 text-h2 font-bold ${valueClass}`}>{value}</div>
      <div className={`mt-1 text-caption ${sub}`}>{delta}</div>
    </div>
  );
}
