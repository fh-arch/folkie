import { PageHeader } from "@/components/shared/PageHeader";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { BrandSubmissionsSection } from "../campaigns/[id]/BrandSubmissionsSection";
import { FileVideo } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  status: string;
}

interface Submission {
  id: string;
  applicationId: string;
  creatorProfileId: string;
  handle: string | null;
  avatarUrl: string | null;
  followerCount: number;
  engagementRate: number;
  submissionStatus: string;
  videoUrl: string | null;
  externalVideoUrl: string | null;
  script: string | null;
  revisionNote: string | null;
  hashtags: string[];
  submittedAt: string;
  reviewedAt: string | null;
}

interface CampaignWithSubmissions {
  campaign: Campaign;
  submissions: Submission[];
}

export default async function PendingReviewPage() {
  let campaigns: Campaign[] = [];
  try {
    campaigns = await apiFetch<Campaign[]>(ENDPOINTS.brand.campaigns());
  } catch {
    campaigns = [];
  }

  // Fetch submissions for all active/in-progress campaigns in parallel
  const activeCampaigns = campaigns.filter((c) =>
    ["active", "applications_closed", "in_progress"].includes(c.status),
  );

  const results: CampaignWithSubmissions[] = await Promise.all(
    activeCampaigns.map(async (campaign) => {
      try {
        const submissions = await apiFetch<Submission[]>(
          ENDPOINTS.brand.campaignSubmissions(campaign.id),
        );
        return { campaign, submissions };
      } catch {
        return { campaign, submissions: [] };
      }
    }),
  );

  const allSubmissions = results.flatMap((r) =>
    r.submissions.map((s) => ({ ...s, campaignTitle: r.campaign.title })),
  );

  const pendingCount = allSubmissions.filter(
    (s) => s.submissionStatus === "submitted",
  ).length;

  return (
    <div>
      <PageHeader
        title="Pending Review"
        description="Content submitted by approved creators waiting for your approval"
        breadcrumbs={[{ label: "Pending Review" }]}
        actions={
          pendingCount > 0 ? (
            <span className="rounded-full bg-warning/15 px-3 py-1 text-small font-semibold text-warning">
              {pendingCount} awaiting review
            </span>
          ) : undefined
        }
      />

      {results.length === 0 ? (
        <div className="card-folkie mt-6 p-8 text-center">
          <FileVideo className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-small font-semibold">No active campaigns</p>
          <p className="mt-1 text-caption text-muted-foreground">
            Content submissions appear here once creators are approved on active
            campaigns.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {results.map(({ campaign, submissions }) =>
            submissions.length === 0 ? null : (
              <section key={campaign.id} className="card-folkie p-5">
                <h3 className="text-h3">{campaign.title}</h3>
                <BrandSubmissionsSection
                  initialSubmissions={submissions}
                  campaignId={campaign.id}
                />
              </section>
            ),
          )}

          {allSubmissions.length === 0 && (
            <div className="card-folkie p-8 text-center">
              <FileVideo className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-small font-semibold">No submissions yet</p>
              <p className="mt-1 text-caption text-muted-foreground">
                Approved creators will submit their content here for review.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
