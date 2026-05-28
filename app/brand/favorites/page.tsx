import {
  Heart,
  CheckCircle2,
  StickyNote,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatNumber } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { RemoveFavoriteButton } from "./RemoveButton";

interface Favorite {
  id: string;
  influencerProfileId: string;
  handle: string | null;
  followerCount: number;
  engagementRate: number;
  tier: "nano" | "micro" | "mid_tier";
  city: string | null;
  categories: string[];
  isVerified: boolean;
  note: string | null;
  addedAt: string;
}

const TIER_LABELS: Record<Favorite["tier"], { label: string; class: string }> = {
  nano: { label: "Nano", class: "bg-accent text-accent-foreground" },
  micro: { label: "Mikro", class: "bg-primary-light text-primary" },
  mid_tier: { label: "Mid-tier", class: "bg-muted text-muted-foreground" },
};

export default async function BrandFavoritesPage() {
  let favorites: Favorite[] = [];
  let fetchError: string | null = null;
  try {
    favorites = await apiFetch<Favorite[]>(ENDPOINTS.brand.favorites());
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  if (favorites.length === 0) {
    return (
      <div>
        <PageHeader
          title="Favorilerim"
          description="Beğendiğin creator'ları sonraki kampanyalarına davet için kaydet."
          breadcrumbs={[{ label: "Favoriler" }]}
        />
        <section className="card-folkie">
          <EmptyState
            icon={Heart}
            title={fetchError ? "Yüklenemedi" : "Henüz favori yok"}
            description={
              fetchError
                ? `Hata: ${fetchError}`
                : "Keşfet sayfasındaki creator'ları kalp ikonu ile kaydet. Burada toplu görür ve davetlerini yönetirsin."
            }
            primaryAction={{
              href: "/brand/discover",
              label: "Creator Keşfet",
              icon: Search,
            }}
            size="lg"
          />
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Favorilerim"
        description={`${favorites.length} kayıtlı creator`}
        breadcrumbs={[{ label: "Favoriler" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favorites.map((f) => (
          <FavoriteCard key={f.id} f={f} />
        ))}
      </div>
    </div>
  );
}

function FavoriteCard({ f }: { f: Favorite }) {
  const tier = TIER_LABELS[f.tier];
  return (
    <article className="card-folkie group overflow-hidden p-0">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary-light via-muted to-accent/20">
        <div className="flex h-full w-full items-center justify-center text-h1 font-bold text-primary/30">
          {(f.handle ?? "C").replace("@", "").charAt(0).toUpperCase()}
        </div>
        <RemoveFavoriteButton creatorId={f.influencerProfileId} />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-caption font-semibold ${tier.class}`}
        >
          {tier.label}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1">
          <span className="text-small font-semibold">{f.handle ?? "—"}</span>
          {f.isVerified && (
            <CheckCircle2 className="h-3.5 w-3.5 fill-primary text-primary-foreground" />
          )}
        </div>
        <div className="mt-0.5 text-caption text-muted-foreground">
          {f.categories[0] ?? "—"}
          {f.city ? ` • ${f.city}` : ""}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
          <div>
            <div className="text-small font-semibold">{formatNumber(f.followerCount)}</div>
            <div className="text-caption text-muted-foreground">Takipçi</div>
          </div>
          <div>
            <div className="text-small font-semibold text-success">{f.engagementRate.toFixed(1)}%</div>
            <div className="text-caption text-muted-foreground">Etkileşim</div>
          </div>
        </div>

        {f.note && (
          <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-muted/50 p-2 text-caption">
            <StickyNote className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="line-clamp-2 text-foreground/80">{f.note}</span>
          </div>
        )}

      </div>
    </article>
  );
}
