import Link from "next/link";
import { Sparkles } from "lucide-react";

export function MatchCallout() {
  return (
    <section className="rounded-2xl bg-primary p-5 text-primary-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-small font-semibold">
              Find the right creators and drive real impact for your brand.
            </p>
            <p className="mt-0.5 text-caption text-primary-foreground/80">
              Our AI matching algorithm surfaces the most relevant nano creators
              for every campaign.
            </p>
          </div>
        </div>
        <Link
          href="/brand/discover"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-small font-semibold text-accent-foreground hover:bg-accent/90"
        >
          <Sparkles className="h-4 w-4" />
          Discover Creators
        </Link>
      </div>
    </section>
  );
}
