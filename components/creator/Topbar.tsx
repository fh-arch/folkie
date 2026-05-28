"use client";

import { Search, HelpCircle, Send } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { NotificationBell } from "@/components/shared/NotificationBell";

export function CreatorTopbar() {
  return (
    <header className="flex items-center gap-4 border-b border-border bg-background px-8 py-4">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search brands, campaigns or categories..."
          className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-16 text-small placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-muted px-2 py-0.5 text-caption text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-small font-semibold text-accent-foreground hover:bg-accent/90">
          <Send className="h-4 w-4" />
          Quick Apply
        </button>

        <NotificationBell />
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card hover:bg-muted">
          <HelpCircle className="h-4 w-4" />
        </button>
        <UserButton appearance={{ elements: { rootBox: "h-10 w-10" } }} />
      </div>
    </header>
  );
}
