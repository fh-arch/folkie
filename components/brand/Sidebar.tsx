"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Megaphone,
  Search,
  Handshake,
  MessageSquare,
  BarChart3,
  Heart,
  Settings,
  Clock,
  Inbox,
  CheckCircle2,
  Rocket,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

function buildBrandNav(messagesBadge: number): NavItem[] {
  return [
    { href: "/brand", label: "Home", icon: Home },
    { href: "/brand/campaigns", label: "Campaigns", icon: Megaphone },
    { href: "/brand/discover", label: "Discover Creators", icon: Search },
    { href: "/brand/collaborations", label: "Collaborations", icon: Handshake },
    { href: "/brand/messages", label: "Messages", icon: MessageSquare, badge: messagesBadge || undefined },
    { href: "/brand/reports", label: "Reports", icon: BarChart3 },
    { href: "/brand/favorites", label: "Favorites", icon: Heart },
    { href: "/brand/settings", label: "Settings", icon: Settings },
  ];
}

function buildBrandShortcuts(pendingBadge: number): NavItem[] {
  return [
    { href: "/brand/pending", label: "Pending Review", icon: Clock, badge: pendingBadge || undefined },
    { href: "/brand/collaborations", label: "Applications", icon: Inbox },
    { href: "/brand/campaigns?status=completed", label: "Completed", icon: CheckCircle2 },
  ];
}

export function BrandSidebar({
  brandName,
  brandEmail,
  messagesBadge = 0,
  pendingBadge = 0,
}: {
  brandName: string;
  brandEmail: string;
  messagesBadge?: number;
  pendingBadge?: number;
}) {
  const pathname = usePathname();
  const mainNav = buildBrandNav(messagesBadge);
  const shortcuts = buildBrandShortcuts(pendingBadge);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="px-6 py-6">
        <Link href="/brand" className="text-h2 font-bold text-primary">
          folkie
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}

        <div className="px-3 pb-2 pt-6 text-caption font-medium uppercase tracking-wide text-muted-foreground">
          Quick Access
        </div>
        {shortcuts.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      {/* Komisyon bilgisi */}
      <div className="mx-3 mb-3 rounded-2xl bg-primary-light p-4">
        <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
          <Rocket className="h-3 w-3" />
          Pricing
        </div>
        <div className="mt-1 text-body font-bold text-primary">No subscription</div>
        <div className="mt-1 text-caption text-foreground/70">
          Only <strong className="text-foreground">15% commission</strong> on completed campaigns
        </div>
        <Link
          href="/brand/campaigns/new"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-small font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Rocket className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      {/* Kullanıcı kartı */}
      <button className="flex items-center gap-3 border-t border-border px-4 py-4 text-left hover:bg-muted">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {brandName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="truncate text-small font-semibold">{brandName}</div>
          <div className="truncate text-caption text-muted-foreground">
            {brandEmail}
          </div>
        </div>
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      </button>
    </aside>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center justify-between rounded-xl px-3 py-2.5 text-small font-medium transition-colors",
        active
          ? "bg-primary-light text-primary"
          : "text-foreground/70 hover:bg-muted hover:text-foreground",
      )}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        {item.label}
      </span>
      {item.badge !== undefined && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-caption font-semibold",
            active
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground",
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function isActive(pathname: string, href: string): boolean {
  const cleanHref = href.split("?")[0] ?? href;
  if (cleanHref === "/brand") return pathname === "/brand";
  return pathname.startsWith(cleanHref);
}
