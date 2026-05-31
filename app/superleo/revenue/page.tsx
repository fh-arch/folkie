import { requireSession } from "@/lib/superadmin/auth";
import { saFetch } from "@/lib/superadmin/api";

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

interface Row {
  id: string; title: string; brandName: string; status: string;
  totalBudget: number; platformFeeRate: number; commission: number; createdAt: string;
}

export default async function SuperAdminRevenue() {
  await requireSession();

  let rows: Row[] = [];
  let error: string | null = null;
  try {
    rows = await saFetch<Row[]>("/api/v1/superadmin/revenue");
  } catch (e) { error = e instanceof Error ? e.message : "Error"; }

  const totalRevenue = rows.reduce((s, r) => s + r.commission, 0);
  const earned = rows.filter(r => r.status === "completed").reduce((s, r) => s + r.commission, 0);
  const pending = rows.filter(r => r.status !== "completed").reduce((s, r) => s + r.commission, 0);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-white">Revenue & Commission</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Commission", value: formatTRY(totalRevenue), color: "text-white" },
          { label: "Earned (Completed)", value: formatTRY(earned), color: "text-emerald-400" },
          { label: "Pending (Active)", value: formatTRY(pending), color: "text-yellow-400" },
        ].map(card => (
          <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="mt-1 text-xs text-white/40">{card.label}</div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {["Campaign", "Brand", "Status", "Campaign Budget", "Fee Rate", "Commission"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase text-white/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/3">
                <td className="px-4 py-3 font-medium text-white">{r.title}</td>
                <td className="px-4 py-3 text-white/60">{r.brandName}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.status === "completed" ? "bg-purple-500/20 text-purple-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                    {r.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/70">{formatTRY(r.totalBudget)}</td>
                <td className="px-4 py-3 text-white/40">%{r.platformFeeRate}</td>
                <td className="px-4 py-3 font-semibold text-emerald-400">{formatTRY(r.commission)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && !error && <div className="py-12 text-center text-sm text-white/30">No revenue data yet</div>}
      </div>
    </div>
  );
}
