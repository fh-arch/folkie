import { requireSession } from "@/lib/superadmin/auth";
import { saFetch } from "@/lib/superadmin/api";

interface Campaign {
  id: string; title: string; productCategory: string; status: string;
  totalBudget: number; commission: number; brandName: string;
  applicationCount: number; approvedCount: number; influencerCount: number;
  applicationDeadline: string; createdAt: string;
}

interface Props { searchParams: Promise<{ status?: string; page?: string }>; }

const STATUS_OPTIONS = ["", "draft", "pending_payment", "active", "applications_closed", "in_progress", "completed", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  draft: "bg-white/10 text-white/50",
  pending_payment: "bg-yellow-500/20 text-yellow-400",
  active: "bg-emerald-500/20 text-emerald-400",
  applications_closed: "bg-blue-500/20 text-blue-400",
  in_progress: "bg-blue-500/20 text-blue-400",
  completed: "bg-purple-500/20 text-purple-400",
  cancelled: "bg-red-500/20 text-red-400",
};

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export default async function SuperAdminCampaigns({ searchParams }: Props) {
  await requireSession();
  const sp = await searchParams;
  const status = sp.status ?? "";
  const page = parseInt(sp.page ?? "1");

  const qs = new URLSearchParams({ page: String(page) });
  if (status) qs.set("status", status);

  let data: { total: number; items: Campaign[] } = { total: 0, items: [] };
  let error: string | null = null;
  try {
    data = await saFetch(`/api/v1/superadmin/campaigns?${qs}`);
  } catch (e) { error = e instanceof Error ? e.message : "Error"; }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Campaigns</h1>
        <p className="mt-1 text-sm text-white/40">{data.total} total</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(s => (
          <a key={s} href={`/superleo/campaigns?status=${s}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${status === s ? "bg-primary text-white" : "bg-white/10 text-white/50 hover:bg-white/15"}`}>
            {s || "All"}
          </a>
        ))}
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {["Campaign", "Brand", "Status", "Budget", "Commission", "Fill", "Deadline"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map(c => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/3">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{c.title}</div>
                  <div className="text-xs text-white/40">{c.productCategory}</div>
                </td>
                <td className="px-4 py-3 text-sm text-white/60">{c.brandName}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[c.status] ?? "bg-white/10 text-white/50"}`}>
                    {c.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-white">{formatTRY(c.totalBudget)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-emerald-400">{formatTRY(c.commission)}</td>
                <td className="px-4 py-3 text-sm text-white/60">{c.approvedCount}/{c.influencerCount}</td>
                <td className="px-4 py-3 text-xs text-white/40">{new Date(c.applicationDeadline).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.items.length === 0 && !error && <div className="py-12 text-center text-sm text-white/30">No campaigns</div>}
      </div>
    </div>
  );
}
