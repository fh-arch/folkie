import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  MapPin,
  Users,
  TrendingUp,
  ThumbsUp,
  Video,
  Tag,
  MessageSquare,
} from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { formatNumber } from "@/lib/utils";
import { FavoriteToggle } from "./FavoriteToggle";

interface CreatorDetail {
  id: string;
  handle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  followerCount: number;
  engagementRate: number;
  tier: string;
  city: string | null;
  categories: string[];
  contentLanguage: string[];
  likesCount: number | null;
  videoCount: number | null;
  isVerified: boolean;
  isFavorited: boolean;
  userId: string;
}

const TIER_LABELS: Record<string, string> = {
  nano: "Nano (1K–10K)",
  micro: "Micro (10K–100K)",
  mid_tier: "Mid-tier (100K+)",
};

export default async function CreatorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let creator: CreatorDetail;
  try {
    creator = await apiFetch<CreatorDetail>(
      ENDPOINTS.brand.creator(params.id),
    );
  } catch {
    notFound();
  }

  const initials = (creator.handle ?? "C")
    .replace("@", "")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Back */}
      <Link
        href="/brand/discover"
        className="inline-flex items-center gap-1.5 text-small text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Discover
      </Link>

      {/* Profile card */}
      <div className="card-folkie overflow-hidden p-0">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-primary-light via-muted to-accent/20" />

        {/* Avatar + actions row */}
        <div className="flex items-end justify-between px-5 pb-4">
          <div className="-mt-12 flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-gradient-to-br from-primary-light to-accent/30 text-h2 font-bold text-primary shadow-sm">
              {initials}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-body font-bold">
                  {creator.handle ?? "—"}
                </span>
                {creator.isVerified && (
                  <CheckCircle2 className="h-4 w-4 fill-primary text-primary-foreground" />
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-caption text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {TIER_LABELS[creator.tier] ?? creator.tier}
                </span>
                {creator.city && (
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" />
                    {creator.city}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <FavoriteToggle
              creatorId={creator.id}
              initialFavorited={creator.isFavorited}
            />
            <Link
              href={`/brand/messages?userId=${creator.userId}`}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Message
            </Link>
          </div>
        </div>

        {/* Bio */}
        {creator.bio && (
          <div className="border-t border-border px-5 py-4">
            <p className="text-small leading-relaxed text-muted-foreground">
              {creator.bio}
            </p>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={Users}
          label="Followers"
          value={formatNumber(creator.followerCount)}
        />
        <StatCard
          icon={TrendingUp}
          label="Engagement"
          value={`${creator.engagementRate.toFixed(1)}%`}
          highlight
        />
        {creator.likesCount != null && (
          <StatCard
            icon={ThumbsUp}
            label="Likes"
            value={formatNumber(creator.likesCount)}
          />
        )}
        {creator.videoCount != null && (
          <StatCard
            icon={Video}
            label="Videos"
            value={formatNumber(creator.videoCount)}
          />
        )}
      </div>

      {/* Categories & Languages */}
      <div className="card-folkie p-5 space-y-4">
        {creator.categories.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-caption font-semibold text-muted-foreground">
              <Tag className="h-3.5 w-3.5" />
              Categories
            </div>
            <div className="flex flex-wrap gap-2">
              {creator.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-muted px-3 py-1 text-caption font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {creator.contentLanguage.length > 0 && (
          <div>
            <div className="mb-2 text-caption font-semibold text-muted-foreground">
              Content Language
            </div>
            <div className="flex flex-wrap gap-2">
              {creator.contentLanguage.map((lang) => (
                <span
                  key={lang}
                  className="rounded-full bg-muted px-3 py-1 text-caption font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="card-folkie flex flex-col items-center gap-1 p-4 text-center">
      <Icon
        className={`h-5 w-5 ${highlight ? "text-success" : "text-primary"}`}
      />
      <div
        className={`text-body font-bold ${highlight ? "text-success" : ""}`}
      >
        {value}
      </div>
      <div className="text-caption text-muted-foreground">{label}</div>
    </div>
  );
}
