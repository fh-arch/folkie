"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Handshake,
  FileEdit,
  Wallet,
  MessageSquare,
  User,
  Settings,
  Sparkles,
  TrendingUp,
  ChevronUp,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

function buildNav(collaborationsBadge: number, draftsBadge: number, messagesBadge: number): NavItem[] {
  return [
    { href: "/creator", label: "Home", icon: Home },
    { href: "/creator/campaigns", label: "Discover Campaigns", icon: Compass },
    { href: "/creator/collaborations", label: "Collaborations", icon: Handshake, badge: collaborationsBadge || undefined },
    { href: "/creator/drafts", label: "Drafts", icon: FileEdit, badge: draftsBadge || undefined },
    { href: "/creator/earnings", label: "Earnings", icon: Wallet },
    { href: "/creator/messages", label: "Messages", icon: MessageSquare, badge: messagesBadge || undefined },
    { href: "/creator/profile", label: "My Profile", icon: User },
    { href: "/creator/settings", label: "Settings", icon: Settings },
  ];
}

const SHORTCUTS: NavItem[] = [
  { href: "/creator/campaigns?nanoOnly=true", label: "Nano Opportunities", icon: Sparkles },
  { href: "/creator/collaborations", label: "Invitations", icon: TrendingUp },
];

export function CreatorSidebar({
  creatorName,
  creatorHandle,
  badgeLevel,
  progressPercent = 0,
  nextLevelGap = 5,
  collaborationsBadge = 0,
  draftsBadge = 0,
  messagesBadge = 0,
}: {
  creatorName: string;
  creatorHandle: string;
  badgeLevel: string;
  progressPercent?: number;
  nextLevelGap?: number;
  collaborationsBadge?: number;
  draftsBadge?: number;
  messagesBadge?: number;
}) {
  const pathname = usePathname();
  const mainNav = buildNav(collaborationsBadge, draftsBadge, messagesBadge);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="px-6 py-6">
        <Link href="/creator" className="text-h2 font-bold text-primary">
          folkie
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}

        <div className="px-3 pb-2 pt-6 text-caption font-medium uppercase tracking-wide text-muted-foreground">
          For You
        </div>
        {SHORTCUTS.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      {/* Folkie Stars rozet kartı — Brand'da plan kartı vardı, creator'da rozet sistemi */}
      <div className="mx-3 mb-3 rounded-2xl bg-navy p-4 text-navy-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <div className="text-caption text-navy-foreground/70">Folkie Stars</div>
            <div className="text-small font-bold">{badgeLevel} ⭐</div>
          </div>
        </div>
        <div className="mt-3 text-caption text-navy-foreground/70">
          To next level
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-navy-foreground/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>
        <div className="mt-1 text-caption text-navy-foreground/60">
          {nextLevelGap > 0 ? `${nextLevelGap} campaigns left` : "All levels unlocked!"}
        </div>
      </div>

      {/* Kullanıcı kartı */}
      <button className="flex items-center gap-3 border-t border-border px-4 py-4 text-left hover:bg-muted">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
          {creatorName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="truncate text-small font-semibold">{creatorName}</div>
          <div className="truncate text-caption text-muted-foreground">
            {creatorHandle}
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
  if (cleanHref === "/creator") return pathname === "/creator";
  return pathname.startsWith(cleanHref);
}
