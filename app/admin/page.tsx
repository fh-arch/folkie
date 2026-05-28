import Link from "next/link";
import {
  Building2,
  Music,
  Wallet,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  ExternalLink,
} from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { formatTRY, formatNumber } from "@/lib/utils";

interface AdminStats {
  totalUsers: number;
  totalBrands: number;
  totalCreators: number;
  newUsersThisWeek: number;
  totalCampaigns: number;
  activeCampaigns: number;
  draftCampaigns: number;
  completedCampaigns: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  totalSubmissions: number;
  submissionsAwaitingReview: number;
  publishedSubmissions: number;
  totalGmv: number;
  pendingCreatorPayouts: number;
  pendingPaymentCount: number;
}

interface AdminBrandRow {
  userId: string;
  brandProfileId: string;
  brandName: string;
  email: string;
  industry: string | null;
  createdAt: string;
}

interface AdminCreatorRow {
  userId: string;
  influencerProfileId: string;
  email: string;
  fullName: string | null;
  tiktokHandle: string | null;
  followerCount: number;
  createdAt: string;
}

const EMPTY_STATS: AdminStats = {
  totalUsers: 0,
  totalBrands: 0,
  totalCreators: 0,
  newUsersThisWeek: 0,
  totalCampaigns: 0,
  activeCampaigns: 0,
  draftCampaigns: 0,
  completedCampaigns: 0,
  totalApplications: 0,
  pendingApplications: 0,
  approvedApplications: 0,
  totalSubmissions: 0,
  submissionsAwaitingReview: 0,
  publishedSubmissions: 0,
  totalGmv: 0,
  pendingCreatorPayouts: 0,
  pendingPaymentCount: 0,
};

export default async function AdminDashboardPage() {
  const [stats, pendingBrands, pendingCreators] = await Promise.all([
    apiFetch<AdminStats>(ENDPOINTS.admin.stats()).catch(() => EMPTY_STATS),
    apiFetch<AdminBrandRow[]>(`${ENDPOINTS.admin.brands()}?filter=pending`).catch(
      () => [] as AdminBrandRow[],
    ),
    apiFetch<AdminCreatorRow[]>(
      `${ENDPOINTS.admin.creators()}?filter=pending`,
    ).catch(() => [] as AdminCreatorRow[]),
  ]);

  return (
    <div>
      <div>
        <h1>Folkie Super Admin</h1>
        <p className="mt-2 text-small text-muted-foreground">
          Marketplace operasyon paneli — kullanıcı onayları, ödemeler, platform durumu.
        </p>
      </div>

      {/* Three primary queues */}
      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <QueueCard
          icon={Building2}
          title="Marka Onayı"
          count={pendingBrands.length}
          subtitle="Yeni marka başvuruları"
          href="/admin/brandlar?filter=pending"
          accent="primary"
          empty="Bekleyen marka yok."
        />
        <QueueCard
          icon={Music}
          title="Creator Onayı"
          count={pendingCreators.length}
          subtitle="Yeni creator profilleri"
          href="/admin/creators?filter=pending"
          accent="accent"
          empty="Bekleyen creator yok."
        />
        <QueueCard
          icon={Wallet}
          title="Ödeme Transferi"
          count={stats.pendingPaymentCount}
          subtitle={`${formatTRY(stats.pendingCreatorPayouts)} bekliyor`}
          href="/admin/payments"
          accent="warning"
          empty="Bekleyen ödeme yok."
        />
      </section>

      {/* Quick previews of the two top queues */}
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <QueuePreview
          title="Onay Bekleyen Markalar"
          href="/admin/brandlar"
          icon={Building2}
          empty="Bekleyen marka yok"
          rows={pendingBrands.slice(0, 5).map((b) => ({
            id: b.brandProfileId,
            primary: b.brandName,
            secondary: b.email + (b.industry ? ` • ${b.industry}` : ""),
            createdAt: b.createdAt,
            userId: b.userId,
          }))}
        />
        <QueuePreview
          title="Onay Bekleyen Creator'lar"
          href="/admin/creators"
          icon={Music}
          empty="Bekleyen creator yok"
          rows={pendingCreators.slice(0, 5).map((c) => ({
            id: c.influencerProfileId,
            primary: c.fullName ?? c.email,
            secondary:
              (c.tiktokHandle ?? "(TikTok yok)") +
              " • " +
              formatNumber(c.followerCount) +
              " takipçi",
            createdAt: c.createdAt,
            userId: c.userId,
          }))}
        />
      </section>

      {/* Platform vital signs */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <VitalCard
          icon={TrendingUp}
          label="Toplam GMV"
          value={formatTRY(stats.totalGmv)}
          sub="Onaylı iş birliklerinin değeri"
        />
        <VitalCard
          icon={Activity}
          label="Aktif Kampanya"
          value={stats.activeCampaigns.toString()}
          sub={`${stats.totalCampaigns} toplam`}
        />
        <VitalCard
          icon={Building2}
          label="Toplam Marka"
          value={stats.totalBrands.toString()}
          sub={`+${
            stats.newUsersThisWeek > 0 ? Math.round(stats.newUsersThisWeek / 2) : 0
          } bu hafta`}
        />
        <VitalCard
          icon={Music}
          label="Toplam Creator"
          value={stats.totalCreators.toString()}
          sub={`${stats.newUsersThisWeek} yeni kullanıcı`}
        />
      </section>

      {/* Operational tools */}
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ToolLink
          href="/hangfire"
          external
          title="Hangfire"
          subtitle="Background job durumu"
        />
        <ToolLink
          href="https://seq.folkie.com.tr"
          external
          title="Seq Logs"
          subtitle="Backend log akışı"
        />
        <ToolLink
          href="/admin/users"
          title="Tüm Kullanıcılar"
          subtitle="Search + detay görünümü"
        />
      </section>
    </div>
  );
}

function QueueCard({
  icon: Icon,
  title,
  count,
  subtitle,
  href,
  accent,
  empty,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
  subtitle: string;
  href: string;
  accent: "primary" | "accent" | "warning";
  empty: string;
}) {
  const bg: Record<typeof accent, string> = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    warning: "bg-warning/10 border border-warning/30",
  };
  const subColor =
    accent === "warning" ? "text-foreground/70" : "text-primary-foreground/80";
  const isUrgent = count > 0;
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-2 rounded-2xl p-5 transition-transform hover:scale-[1.01] ${bg[accent]} ${
        accent === "warning" ? "" : ""
      } ${isUrgent ? "ring-2 ring-offset-2 ring-offset-background ring-current/30" : ""}`}
    >
      <div className="flex items-center justify-between">
        <Icon className={`h-5 w-5 ${subColor}`} />
        {isUrgent && <AlertCircle className={`h-4 w-4 ${subColor}`} />}
      </div>
      <div>
        <div className={`text-caption ${subColor}`}>{title}</div>
        <div
          className={`mt-1 text-h1 font-bold leading-tight ${
            accent === "warning" ? "text-foreground" : ""
          }`}
        >
          {count}
        </div>
        <div className={`mt-1 text-caption ${subColor}`}>
          {count === 0 ? empty : subtitle}
        </div>
      </div>
      <div
        className={`mt-2 inline-flex items-center gap-1 text-caption font-medium ${subColor}`}
      >
        Listeyi aç
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function QueuePreview({
  title,
  href,
  icon: Icon,
  empty,
  rows,
}: {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  empty: string;
  rows: {
    id: string;
    primary: string;
    secondary: string;
    createdAt: string;
    userId: string;
  }[];
}) {
  return (
    <section className="card-folkie p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h3 className="text-body font-semibold">{title}</h3>
        </div>
        <Link href={href} className="text-caption text-primary hover:underline">
          Tümünü gör →
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-caption text-muted-foreground">
          {empty}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/users/${r.userId}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 hover:border-primary"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-small font-semibold">{r.primary}</div>
                  <div className="truncate text-caption text-muted-foreground">
                    {r.secondary}
                  </div>
                </div>
                <span className="shrink-0 text-caption text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function VitalCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="card-folkie flex items-center gap-3 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <div className="text-caption text-muted-foreground">{label}</div>
        <div className="text-h3 leading-tight">{value}</div>
        <div className="text-caption text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function ToolLink({
  href,
  title,
  subtitle,
  external,
}: {
  href: string;
  title: string;
  subtitle: string;
  external?: boolean;
}) {
  const content = (
    <>
      <div>
        <div className="text-small font-semibold">{title}</div>
        <div className="text-caption text-muted-foreground">{subtitle}</div>
      </div>
      {external ? (
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      )}
    </>
  );
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 hover:border-primary"
      >
        {content}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 hover:border-primary"
    >
      {content}
    </Link>
  );
}
