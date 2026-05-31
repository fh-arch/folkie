import { requireSession } from "@/lib/superadmin/auth";
import { saFetch } from "@/lib/superadmin/api";

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export default async function SuperAdminAnalytics() {
  await requireSession();

  let stats: any = null;
  let campaigns: any[] = [];
  try {
    [stats, campaigns] = await Promise.all([
      saFetch<any>("/api/v1/superadmin/stats"),
      saFetch<any[]>("/api/v1/superadmin/revenue"),
    ]);
  } catch {}

  // Campaigns by status
  const statusCounts: Record<string, number> = {};
  for (const c of campaigns) {
    statusCounts[c.status] = (statusCounts[c.status] ?? 0) + 1;
  }

  // New users this week vs last week (from stats)
  const conversionRate = stats
    ? stats.campaigns.totalCampaigns > 0
      ? ((stats.campaigns.completedCampaigns / stats.campaigns.totalCampaigns) * 100).toFixed(1)
      : "0.0"
    : "—";

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-white">Analytics</h1>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Campaigns by status */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white/60">Campaigns by Status</h2>
          <div className="space-y-2">
            {Object.entries(statusCounts).map(([s, n]) => (
              <div key={s} className="flex items-center gap-3">
                <span className="w-32 text-xs text-white/50">{s.replace(/_/g, " ")}</span>
                <div className="flex-1 overflow-hidden rounded-full bg-white/10 h-2">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(n / campaigns.length) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-xs font-semibold text-white">{n}</span>
              </div>
            ))}
            {campaigns.length === 0 && <p className="text-sm text-white/30">No data</p>}
          </div>
        </div>

        {/* User growth */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white/60">User Growth</h2>
          {stats && (
            <div className="space-y-3">
              <Metric label="New today" value={stats.users.newToday} />
              <Metric label="New this week" value={stats.users.newThisWeek} />
              <Metric label="New this month" value={stats.users.newThisMonth} />
              <Metric label="Total brands" value={stats.users.totalBrands} />
              <Metric label="Total creators" value={stats.users.totalCreators} />
            </div>
          )}
        </div>

        {/* Platform KPIs */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white/60">Platform KPIs</h2>
          {stats && (
            <div className="space-y-3">
              <Metric label="Campaign completion rate" value={`${conversionRate}%`} />
              <Metric label="Total commission earned" value={formatTRY(stats.finance.earnedCommission)} />
              <Metric label="Pending commission" value={formatTRY(stats.finance.pendingCommission)} />
              <Metric label="Folkie balance (in - out)" value={formatTRY(stats.finance.folkieBalance)} />
              <Metric label="Blocked users" value={stats.users.blockedUsers} />
            </div>
          )}
        </div>

        {/* Top campaigns by commission */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white/60">Top Campaigns by Commission</h2>
          <div className="space-y-2">
            {campaigns
              .sort((a, b) => b.commission - a.commission)
              .slice(0, 8)
              .map((c: any) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-white/70 max-w-[200px]">{c.title}</span>
                  <span className="font-semibold text-emerald-400">{formatTRY(c.commission)}</span>
                </div>
              ))}
            {campaigns.length === 0 && <p className="text-sm text-white/30">No data</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/50">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
