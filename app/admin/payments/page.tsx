import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatTRY } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { ApproveButton, TransferForm } from "./PaymentActions";

interface AdminPayment {
  id: string;
  campaignId: string;
  campaignTitle: string;
  influencerProfileId: string;
  creatorHandle: string | null;
  amount: number;
  paymentType: string;
  status: "pending" | "approved" | "transferred" | "failed";
  ibanMasked: string;
  ibanName: string;
  adminNote: string | null;
  transferReference: string | null;
  approvedAt: string | null;
  transferredAt: string | null;
  createdAt: string;
}

export default async function AdminPaymentsPage() {
  let payments: AdminPayment[] = [];
  let fetchError: string | null = null;
  try {
    payments = await apiFetch<AdminPayment[]>(ENDPOINTS.admin.payments());
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  if (payments.length === 0) {
    return (
      <div>
        <PageHeader
          title="Ödemeler"
          description="Influencer ödemelerini onayla ve manuel banka transferini işaretle."
        />
        <section className="card-folkie">
          <EmptyState
            icon={Wallet}
            title={fetchError ? "Yüklenemedi" : "Henüz ödeme yok"}
            description={
              fetchError ??
              "Kampanyalar tamamlandığında ödeme talepleri burada görünür."
            }
            size="lg"
          />
        </section>
      </div>
    );
  }

  const pendingTotal = payments
    .filter((p) => p.status === "pending" || p.status === "approved")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader
        title="Ödemeler"
        description={`${payments.length} ödeme — ${formatTRY(pendingTotal)} bekleyen`}
      />

      <section className="card-folkie p-4 sm:p-5">
        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-small">
            <thead>
              <tr className="border-b border-border text-left text-caption text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Kampanya / Creator</th>
                <th className="py-3 pr-4 font-medium">Tutar</th>
                <th className="py-3 pr-4 font-medium">IBAN</th>
                <th className="py-3 pr-4 font-medium">Durum</th>
                <th className="py-3 pr-4 font-medium">Onay</th>
                <th className="py-3 font-medium">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="py-3 pr-4">
                    <div className="font-semibold">{p.campaignTitle}</div>
                    <div className="text-caption text-muted-foreground">
                      {p.creatorHandle ?? "(handle yok)"}
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-bold text-primary">
                    {formatTRY(p.amount)}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-mono text-caption">{p.ibanMasked}</div>
                    <div className="text-caption text-muted-foreground">
                      {p.ibanName}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge variant={p.status} />
                  </td>
                  <td className="py-3 pr-4 text-caption text-muted-foreground">
                    {p.approvedAt
                      ? new Date(p.approvedAt).toLocaleDateString("tr-TR")
                      : "—"}
                  </td>
                  <td className="py-3">
                    {p.status === "pending" && <ApproveButton paymentId={p.id} />}
                    {p.status === "approved" && <TransferForm paymentId={p.id} />}
                    {p.status === "transferred" && (
                      <span className="text-caption text-success">
                        ✓ {p.transferReference}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="space-y-3 md:hidden">
          {payments.map((p) => (
            <article key={p.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{p.campaignTitle}</div>
                  <div className="text-caption text-muted-foreground">
                    {p.creatorHandle ?? "(handle yok)"}
                  </div>
                </div>
                <StatusBadge variant={p.status} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-caption">
                <div>
                  <div className="text-muted-foreground">Tutar</div>
                  <div className="font-bold text-primary">
                    {formatTRY(p.amount)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">IBAN</div>
                  <div className="font-mono">{p.ibanMasked}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                {p.status === "pending" && <ApproveButton paymentId={p.id} />}
                {p.status === "approved" && <TransferForm paymentId={p.id} />}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
