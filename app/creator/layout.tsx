import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getCurrentUserRole } from "@/lib/clerk/role";
import { CreatorSidebar } from "@/components/creator/Sidebar";
import { CreatorTopbar } from "@/components/creator/Topbar";
import { MobileNav } from "@/components/shared/MobileNav";
import { getMyBadge } from "@/lib/badge";

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getCurrentUserRole();
  if (role !== "influencer") redirect("/dashboard");

  const [user, badge] = await Promise.all([currentUser(), getMyBadge()]);
  const creatorName = user?.firstName ?? "Creator";
  const creatorHandle =
    (user?.publicMetadata?.tiktokHandle as string) ??
    `@${user?.username ?? "creator"}`;

  const BADGE_LEVEL_MAP: Record<string, string> = {
    welcome: "Welcome", hosgeldin: "Welcome",
    rising: "Rising", yükselen: "Rising", yukselen: "Rising",
    shining: "Shining", parlayan: "Shining",
    super_star: "Super Star", "süper star": "Super Star", "super star": "Super Star",
  };
  const rawLevel = (badge?.level ?? badge?.levelLabel ?? "").toLowerCase();
  const badgeLevel = BADGE_LEVEL_MAP[rawLevel] ?? badge?.levelLabel ?? "Welcome";

  const sidebar = (
    <CreatorSidebar
      creatorName={creatorName}
      creatorHandle={creatorHandle}
      badgeLevel={badgeLevel}
      progressPercent={badge?.progressPercent ?? 0}
      nextLevelGap={badge?.nextLevelGap ?? 5}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebar}</div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <MobileNav>{sidebar}</MobileNav>
            <Link href="/creator" className="text-h3 font-bold text-primary">
              folkie
            </Link>
          </div>
          <Link
            href="/creator/campaigns"
            className="rounded-full bg-accent px-4 py-2 text-caption font-semibold text-accent-foreground"
          >
            Discover
          </Link>
        </header>

        {/* Desktop topbar */}
        <div className="hidden lg:block">
          <CreatorTopbar />
        </div>

        <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
