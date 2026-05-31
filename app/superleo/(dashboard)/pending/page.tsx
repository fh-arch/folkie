import { requireSession } from "@/lib/superadmin/auth";
import { saFetch } from "@/lib/superadmin/api";
import { confirmBrandPayment, transferCreatorPayout } from "./actions";

function formatTRY(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export default async function SuperAdminPending() {
  await requireSession();

  const [brandPayments, creatorPayouts, submissions] = await Promise.all([
    saFetch<any[]>("/api/v1/superadmin/pending/brand-payments").catch(() => []),
    saFetch<any[]>("/api/v1/superadmin/pending/creator-payouts").catch(() => []),
    saFetch<any[]>("/api/v1/superadmin/pending/submissions").catch(() => []),
  ]);

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-2xl font-bold text-white">Pending Queues</h1>

      {/* Brand Payments */}
      <section id="brand-payments">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-yellow-400">
          Brand Payments Awaiting Confirmation ({brandPayments.length})
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["Campaign", "Brand", "Amount", "Date", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brandPayments.map((p: any) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium text-white">{p.campaignTitle}</td>
                  <td className="px-4 py-3 text-white/60">{p.brandName}</td>
                  <td className="px-4 py-3 font-semibold text-yellow-400">{formatTRY(p.amount)}</td>
                  <td className="px-4 py-3 text-xs text-white/40">{new Date(p.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-3">
                    <form action={confirmBrandPayment} className="flex items-center gap-2">
                      <input type="hidden" name="paymentId" value={p.id} />
                      <input name="reference" placeholder="Bank ref..." className="w-32 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white placeholder-white/30 focus:outline-none" />
                      <button className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/30">Confirm</button>
                    </form>
                  </td>
                </tr>
              ))}
              {brandPayments.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-sm text-white/30">No pending brand payments</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Creator Payouts */}
      <section id="creator-payouts">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">
          Creator Payouts Awaiting Transfer ({creatorPayouts.length})
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["Creator", "IBAN Holder", "Campaign", "Amount", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {creatorPayouts.map((p: any) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium text-white">{p.handle ?? "—"}</td>
                  <td className="px-4 py-3 text-white/60">{p.ibanName}</td>
                  <td className="px-4 py-3 text-xs text-white/40">{p.campaignTitle}</td>
                  <td className="px-4 py-3 font-semibold text-blue-400">{formatTRY(p.amount)}</td>
                  <td className="px-4 py-3">
                    <form action={transferCreatorPayout} className="flex items-center gap-2">
                      <input type="hidden" name="paymentId" value={p.id} />
                      <input name="reference" placeholder="Bank ref..." className="w-32 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white placeholder-white/30 focus:outline-none" />
                      <button className="rounded-lg bg-blue-500/20 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/30">Transfer</button>
                    </form>
                  </td>
                </tr>
              ))}
              {creatorPayouts.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-sm text-white/30">No pending payouts</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Content Submissions */}
      <section id="submissions">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-purple-400">
          Content Awaiting Review ({submissions.length})
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["Creator", "Campaign", "Script preview", "Submitted"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((s: any) => (
                <tr key={s.id} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium text-white">{s.handle ?? "—"}</td>
                  <td className="px-4 py-3 text-white/60">{s.campaignTitle}</td>
                  <td className="px-4 py-3 text-xs text-white/40 max-w-xs truncate">{s.script ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-white/40">{new Date(s.submittedAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
              {submissions.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-sm text-white/30">No pending submissions</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
