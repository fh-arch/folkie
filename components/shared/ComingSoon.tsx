import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  sprint?: string;
  backHref?: string;
  backLabel?: string;
}

/**
 * Henüz inşa edilmemiş sayfalar için tutarlı placeholder.
 * Sprint planındaki "ne zaman" bilgisini de gösterir ki kullanıcı kafası karışmasın.
 */
export function ComingSoon({
  title,
  description,
  sprint,
  backHref,
  backLabel = "Geri",
}: Props) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light text-primary">
        <Construction className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-h2">{title}</h1>
      {description && (
        <p className="mt-3 max-w-md text-body text-muted-foreground">
          {description}
        </p>
      )}
      {sprint && (
        <span className="mt-4 inline-block rounded-full bg-accent px-4 py-1.5 text-caption font-semibold text-accent-foreground">
          📦 {sprint}
        </span>
      )}
      {backHref && (
        <Link
          href={backHref}
          className="mt-8 inline-flex items-center gap-2 text-small text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      )}
    </div>
  );
}
