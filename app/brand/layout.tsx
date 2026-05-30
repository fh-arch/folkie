import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getCurrentUserRole } from "@/lib/clerk/role";
import { BrandSidebar } from "@/components/brand/Sidebar";
import { BrandTopbar } from "@/components/brand/Topbar";
import { MobileNav } from "@/components/shared/MobileNav";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export default async function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getCurrentUserRole();
  if (role !== "brand") redirect("/dashboard");

  const [user, conversations, campaigns] = await Promise.all([
    currentUser(),
    apiFetch<{ unreadCount: number }[]>(ENDPOINTS.messaging.conversations()).catch(() => []),
    apiFetch<{ status: string }[]>(ENDPOINTS.brand.campaigns()).catch(() => []),
  ]);

  const brandName =
    (user?.publicMetadata?.brandName as string) ??
    user?.firstName ??
    "Marka";
  const brandEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const messagesBadge = conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);
  const pendingBadge = (campaigns as { status: string }[]).filter(
    c => ["active", "applications_closed", "in_progress"].includes(c.status)
  ).length;

  const sidebar = (
    <BrandSidebar
      brandName={brandName}
      brandEmail={brandEmail}
      messagesBadge={messagesBadge}
      pendingBadge={pendingBadge}
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
            + New
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
