"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search, Bookmark, CheckCircle2, Heart, SlidersHorizontal } from "lucide-react";
import { formatNumber, cn } from "@/lib/utils";
import { KATEGORILER, SEHIRLER } from "@/lib/constants";
import { addFavorite, removeFavorite } from "../favorites/actions";

interface CreatorCard {
  id: string;
  handle: string | null;
  followerCount: number;
  engagementRate: number;
  tier: "nano" | "micro" | "mid_tier";
  city: string | null;
  categories: string[];
  bio: string | null;
  isVerified: boolean;
  isFavorited: boolean;
}

interface SearchResult {
  items: CreatorCard[];
  total: number;
  page: number;
  pageSize: number;
}

const TIER_LABELS = {
  nano: "Nano",
  micro: "Micro",
  mid_tier: "Mid-tier",
};

export function CreatorSearchClient({ initial }: { initial: SearchResult }) {
  const [result, setResult] = useState(initial);
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    city: "",
    tier: "",
    verifiedOnly: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pending, startTransition] = useTransition();

  async function applyFilters(newFilters: typeof filters) {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.q) params.set("q", newFilters.q);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.city) params.set("city", newFilters.city);
    if (newFilters.tier) params.set("tier", newFilters.tier);
    if (newFilters.verifiedOnly) params.set("verifiedOnly", "true");
    params.set("pageSize", "24");

    startTransition(async () => {
      const res = await fetch(`/api/proxy/creators?${params}`);
      if (res.ok) setResult(await res.json());
    });
  }

  return (
    <section className="card-folkie p-4 sm:p-5">
      {/* Search bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && applyFilters(filters)}
            placeholder="Search by handle or bio..."
            className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-3 text-small focus:border-primary focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-small font-medium",
            showFilters
              ? "border-primary bg-primary-light text-primary"
              : "border-border hover:border-primary",
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>
        <button
          onClick={() => applyFilters(filters)}
          disabled={pending}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-small font-semibold text-primary-foreground disabled:opacity-50"
        >
          {pending ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 grid gap-3 rounded-xl bg-muted/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={filters.category}
            onChange={(e) => applyFilters({ ...filters, category: e.target.value })}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-small"
          >
            <option value="">Category (all)</option>
            {KATEGORILER.slice(0, 14).map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>

          <select
            value={filters.city}
            onChange={(e) => applyFilters({ ...filters, city: e.target.value })}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-small"
          >
            <option value="">City (all)</option>
            {SEHIRLER.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filters.tier}
            onChange={(e) => applyFilters({ ...filters, tier: e.target.value })}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-small"
          >
            <option value="">Tier (all)</option>
            <option value="nano">Nano (1K–10K)</option>
            <option value="micro">Micro (10K–100K)</option>
            <option value="mid_tier">Mid-tier (100K+)</option>
          </select>

          <label className="flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-small">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => applyFilters({ ...filters, verifiedOnly: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            Verified only
          </label>
        </div>
      )}

      {/* Results */}
      {result.items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-small font-semibold">No results</p>
          <p className="mt-1 text-caption text-muted-foreground">
            Try loosening your filters or a different search term.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {result.items.map((c) => (
            <CreatorCardItem key={c.id} creator={c} />
          ))}
        </div>
      )}
    </section>
  );
}

function CreatorCardItem({ creator }: { creator: CreatorCard }) {
  const [isFav, setIsFav] = useState(creator.isFavorited);
  const [pending, startTransition] = useTransition();

  function toggleFavorite() {
    startTransition(async () => {
      if (isFav) {
        const r = await removeFavorite(creator.id);
        if (r.ok) setIsFav(false);
      } else {
        const r = await addFavorite(creator.id, null);
        if (r.ok) setIsFav(true);
      }
    });
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-background transition-all hover:shadow-lg">
      <Link href={`/brand/discover/${creator.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary-light via-muted to-accent/20">
          <div className="flex h-full w-full items-center justify-center text-h1 font-bold text-primary/30">
            {(creator.handle ?? "C").replace("@", "").charAt(0).toUpperCase()}
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-0.5 text-caption font-semibold backdrop-blur">
            {TIER_LABELS[creator.tier]}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between gap-1">
          <Link
            href={`/brand/discover/${creator.id}`}
            className="flex items-center gap-1 hover:text-primary"
          >
            <span className="text-small font-semibold">{creator.handle ?? "—"}</span>
            {creator.isVerified && (
              <CheckCircle2 className="h-3.5 w-3.5 fill-primary text-primary-foreground" />
            )}
          </Link>
          <button
            onClick={toggleFavorite}
            disabled={pending}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted disabled:opacity-50"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            {isFav ? (
              <Heart className="h-4 w-4 fill-destructive text-destructive" />
            ) : (
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
        <div className="mt-0.5 truncate text-caption text-muted-foreground">
          {creator.categories[0] ?? "—"}
          {creator.city ? ` • ${creator.city}` : ""}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-caption">
          <div>
            <div className="text-small font-semibold">{formatNumber(creator.followerCount)}</div>
            <div className="text-muted-foreground">Followers</div>
          </div>
          <div>
            <div className="text-small font-semibold text-success">
              {creator.engagementRate.toFixed(1)}%
            </div>
            <div className="text-muted-foreground">Engagement</div>
          </div>
        </div>
      </div>
    </article>
  );
}
