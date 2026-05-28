import Link from "next/link";
import { Compass, Send } from "lucide-react";

export function CreatorHeroCard({
  creatorName,
  newCampaigns,
}: {
  creatorName: string;
  newCampaigns: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 text-primary-foreground lg:p-10">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="max-w-xl">
          <p className="text-small text-primary-foreground/80">
            Hey, {creatorName} 👋
          </p>
          <h2 className="mt-2 text-h2 leading-tight">
            <span className="text-accent">{newCampaigns} new campaigns</span>{" "}
            recommended for you this week
          </h2>
          <p className="mt-3 text-small text-primary-foreground/80">
            Discover the best collaboration opportunities for your niche and audience. Apply, create, earn.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/creator/campaigns"
              className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-small font-semibold text-accent-foreground hover:bg-accent/90"
            >
              <Compass className="h-4 w-4" />
              Discover Campaigns
            </Link>
            <Link
              href="/creator/campaigns?tab=invitations"
              className="flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-2.5 text-small font-medium hover:bg-primary-foreground/15"
            >
              <Send className="h-4 w-4" />
              Invitations
            </Link>
          </div>
        </div>

        {/* Dekoratif yumuşak daireler — brand'daki keskin hedef ikonu yerine */}
        <div className="relative hidden h-40 w-40 md:block">
          <div className="absolute inset-0 rounded-full border-2 border-primary-foreground/15" />
          <div className="absolute inset-4 rounded-full border-2 border-primary-foreground/20" />
          <div className="absolute inset-10 rounded-full bg-accent/30 blur-md" />
          <div className="absolute inset-14 rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
