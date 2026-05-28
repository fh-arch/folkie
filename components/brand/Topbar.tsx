"use client";

import Link from "next/link";
import { HelpCircle, Plus } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { NotificationBell } from "@/components/shared/NotificationBell";

export function BrandTopbar() {
  return (
    <header className="flex items-center gap-4 border-b border-border bg-background px-8 py-4">
      <div className="flex-1" />

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/brand/campaigns/new"
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-small font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Kampanya Oluştur
        </Link>

        <NotificationBell />

        <a
          href="mailto:destek@folkie.com.tr"
          aria-label="Destek"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card hover:bg-muted"
        >
          <HelpCircle className="h-4 w-4" />
        </a>

        <UserButton appearance={{ elements: { rootBox: "h-10 w-10" } }} />
      </div>
    </header>
  );
}
