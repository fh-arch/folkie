import Link from "next/link";
import { Search, Plus } from "lucide-react";

export function BrandHeroCard() {
  return (
    <section className="card-folkie relative overflow-hidden bg-muted/40 p-8 lg:p-10">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="max-w-xl">
          <h2 className="text-h2 leading-tight">
            The right creators,
            <br />
            <span className="text-primary">real impact</span>
            <span className="text-accent">.</span>
          </h2>
          <p className="mt-3 text-small text-muted-foreground">
            Discover the best creators for your brand, manage campaigns, and
            track performance in real time.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/brand/discover"
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-small font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Search className="h-4 w-4" />
              Discover Creators
            </Link>
            <Link
              href="/brand/campaigns/new"
              className="flex items-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 text-small font-semibold text-primary hover:bg-primary-light"
            >
              <Plus className="h-4 w-4" />
              New Campaign
            </Link>
          </div>
        </div>

        <FolkieTargetIcon className="hidden h-40 w-40 md:block" />
      </div>
    </section>
  );
}

function FolkieTargetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="80" stroke="#6B3DFF" strokeWidth="14" fill="none" />
      <circle cx="100" cy="100" r="20" fill="#6B3DFF" />
      <path d="M 30 60 L 30 30 L 60 30" stroke="#C6FF00" strokeWidth="10" fill="none" strokeLinecap="square" />
      <path d="M 170 60 L 170 30 L 140 30" stroke="#C6FF00" strokeWidth="10" fill="none" strokeLinecap="square" />
      <path d="M 30 140 L 30 170 L 60 170" stroke="#C6FF00" strokeWidth="10" fill="none" strokeLinecap="square" />
      <path d="M 170 140 L 170 170 L 140 170" stroke="#C6FF00" strokeWidth="10" fill="none" strokeLinecap="square" />
    </svg>
  );
}
