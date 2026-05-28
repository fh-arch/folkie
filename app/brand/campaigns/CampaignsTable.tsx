"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Users, Calendar, Eye } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatTRY, formatNumber } from "@/lib/utils";

export interface CampaignRow {
  id: string;
  title: string;
  productCategory: string;
  status:
    | "draft"
    | "pending_payment"
    | "active"
    | "applications_closed"
    | "in_progress"
    | "completed"
    | "cancelled";
  budget: number;
  influencerCount: number;
  applicationCount: number;
  approvedCount: number;
  applicationDeadline: string;
  isFlashCampaign: boolean;
  createdAt: string;
}

const STATUS_FOR_BADGE: Record<
  CampaignRow["status"],
  "draft" | "pending" | "active" | "in_progress" | "completed" | "cancelled"
> = {
  draft: "draft",
  pending_payment: "pending",
  active: "active",
  applications_closed: "in_progress",
  in_progress: "in_progress",
  completed: "completed",
  cancelled: "cancelled",
};

export function CampaignsTable({ campaigns }: { campaigns: CampaignRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return campaigns;
    return campaigns.filter(
      (c) =>
        c.title.toLocaleLowerCase("tr").includes(q) ||
        c.productCategory.toLocaleLowerCase("tr").includes(q),
    );
  }, [campaigns, query]);

  return (
    <>
      <div className="ml-auto flex w-full items-center gap-2 sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="h-9 w-full rounded-full border border-border bg-background pl-9 pr-3 text-small placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:w-56"
          />
        </div>
        <button
          disabled
          title="Detaylı filtreler yakında"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-small text-muted-foreground"
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {filtered.length === 0 && query ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
          <Search className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-small font-semibold">
            No results for &quot;{query}&quot;
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            Try a different term or clear the filters.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full text-small">
              <thead>
                <tr className="border-b border-border text-left text-caption text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Campaign</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Budget</th>
                  <th className="py-3 pr-4 font-medium">Fill rate</th>
                  <th className="py-3 pr-4 font-medium">Applications</th>
                  <th className="py-3 pr-4 font-medium">Deadline</th>
                  <th className="py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        {c.isFlashCampaign && (
                          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                            ⚡ FLASH
                          </span>
                        )}
                        <div>
                          <Link
                            href={`/brand/campaigns/${c.id}`}
                            className="font-semibold hover:text-primary"
                          >
                            {c.title}
                          </Link>
                          <div className="text-caption text-muted-foreground">
                            {c.productCategory}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <StatusBadge variant={STATUS_FOR_BADGE[c.status]} />
                    </td>
                    <td className="py-4 pr-4 font-semibold">
                      {formatTRY(c.budget)}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${c.influencerCount > 0 ? (c.approvedCount / c.influencerCount) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-caption text-muted-foreground">
                          {c.approvedCount}/{c.influencerCount}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="flex items-center gap-1 text-caption text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {formatNumber(c.applicationCount)}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-caption text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(c.applicationDeadline).toLocaleDateString(
                          "tr-TR",
                        )}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/brand/campaigns/${c.id}`}
                        className="inline-flex items-center gap-1 text-caption text-primary hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" /> Detay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-4 space-y-3 md:hidden">
            {filtered.map((c) => (
              <article
                key={c.id}
                className="rounded-2xl border border-border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {c.isFlashCampaign && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                          ⚡
                        </span>
                      )}
                      <Link
                        href={`/brand/campaigns/${c.id}`}
                        className="truncate font-semibold hover:text-primary"
                      >
                        {c.title}
                      </Link>
                    </div>
                    <div className="mt-0.5 text-caption text-muted-foreground">
                      {c.productCategory}
                    </div>
                  </div>
                  <StatusBadge variant={STATUS_FOR_BADGE[c.status]} />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 border-t border-border pt-3 text-caption">
                  <div>
                    <div className="text-muted-foreground">Budget</div>
                    <div className="font-semibold">{formatTRY(c.budget)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Fill rate</div>
                    <div className="font-semibold">
                      {c.approvedCount}/{c.influencerCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Applications</div>
                    <div className="font-semibold">
                      {formatNumber(c.applicationCount)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
