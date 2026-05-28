import { Sparkles, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { CreatorSearchClient } from "./CreatorSearchClient";

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

export default async function BrandDiscoverPage() {
  let initial: SearchResult = { items: [], total: 0, page: 1, pageSize: 20 };
  let fetchError: string | null = null;
  try {
    initial = await apiFetch<SearchResult>(`${ENDPOINTS.brand.creators()}?pageSize=24`);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  if (fetchError) {
    return (
      <div>
        <PageHeader title="Discover Creators" breadcrumbs={[{ label: "Discover Creators" }]} />
        <section className="card-folkie">
          <EmptyState
            icon={Users}
            title="Failed to load"
            description={fetchError}
            size="lg"
          />
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Discover Creators"
        description="Filter, save favorites, and invite creators to your campaigns."
        breadcrumbs={[{ label: "Discover Creators" }]}
        actions={
          <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-caption font-semibold text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            {initial.total} creator
          </span>
        }
      />
      <CreatorSearchClient initial={initial} />
    </div>
  );
}
