import { requireSession } from "@/lib/superadmin/auth";
import { saFetch } from "@/lib/superadmin/api";

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export default async function SuperAdminPayments() {
  await requireSession();

  const [brandPayments, creatorPayouts] = await Promise.all([
    saFetch<any[]>("/api/v1/admin/payments").catch(() => []),
    saFetch<any[]>("/api/v1/superadmin/pending/creator-payouts").catch(() => []),
  ]);

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-2xl font-bold text-white">Payments Overview</h1>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
          Creator Payouts (Pending / Approved)
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["Creator", "IBAN Name", "Amount", "Status", "Campaign"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {creatorPayouts.map((p: any) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium text-white">{p.handle ?? "—"}</td>
                  <td className="px-4 py-3 text-white/60">{p.ibanName}</td>
                  <td className="px-4 py-3 font-semibold text-blue-400">{formatTRY(p.amount)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-white/40">{p.campaignTitle}</td>
                </tr>
              ))}
              {creatorPayouts.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-sm text-white/30">No pending payouts</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <p className="text-sm text-white/40">
          Go to <a href="/superleo/pending" className="text-primary underline">Pending Queues</a> to confirm brand payments and transfer creator payouts.
        </p>
      </section>
    </div>
  );
}
