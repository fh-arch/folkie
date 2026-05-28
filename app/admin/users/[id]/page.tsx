import Link from "next/link";
import { notFound } from "next/navigation";
import {
  User,
  Building2,
  Music,
  Wallet,
  Calendar,
  Mail,
  Hash,
  MapPin,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatTRY, formatNumber } from "@/lib/utils";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface AdminUserDetail {
  id: string;
  clerkUserId: string;
  email: string;
  role: "influencer" | "brand" | "admin";
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  brand: BrandSection | null;
  influencer: InfluencerSection | null;
}

interface BrandSection {
  id: string;
  companyName: string;
  industry: string | null;
  website: string | null;
  taxId: string | null;
  contactName: string | null;
  contactPhone: string | null;
  billingAddress: string | null;
  campaignCount: number;
  activeCampaignCount: number;
  totalSpent: number;
}

interface InfluencerSection {
  id: string;
  tiktokHandle: string | null;
  tiktokUserId: string | null;
  followerCount: number;
  engagementRate: number;
  fakeFollowerScore: number;
  city: string | null;
  country: string | null;
  bio: string | null;
  tier: string;
  categories: string[];
  subcategories: string[];
  contentLanguage: string[];
  hasIban: boolean;
  ibanName: string | null;
  applicationCount: number;
  approvedApplicationCount: number;
  totalEarned: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const ROLE_BADGE: Record<string, string> = {
  influencer: "bg-accent/30 text-foreground",
  brand: "bg-primary-light text-primary",
  admin: "bg-destructive/15 text-destructive",
};

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id } = await params;

  let user: AdminUserDetail;
  try {
    user = await apiFetch<AdminUserDetail>(ENDPOINTS.admin.userDetail(id));
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div>
      <Link
        href="/admin/users"
        className="mb-4 inline-flex items-center gap-1.5 text-caption text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kullanıcılar listesine dön
      </Link>

      <PageHeader
        title={user.fullName ?? user.email}
        description={user.email}
        actions={
          <span
            className={`rounded-full px-3 py-1 text-caption font-semibold capitalize ${ROLE_BADGE[user.role] ?? "bg-muted"}`}
          >
            {user.role}
          </span>
        }
      />

      {/* User meta card */}
      <section className="card-folkie mb-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Meta icon={Mail} label="E-posta" value={user.email} />
          <Meta
            icon={Calendar}
            label="Kayıt"
            value={new Date(user.createdAt).toLocaleDateString("tr-TR")}
          />
          <Meta icon={Hash} label="Folkie ID" value={user.id.slice(0, 8) + "…"} />
          <Meta
            icon={Hash}
            label="Clerk ID"
            value={user.clerkUserId.slice(0, 16) + "…"}
          />
        </div>
      </section>

      {/* Brand section */}
      {user.brand && (
        <section className="card-folkie mb-5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="text-body font-semibold">Marka Profili</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Şirket"
              value={user.brand.companyName}
            />
            <Stat label="Sektör" value={user.brand.industry ?? "—"} />
            <Stat
              label="Vergi No"
              value={user.brand.taxId ?? "—"}
            />
            <Stat
              label="Website"
              value={
                user.brand.website ? (
                  <a
                    href={
                      user.brand.website.startsWith("http")
                        ? user.brand.website
                        : `https://${user.brand.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    {user.brand.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  "—"
                )
              }
            />
            <Stat label="İletişim" value={user.brand.contactName ?? "—"} />
            <Stat label="Telefon" value={user.brand.contactPhone ?? "—"} />
            <Stat
              label="Fatura Adresi"
              value={user.brand.billingAddress ?? "—"}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <NumberCard
              label="Kampanya"
              value={user.brand.campaignCount.toString()}
              sub={`${user.brand.activeCampaignCount} aktif`}
            />
            <NumberCard
              label="Toplam Bütçe"
              value={formatTRY(user.brand.totalSpent)}
              sub="kampanya değeri"
            />
            <NumberCard
              label="Profil Tarihi"
              value={new Date(user.createdAt).toLocaleDateString("tr-TR")}
              sub="kayıt"
            />
          </div>
        </section>
      )}

      {/* Creator section */}
      {user.influencer && (
        <section className="card-folkie mb-5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <h3 className="text-body font-semibold">Creator Profili</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="TikTok"
              value={user.influencer.tiktokHandle ?? "(bağlı değil)"}
            />
            <Stat
              label="Takipçi"
              value={formatNumber(user.influencer.followerCount)}
            />
            <Stat
              label="Etkileşim"
              value={`${user.influencer.engagementRate.toFixed(1)}%`}
            />
            <Stat
              label="Bot Skoru"
              value={`${user.influencer.fakeFollowerScore.toFixed(1)}%`}
            />
            <Stat label="Tier" value={user.influencer.tier} />
            <Stat
              label="Konum"
              value={
                user.influencer.city
                  ? `${user.influencer.city}, ${user.influencer.country ?? ""}`.trim()
                  : "—"
              }
            />
            <Stat
              label="Kategoriler"
              value={
                user.influencer.categories.length > 0
                  ? user.influencer.categories.join(", ")
                  : "—"
              }
            />
            <Stat
              label="Diller"
              value={user.influencer.contentLanguage.join(", ")}
            />
          </div>

          {user.influencer.bio && (
            <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4">
              <div className="text-caption text-muted-foreground">Bio</div>
              <p className="mt-1 text-small">{user.influencer.bio}</p>
            </div>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <NumberCard
              label="Başvuru"
              value={user.influencer.applicationCount.toString()}
              sub={`${user.influencer.approvedApplicationCount} onaylı`}
            />
            <NumberCard
              label="Kazandığı"
              value={formatTRY(user.influencer.totalEarned)}
              sub="onaylı iş birlikleri"
            />
            <NumberCard
              label="IBAN"
              value={user.influencer.hasIban ? "✓ Tanımlı" : "Yok"}
              sub={user.influencer.ibanName ?? "—"}
            />
          </div>
        </section>
      )}

      {!user.brand && !user.influencer && (
        <section className="card-folkie p-8 text-center">
          <User className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-small font-semibold">
            Bu kullanıcı henüz profil tamamlamamış
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            Kayıt oldu ama onboarding tamamlanmamış.
          </p>
        </section>
      )}
    </div>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="min-w-0">
        <div className="text-caption text-muted-foreground">{label}</div>
        <div className="truncate text-small font-medium" title={value}>
          {value}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-caption text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-small font-medium">{value}</div>
    </div>
  );
}

function NumberCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="text-caption text-muted-foreground">{label}</div>
      <div className="mt-1 text-h3 font-bold">{value}</div>
      <div className="text-caption text-muted-foreground">{sub}</div>
    </div>
  );
}
