import { notFound } from "next/navigation";
import {
  Calendar,
  Users,
  Wallet,
  Sparkles,
  Hash,
  Video,
  Package,
  Globe,
  Building2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatTRY } from "@/lib/utils";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { ApplyButton } from "./ApplyButton";

interface Props {
  params: Promise<{ id: string }>;
}

interface CampaignDetail {
  id: string;
  brandId: string;
  brandName: string;
  brandLogoUrl: string | null;
  brandWebsite: string | null;
  title: string;
  productName: string;
  productCategory: string;
  brief: string;
  requiredHashtags: string[];
  contentTypes: string[];
  tone: string | null;
  targetCities: string[];
  contentLanguage: string[];
  minFollowers: number;
  maxFollowers: number;
  influencerCount: number;
  approvedCount: number;
  budgetPerInfluencer: number;
  productDelivery: string;
  applicationDeadline: string;
  publishStartDate: string;
  publishEndDate: string;
  isFlashCampaign: boolean;
  flashPublishTime: string | null;
  hasApplied: boolean;
}

const PRODUCT_DELIVERY_LABEL: Record<string, string> = {
  physical: "Physical product shipped",
  digital: "Digital product / coupon",
  none: "No product",
};

export default async function CreatorCampaignDetailPage({ params }: Props) {
  const { id } = await params;

  let campaign: CampaignDetail;
  try {
    campaign = await apiFetch<CampaignDetail>(ENDPOINTS.creator.campaign(id));
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const isNanoOnly = campaign.maxFollowers <= 10_000;
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.applicationDeadline).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24),
    ),
  );
  const publishWindow = `${new Date(campaign.publishStartDate).toLocaleDateString("tr-TR")} – ${new Date(campaign.publishEndDate).toLocaleDateString("tr-TR")}`;

  return (
    <div>
      <PageHeader
        title={campaign.title}
        breadcrumbs={[
          { href: "/creator/campaigns", label: "Campaigns" },
          { label: campaign.title },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <section className="card-folkie p-5">
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  campaign.brandLogoUrl ??
                  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200"
                }
                alt={campaign.brandName}
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-caption text-muted-foreground">Brand</span>
                </div>
                <h3 className="mt-0.5">{campaign.brandName}</h3>
                <p className="text-caption text-muted-foreground">
                  {campaign.productCategory}
                </p>
              </div>
              {isNanoOnly && (
                <span className="rounded-full bg-accent px-3 py-1 text-caption font-semibold text-accent-foreground">
                  🌱 Nano-only
                </span>
              )}
            </div>
          </section>

          <section className="card-folkie p-5">
            <h3 className="text-body font-semibold">Campaign Brief</h3>
            <p className="mt-3 whitespace-pre-line text-small text-muted-foreground">
              {campaign.brief}
            </p>
          </section>

          <section className="card-folkie p-5">
            <h3 className="text-body font-semibold">Campaign Details</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <DetailRow icon={Video} label="Content type">
                {campaign.contentTypes.join(", ") || "—"}
              </DetailRow>
              <DetailRow icon={Hash} label="Required hashtags">
                {campaign.requiredHashtags.length > 0
                  ? campaign.requiredHashtags.map((h) => `#${h}`).join(" ")
                  : "—"}
              </DetailRow>
              <DetailRow icon={Package} label="Product delivery">
                {PRODUCT_DELIVERY_LABEL[campaign.productDelivery] ?? campaign.productDelivery}
              </DetailRow>
              <DetailRow icon={Globe} label="Content language">
                {campaign.contentLanguage.join(", ")}
              </DetailRow>
              <DetailRow icon={Calendar} label="Publishing window">
                {publishWindow}
              </DetailRow>
              <DetailRow icon={Sparkles} label="Tone">
                {campaign.tone ?? "—"}
              </DetailRow>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="card-navy lg:sticky lg:top-4">
            <div className="text-caption text-navy-foreground/70">Your fee</div>
            <div className="mt-1 text-h1 font-bold text-navy-foreground">
              {formatTRY(campaign.budgetPerInfluencer)}
            </div>
            {campaign.productDelivery === "physical" && (
              <div className="mt-1 text-caption text-navy-foreground/60">
                + free product
              </div>
            )}

            <div className="mt-5 space-y-3 border-t border-navy-foreground/10 pt-4 text-small">
              <Row icon={Calendar} label="Deadline" value={`${daysLeft} days`} />
              <Row icon={Users} label="Slots" value={`${campaign.approvedCount}/${campaign.influencerCount}`} />
              <Row icon={Wallet} label="Payment" value="After campaign ends" />
            </div>

            <div className="mt-5">
              <ApplyButton
                campaignId={campaign.id}
                alreadyApplied={campaign.hasApplied}
                fee={campaign.budgetPerInfluencer}
                daysLeft={daysLeft}
              />
            </div>

            <p className="mt-4 text-caption text-navy-foreground/60">
              Your application is reviewed by the brand. If approved, the product is shipped to you.
              Upload your content per the brief, then publish on TikTok on the campaign day.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-0.5 text-small">{children}</div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-navy-foreground/70">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="font-semibold text-navy-foreground">{value}</span>
    </div>
  );
}
