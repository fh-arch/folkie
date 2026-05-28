import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getCurrentUserRole } from "@/lib/clerk/role";
import { BrandSidebar } from "@/components/brand/Sidebar";
import { BrandTopbar } from "@/components/brand/Topbar";
import { MobileNav } from "@/components/shared/MobileNav";

export default async function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getCurrentUserRole();
  if (role !== "brand") redirect("/dashboard");

  const user = await currentUser();
  const brandName =
    (user?.publicMetadata?.brandName as string) ??
    user?.firstName ??
    "Marka";
  const brandEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  const sidebar = (
    <BrandSidebar
      brandName={brandName}
      brandEmail={brandEmail}
      planName="Pro Plan"
      activeCampaigns={12}
      campaignLimit={25}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebar}</div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header (lg:hidden) */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <MobileNav>{sidebar}</MobileNav>
            <Link href="/brand" className="text-h3 font-bold text-primary">
              folkie
            </Link>
          </div>
          {/* Mobile quick action */}
          <Link
            href="/brand/campaigns/new"
            className="rounded-full bg-primary px-4 py-2 text-caption font-semibold text-primary-foreground"
          >
            + Yeni
          </Link>
        </header>

        {/* Desktop topbar */}
        <div className="hidden lg:block">
          <BrandTopbar />
        </div>

        <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
