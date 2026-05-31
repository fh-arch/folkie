import { requireSession } from "@/lib/superadmin/auth";
import { saFetch } from "@/lib/superadmin/api";
import { Users, Megaphone, DollarSign, Clock, TrendingUp, AlertTriangle, CheckCircle2, Wallet } from "lucide-react";

interface Stats {
  users: { totalUsers: number; totalBrands: number; totalCreators: number; blockedUsers: number; newToday: number; newThisWeek: number; newThisMonth: number };
  campaigns: { totalCampaigns: number; activeCampaigns: number; completedCampaigns: number };
  queues: { pendingApplications: number; pendingSubmissions: number; pendingBrandPayments: number; pendingCreatorPayouts: number };
  finance: { totalCommission: number; earnedCommission: number; pendingCommission: number; totalBrandIn: number; totalCreatorOut: number; folkieBalance: number };
}

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export default async function SuperAdminDashboard() {
  await requireSession();

  let stats: Stats | null = null;
  let error: string | null = null;
  try {
    stats = await saFetch<Stats>("/api/v1/superadmin/stats");
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load stats";
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">Platform overview — live data</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Users row */}
          <section className="mb-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Users</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Users} label="Total Users" value={stats.users.totalUsers} sub={`${stats.users.totalBrands} brands · ${stats.users.totalCreators} creators`} color="blue" />
              <StatCard icon={TrendingUp} label="New Today" value={stats.users.newToday} sub={`${stats.users.newThisWeek} this week · ${stats.users.newThisMonth} this month`} color="green" />
              <StatCard icon={Megaphone} label="Campaigns" value={stats.campaigns.totalCampaigns} sub={`${stats.campaigns.activeCampaigns} active · ${stats.campaigns.completedCampaigns} completed`} color="purple" />
              <StatCard icon={AlertTriangle} label="Blocked Users" value={stats.users.blockedUsers} sub="accounts suspended" color="red" />
            </div>
          </section>

          {/* Finance row */}
          <section className="mb-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Finance</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard icon={DollarSign} label="Folkie Balance" value={formatTRY(stats.finance.folkieBalance)} sub={`${formatTRY(stats.finance.totalBrandIn)} in · ${formatTRY(stats.finance.totalCreatorOut)} out`} color="green" isCurrency />
              <StatCard icon={CheckCircle2} label="Commission Earned" value={formatTRY(stats.finance.earnedCommission)} sub="from completed campaigns" color="blue" isCurrency />
              <StatCard icon={Wallet} label="Pending Commission" value={formatTRY(stats.finance.pendingCommission)} sub="from active campaigns" color="yellow" isCurrency />
            </div>
          </section>

          {/* Action queues */}
          <section className="mb-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Action Required</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QueueCard href="/superleo/pending#brand-payments" label="Brand Payments" count={stats.queues.pendingBrandPayments} desc="waiting confirmation" urgent={stats.queues.pendingBrandPayments > 0} />
              <QueueCard href="/superleo/pending#creator-payouts" label="Creator Payouts" count={stats.queues.pendingCreatorPayouts} desc="waiting transfer" urgent={stats.queues.pendingCreatorPayouts > 0} />
              <QueueCard href="/superleo/pending#submissions" label="Content Reviews" count={stats.queues.pendingSubmissions} desc="submitted, awaiting review" urgent={false} />
              <QueueCard href="/superleo/pending#applications" label="Applications" count={stats.queues.pendingApplications} desc="pending brand review" urgent={false} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, isCurrency }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  sub: string;
  color: "blue" | "green" | "purple" | "red" | "yellow";
  isCurrency?: boolean;
}) {
  const colors = {
    blue:   "bg-blue-500/15 text-blue-400",
    green:  "bg-emerald-500/15 text-emerald-400",
    purple: "bg-violet-500/15 text-violet-400",
    red:    "bg-red-500/15 text-red-400",
    yellow: "bg-yellow-500/15 text-yellow-400",
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-2xl font-bold text-white">{value}</div>
      <div className="mt-0.5 text-xs font-medium text-white/50">{label}</div>
      <div className="mt-1 text-xs text-white/30">{sub}</div>
    </div>
  );
}

function QueueCard({ href, label, count, desc, urgent }: { href: string; label: string; count: number; desc: string; urgent: boolean }) {
  return (
    <a href={href} className={`rounded-2xl border p-5 transition-colors hover:bg-white/5 ${urgent && count > 0 ? "border-yellow-500/40 bg-yellow-500/5" : "border-white/10 bg-white/5"}`}>
      <div className={`text-3xl font-bold ${urgent && count > 0 ? "text-yellow-400" : "text-white"}`}>{count}</div>
      <div className="mt-1 text-sm font-semibold text-white">{label}</div>
      <div className="mt-0.5 text-xs text-white/40">{desc}</div>
    </a>
  );
}
